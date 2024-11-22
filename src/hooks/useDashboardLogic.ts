import { NewsItem } from "@/types/RSSFeed";
import { useEffect, useState } from "react";
import { useFeeds } from "./useFeeds";

const useDashboardLogic = () => {
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([]);
  const [localNews, setLocalNews] = useState<NewsItem[]>([]);
  const { getDashboardContent, loading, error } = useFeeds();

  const isValidImage = (image: string | null | undefined): boolean =>
    !!image && image.trim() !== "error";

  const topStories = [
    ...featuredNews.filter((item) => isValidImage(item.image)),
    ...localNews.filter((item) => isValidImage(item.image)),
  ];

  const latestNews = [
    ...featuredNews.filter((item) => !isValidImage(item.image)),
    ...localNews.filter((item) => !isValidImage(item.image)),
  ];

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    return new Date().toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    if (!loading) {
      const { featuredNews, localNews } = getDashboardContent();

      setFeaturedNews(featuredNews);
      setLocalNews(localNews);
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
