import { Dispatch, SetStateAction } from "react";

export interface RSSItem {
  title: string;
  link: string;
  contentSnippet: string;
}

export interface RSSFeed {
  id: string;
  title: string;
  items: RSSItem[];
}

export interface FeedListProps {
  feeds: Array<{ id: string; title: string; url: string }>;
  activeFeedIndex: number | null;
  onFeedClick: (url: string, index: number) => void;
  onDeleteFeed: (feedId: string) => void;
  selectedFeedData: FeedItemPost[] | null;
}

export interface PostItemProps {
  item: {
    title: string;
    description: string;
    feedTitle: string;
    videoId?: string;
  };
  isActive?: boolean;
  isActivated?: boolean;
  onItemClick?: () => void;
  onItemActivate?: () => void;
}

export interface PostsProps {
  selectedFeedData: FeedItemPost[];
  activatedItemIndex: number | null;
  onItemSelect: (index: number) => void;
  onItemActivate: (index: number | null) => void;
}

export type FeedItemPost = {
  id: string;
  title: string;
  description: string;
  content: string;
  feedTitle: string;
  videoId?: string;
  thumbnailUrl?: string;
  link?: string;
  url?: string;
  publishedAt?: string;
  author?: string;
  category?: string;
};

export type PresentationType = "listCard" | "list";

export interface ContentDisplayProps {
  categoryLoading: boolean;
  dashboardLoading: boolean;
  categoryError: string | null;
  dashboardError: string | null;
  filteredGroupedPosts: Record<string, FeedItemPost[]>;
  collapsed: boolean;
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  filteredPosts: FeedItemPost[];
  savedPosts: FeedItemPost[];
  handleSavePost: (post: FeedItemPost) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  typeofPresentation: PresentationType;
  setTypeofPresentation: Dispatch<SetStateAction<PresentationType>>;
}
