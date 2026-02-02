"use client";

import { useEffect, useRef } from "react";
import styles from "./AnimatedTitle.module.css";

interface AnimatedTitleProps {
  text: string;
  className?: string;
}

export default function AnimatedTitle({
  text,
  className = "",
}: AnimatedTitleProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 各文字をspanで囲む
    const chars = text.split("");
    container.innerHTML = chars
      .map(
        (char, index) =>
          `<span class="${styles.char}" style="--char-index: ${index}">${char}</span>`,
      )
      .join("");
  }, [text]);

  return (
    <h2 ref={containerRef} className={`${styles.title} ${className}`}>
      {text}
    </h2>
  );
}
