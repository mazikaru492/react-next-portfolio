"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, type FC } from "react";
import style from "./index.module.css";
import Menu from "../Menu";

// Constants
const LOGO_CONFIG = {
  src: "/logo.svg",
  alt: "HURUYA",
  width: 180,
  height: 62,
} as const;

const TIME_UPDATE_INTERVAL = 1000; // ms

// Utility function for formatting time
const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const Header: FC = () => {
  const [currentTime, setCurrentTime] = useState("");

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

  return (
    <header className={style.header}>
      <div className={style.leftSection}>
        <div className={style.timeDisplay} role="timer" aria-live="off">
          <span className={style.flag} aria-hidden="true">
            JP
          </span>
          <time className={style.time}>{currentTime}</time>
        </div>
      </div>
      <Link href="/" className={style.logoLink} aria-label="ホームページへ">
        <Image {...LOGO_CONFIG} className={style.logo} priority />
      </Link>
      <div className={style.rightSection}>
        <Menu />
      </div>
    </header>
  );
};

export default Header;
