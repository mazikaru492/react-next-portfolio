"use client";

import { useEffect, useState, useCallback, type FC } from "react";

// ==========================================
// Types & Interfaces
// ==========================================

interface OnlineStatusDotProps {
  readonly className?: string;
}

type OnlineStatus = boolean;

// ==========================================
// Constants
// ==========================================

const NETWORK_CONFIG = {
  pingEndpoint: "/api/ping",
  timeout: 2500,
  checkInterval: 10_000,
} as const;

const STATUS_LABELS = {
  online: "オンライン",
  offline: "オフライン",
} as const;

// ==========================================
// Main Component
// ==========================================

const OnlineStatusDot: FC<OnlineStatusDotProps> = ({ className }) => {
  const [isOnline, setIsOnline] = useState<OnlineStatus>(true);

  const checkInternetConnection = useCallback(async (): Promise<void> => {
    if (!navigator.onLine) {
      setIsOnline(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      NETWORK_CONFIG.timeout,
    );

    try {
      await fetch(NETWORK_CONFIG.pingEndpoint, {
        method: "GET",
        cache: "no-store",
        signal: controller.signal,
      });
      setIsOnline(true);
    } catch {
      setIsOnline(false);
    } finally {
      window.clearTimeout(timeoutId);
    }
  }, []);

  useEffect(() => {
    const handleBrowserStatusChange = (): void => {
      void checkInternetConnection();
    };

    void checkInternetConnection();

    window.addEventListener("online", handleBrowserStatusChange);
    window.addEventListener("offline", handleBrowserStatusChange);

    const intervalId = window.setInterval(() => {
      void checkInternetConnection();
    }, NETWORK_CONFIG.checkInterval);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("online", handleBrowserStatusChange);
      window.removeEventListener("offline", handleBrowserStatusChange);
    };
  }, [checkInternetConnection]);

  const statusLabel = isOnline ? STATUS_LABELS.online : STATUS_LABELS.offline;

  return (
    <span
      className={className}
      data-online={isOnline ? "true" : "false"}
      title={statusLabel}
      aria-label={statusLabel}
      role="status"
    />
  );
};

export default OnlineStatusDot;
