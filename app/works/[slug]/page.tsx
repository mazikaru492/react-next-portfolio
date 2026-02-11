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

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

// ==========================================
// Utilities
// ==========================================

/** リッチテキスト HTML → 最初の href URL */
const extractUrl = (html: string): string | null =>
  html.match(/href=\\?"([^"\\]+)\\?"/)?.[1] ?? null;

// ==========================================
// Route Segment Config
// ==========================================

export const revalidate = 60;

// ==========================================
// Page Component
// ==========================================

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const work = await getWorkDetail(slug);

  if (!work) {
    notFound();
  }

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

        {/* フッター */}
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
