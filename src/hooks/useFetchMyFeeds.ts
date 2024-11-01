import { useState, useEffect, SetStateAction } from "react";

interface ContentGroupItem {
  id: number;
  title: string;
  link: string;
  description: string;
  content: string;
  imageSource: string | null;
  author: string;
  publishedAt: string;
  favorite: number;
}

interface Myfeedprops {
  id: number;
  url: string;
  category: string;
  feedTitle: string;
  contentGroup: ContentGroupItem[];
}

interface FetchResponse {
  feeds: Myfeedprops[];
}

export const useFetchMyFeeds = () => {
  const [feeds, setFeeds] = useState<Myfeedprops[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFeed, setSelectedFeed] = useState<ContentGroupItem[]>(
    feeds[0]?.contentGroup || []
  );

  useEffect(() => {
    const fetchFeeds = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:3000/api/myfeeds");
        if (!response.ok) {
          throw new Error("Error al obtener la lista de feeds");
        }

        const data: FetchResponse = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("La respuesta no tiene el formato esperado");
        }

        setFeeds(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeds();
  }, []);

  useEffect(() => {
    if (feeds.length > 0 && selectedFeed.length === 0) {
      setSelectedFeed(feeds[0].contentGroup);
    }
  }, [feeds, selectedFeed.length]);

  const changeFeed = (feed: SetStateAction<ContentGroupItem[]>) => {
    setSelectedFeed(feed);
  };

  return { feeds, loading, error, selectedFeed, changeFeed };
};
