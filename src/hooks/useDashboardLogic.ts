import { NewsItem } from "@/types/RSSFeed";
import { useEffect, useState } from "react";
import { useFeeds } from "./useFeeds";

const useDashboardLogic = () => {
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([]);
  const [localNews, setLocalNews] = useState<NewsItem[]>([]);
  const { getDashboardContent, loading, error } = useFeeds();

  const isValidImage = (image: string | null | undefined): boolean =>
    !!image && image.trim() !== "error";

  const allNews = [...featuredNews, ...localNews];

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
