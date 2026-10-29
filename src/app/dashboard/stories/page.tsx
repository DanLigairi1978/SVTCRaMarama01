"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { collection, getDocs, query, orderBy, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { deleteStoryPhoto } from "@/lib/storage-images";
import { formatErrorMessage } from "@/lib/error-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Trash2, Pencil, Plus, AlertCircle, RotateCw } from "lucide-react";
import { format } from "date-fns";
import { StoryForm, type StoryFormInitialData } from "./story-form";

interface StoryListItem {
  id: string;
  authorName: string;
  heading: string;
  body: string;
  photoUrls: string[];
  photoPaths: string[];
  createdAt: Date;
}

export default function StoriesAdminPage() {
  const [stories, setStories] = useState<StoryListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editingStory, setEditingStory] = useState<StoryFormInitialData | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchStories = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const list: StoryListItem[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as {
          authorName: string;
          heading: string;
          body: string;
          photoUrls: string[];
          photoPaths: string[];
          createdAt?: Timestamp;
        };
        return {
          id: docSnap.id,
          authorName: data.authorName,
          heading: data.heading,
          body: data.body,
          photoUrls: data.photoUrls || [],
          photoPaths: data.photoPaths || [],
          createdAt: data.createdAt?.toDate() ?? new Date(),
        };
      });
      setStories(list);
    } catch (error) {
      console.error("Error fetching stories:", error);
      setFetchError(formatErrorMessage(error, "Failed to load stories. Check your connection."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleDelete = async (id: string, photoPaths: string[]) => {
    if (!confirm("Are you sure you want to delete this story? This cannot be undone.")) return;
    setActionError(null);
    setDeletingId(id);
    try {
      if (photoPaths && photoPaths.length > 0) {
        await Promise.all(photoPaths.map((path) => deleteStoryPhoto(path)));
      }
      await deleteDoc(doc(db, "stories", id));
      await fetchStories();
    } catch (error) {
      console.error("Error deleting story:", error);
      setActionError(formatErrorMessage(error, "Failed to delete story."));
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaved = () => {
    setView("list");
    setEditingStory(null);
    setActionError(null);
    fetchStories();
  };

  if (view === "add") {
    return <StoryForm onSaved={handleSaved} onCancel={() => setView("list")} />;
  }

  if (view === "edit" && editingStory) {
    return (
      <StoryForm
        initialData={editingStory}
        onSaved={handleSaved}
        onCancel={() => {
          setView("list");
          setEditingStory(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {actionError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{actionError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Stories</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchStories}
              disabled={loading}
              title="Refresh stories"
            >
              <RotateCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button onClick={() => setView("add")}>
              <Plus className="mr-2 h-4 w-4" /> Add Story
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : fetchError ? (
            <div className="space-y-3 py-6 text-center">
              <p className="text-sm text-destructive">{fetchError}</p>
              <Button variant="outline" size="sm" onClick={fetchStories}>
                Retry
              </Button>
            </div>
          ) : stories.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No stories yet. Add one to publish it on /stories.</p>
          ) : (
            <div className="space-y-4">
              {stories.map((story) => (
                <div key={story.id} className="flex items-center justify-between gap-4 rounded-md border p-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {story.photoUrls[0] && (
                      <div className="relative h-14 w-14 shrink-0 rounded-md overflow-hidden">
                        <Image src={story.photoUrls[0]} alt="" fill className="object-cover" unoptimized />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-headline font-semibold truncate">{story.heading}</h4>
                      <p className="font-body text-sm text-primary font-medium">{story.authorName}</p>
                      <p className="font-body text-xs text-muted-foreground mt-0.5">
                        {format(story.createdAt, "MMMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingStory(story);
                        setView("edit");
                      }}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(story.id, story.photoPaths)}
                      disabled={deletingId === story.id}
                      className="text-destructive hover:text-destructive/90"
                      title="Delete"
                    >
                      {deletingId === story.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
