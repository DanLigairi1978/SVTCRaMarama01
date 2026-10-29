"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { Loader2, BookOpen, Image as ImageIcon } from "lucide-react";
import { SectionEyebrow } from "@/components/marketing/section-eyebrow";
import { Button } from "@/components/ui/button";
import { formatErrorMessage } from "@/lib/error-utils";
import type { Story } from "@/lib/types";

interface StoryDoc {
  authorName: string;
  heading: string;
  body: string;
  photoUrls: string[];
  photoPaths?: string[];
  createdAt?: Timestamp;
}

function StoryPhoto({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-secondary/60 text-muted-foreground">
        <ImageIcon className="h-8 w-8 opacity-40" />
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes={sizes}
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchStories = async () => {
    setLoading(true);
    setFetchError(null);
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
          photoPaths: data.photoPaths || [],
          createdAt: data.createdAt?.toDate() ?? new Date(),
          updatedAt: data.createdAt?.toDate() ?? new Date(),
        };
      });
      setStories(list);
    } catch (error) {
      console.error("Error fetching stories:", error);
      setFetchError(formatErrorMessage(error, "Unable to load stories at this time."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <div className="bg-background">
      <header className="bg-charcoal-900 py-20 md:py-28 text-center">
        <div className="container mx-auto px-4">
          <SectionEyebrow tone="accent" align="center">Community Voices</SectionEyebrow>
          <h1 className="font-headline text-4xl md:text-5xl font-semibold tracking-tight text-ivory-100 mt-1">
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
      ) : fetchError ? (
        <div className="container mx-auto px-4 py-16 text-center space-y-4">
          <p className="font-body text-destructive">{fetchError}</p>
          <Button variant="outline" onClick={fetchStories}>
            Retry
          </Button>
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

              <h2 className="font-headline text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-8 leading-tight">
                {story.heading}
              </h2>

              {story.photoUrls.length === 1 && (
                <div className="relative aspect-[16/10] sm:aspect-[2/1] rounded-md overflow-hidden bg-muted mb-8">
                  <StoryPhoto
                    src={story.photoUrls[0]}
                    alt={story.heading}
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </div>
              )}

              {story.photoUrls.length === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {story.photoUrls.slice(0, 2).map((url, i) => (
                    <div key={i} className="relative aspect-[4/3] rounded-md overflow-hidden bg-muted">
                      <StoryPhoto
                        src={url}
                        alt={`${story.heading} photo ${i + 1}`}
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              )}

              {story.photoUrls.length >= 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  <div className="relative aspect-[4/5] rounded-md overflow-hidden bg-muted">
                    <StoryPhoto
                      src={story.photoUrls[0]}
                      alt={story.heading}
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  <div className="grid grid-rows-2 gap-3">
                    {story.photoUrls.slice(1, 3).map((url, i) => (
                      <div key={i} className="relative aspect-square rounded-md overflow-hidden bg-muted">
                        <StoryPhoto
                          src={url}
                          alt={`${story.heading} photo ${i + 2}`}
                          sizes="(max-width: 640px) 100vw, 25vw"
                        />
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
      ) : (
        <div className="container mx-auto px-4 py-20 text-center max-w-md">
          <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-headline text-xl font-semibold">No stories published yet</h3>
          <p className="font-body text-muted-foreground mt-1 text-sm">
            Check back soon as our community members share their experiences and journeys.
          </p>
        </div>
      )}
    </div>
  );
}
