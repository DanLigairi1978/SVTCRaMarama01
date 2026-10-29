"use client";

import { useEffect, useState } from "react";
import { doc, collection, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadStaffPhoto, deleteStaffPhoto, validatePhotoFile } from "@/lib/storage-images";
import { formatErrorMessage } from "@/lib/error-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ImagePlus, AlertCircle } from "lucide-react";
import Image from "next/image";

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
  const [objectUrlCreated, setObjectUrlCreated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (objectUrlCreated) {
        URL.revokeObjectURL(objectUrlCreated);
      }
    };
  }, [objectUrlCreated]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    const check = validatePhotoFile(file);
    if (!check.valid) {
      setError(check.error || "Invalid image file.");
      e.target.value = "";
      return;
    }

    if (objectUrlCreated) {
      URL.revokeObjectURL(objectUrlCreated);
    }

    const preview = URL.createObjectURL(file);
    setObjectUrlCreated(preview);
    setError(null);
    setPhotoFile(file);
    setPhotoPreview(preview);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = fullName.trim();
    const trimmedJob = jobDescription.trim();
    const trimmedYear = yearJoined.trim();
    const trimmedBio = bio.trim();

    if (!trimmedName) {
      setError("Please enter the staff member's full name.");
      return;
    }
    if (trimmedName.length > 100) {
      setError("Full name must be 100 characters or fewer.");
      return;
    }
    if (trimmedJob.length > 150) {
      setError("Job description must be 150 characters or fewer.");
      return;
    }
    if (trimmedYear) {
      const currentYear = new Date().getFullYear();
      const numericYear = Number(trimmedYear);
      if (!/^\d{4}$/.test(trimmedYear) || numericYear < 1950 || numericYear > currentYear + 1) {
        setError(`Please enter a valid 4-digit year between 1950 and ${currentYear + 1}.`);
        return;
      }
    }
    if (trimmedBio.length > 5000) {
      setError("Bio must be 5,000 characters or fewer.");
      return;
    }

    setIsSubmitting(true);
    let newlyUploadedPath: string | null = null;
    try {
      const staffId = initialData?.id ?? doc(collection(db, "staff")).id;

      let photoUrl = initialData?.photoUrl ?? "";
      let photoPath = initialData?.photoPath ?? "";

      if (photoFile) {
        const uploaded = await uploadStaffPhoto(photoFile, staffId);
        newlyUploadedPath = uploaded.path;
        photoUrl = uploaded.url;
        photoPath = uploaded.path;
      }

      if (isEditing) {
        await updateDoc(doc(db, "staff", staffId), {
          fullName: trimmedName,
          jobDescription: trimmedJob,
          yearJoined: trimmedYear,
          bio: trimmedBio,
          photoUrl,
          photoPath,
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(doc(db, "staff", staffId), {
          fullName: trimmedName,
          jobDescription: trimmedJob,
          yearJoined: trimmedYear,
          bio: trimmedBio,
          photoUrl,
          photoPath,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      // ONLY delete replaced old photo AFTER Firestore write succeeds
      if (isEditing && photoFile && initialData?.photoPath && initialData.photoPath !== photoPath) {
        await deleteStaffPhoto(initialData.photoPath);
      }

      onSaved();
    } catch (err: unknown) {
      console.error("Error saving staff member:", err);
      // Clean up newly uploaded photo if Firestore write fails to prevent orphaned files
      if (newlyUploadedPath) {
        await deleteStaffPhoto(newlyUploadedPath);
      }
      setError(formatErrorMessage(err, "Failed to save staff member. Please check details and try again."));
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
            />
          </div>
          <div className="space-y-2">
            <label className="font-label text-sm font-medium">Year Joined</label>
            <Input
              placeholder="e.g. 2016"
              value={yearJoined}
              onChange={(e) => setYearJoined(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="font-label text-sm font-medium">Short Bio</label>
            <Textarea
              placeholder="A brief bio highlighting background, contributions, and role at SVTC."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <label className="font-label text-sm font-medium">Portrait Photo (under 5MB)</label>
            <label className="relative aspect-square w-40 rounded-md border border-dashed border-input bg-secondary/40 flex items-center justify-center cursor-pointer overflow-hidden hover:border-primary transition-colors">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                className="sr-only"
                onChange={handleFileChange}
              />
              {photoPreview ? (
                <Image src={photoPreview} alt="Portrait preview" fill className="object-cover" unoptimized />
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <ImagePlus className="h-6 w-6" />
                  <span className="font-label text-[0.65rem] uppercase tracking-wide">Upload Photo</span>
                </div>
              )}
            </label>
            <p className="font-body text-xs text-muted-foreground">Formats: JPEG, PNG, WebP, GIF (max 5MB).</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
