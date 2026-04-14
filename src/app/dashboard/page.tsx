"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash2, Plus } from "lucide-react";

// Define the NewsItem type matching our Firestore data
interface NewsItem {
    id: string;
    title: string;
    date: string;
    summary: string;
    timestamp?: any; // for sorting
}

export default function DashboardPage() {
    const [mounted, setMounted] = useState(false);
    const { user, isAdmin, loading } = useAuth();
    const router = useRouter();
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loadingNews, setLoadingNews] = useState(true);

    // Form State
    const [title, setTitle] = useState("");
    const [dateStr, setDateStr] = useState("");
    const [summary, setSummary] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Wait for client-side mount before doing anything
    useEffect(() => {
        setMounted(true);
    }, []);

    // Protect Route — only redirect AFTER auth has fully resolved
    useEffect(() => {
        if (mounted && !loading && (!user || !isAdmin)) {
            router.replace("/");
        }
    }, [mounted, user, isAdmin, loading, router]);

    // Fetch News
    const fetchNews = async () => {
        setLoadingNews(true);
        try {
            const q = query(collection(db, "news"), orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(q);
            const newsList: NewsItem[] = [];
            querySnapshot.forEach((docSnap) => {
                newsList.push({ id: docSnap.id, ...docSnap.data() } as NewsItem);
            });
            setNews(newsList);
        } catch (error) {
            console.error("Error fetching news:", error);
        } finally {
            setLoadingNews(false);
        }
    };

    useEffect(() => {
        if (mounted && user && isAdmin) {
            fetchNews();
        }
    }, [mounted, user, isAdmin]);

    // Add News
    const handleAddNews = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !dateStr || !summary) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "news"), {
                title,
                date: dateStr,
                summary,
                timestamp: new Date()
            });

            // Reset form
            setTitle("");
            setDateStr("");
            setSummary("");

            // Refresh list
            fetchNews();
        } catch (error) {
            console.error("Error adding news:", error);
            alert("Failed to add news item. Check your permissions.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete News
    const handleDeleteNews = async (id: string) => {
        if (!confirm("Are you sure you want to delete this news item?")) return;
        try {
            await deleteDoc(doc(db, "news", id));
            fetchNews();
        } catch (error) {
            console.error("Error deleting news:", error);
        }
    };

    // Show loading spinner until mounted AND auth resolved AND user is admin
    if (!mounted || loading || !isAdmin) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container py-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage website content and updates.</p>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Add News Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Add Latest News</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddNews} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title</label>
                                <Input
                                    placeholder="e.g. Community Health Screening a Success"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date Display Text</label>
                                <Input
                                    placeholder="e.g. 25 JUL 2024"
                                    value={dateStr}
                                    onChange={(e) => setDateStr(e.target.value)}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Format as you want it to appear on the site.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Summary</label>
                                <Textarea
                                    placeholder="Brief description of the news event..."
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="mr-2 h-4 w-4" /> Add News Item
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Existing News List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Current News Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loadingNews ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : news.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">No news items found. Add one to get started.</p>
                        ) : (
                            <div className="space-y-4">
                                {news.map((item) => (
                                    <div key={item.id} className="flex items-start justify-between rounded-lg border p-4">
                                        <div>
                                            <h4 className="font-semibold">{item.title}</h4>
                                            <p className="text-sm text-primary font-medium">{item.date}</p>
                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.summary}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteNews(item.id)}
                                            className="text-destructive hover:text-destructive/90"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
