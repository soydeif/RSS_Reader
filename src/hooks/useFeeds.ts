import { useState, useEffect, SetStateAction, useCallback } from "react";

interface ContentGroupItem {
  id: number;
  title: string;
  link: string;
  description: string;
  content: string;
  imagesource: string | null;
  author: string;
  publishedat: string;
  favorite: number;
}

interface Myfeedprops {
  id: number;
  url: string;
  category: string;
  feedtitle: string;
  contentGroup: ContentGroupItem[];
}

interface FetchResponse {
  feeds: Myfeedprops[];
}

export const useFeeds = () => {
  const [feeds, setFeeds] = useState<Myfeedprops[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFeed, setSelectedFeed] = useState<ContentGroupItem[]>([]);

  useEffect(() => {
    const fetchFeeds = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "https://reaserapi-production.up.railway.app/api/myfeeds"
        );
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
    const currentSection =
      sessionStorage.getItem("currentSection") || "dashboard";

    if (feeds.length > 0) {
      const matchingFeed =
        currentSection === "dashboard"
          ? feeds[0].contentGroup
          : feeds.find((feed) => feed.feedtitle === currentSection)
              ?.contentGroup;

      if (matchingFeed) {
        setSelectedFeed(matchingFeed);
      }
    }
  }, [feeds]);

  const changeFeed = (feed: SetStateAction<ContentGroupItem[]>) => {
    setSelectedFeed(feed);
  };

  const getDashboardContent = useCallback(() => {
    const allNews = feeds.flatMap((feed) => feed.contentGroup);

    const sortedNews = allNews.sort(
      (a, b) =>
        new Date(b.publishedat).getTime() - new Date(a.publishedat).getTime()
    );

    const featuredNews = sortedNews.slice(0, 5).map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.description || item.content,
      image: item.imagesource,
      source: item.author,
      publishedAt: item.publishedat,
      link: item.link || "",
    }));

    const localNews = sortedNews.slice(5, 10).map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.description || item.content,
      image: item.imagesource,
      source: item.author,
      publishedAt: item.publishedat,
      link: item.link || "",
    }));

    return { featuredNews, localNews };
  }, [feeds]);

  return {
    feeds,
    loading,
    error,
    selectedFeed,
    changeFeed,
    getDashboardContent,
  };
};
