import { useMediaQuery } from "../../../src/hooks/useMediaQuery";

// Check if the device is a mobile device
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};

// Check if the app is running as a PWA
export const isPWA = () => {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone ||
    document.referrer.includes("android-app://")
  );
};

// Hook to check if the device is in portrait orientation
export const useIsPortrait = () => {
  return useMediaQuery("(orientation: portrait)");
};

// Hook to check if the device has a small screen
export const useIsSmallScreen = () => {
  return useMediaQuery("(max-width: 640px)");
};

// Hook to check if the device has a medium screen
export const useIsMediumScreen = () => {
  return useMediaQuery("(min-width: 641px) and (max-width: 1024px)");
};

// Hook to check if the device has touch capability
export const useHasTouch = () => {
  return typeof window !== "undefined" && "ontouchstart" in window;
};

// Function to handle touch events with better performance
export const optimizedTouchHandler = (callback: Function) => {
  let lastTouchTime = 0;
  const TOUCH_DELAY = 100; // ms

  return (event: React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTouchTime > TOUCH_DELAY) {
      lastTouchTime = now;
      callback(event);
    }
  };
};

// Function to add pull-to-refresh functionality
export const setupPullToRefresh = (refreshFunction: () => Promise<void>) => {
  let touchStartY = 0;
  let touchEndY = 0;
  const MIN_PULL_DISTANCE = 100;

  const handleTouchStart = (e: TouchEvent) => {
    touchStartY = e.touches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndY = e.touches[0].clientY;
  };

  const handleTouchEnd = async () => {
    if (window.scrollY === 0 && touchEndY - touchStartY > MIN_PULL_DISTANCE) {
      await refreshFunction();
    }
  };

  document.addEventListener("touchstart", handleTouchStart);
  document.addEventListener("touchmove", handleTouchMove);
  document.addEventListener("touchend", handleTouchEnd);

  return () => {
    document.removeEventListener("touchstart", handleTouchStart);
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
  };
};
