/* eslint-disable react-hooks/exhaustive-deps */
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
  const [loading, setLoading] = useState(true);

  const isValidImage = (image: string | null | undefined): boolean =>
    !!image && image.trim() !== "error";

  const fetchDataForDashboard = async () => {
    try {
      const { featuredNews: fetchedFeatured, localNews: fetchedLocal } =
        getDashboardContent();

      if (fetchedFeatured.length > 0) {
        setFeaturedNews(fetchedFeatured);
        sessionStorage.setItem("featuredNews", JSON.stringify(fetchedFeatured));
      }

      if (fetchedLocal.length > 0) {
        setLocalNews(fetchedLocal);
        sessionStorage.setItem("localNews", JSON.stringify(fetchedLocal));
      }
    } catch (error) {
      console.error("Error fetching dashboard content:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedFeatured = sessionStorage.getItem("featuredNews");
    const cachedLocal = sessionStorage.getItem("localNews");

    const hasValidData =
      cachedFeatured &&
      cachedLocal &&
      JSON.parse(cachedFeatured).length > 0 &&
      JSON.parse(cachedLocal).length > 0;

    if (!hasValidData) {
      fetchDataForDashboard();
    } else {
      setLoading(false);
    }
  }, [getDashboardContent]);

  const allNews = useMemo(
    () => [...featuredNews, ...localNews],
    [featuredNews, localNews]
  );

  const newsWithImage = allNews.filter((item) => isValidImage(item.image));
  const newsWithoutImage = allNews.filter((item) => !isValidImage(item.image));

  const topStories = newsWithImage.slice(
    0,
    Math.max(0, newsWithImage.length - 3)
  );
  const latestNews = newsWithImage.slice(-3).concat(newsWithoutImage);

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    return new Date().toLocaleDateString("en-US", options);
  };

  return {
    loading,
    topStories,
    latestNews,
    formatDate,
    error,
  };
};

export default useDashboardLogic;
