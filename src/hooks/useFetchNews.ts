import { useState } from "react";

export interface Article {
  category: string | undefined;
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content?: string;
  link?: string;
  source: {
    name: string;
  };
}

interface NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

export const useFetchNews = () => {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<Record<string, Article[]>>({});

  const fetchNewsData = async (category: string) => {
    if (cache[category]) {
      setNews(cache[category]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://saurav.tech/NewsAPI/top-headlines/category/${category}/in.json`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch news data");
      }
      const data: NewsResponse = await response.json();
      setNews(data.articles);
      setCache((prev) => ({ ...prev, [category]: data.articles }));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { news, loading, error, fetchNewsData };
};
