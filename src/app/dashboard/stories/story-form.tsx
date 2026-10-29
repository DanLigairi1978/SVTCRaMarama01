"use client";

import { useEffect, useState } from "react";
import { doc, collection, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadStoryPhoto, deleteStoryPhoto, validatePhotoFile } from "@/lib/storage-images";
import { formatErrorMessage } from "@/lib/error-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ImagePlus, AlertCircle } from "lucide-react";
import Image from "next/image";

export interface StoryFormInitialData {
  id: string;
  authorName: string;
  heading: string;
  body: string;
  photoUrls: string[];
  photoPaths: string[];
}

interface StoryFormProps {
  initialData?: StoryFormInitialData;
  onSaved: () => void;
  onCancel: () => void;
}

interface PhotoSlot {
  file: File | null;
  previewUrl: string | null;
  objectUrl: string | null;
}

export function StoryForm({ initialData, onSaved, onCancel }: StoryFormProps) {
  const isEditing = !!initialData;
  const [authorName, setAuthorName] = useState(initialData?.authorName ?? "");
  const [heading, setHeading] = useState(initialData?.heading ?? "");
  const [body, setBody] = useState(initialData?.body ?? "");
  const [slots, setSlots] = useState<PhotoSlot[]>(
    [0, 1, 2].map((i) => ({
      file: null,
      previewUrl: initialData?.photoUrls[i] ?? null,
      objectUrl: null,
    }))
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clean up object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      slots.forEach((s) => {
        if (s.objectUrl) URL.revokeObjectURL(s.objectUrl);
      });
    };
  }, [slots]);

  const handleFileChange = (slot: number, fileList: FileList | null) => {
    const file = fileList?.[0] ?? null;
    if (!file) return;

    const check = validatePhotoFile(file);
    if (!check.valid) {
      setError(`Photo ${slot + 1}: ${check.error}`);
      return;
    }

    setError(null);
    setSlots((prev) => {
      const next = [...prev];
      const prevSlot = next[slot];
      if (prevSlot.objectUrl) {
        URL.revokeObjectURL(prevSlot.objectUrl);
      }
      const newObjectUrl = URL.createObjectURL(file);
      next[slot] = { file, previewUrl: newObjectUrl, objectUrl: newObjectUrl };
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedAuthor = authorName.trim();
    const trimmedHeading = heading.trim();
    const trimmedBody = body.trim();

    if (!trimmedAuthor) {
      setError("Please enter the author's full name.");
      return;
    }
    if (!trimmedHeading) {
      setError("Please enter the story heading.");
      return;
    }
    if (!trimmedBody) {
      setError("Please write the story content.");
      return;
    }

    if (!isEditing && slots.some((s) => !s.file)) {
      setError("All 3 photos are required for a new story.");
      return;
    }

    if (isEditing && slots.some((s, i) => !s.file && !initialData?.photoUrls[i])) {
      setError("All 3 photo slots must have an image.");
      return;
    }

    setIsSubmitting(true);
    try {
      const storyId = initialData?.id ?? doc(collection(db, "stories")).id;

      const photoUrls: string[] = [];
      const photoPaths: string[] = [];

      for (let i = 0; i < 3; i++) {
        const slot = slots[i];
        if (slot.file) {
          const uploaded = await uploadStoryPhoto(slot.file, storyId, i);
          // If updating with a new photo, clean up the old photo from storage
          if (isEditing && initialData?.photoPaths[i] && initialData.photoPaths[i] !== uploaded.path) {
            await deleteStoryPhoto(initialData.photoPaths[i]);
          }
          photoUrls.push(uploaded.url);
          photoPaths.push(uploaded.path);
        } else if (initialData?.photoUrls[i]) {
          photoUrls.push(initialData.photoUrls[i]);
          photoPaths.push(initialData.photoPaths[i] || "");
        }
      }

      if (isEditing) {
        await updateDoc(doc(db, "stories", storyId), {
          authorName: trimmedAuthor,
          heading: trimmedHeading,
          body: trimmedBody,
          photoUrls,
          photoPaths,
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(doc(db, "stories", storyId), {
          authorName: trimmedAuthor,
          heading: trimmedHeading,
          body: trimmedBody,
          photoUrls,
          photoPaths,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      onSaved();
    } catch (err: unknown) {
      console.error("Error saving story:", err);
      setError(formatErrorMessage(err, "Failed to save story. Please check details and try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Story" : "Add New Story"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="font-label text-sm font-medium">Author's Full Name</label>
            <Input
              placeholder="e.g. Litia Tuilagi"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="font-label text-sm font-medium">Story Heading</label>
            <Input
              placeholder="e.g. How the Weaving Circle Changed My Life"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="font-label text-sm font-medium">Story Body</label>
            <Textarea
              placeholder="Write the story here. Leave a blank line between paragraphs."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="font-label text-sm font-medium">Photos (3 required, under 5MB each)</label>
            <div className="grid grid-cols-3 gap-3">
              {slots.map((slot, i) => (
                <label
                  key={i}
                  className="relative aspect-square rounded-md border border-dashed border-input bg-secondary/40 flex items-center justify-center cursor-pointer overflow-hidden hover:border-primary transition-colors"
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                    className="sr-only"
                    onChange={(e) => handleFileChange(i, e.target.files)}
                  />
                  {slot.previewUrl ? (
                    <Image src={slot.previewUrl} alt={`Photo ${i + 1} preview`} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <ImagePlus className="h-6 w-6" />
                      <span className="font-label text-[0.65rem] uppercase tracking-wide">Photo {i + 1}</span>
                    </div>
                  )}
                </label>
              ))}
            </div>
            <p className="font-body text-xs text-muted-foreground">Formats: JPEG, PNG, WebP, GIF (max 5MB each).</p>
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
                "Publish Story"
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
