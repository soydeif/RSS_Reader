/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from "uuid";

export const fetchRssFeedAsText = async (
  url: string
): Promise<any[] | null> => {
  try {
    const response = await fetch(url);
    let text = await response.text();

    text = text
      .replace(/<content:encoded>/g, "<content>")
      .replace(/<\/content:encoded>/g, "</content>");

    const domParser = new DOMParser();
    const doc = domParser.parseFromString(text, "text/xml");

    const parserError = doc.getElementsByTagName("parsererror");
    if (parserError.length > 0) {
      console.error("Error al parsear XML:", parserError[0].textContent);
      return null;
    }

    const isAtom = doc.getElementsByTagName("feed").length > 0;
    const isRss = doc.getElementsByTagName("rss").length > 0;

    let feedtitle = "Sin título";
    let items: HTMLCollectionOf<Element> | Element[] = [];

    if (isAtom) {
      const feedtitleElement = doc
        .getElementsByTagName("feed")[0]
        .getElementsByTagName("title")[0];
      feedtitle = feedtitleElement
        ? feedtitleElement.textContent || "Sin título"
        : "Sin título";
      items = Array.from(doc.getElementsByTagName("entry"));
    } else if (isRss) {
      const channelElement = doc.getElementsByTagName("channel")[0];
      const feedtitleElement = channelElement.getElementsByTagName("title")[0];
      feedtitle = feedtitleElement
        ? feedtitleElement.textContent || "Sin título"
        : "Sin título";
      items = Array.from(channelElement.getElementsByTagName("item"));
    } else {
      console.error("Formato de feed no reconocido");
      return null;
    }

    const result: any[] = [];

    for (let i = 0; i < items.length; i++) {
      const titleElement = items[i].getElementsByTagName("title")[0];
      const contentElement =
        items[i].getElementsByTagName("content")[0] ||
        items[i].getElementsByTagName("summary")[0] ||
        items[i].getElementsByTagName("description")[0];

      const title = titleElement
        ? titleElement.textContent || "Sin título"
        : "Sin título";

      const description = contentElement
        ? contentElement.textContent || "Sin contenido disponible"
        : "Sin descripción disponible";

      let videoId = "";
      let videoUrl = "";
      let thumbnailUrl = "";

      const mediaContentElement =
        items[i].getElementsByTagName("media:content")[0];
      if (mediaContentElement) {
        thumbnailUrl = mediaContentElement.getAttribute("url") || "";
      }

      const mediaElement = items[i].getElementsByTagName("media:group")[0];
      if (mediaElement && !thumbnailUrl) {
        videoId =
          items[i].getElementsByTagName("yt:videoId")[0]?.textContent || "";
        videoUrl =
          items[i].getElementsByTagName("link")[0]?.getAttribute("href") || "";
        thumbnailUrl =
          mediaElement
            .getElementsByTagName("media:thumbnail")[0]
            ?.getAttribute("url") || "";
      }

      result.push({
        id: uuidv4(),
        title,
        description,
        feedtitle,
        videoId,
        videoUrl,
        thumbnailUrl,
      });
    }

    return result;
  } catch (error) {
    console.error("Error en fetchRssFeedAsText:", error);
    return null;
  }
};
