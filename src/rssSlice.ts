import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export interface RSSState {
  source: Array<{
    id: string;
    title: string;
    url: string;
    content?: string;
  }>;
}

export const initialState: RSSState = {
  source: [
    {
      id: uuidv4(),
      title: "The Verge",
      url: "https://www.theverge.com/rss/index.xml",
    },
  ],
};

const rssSlice = createSlice({
  name: "rss",
  initialState,
  reducers: {
    addFeed: (
      state,
      action: PayloadAction<{ title: string; url?: string; content?: string }>
    ) => {
      state.source.push({
        id: uuidv4(),
        title: action.payload.title,
        url: action.payload.url || "",
        content: action.payload.content,
      });
    },
    removeFeed: (state, action: PayloadAction<string>) => {
      state.source = state.source.filter((feed) => feed.id !== action.payload);
    },
    updateFeedContent: (
      state,
      action: PayloadAction<{ id: string; content: string }>
    ) => {
      const feed = state.source.find((feed) => feed.id === action.payload.id);
      if (feed) {
        feed.content = action.payload.content;
      }
    },
  },
});

export const { addFeed, removeFeed, updateFeedContent } = rssSlice.actions;
export default rssSlice.reducer;
