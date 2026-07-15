"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import type { Story } from "@/lib/types";

interface StoryDoc {
  authorName: string;
  heading: string;
  body: string;
  photoUrls: string[];
  createdAt?: Timestamp;
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const list: Story[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as StoryDoc;
          return {
            id: docSnap.id,
            authorName: data.authorName,
            heading: data.heading,
            body: data.body,
            photoUrls: data.photoUrls || [],
            createdAt: data.createdAt?.toDate() ?? new Date(),
            updatedAt: data.createdAt?.toDate() ?? new Date(),
          };
        });
        setStories(list);
      } catch (error) {
        console.error("Error fetching stories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return (
    <div className="bg-background">
      <header className="bg-charcoal-900 py-20 md:py-28 text-center">
        <div className="container mx-auto px-4">
          <span className="font-label text-xs font-semibold uppercase tracking-[0.16em] text-ochre-200">
            Community Voices
          </span>
          <h1 className="font-headline text-4xl md:text-5xl font-black text-ivory-100 mt-3">
            Stories: Where Hope Takes Root
          </h1>
          <h3 className="font-body mt-4 text-lg md:text-xl text-ivory-300 max-w-2xl mx-auto leading-relaxed">
            Shared experiences and lasting change, told one story at a time.
          </h3>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : stories.length > 0 ? (
        <main className="container mx-auto px-4 py-16 md:py-24 space-y-20 md:space-y-28">
          {stories.map((story) => (
            <article key={story.id} className="max-w-3xl mx-auto border-b border-border pb-20 md:pb-28 last:border-b-0 last:pb-0">
              <div className="mb-6">
                <p className="font-label text-xs font-semibold uppercase tracking-wide text-primary">
                  {story.authorName}
                </p>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  {format(story.createdAt, "MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>

              <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground mb-8 leading-tight">
                {story.heading}
              </h2>

              {story.photoUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-8 h-72 md:h-96">
                  <div className="relative row-span-2 rounded-md overflow-hidden">
                    <Image src={story.photoUrls[0]} alt={story.heading} fill className="object-cover" />
                  </div>
                  <div className="grid grid-rows-2 gap-3">
                    {story.photoUrls.slice(1, 3).map((url, i) => (
                      <div key={i} className="relative rounded-md overflow-hidden">
                        <Image src={url} alt={`${story.heading} photo ${i + 2}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="font-body text-lg text-foreground/90 leading-relaxed space-y-5 max-w-prose">
                {story.body
                  .split(/\n\s*\n/)
                  .filter((p) => p.trim().length > 0)
                  .map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
              </div>
            </article>
          ))}
        </main>
      ) : null}
    </div>
  );
}
