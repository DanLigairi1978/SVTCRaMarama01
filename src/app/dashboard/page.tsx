"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash2, Plus } from "lucide-react";

interface NewsItem {
    id: string;
    title: string;
    date: string;
    summary: string;
    timestamp?: any;
}

export default function DashboardPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loadingNews, setLoadingNews] = useState(true);

    const [title, setTitle] = useState("");
    const [dateStr, setDateStr] = useState("");
    const [summary, setSummary] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        fetchNews();
    }, []);

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

            setTitle("");
            setDateStr("");
            setSummary("");

            fetchNews();
        } catch (error) {
            console.error("Error adding news:", error);
            alert("Failed to add news item. Check your permissions.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteNews = async (id: string) => {
        if (!confirm("Are you sure you want to delete this news item?")) return;
        try {
            await deleteDoc(doc(db, "news", id));
            fetchNews();
        } catch (error) {
            console.error("Error deleting news:", error);
        }
    };

    return (
        <div className="grid gap-8 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Add Latest News</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddNews} className="space-y-4">
                        <div className="space-y-2">
                            <label className="font-label text-sm font-medium">Title</label>
                            <Input
                                placeholder="e.g. Community Health Screening a Success"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="font-label text-sm font-medium">Date Display Text</label>
                            <Input
                                placeholder="e.g. 25 JUL 2024"
                                value={dateStr}
                                onChange={(e) => setDateStr(e.target.value)}
                                required
                            />
                            <p className="font-body text-xs text-muted-foreground">Format as you want it to appear on the site.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="font-label text-sm font-medium">Summary</label>
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
                                <div key={item.id} className="flex items-start justify-between rounded-md border p-4">
                                    <div>
                                        <h4 className="font-headline font-semibold">{item.title}</h4>
                                        <p className="font-body text-sm text-primary font-medium">{item.date}</p>
                                        <p className="font-body text-sm text-muted-foreground mt-1 line-clamp-2">{item.summary}</p>
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
    );
}
