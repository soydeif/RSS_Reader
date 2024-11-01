export interface ContentGroupItem {
  id: number;
  title: string;
  link: string;
  description: string;
  content: string;
  imageSource: string | null;
  author: string;
  publishedAt: string;
  favorite: number;
}

export interface Myfeedprops {
  id: number;
  url: string;
  category: string;
  feedTitle: string;
  contentGroup: ContentGroupItem[];
}

export interface FetchResponse {
  feeds: Myfeedprops[];
}
