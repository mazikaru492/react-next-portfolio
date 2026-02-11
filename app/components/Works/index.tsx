import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.css";
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

// ==========================================
// WorkCard
// ==========================================

const WorkCard: FC<{ work: Work }> = ({ work }) => {
  const title = work.name1;
  const image = work.name2;
  const description = work.name3 ? stripHtml(work.name3) : "";

  return (
    <Link href={`/works/${work.id}`} className={styles.cardLink}>
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
          {description && (
            <p className={styles.cardDescription}>{description}</p>
          )}
          <span className={styles.readMore}>詳細を見る →</span>
        </div>
      </article>
    </Link>
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
