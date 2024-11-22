export interface ContentGroupItem {
  id: number;
  title: string;
  link: string;
  description: string;
  content: string;
  imagesource: string | null;
  author: string;
  publishedat: string;
  favorite: number;
}

export interface Myfeedprops {
  id: number;
  url: string;
  category: string;
  feedtitle: string;
  contentGroup: ContentGroupItem[];
}

export interface FetchResponse {
  feeds: Myfeedprops[];
}
