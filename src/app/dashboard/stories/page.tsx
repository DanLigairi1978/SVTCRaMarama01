"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { collection, getDocs, query, orderBy, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { deleteStoryPhoto } from "@/lib/github-images";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash2, Pencil, Plus } from "lucide-react";
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

  const fetchStories = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleDelete = async (id: string, photoPaths: string[]) => {
    if (!confirm("Are you sure you want to delete this story? This cannot be undone.")) return;
    try {
      await Promise.all(photoPaths.map((path) => deleteStoryPhoto(path)));
      await deleteDoc(doc(db, "stories", id));
      fetchStories();
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  const handleSaved = () => {
    setView("list");
    setEditingStory(null);
    fetchStories();
  };

  if (view === "add") {
    return <StoryForm onSaved={handleSaved} onCancel={() => setView("list")} />;
  }

  if (view === "edit" && editingStory) {
    return <StoryForm initialData={editingStory} onSaved={handleSaved} onCancel={() => { setView("list"); setEditingStory(null); }} />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Stories</CardTitle>
        <Button onClick={() => setView("add")}>
          <Plus className="mr-2 h-4 w-4" /> Add Story
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(story.id, story.photoPaths)}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
