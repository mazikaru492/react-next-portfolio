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
// Constants
// ==========================================

/** セクション見出しの固定テキスト */
const SECTION = {
  title: "Works",
  subtitle: "制作したプログラム・プロジェクト",
} as const;

// ==========================================
// Utilities
// ==========================================

/**
 * リッチテキスト HTML をプレーンテキストに変換する。
 * microCMS から返される HTML 文字列をカード上の概要表示に使うため、
 * タグを除去してテキスト部分だけを取り出す。
 */
const stripHtml = (html: string): string => html.replace(/<[^>]*>/g, "").trim();

// ==========================================
// WorkCard — 個別の制作物カード
// ==========================================

/**
 * 1つの Work をカードとして描画するコンポーネント。
 * クリックすると詳細ページ (/works/[id]) へ遷移する。
 *
 * microCMS フィールドの対応：
 *   name1 → タイトル
 *   name2 → サムネイル画像
 *   name3 → 説明（リッチテキスト HTML）
 */
const WorkCard: FC<{ work: Work }> = ({ work }) => {
  const title = work.name1;
  const image = work.name2;
  const description = work.name3 ? stripHtml(work.name3) : "";

  return (
    <Link href={`/works/${work.id}`} className={styles.cardLink}>
      <article className={styles.card}>
        {/* サムネイル画像（存在する場合のみ描画） */}
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
          {/* 概要テキスト（空文字の場合は非表示） */}
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
// Works — 制作物一覧セクション
// ==========================================

/**
 * Works セクション全体を描画するコンポーネント。
 * 制作物が0件の場合は空メッセージを表示する。
 */
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
