import Link from "next/link";
import type { FC } from "react";
import { NEWS_LIST_LIMIT } from "@/app/constants";
import styles from "./index.module.css";

// ==========================================
// Types & Interfaces
// ==========================================

interface PaginationProps {
  readonly totalCount: number;
  readonly current?: number;
  readonly basePath?: string;
}

interface PageItemProps {
  readonly page: number;
  readonly isCurrent: boolean;
  readonly basePath: string;
}

// ==========================================
// Constants
// ==========================================

const DEFAULT_CURRENT_PAGE = 1;
const DEFAULT_BASE_PATH = "/news";

// ==========================================
// Utility Functions
// ==========================================

const calculatePageCount = (totalCount: number): number =>
  Math.ceil(totalCount / NEWS_LIST_LIMIT);

const generatePageNumbers = (totalCount: number): readonly number[] =>
  Array.from({ length: calculatePageCount(totalCount) }, (_, i) => i + 1);

const buildPageUrl = (basePath: string, page: number): string =>
  `${basePath}/p/${page}`;

// ==========================================
// Sub-Components
// ==========================================

const PageItem: FC<PageItemProps> = ({ page, isCurrent, basePath }) => (
  <li className={styles.list}>
    {isCurrent ? (
      <span className={`${styles.item} ${styles.current}`} aria-current="page">
        {page}
      </span>
    ) : (
      <Link href={buildPageUrl(basePath, page)} className={styles.item}>
        {page}
      </Link>
    )}
  </li>
);

// ==========================================
// Main Component
// ==========================================

const Pagination: FC<PaginationProps> = ({
  totalCount,
  current = DEFAULT_CURRENT_PAGE,
  basePath = DEFAULT_BASE_PATH,
}) => {
  const pages = generatePageNumbers(totalCount);

  return (
    <nav aria-label="ページナビゲーション">
      <ul className={styles.container}>
        {pages.map((page) => (
          <PageItem
            key={page}
            page={page}
            isCurrent={page === current}
            basePath={basePath}
          />
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
