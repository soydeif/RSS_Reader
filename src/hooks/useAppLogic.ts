import { useState, useEffect } from "react";
import { FeedItemPost } from "@/types/RSSFeed";
import { store } from "@/store";
import { addFeed, removeFeed } from "@/rssSlice";
import { useDashboard } from "./useDashboard";
import useViewport from "./useViewport";
import { useFetchMyFeeds } from "./useFetchMyFeeds";

type PresentationType = "listCard" | "list";

export const useAppLogic = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentSection, setCurrentSection] = useState("Dashboard");
  const [savedPosts, setSavedPosts] = useState<FeedItemPost[]>(() => {
    const savedPostsFromStorage = localStorage.getItem("savedPosts");
    return savedPostsFromStorage ? JSON.parse(savedPostsFromStorage) : [];
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewSaved, setViewSaved] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [typeofPresentation, setTypeofPresentation] =
    useState<PresentationType>(() => {
      const typeofPresentationFromStorage =
        localStorage.getItem("typeofPresentation");

      if (typeofPresentationFromStorage) {
        const cleanedValue = typeofPresentationFromStorage.replace(
          /^"+|"+$/g,
          ""
        );
        return cleanedValue as PresentationType;
      }

      return "list";
    });
  const viewportType = useViewport();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    news: dashboardNews,
    loading: dashboardLoading,
    error: dashboardError,
  } = useDashboard();

  const { feeds, selectedFeed, changeFeed, error, loading } = useFetchMyFeeds();

  useEffect(() => {
    localStorage.setItem("savedPosts", JSON.stringify(savedPosts));
  }, [savedPosts]);

  useEffect(() => {
    localStorage.setItem(
      "typeofPresentation",
      JSON.stringify(typeofPresentation)
    );
  }, [typeofPresentation]);

  const handleSavePost = (post: FeedItemPost) => {
    setSavedPosts((prev) => {
      const isAlreadySaved = prev.some((item) => item.id === post.id);

      if (isAlreadySaved) {
        const newPosts = prev.filter((item) => item.id !== post.id);
        store.dispatch(removeFeed(post.id));
        return newPosts.length > 0 ? newPosts : [];
      } else {
        store.dispatch(addFeed({ title: post.title, url: post.link }));
        return [...prev, post];
      }
    });
  };

  const handleCategorySelection = (categoryKey: string) => {
    setCurrentPage(1);
    setSelectedCategory(categoryKey);
  };
  const filteredPosts = viewSaved
    ? savedPosts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : selectedFeed.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const handleMenuSelect = (key: string) => {
    setSearchTerm("");
    setCurrentPage(1);
    setCurrentSection(key);
    if (key === "dashboard") {
      setViewSaved(false);
      handleCategorySelection("dashboard");
    } else if (key === "saved") {
      setViewSaved(true);
    } else {
      setViewSaved(false);
      handleCategorySelection(key);
    }
    if (viewportType !== "desktop") {
      setCollapsed(!collapsed);
    }
  };

  return {
    collapsed,
    setCollapsed,
    savedPosts,
    setSavedPosts,
    selectedCategory,
    setSelectedCategory,
    viewSaved,
    searchTerm,
    setSearchTerm,
    handleSavePost,
    dashboardNews,
    dashboardLoading,
    dashboardError,
    filteredPosts,
    currentPage,
    setCurrentPage,
    typeofPresentation,
    setTypeofPresentation,
    handleMenuSelect,
    currentSection,
    feeds,
    selectedFeed,
    changeFeed,
    error,
    loading,
  };
};
