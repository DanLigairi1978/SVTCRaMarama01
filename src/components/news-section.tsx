"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { latestNews as staticNews } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface NewsItem {
    id: string;
    title: string;
    date: string;
    summary: string;
}

export function NewsSection() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const q = query(
                    collection(db, "news"),
                    orderBy("timestamp", "desc"),
                    limit(3)
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const newsList: NewsItem[] = [];
                    querySnapshot.forEach((doc) => {
                        newsList.push({ id: doc.id, ...doc.data() } as NewsItem);
                    });
                    setNews(newsList);
                } else {
                    // Fallback to static data if no news in DB
                    setNews(staticNews);
                }
            } catch (error) {
                console.error("Error fetching news:", error);
                setNews(staticNews); // Fallback on error
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
                <Card key={item.id} className="border-none shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <p className="text-sm font-bold text-primary mb-2">{item.date}</p>
                        <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-base text-foreground/80">
                            {item.summary}
                        </CardDescription>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
