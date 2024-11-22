import { RootState } from "./store";

export const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("rssState", serializedState);
  } catch (err) {
    console.error("Error al guardar el estado en localStorage:", err);
  }
};

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("rssState");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Error al cargar el estado de localStorage:", err);
    return undefined;
  }
};
