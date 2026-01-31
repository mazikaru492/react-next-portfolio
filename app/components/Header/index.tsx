"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, useMemo, type FC } from "react";
import style from "./index.module.css";
import Menu from "../Menu";

// Constants
const LOGO_CONFIG = {
  src: "/logo.svg",
  alt: "HURUYA",
  width: 180,
  height: 62,
} as const;

const ICON_SIZE = 20;
const TIME_UPDATE_INTERVAL = 1000; // ms

// Utility function for formatting time
const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

// Extracted SVG components for better maintainability
const SunIcon: FC = () => (
  <svg
    width={ICON_SIZE}
    height={ICON_SIZE}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon: FC = () => (
  <svg
    width={ICON_SIZE}
    height={ICON_SIZE}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default function Header() {
  const [currentTime, setCurrentTime] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Memoize the toggle handler to prevent unnecessary re-renders
  const handleThemeToggle = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  // Memoize the aria-label to avoid recalculation on every render
  const themeToggleLabel = useMemo(
    () => (isDarkMode ? "ライトモードに切り替え" : "ダークモードに切り替え"),
    [isDarkMode],
  );

  // Update time effect
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(formatTime(new Date()));
    };

    // Initial update
    updateTime();

    // Set up interval
    const intervalId = setInterval(updateTime, TIME_UPDATE_INTERVAL);

    // Cleanup
    return () => clearInterval(intervalId);
  }, []);

  // Theme management effect
  useEffect(() => {
    const htmlElement = document.documentElement;
    const themeClass = "light-mode";

    if (isDarkMode) {
      htmlElement.classList.remove(themeClass);
    } else {
      htmlElement.classList.add(themeClass);
    }
  }, [isDarkMode]);

  return (
    <header className={style.header}>
      <Link href="/" className={style.logoLink} aria-label="ホームページへ">
        <Image {...LOGO_CONFIG} className={style.logo} priority />
      </Link>
      <div className={style.rightSection}>
        <div className={style.timeDisplay} role="timer" aria-live="off">
          <span className={style.flag} aria-hidden="true">
            🇯🇵
          </span>
          <time className={style.time}>{currentTime}</time>
        </div>
        <button
          className={style.themeToggle}
          onClick={handleThemeToggle}
          aria-label={themeToggleLabel}
          type="button"
        >
          {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </button>
        <Menu />
      </div>
    </header>
  );
}
