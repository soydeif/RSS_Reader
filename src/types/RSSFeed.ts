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
}
export interface PostItemProps {
  item: {
    title: string;
    description: string;
    content: string;
  };
  isActive: boolean;
  onItemClick: () => void;
}

export interface PostsProps {
  selectedFeedData: FeedItemPost[] | null;
  activeItemIndex: number | null;
  handleItemClick: (index: number) => void;
}
export type FeedItemPost = {
  title: string;
  description: string;
  content: string;
  feedTitle: string;
};
