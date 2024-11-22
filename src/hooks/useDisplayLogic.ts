import { useState, useEffect } from "react";
import { FeedItemPost } from "@/types/RSSFeed";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import useViewport from "@/hooks/useViewport";

const defaultImage =
  "data:image/png;base64,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";

export const useDisplayLogic = () => {
  const [selectedPost, setSelectedPost] = useState<FeedItemPost | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const viewportType = useViewport();
  const [error, setError] = useState<string | null>(null);
  const [tourStep, setTourStep] = useState<number>(0);

  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const storedTourValue = localStorage.getItem("shouldShowTour");
  const shouldShowTour = storedTourValue ? JSON.parse(storedTourValue) : null;

  useEffect(() => {
    if (shouldShowTour === null) {
      setIsTourOpen(true);
      localStorage.setItem("shouldShowTour", JSON.stringify(false));
    }

    localStorage.setItem("shouldShowTour", JSON.stringify(shouldShowTour));
  }, [shouldShowTour]);

  const pageSize = 5;

  const modifyLinks = (
    html: string,
    returnAsText: boolean = false
  ): React.ReactNode | string => {
    try {
      let processedHTML = html;

      if (
        processedHTML.trim().startsWith("{") &&
        processedHTML.trim().endsWith("}")
      ) {
        const parsed = JSON.parse(processedHTML);

        if (parsed._) {
          processedHTML = parsed._;
        } else if (
          parsed.$ &&
          typeof parsed.$ === "object" &&
          parsed.$.type === "html"
        ) {
          processedHTML = parsed._;
        }
      }

      const sanitizedHTML = DOMPurify.sanitize(processedHTML, {
        USE_PROFILES: { html: true },
      });

      const parser = new DOMParser();
      const doc = parser.parseFromString(sanitizedHTML, "text/html");

      const bodyText = doc.body.innerHTML;

      if (
        bodyText.includes("This article originally appeared on Engadget at")
      ) {
        doc.body.innerHTML = bodyText.replace(
          /This article originally appeared on Engadget at.*?(<br>|<\/div>|$)/,
          ""
        );
      }

      doc.querySelectorAll("a").forEach((anchor) => {
        const textContent = anchor.textContent || "";
        anchor.replaceWith(textContent);
      });

      doc.querySelectorAll("img").forEach((img) => img.remove());

      if (returnAsText) {
        return doc.body.textContent?.trim() || "";
      }

      const cleanedHTML = doc.body.innerHTML;

      return parse(cleanedHTML);
    } catch (error) {
      console.error("Error al procesar el HTML:", error);
      return returnAsText ? "" : html;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const steps = [
    ...(viewportType === "desktop"
      ? [
          {
            title: "Topics Sidebar",
            description:
              "Navigate through various categories using the sidebar. Click on the tags to discover articles tailored to your specific interests.",
            target: () => document.querySelector(".ant-menu") as HTMLElement,
          },
        ]
      : []),
    {
      title: "Search Bar",
      description:
        "Feel free to search for articles using keywords relevant to your interests.",
      target: () => document.querySelector(".input-search") as HTMLElement,
    },
    {
      title: "Select View Type",
      description:
        "Choose how you would like the articles displayed on the page.",
      target: () =>
        document.querySelector(".style-view-btn-content") as HTMLElement,
    },
    {
      title: "Access Content Details",
      description:
        "Click on any article to view more details about the selected content.",
      target: () => document.querySelector(".rss-item") as HTMLElement,
    },
  ];

  const handleTourClose = () => {
    setIsTourOpen(false);
    localStorage.setItem("shouldShowTour", JSON.stringify(false));
  };

  useEffect(() => {
    if (viewportType !== "desktop") {
      setSelectedPost(null);
    }
  }, [viewportType]);

  return {
    formatDate,
    modifyLinks,
    selectedPost,
    setSelectedPost,
    imagesLoaded,
    setImagesLoaded,
    error,
    setError,
    isTourOpen,
    tourStep,
    setTourStep,
    viewportType,
    pageSize,
    defaultImage,
    steps,
    handleTourClose,
  };
};
