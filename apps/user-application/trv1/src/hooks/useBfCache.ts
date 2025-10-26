import { useEffect } from "react";

/**
 * Hook to support back/forward cache (bfcache) for better navigation performance
 * This hook ensures the app properly handles page restoration from bfcache
 */
export function useBfCache() {
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      // If the page is being restored from bfcache, event.persisted will be true
      if (event.persisted) {
        // Refresh any stale data here if needed
        // For React Query, you might want to invalidate queries
        console.log("Page restored from bfcache");
      }
    };

    const handlePageHide = (event: PageTransitionEvent) => {
      // Clean up any resources that might prevent bfcache
      // Avoid heavy operations here
      if (event.persisted) {
        console.log("Page entering bfcache");
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);
}
