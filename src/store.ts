import { configureStore } from "@reduxjs/toolkit";
import rssReducer, { RSSState, initialState } from "./rssSlice";
import { loadState, saveState } from "./localStorage";

export interface RootState {
  rss: RSSState;
}

const persistedState = loadState() as RootState;

export const store = configureStore({
  reducer: {
    rss: rssReducer,
  },
  preloadedState: persistedState || { rss: initialState },
});

store.subscribe(() => {
  saveState(store.getState());
});

export type AppDispatch = typeof store.dispatch;
