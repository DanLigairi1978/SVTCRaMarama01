"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { deleteStaffPhoto } from "@/lib/github-images";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash2, Pencil, Plus, ArrowUp, ArrowDown, GripVertical, Save } from "lucide-react";
import { StaffForm, type StaffFormInitialData } from "./staff-form";

interface StaffListItem {
  id: string;
  fullName: string;
  jobDescription: string;
  yearJoined: string;
  bio: string;
  photoUrl: string;
  photoPath: string;
  order?: number;
}

export default function StaffAdminPage() {
  const [staff, setStaff] = useState<StaffListItem[]>([]);
  const [savedOrder, setSavedOrder] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editing, setEditing] = useState<StaffFormInitialData | null>(null);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "staff"), orderBy("createdAt", "asc"));
      const snapshot = await getDocs(q);
      const list: StaffListItem[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as {
          fullName: string;
          jobDescription: string;
          yearJoined: string;
          bio: string;
          photoUrl: string;
          photoPath: string;
          order?: number;
          createdAt?: Timestamp;
        };
        return {
          id: docSnap.id,
          fullName: data.fullName,
          jobDescription: data.jobDescription,
          yearJoined: data.yearJoined,
          bio: data.bio,
          photoUrl: data.photoUrl,
          photoPath: data.photoPath,
          order: data.order,
        };
      });
      list.sort((a, b) => {
        const ao = a.order ?? Number.POSITIVE_INFINITY;
        const bo = b.order ?? Number.POSITIVE_INFINITY;
        return ao - bo;
      });
      setStaff(list);
      setSavedOrder(list.map((s) => s.id));
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleDelete = async (id: string, photoPath: string) => {
    if (!confirm("Are you sure you want to delete this staff member? This cannot be undone.")) return;
    try {
      if (photoPath) await deleteStaffPhoto(photoPath);
      await deleteDoc(doc(db, "staff", id));
      fetchStaff();
    } catch (error) {
      console.error("Error deleting staff member:", error);
    }
  };

  const handleSaved = () => {
    setView("list");
    setEditing(null);
    fetchStaff();
  };

  const moveTo = (from: number, to: number) => {
    if (to < 0 || to >= staff.length || to === from) return;
    setStaff((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const handleDrop = (targetIndex: number) => {
    if (dragId == null) return;
    const from = staff.findIndex((s) => s.id === dragId);
    if (from === -1) return;
    moveTo(from, targetIndex);
    setDragId(null);
  };

  const isDirty =
    staff.length !== savedOrder.length ||
    staff.some((s, i) => savedOrder[i] !== s.id);

  const handleSaveOrder = async () => {
    setSavingOrder(true);
    try {
      const batch = writeBatch(db);
      staff.forEach((member, index) => {
        batch.update(doc(db, "staff", member.id), { order: index });
      });
      await batch.commit();
      setSavedOrder(staff.map((s) => s.id));
      setStaff((prev) => prev.map((s, i) => ({ ...s, order: i })));
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to save order. Check your permissions and try again.");
    } finally {
      setSavingOrder(false);
    }
  };

  if (view === "add") {
    return <StaffForm onSaved={handleSaved} onCancel={() => setView("list")} />;
  }

  if (view === "edit" && editing) {
    return <StaffForm initialData={editing} onSaved={handleSaved} onCancel={() => { setView("list"); setEditing(null); }} />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 flex-wrap">
        <CardTitle>Staff</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleSaveOrder}
            disabled={!isDirty || savingOrder}
          >
            {savingOrder ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Order
              </>
            )}
          </Button>
          <Button onClick={() => setView("add")}>
            <Plus className="mr-2 h-4 w-4" /> Add Staff
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : staff.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No staff members yet. Add one to feature them on the About page.</p>
        ) : (
          <div className="space-y-4">
            {isDirty && (
              <p className="font-body text-xs text-muted-foreground">
                Order changed. Click <span className="font-medium text-foreground">Save Order</span> to publish the new order to the About page.
              </p>
            )}
            {staff.map((member, index) => (
              <div
                key={member.id}
                draggable
                onDragStart={(e) => {
                  setDragId(member.id);
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragOver={(e) => {
                  if (dragId && dragId !== member.id) e.preventDefault();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(index);
                }}
                onDragEnd={() => setDragId(null)}
                className={`flex items-start justify-between gap-4 rounded-md border bg-card p-4 transition-opacity ${
                  dragId === member.id ? "opacity-50" : "opacity-100"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
                    title="Drag to reorder"
                  >
                    <GripVertical className="h-5 w-5" />
                  </div>
                  {member.photoUrl && (
                    <div className="relative h-16 w-16 shrink-0 rounded-md overflow-hidden">
                      <Image src={member.photoUrl} alt={member.fullName} fill className="object-cover" unoptimized />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="font-headline font-semibold truncate">{member.fullName}</h4>
                    <p className="font-body text-sm text-primary font-medium">{member.jobDescription}</p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">Joined {member.yearJoined}</p>
                    <p className="font-body text-sm text-muted-foreground mt-1 line-clamp-2">{member.bio}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveTo(index, index - 1)}
                      disabled={index === 0}
                      title="Move up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveTo(index, index + 1)}
                      disabled={index === staff.length - 1}
                      title="Move down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditing(member);
                        setView("edit");
                      }}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(member.id, member.photoPath)}
                      className="text-destructive hover:text-destructive/90"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
