import { useEffect, useState } from "react";

const getViewportType = (width: number) => {
  if (width < 768) {
    return "mobile";
  } else if (width >= 768 && width < 1024) {
    return "tablet";
  } else {
    return "desktop";
  }
};

const useViewport = () => {
  const [viewportType, setViewportType] = useState(
    getViewportType(window.innerWidth)
  );

  useEffect(() => {
    const handleResize = () => {
      setViewportType(getViewportType(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return viewportType;
};

export default useViewport;
