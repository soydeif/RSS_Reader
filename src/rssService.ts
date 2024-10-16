/* eslint-disable @typescript-eslint/no-explicit-any */
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

    let feedTitle = "Sin título";
    let items: HTMLCollectionOf<Element> | Element[] = [];

    if (isAtom) {
      const feedTitleElement = doc
        .getElementsByTagName("feed")[0]
        .getElementsByTagName("title")[0];
      feedTitle = feedTitleElement
        ? feedTitleElement.textContent || "Sin título"
        : "Sin título";
      items = Array.from(doc.getElementsByTagName("entry"));
    } else if (isRss) {
      const channelElement = doc.getElementsByTagName("channel")[0];
      const feedTitleElement = channelElement.getElementsByTagName("title")[0];
      feedTitle = feedTitleElement
        ? feedTitleElement.textContent || "Sin título"
        : "Sin título";
      items = Array.from(channelElement.getElementsByTagName("item"));
    } else {
      console.error("Formato de feed no reconocido");
      return null;
    }

    const result: any[] = [];

    for (let i = 0; i < items.length; i++) {
      const titleElement = items[i].getElementsByTagName("title")[0];
      const descriptionElement =
        items[i].getElementsByTagName("description")[0];
      const contentElement = items[i].getElementsByTagName("content")[0];

      const title = titleElement
        ? titleElement.textContent || "Sin título"
        : "Sin título";
      const description = contentElement
        ? contentElement.textContent || "Sin contenido disponible"
        : descriptionElement
        ? descriptionElement.textContent || "Sin descripción disponible"
        : "Sin descripción disponible";

      result.push({
        title,
        description,
        feedTitle,
      });
    }

    return result;
  } catch (error) {
    console.error("Error en fetchRssFeedAsText:", error);
    return null;
  }
};
