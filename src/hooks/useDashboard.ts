/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";

export interface Article {
  content: string;
  author: string;
  description: string;
  favorite: boolean;
  id: number;
  imageSource: string;
  link: string;
  publishedAt: string;
  title: string;
}

interface Feed {
  id: number;
  url: string;
  category: string;
  feedTitle: string;
  contentGroup: any[];
}

export const useDashboard = () => {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setLoading(true);
        setError(null);

        const feedResponse = await fetch("http://localhost:3000/api/myfeeds");
        const feeds: Feed[] = await feedResponse.json();

        const combinedNews = feeds.flatMap((feed) =>
          feed.contentGroup.slice(0, 2)
        );

        setNews(combinedNews);
      } catch (err) {
        setError(`Error general: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, []);

  return { news, loading, error };
};
