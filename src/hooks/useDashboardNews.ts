import { useState, useEffect } from "react";

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

export const useFetchDashboardNews = () => {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setLoading(true);

        const sources = ["bbc-news", "cnn", "fox-news"];
        const promises = sources.map((source) =>
          fetch(`https://saurav.tech/NewsAPI/everything/${source}.json`).then(
            (res) => res.json()
          )
        );

        const results = await Promise.all(promises);

        const combinedNews = results.flatMap((result: NewsResponse) =>
          result.articles.slice(0, 2)
        );

        setNews(combinedNews);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, []);

  return { news, loading, error };
};
