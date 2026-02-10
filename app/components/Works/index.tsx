import Image from "next/image";
import styles from "./index.module.css";
import { FaExternalLinkAlt } from "react-icons/fa";
import type { FC } from "react";
import type { Work } from "@/app/lids/microcms";

// ==========================================
// Types
// ==========================================

interface WorksProps {
  readonly works: readonly Work[];
}

// ==========================================
// Utilities
// ==========================================

const SECTION = {
  title: "Works",
  subtitle: "制作したプログラム・プロジェクト",
} as const;

/** リッチテキスト HTML → プレーンテキスト */
const stripHtml = (html: string): string => html.replace(/<[^>]*>/g, "").trim();

/** リッチテキスト HTML → 最初の href URL */
const extractUrl = (html: string): string | null =>
  html.match(/href=\\?"([^"\\]+)\\?"/)?.[1] ?? null;

// ==========================================
// WorkCard
// ==========================================

const WorkCard: FC<{ work: Work }> = ({ work }) => {
  const title = work.name1;
  const image = work.name2;
  const description = work.name3 ? stripHtml(work.name3) : "";
  const linkUrl = work.name4 ? extractUrl(work.name4) : null;

  return (
    <article className={styles.card}>
      {image && (
        <div className={styles.cardImage}>
          <Image
            src={image.url}
            alt={title}
            width={image.width}
            height={image.height}
            className={styles.image}
          />
        </div>
      )}
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title}</h3>
        {description && <p className={styles.cardDescription}>{description}</p>}
        {linkUrl && (
          <div className={styles.links}>
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              aria-label={`${title}のリンク`}
            >
              <FaExternalLinkAlt aria-hidden />
              <span>サイトを見る</span>
            </a>
          </div>
        )}
      </div>
    </article>
  );
};

// ==========================================
// Works (Main)
// ==========================================

const Works: FC<WorksProps> = ({ works }) => (
  <section className={styles.container}>
    <h2 className={styles.title}>{SECTION.title}</h2>
    <p className={styles.subtitle}>{SECTION.subtitle}</p>

    {works.length > 0 ? (
      <div className={styles.grid}>
        {works.map((work) => (
          <WorkCard key={work.id} work={work} />
        ))}
      </div>
    ) : (
      <p className={styles.emptyMessage}>現在、制作物はありません</p>
    )}
  </section>
);

export default Works;
