import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { FiClock, FiTag } from "react-icons/fi";
import styles from "./index.module.css";
import Category from "../Category";
import Data from "../Data";
import type { News } from "@/app/lids/microcms";

// ==========================================
// Types & Interfaces
// ==========================================

interface NewsListProps {
  readonly news: readonly News[];
}

interface ArticleThumbnailProps {
  readonly thumbnail: News["thumbnail"];
}

interface NewsItemProps {
  readonly article: News;
}

// ==========================================
// Constants
// ==========================================

const FALLBACK_IMAGE = {
  src: "/no-image.png",
  alt: "画像なし",
  width: 1200,
  height: 630,
} as const;

const EMPTY_MESSAGE = "記事がありません。" as const;

// ==========================================
// Sub-Components
// ==========================================

const ArticleThumbnail: FC<ArticleThumbnailProps> = ({ thumbnail }) => {
  const imageProps = thumbnail
    ? {
        src: thumbnail.url,
        width: thumbnail.width,
        height: thumbnail.height,
        alt: "",
      }
    : FALLBACK_IMAGE;

  return (
    <div className={styles.imageWrapper}>
      <Image {...imageProps} className={styles.image} />
    </div>
  );
};

const NewsItem: FC<NewsItemProps> = ({ article }) => {
  const publishDate = article.publishedAt ?? article.createdAt;

  return (
    <article className={styles.newsItem}>
      <Link href={`/news/${article.id}`} className={styles.link}>
        <ArticleThumbnail thumbnail={article.thumbnail} />
        <div className={styles.contents}>
          <div className={styles.meta}>
            <div className={styles.date}>
              <FiClock aria-hidden="true" />
              <Data data={publishDate} />
            </div>
            {article.category && (
              <div className={styles.categoryItem}>
                <FiTag aria-hidden="true" />
                <Category category={article.category} />
              </div>
            )}
          </div>
          <h3 className={styles.title}>{article.title}</h3>
        </div>
      </Link>
    </article>
  );
};

// ==========================================
// Main Component
// ==========================================

const NewsList: FC<NewsListProps> = ({ news }) => {
  if (news.length === 0) {
    return <p>{EMPTY_MESSAGE}</p>;
  }

  return (
    <div className={styles.container}>
      {news.map((article) => (
        <NewsItem key={article.id} article={article} />
      ))}
    </div>
  );
};

export default NewsList;
