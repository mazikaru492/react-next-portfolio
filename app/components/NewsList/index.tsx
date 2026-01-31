import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
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
  if (thumbnail) {
    return (
      <Image
        src={thumbnail.url}
        alt=""
        className={styles.image}
        width={thumbnail.width}
        height={thumbnail.height}
      />
    );
  }

  return (
    <Image
      src={FALLBACK_IMAGE.src}
      alt={FALLBACK_IMAGE.alt}
      className={styles.image}
      width={FALLBACK_IMAGE.width}
      height={FALLBACK_IMAGE.height}
    />
  );
};

const NewsItem: FC<NewsItemProps> = ({ article }) => {
  const publishDate = article.publishedAt ?? article.createdAt;

  return (
    <li className={styles.newsItem}>
      <Link href={`/news/${article.id}`} className={styles.link}>
        <ArticleThumbnail thumbnail={article.thumbnail} />
        <dl className={styles.contents}>
          <dt className={styles.title}>{article.title}</dt>
          <dd className={styles.meta}>
            {article.category && <Category category={article.category} />}
            <Data data={publishDate} />
          </dd>
        </dl>
      </Link>
    </li>
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
    <ul>
      {news.map((article) => (
        <NewsItem key={article.id} article={article} />
      ))}
    </ul>
  );
};

export default NewsList;
