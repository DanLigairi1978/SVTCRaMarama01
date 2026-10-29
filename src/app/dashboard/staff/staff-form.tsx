"use client";

import { useState } from "react";
import { doc, collection, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadStaffPhoto } from "@/lib/storage-images";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ImagePlus } from "lucide-react";
import Image from "next/image";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export interface StaffFormInitialData {
  id: string;
  fullName: string;
  jobDescription: string;
  yearJoined: string;
  bio: string;
  photoUrl: string;
  photoPath: string;
}

interface StaffFormProps {
  initialData?: StaffFormInitialData;
  onSaved: () => void;
  onCancel: () => void;
}

export function StaffForm({ initialData, onSaved, onCancel }: StaffFormProps) {
  const isEditing = !!initialData;
  const [fullName, setFullName] = useState(initialData?.fullName ?? "");
  const [jobDescription, setJobDescription] = useState(initialData?.jobDescription ?? "");
  const [yearJoined, setYearJoined] = useState(initialData?.yearJoined ?? "");
  const [bio, setBio] = useState(initialData?.bio ?? "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photoUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (fileList: FileList | null) => {
    const file = fileList?.[0] ?? null;
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Portrait must be an image file.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Portrait must be under 5MB.");
      return;
    }

    setError(null);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !jobDescription || !yearJoined || !bio) return;
    if (!isEditing && !photoFile) {
      setError("A portrait photo is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const staffId = initialData?.id ?? doc(collection(db, "staff")).id;

      let photoUrl = initialData?.photoUrl ?? "";
      let photoPath = initialData?.photoPath ?? "";
      if (photoFile) {
        const uploaded = await uploadStaffPhoto(photoFile, staffId);
        photoUrl = uploaded.url;
        photoPath = uploaded.path;
      }

      if (isEditing) {
        await updateDoc(doc(db, "staff", staffId), {
          fullName,
          jobDescription,
          yearJoined,
          bio,
          photoUrl,
          photoPath,
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(doc(db, "staff", staffId), {
          fullName,
          jobDescription,
          yearJoined,
          bio,
          photoUrl,
          photoPath,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      onSaved();
    } catch (err: any) {
      console.error("Error saving staff member:", err);
      setError(err?.message || "Failed to save staff member. Please check details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Staff Member" : "Add Staff Member"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="font-label text-sm font-medium">Full Name</label>
            <Input
              placeholder="e.g. Litia Tuilagi"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="font-label text-sm font-medium">Job Description</label>
            <Input
              placeholder="e.g. Executive Director"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="font-label text-sm font-medium">Year Joined</label>
            <Input
              placeholder="e.g. 2016"
              value={yearJoined}
              onChange={(e) => setYearJoined(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="font-label text-sm font-medium">Short Bio</label>
            <Textarea
              placeholder="A brief bio highlighting background, contributions, and role at SVTC."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="font-label text-sm font-medium">Portrait Photo</label>
            <label className="relative aspect-square w-40 rounded-md border border-dashed border-input bg-secondary/40 flex items-center justify-center cursor-pointer overflow-hidden hover:border-primary transition-colors">
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => handleFileChange(e.target.files)}
              />
              {photoPreview ? (
                <Image src={photoPreview} alt="Portrait preview" fill className="object-cover" unoptimized />
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <ImagePlus className="h-6 w-6" />
                  <span className="font-label text-[0.65rem] uppercase tracking-wide">Portrait</span>
                </div>
              )}
            </label>
          </div>

          {error && <p className="font-body text-sm text-destructive">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Publish"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
