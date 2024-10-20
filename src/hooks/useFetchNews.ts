import { useState, useEffect } from "react";

// Define the types for your news articles
export interface Article {
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

export const useFetchNews = (category: string) => {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsData = async () => {
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
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, [category]);

  return { news, loading, error };
};
