import Image from "next/image";
import type { FC } from "react";
import styles from "./index.module.css";
import { formatDate } from "@/app/lids/utils";

// ==========================================
// Types & Interfaces
// ==========================================

interface DateDisplayProps {
  readonly data: string;
}

// ==========================================
// Constants
// ==========================================

const CLOCK_ICON = {
  src: "/clock.svg",
  alt: "公開日時",
  size: 16,
} as const;

// ==========================================
// Main Component
// ==========================================

const DateDisplay: FC<DateDisplayProps> = ({ data }) => (
  <span className={styles.data}>
    <Image
      src={CLOCK_ICON.src}
      alt={CLOCK_ICON.alt}
      width={CLOCK_ICON.size}
      height={CLOCK_ICON.size}
      loading="eager"
    />
    <time dateTime={data}>{formatDate(data)}</time>
  </span>
);

export default DateDisplay;
