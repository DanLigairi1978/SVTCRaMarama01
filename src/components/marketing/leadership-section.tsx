"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { SectionEyebrow } from "@/components/marketing/section-eyebrow";
import { cn } from "@/lib/utils";
import type { Staff } from "@/lib/types";

interface StaffDoc {
  fullName: string;
  jobDescription: string;
  yearJoined: string;
  bio: string;
  photoUrl: string;
  photoPath: string;
  order?: number;
  createdAt?: Timestamp;
}

function StaffCard({ member }: { member: Staff }) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const bioRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const measure = () => {
      const el = bioRef.current;
      if (!el || expanded) return;
      setIsOverflowing(el.scrollHeight > el.clientHeight + 1);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [member.bio, expanded]);

  const initials =
    member.fullName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "SV";

  return (
    <article className="rounded-md border border-gray-200 bg-ochre-200/25 p-6 md:p-8 shadow-card">
      <div className="grid gap-6 md:grid-cols-[220px,1fr] items-start">
        {member.photoUrl && !imageFailed ? (
          <div className="relative w-full aspect-square md:w-[220px] rounded-md overflow-hidden shadow-card bg-secondary/50">
            <Image
              src={member.photoUrl}
              alt={member.fullName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 220px"
              unoptimized
              onError={() => setImageFailed(true)}
            />
          </div>
        ) : (
          <div className="relative w-full aspect-square md:w-[220px] rounded-md overflow-hidden shadow-card bg-secondary/70 flex items-center justify-center">
            <span className="font-headline text-3xl font-semibold text-primary/70">
              {initials}
            </span>
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-headline text-2xl font-semibold text-foreground leading-tight">
            {member.fullName}
          </h3>
          {member.jobDescription && (
            <p className="font-body text-base text-primary font-medium mt-1">
              {member.jobDescription}
            </p>
          )}
          {member.yearJoined && member.yearJoined.trim() !== "" && member.yearJoined !== "-" && (
            <p className="font-label text-xs font-semibold uppercase tracking-wide text-muted-foreground mt-2">
              Joined {member.yearJoined}
            </p>
          )}

          {member.bio && member.bio.trim() !== "" && member.bio !== "-" && (
            <>
              <p
                ref={bioRef}
                className={cn(
                  "font-body text-muted-foreground mt-4 leading-relaxed whitespace-pre-line",
                  !expanded && "line-clamp-6 md:line-clamp-[8]"
                )}
              >
                {member.bio}
              </p>

              {(isOverflowing || expanded) && (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className="mt-3 inline-flex items-center gap-1 font-label text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                  aria-expanded={expanded}
                >
                  {expanded ? (
                    <>
                      Show Less <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Read More <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export function LeadershipSection() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const q = query(collection(db, "staff"), orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);
        const list: Staff[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as StaffDoc;
          return {
            id: docSnap.id,
            fullName: data.fullName,
            jobDescription: data.jobDescription,
            yearJoined: data.yearJoined,
            bio: data.bio,
            photoUrl: data.photoUrl,
            photoPath: data.photoPath,
            order: data.order,
            createdAt: data.createdAt?.toDate() ?? new Date(),
          };
        });
        list.sort((a, b) => {
          const ao = a.order ?? Number.POSITIVE_INFINITY;
          const bo = b.order ?? Number.POSITIVE_INFINITY;
          if (ao !== bo) return ao - bo;
          return a.createdAt.getTime() - b.createdAt.getTime();
        });
        setStaff(list);
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  return (
    <section id="leadership" className="scroll-mt-20">
      <div className="text-center mb-10">
        <h2 className="font-headline text-3xl font-semibold tracking-tight mb-2">Leadership &amp; Team</h2>
        <SectionEyebrow align="center">The dedicated professionals driving our mission forward</SectionEyebrow>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : staff.length === 0 ? null : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {staff.map((member) => (
            <StaffCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </section>
  );
}
