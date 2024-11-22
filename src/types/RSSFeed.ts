/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction } from "react";
import type { TourProps } from "antd";

export interface RSSItem {
  description: string;
  image?: string;
  thumbnailUrl?: string;
  pubDate?: string;
  title: string;
  link: string;
  contentSnippet: string;
}

export interface RSSFeed {
  id: string;
  title: string;
  items: RSSItem[];
}

export interface Myfeedprops {
  thumbnailUrl: string;
  content: any;
  link: string;
  title: string | Node;
  description: string;
  id: string;
  url: string;
  category: string;
}

export interface FeedListProps {
  feeds: Array<{ id: string; title: string; link: string }>;
  activeFeedIndex: number | null;
  onFeedClick: (url: string, index: number) => void;
  onDeleteFeed: (feedId: string) => void;
  selectedFeedData: FeedItemPost[] | null;
}

export interface PostItemProps {
  item: {
    title: string;
    description: string;
    feedtitle: string;
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
  steps: TourProps["steps"];
}

export type FeedItemPost = {
  imagesource: string;
  id: string;
  title: string;
  link: string;
  description: string;
  content: string;
  publishedat: string;
  feedtitle: string;
  thumbnailurl: string;
  author: string;
  url: string;
  category?: string;
};

export type PresentationType = "listCard" | "list";

export interface ContentDisplayProps {
  loading: boolean;
  setCollapsed: (arg: boolean) => void;
  error: string | null;
  savedPosts: FeedItemPost[];
  handleSavePost: (post: FeedItemPost) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  typeofPresentation: PresentationType;
  setTypeofPresentation: Dispatch<SetStateAction<PresentationType>>;
  feed: any;
}

export interface FeedDisplayProps {
  selectedFeedData:
    | FeedItemPost[]
    | { title: string; link: string; contentSnippet: string; pubDate?: string };
  savedPosts: FeedItemPost[];
  onSavePost: (post: FeedItemPost) => void;
  pagination?: boolean;
  currentPage?: number | undefined;
  setCurrentPage: (page: number) => void;
  typeofPresentation: PresentationType;
  setCollapsed: (arg: boolean) => void;
}

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  image: string | null;
  source: string;
  publishedAt: string;
  link: string;
}
