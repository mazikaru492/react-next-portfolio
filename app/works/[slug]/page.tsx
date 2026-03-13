import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getWorkDetail } from "@/app/lids/microcms";
import { FaExternalLinkAlt, FaArrowLeft } from "react-icons/fa";
import Hero from "@/app/components/Menu/Hero";
import styles from "./page.module.css";

// ==========================================
// Types
// ==========================================

/** 動的ルートパラメータ。Next.js 15 では Promise で提供される */
type Props = {
  params: Promise<{
    slug: string;
  }>;
};

// ==========================================
// Utilities
// ==========================================

/**
 * リッチテキスト HTML から最初の href 属性値（URL）を抽出する。
 * microCMS のリッチテキストフィールド (name4) に埋め込まれた
 * 外部リンクを取得するために使用する。
 *
 * 正規表現の解説:
 *   href=\\?" → href=" の開始（エスケープ付き引用符にも対応）
 *   ([^"\\]+)  → URL 本体（引用符・バックスラッシュ以外の文字列）
 *   \\?"       → 閉じ引用符
 */
const extractUrl = (html: string): string | null =>
  html.match(/href=\\?"([^"\\]+)\\?"/)?.[1] ?? null;

// ==========================================
// Route Segment Config
// ==========================================

/** ISR: 60秒ごとにページを再生成し、microCMS の最新データを反映する */
export const revalidate = 60;

// ==========================================
// Page Component
// ==========================================

/**
 * Work 詳細ページ（/works/[slug]）。
 * microCMS から個別の制作物データを取得して表示する。
 * データが見つからない場合は 404 を返す。
 *
 * microCMS フィールドの対応：
 *   name1 → タイトル
 *   name2 → メイン画像
 *   name3 → 説明（リッチテキスト HTML）
 *   name4 → 外部リンク（リッチテキスト HTML 内の href）
 */
export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const work = await getWorkDetail(slug);

  if (!work) {
    notFound();
  }

  // microCMS のフィールド名をセマンティックな変数名にマッピング
  const title = work.name1;
  const image = work.name2;
  const description = work.name3 ?? "";
  const linkUrl = work.name4 ? extractUrl(work.name4) : null;

  return (
    <div className={styles.wrapper}>
      <Hero title={title} sub="Work Detail" />

      <div className={styles.container}>
        <article className={styles.article}>
          {/* メイン画像 */}
          {image && (
            <div className={styles.imageWrapper}>
              <Image
                src={image.url}
                alt={title}
                width={image.width || 1200}
                height={image.height || 630}
                className={styles.image}
                priority
              />
            </div>
          )}

          {/* コンテンツ */}
          <div className={styles.content}>
            <h1 className={styles.title}>{title}</h1>

            {/* 説明（リッチテキスト） */}
            {description && (
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}

            {/* 外部リンク */}
            {linkUrl && (
              <div className={styles.linkSection}>
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.externalLink}
                >
                  <FaExternalLinkAlt aria-hidden />
                  <span>サイトを見る</span>
                </a>
              </div>
            )}
          </div>
        </article>

        {/* フッター — 一覧ページへの戻りリンク */}
        <div className={styles.footer}>
          <Link href="/works" className={styles.backLink}>
            <FaArrowLeft aria-hidden />
            <span>一覧に戻る</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
