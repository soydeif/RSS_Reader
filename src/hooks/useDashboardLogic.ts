import { NewsItem } from "@/types/RSSFeed";
import { useEffect, useState, useMemo } from "react";
import { useFeeds } from "./useFeeds";

const useDashboardLogic = () => {
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>(() => {
    const cachedFeatured = sessionStorage.getItem("featuredNews");
    return cachedFeatured ? JSON.parse(cachedFeatured) : [];
  });

  const [localNews, setLocalNews] = useState<NewsItem[]>(() => {
    const cachedLocal = sessionStorage.getItem("localNews");
    return cachedLocal ? JSON.parse(cachedLocal) : [];
  });

  const { getDashboardContent, error } = useFeeds();
  const [loading, setLoading] = useState(
    featuredNews.length === 0 && localNews.length === 0
  );

  const isValidImage = (image: string | null | undefined): boolean =>
    !!image && image.trim() !== "error";

  const allNews = useMemo(
    () => [...featuredNews, ...localNews],
    [featuredNews, localNews]
  );

  let newsWithImage = allNews.filter((item) => isValidImage(item.image));
  let newsWithoutImage = allNews.filter((item) => !isValidImage(item.image));

  if (newsWithoutImage.length === 0 && newsWithImage.length > 0) {
    const numToMove = Math.min(3, newsWithImage.length);
    newsWithoutImage = newsWithImage.slice(-numToMove);
    newsWithImage = newsWithImage.slice(0, newsWithImage.length - numToMove);
  }

  const topStories = newsWithImage;
  const latestNews = newsWithoutImage;

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    return new Date().toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    if (loading) {
      const cachedFeatured = sessionStorage.getItem("featuredNews");
      const cachedLocal = sessionStorage.getItem("localNews");

      if (!cachedFeatured || !cachedLocal) {
        const { featuredNews, localNews } = getDashboardContent();
        setFeaturedNews(featuredNews);
        setLocalNews(localNews);

        sessionStorage.setItem("featuredNews", JSON.stringify(featuredNews));
        sessionStorage.setItem("localNews", JSON.stringify(localNews));
      }
      setLoading(false);
    }
  }, [loading, getDashboardContent]);

  return {
    error,
    loading,
    topStories,
    latestNews,
    formatDate,
  };
};

export default useDashboardLogic;
