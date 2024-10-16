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
  activeFeedIndex: number | null | string;
  onFeedClick: (url: string, index: number) => void;
  onDeleteFeed: (feedId: string) => void;
}
export interface PostItemProps {
  item: {
    title: string;
    description: string;
    feedTitle: string;
  };
  isActive?: boolean | string | undefined;
  onItemClick: () => void;
  activeItemIndex?: string | null;
}

export interface PostsProps {
  selectedFeedData: FeedItemPost[] | null;
  onItemSelect: (index: number) => void;
}
export type FeedItemPost = {
  title: string;
  description: string;
  content: string;
  feedTitle: string;
};
