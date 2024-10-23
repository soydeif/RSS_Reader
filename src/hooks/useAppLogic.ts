import { useState, useEffect } from "react";
import { Article, useFetchNews } from "./useFetchNews";
import { FeedItemPost } from "../types/RSSFeed";
import { store } from "../store";
import { addFeed, removeFeed } from "../rssSlice";
import { useFetchDashboardNews } from "./useDashboardNews";

const categories = [
  { key: "business", label: "Business" },
  { key: "entertainment", label: "Entertainment" },
  { key: "general", label: "General" },
  { key: "health", label: "Health" },
  { key: "science", label: "Science" },
  { key: "sports", label: "Sports" },
  { key: "technology", label: "Technology" },
];

const mapArticleToFeedItemPost = (
  article: Article,
  category: string
): FeedItemPost => ({
  id: article.url,
  title: article.title,
  description: article.description,
  content: article.content || "",
  link: article.url,
  thumbnailUrl: article.urlToImage || "",
  feedTitle: article.source.name,
  publishedAt: article.publishedAt,
  author: article?.author,
  category: category,
});

export const useAppLogic = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [savedPosts, setSavedPosts] = useState<FeedItemPost[]>(() => {
    const savedPostsFromStorage = localStorage.getItem("savedPosts");
    return savedPostsFromStorage ? JSON.parse(savedPostsFromStorage) : [];
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewSaved, setViewSaved] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);

  const {
    news: categoryNews,
    loading: categoryLoading,
    error: categoryError,
    fetchNewsData,
  } = useFetchNews();
  const {
    news: dashboardNews,
    loading: dashboardLoading,
    error: dashboardError,
  } = useFetchDashboardNews();

  useEffect(() => {
    localStorage.setItem("savedPosts", JSON.stringify(savedPosts));
  }, [savedPosts]);

  const handleSavePost = (post: FeedItemPost) => {
    setSavedPosts((prev) => {
      const isAlreadySaved = prev.some((item) => item.id === post.id);
      if (isAlreadySaved) {
        const newPosts = prev.filter((item) => item.id !== post.id);
        store.dispatch(removeFeed(post.id));
        return newPosts;
      } else {
        store.dispatch(addFeed({ title: post.title, url: post.link }));
        return [...prev, post];
      }
    });
  };

  const handleCategorySelection = async (categoryKey: string) => {
    if (categoryKey === "dashboard") {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryKey);
      await fetchNewsData(categoryKey);
    }
    setCurrentPage(1);
    setViewSaved(false);
    setSearchTerm("");
  };

  const filteredPosts = viewSaved
    ? savedPosts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : selectedCategory
    ? categoryNews.map((article) =>
        mapArticleToFeedItemPost(article, selectedCategory)
      )
    : dashboardNews.map((article: Article) =>
        mapArticleToFeedItemPost(article, "dashboard")
      );

  const groupedPosts = (posts: FeedItemPost[]) => {
    return categories.reduce((acc, category) => {
      const filteredByCategory = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          post.category === category.key
      );
      if (filteredByCategory.length > 0) {
        acc[category.label] = filteredByCategory;
      }
      return acc;
    }, {} as Record<string, FeedItemPost[]>);
  };

  const filteredGroupedPosts = groupedPosts(filteredPosts);

  return {
    collapsed,
    setCollapsed,
    savedPosts,
    setSavedPosts,
    selectedCategory,
    setSelectedCategory,
    viewSaved,
    setViewSaved,
    searchTerm,
    setSearchTerm,
    handleSavePost,
    handleCategorySelection,
    categories,
    mapArticleToFeedItemPost,
    categoryNews,
    dashboardNews,
    categoryLoading,
    dashboardLoading,
    categoryError,
    dashboardError,
    fetchNewsData,
    filteredGroupedPosts,
    groupedPosts,
    filteredPosts,
    currentPage,
    setCurrentPage,
  };
};
