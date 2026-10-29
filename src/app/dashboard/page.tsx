"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    deleteDoc,
    doc,
    serverTimestamp,
} from "firebase/firestore";
import { formatErrorMessage } from "@/lib/error-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Trash2, Plus, AlertCircle, CheckCircle2, RotateCw } from "lucide-react";

interface NewsItem {
    id: string;
    title: string;
    date: string;
    summary: string;
    timestamp?: unknown;
}

export default function DashboardPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loadingNews, setLoadingNews] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [dateStr, setDateStr] = useState("");
    const [summary, setSummary] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const fetchNews = async () => {
        setLoadingNews(true);
        setFetchError(null);
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
            setFetchError(formatErrorMessage(error, "Failed to load news items. Please check connection."));
        } finally {
            setLoadingNews(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleAddNews = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setFormSuccess(null);
        setActionError(null);

        const trimmedTitle = title.trim();
        const trimmedDate = dateStr.trim();
        const trimmedSummary = summary.trim();

        if (!trimmedTitle) {
            setFormError("Please enter a news headline/title.");
            return;
        }
        if (trimmedTitle.length > 200) {
            setFormError("Title must be 200 characters or fewer.");
            return;
        }
        if (!trimmedDate) {
            setFormError("Please enter the date display text (e.g. 25 JUL 2024).");
            return;
        }
        if (trimmedDate.length > 50) {
            setFormError("Date display text must be 50 characters or fewer.");
            return;
        }
        if (!trimmedSummary) {
            setFormError("Please enter a summary of the news event.");
            return;
        }
        if (trimmedSummary.length > 2000) {
            setFormError("Summary must be 2,000 characters or fewer.");
            return;
        }

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "news"), {
                title: trimmedTitle,
                date: trimmedDate,
                summary: trimmedSummary,
                timestamp: serverTimestamp(),
            });

            setTitle("");
            setDateStr("");
            setSummary("");
            setFormSuccess("News item published successfully.");

            await fetchNews();
        } catch (error) {
            console.error("Error adding news:", error);
            setFormError(formatErrorMessage(error, "Failed to publish news item. Check your permissions."));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteNews = async (id: string) => {
        if (!confirm("Are you sure you want to delete this news item?")) return;
        setActionError(null);
        setDeletingId(id);
        try {
            await deleteDoc(doc(db, "news", id));
            await fetchNews();
        } catch (error) {
            console.error("Error deleting news:", error);
            setActionError(formatErrorMessage(error, "Failed to delete news item."));
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {actionError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{actionError}</AlertDescription>
                </Alert>
            )}

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
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                        setFormError(null);
                                    }}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="font-label text-sm font-medium">Date Display Text</label>
                                <Input
                                    placeholder="e.g. 25 JUL 2024"
                                    value={dateStr}
                                    onChange={(e) => {
                                        setDateStr(e.target.value);
                                        setFormError(null);
                                    }}
                                    required
                                />
                                <p className="font-body text-xs text-muted-foreground">Format as you want it to appear on the site.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="font-label text-sm font-medium">Summary</label>
                                <Textarea
                                    placeholder="Brief description of the news event..."
                                    value={summary}
                                    onChange={(e) => {
                                        setSummary(e.target.value);
                                        setFormError(null);
                                    }}
                                    rows={4}
                                    required
                                />
                            </div>

                            {formError && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{formError}</AlertDescription>
                                </Alert>
                            )}

                            {formSuccess && (
                                <Alert className="border-teal text-teal dark:border-teal">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <AlertDescription>{formSuccess}</AlertDescription>
                                </Alert>
                            )}

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
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Current News Items</CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={fetchNews}
                            disabled={loadingNews}
                            title="Refresh news"
                        >
                            <RotateCw className={`h-4 w-4 ${loadingNews ? "animate-spin" : ""}`} />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {loadingNews ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : fetchError ? (
                            <div className="space-y-3 py-6 text-center">
                                <p className="text-sm text-destructive">{fetchError}</p>
                                <Button variant="outline" size="sm" onClick={fetchNews}>
                                    Retry
                                </Button>
                            </div>
                        ) : news.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">No news items found. Add one to get started.</p>
                        ) : (
                            <div className="space-y-4">
                                {news.map((item) => (
                                    <div key={item.id} className="flex items-start justify-between rounded-md border p-4">
                                        <div className="min-w-0 pr-3">
                                            <h4 className="font-headline font-semibold truncate">{item.title}</h4>
                                            <p className="font-body text-sm text-primary font-medium">{item.date}</p>
                                            <p className="font-body text-sm text-muted-foreground mt-1 line-clamp-2">{item.summary}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteNews(item.id)}
                                            disabled={deletingId === item.id}
                                            className="text-destructive hover:text-destructive/90 shrink-0"
                                            title="Delete"
                                        >
                                            {deletingId === item.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
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
