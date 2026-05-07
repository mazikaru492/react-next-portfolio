import Link from "next/link";
import Image from "next/image";
import sanitizeHtml from "sanitize-html";
import type { FC } from "react";
import styles from "./index.module.css";
import type { News } from "@/app/lids/microcms";
import DateDisplay from "../Data";
import Category from "../Category";

// ==========================================
// Types & Interfaces
// ==========================================

interface ArticleProps {
  readonly data: News;
}

// ==========================================
// Constants
// ==========================================

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "s",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "blockquote",
  "pre",
  "code",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "div",
  "span",
  "figure",
  "figcaption",
];

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ["href", "name", "target", "rel"],
  img: ["src", "alt", "width", "height"],
  "*": ["class", "id"],
};

const SANITIZE_CONFIG = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: ALLOWED_ATTRIBUTES,
  transformTags: {
    a: (tagName: string, attribs: Record<string, string>) => ({
      tagName,
      attribs: {
        ...attribs,
        ...(attribs.target === "_blank"
          ? { rel: "noopener noreferrer" }
          : {}),
      },
    }),
  },
};

// ==========================================
// Utility Functions
// ==========================================

const sanitizeContent = (content: string): string => {
  return sanitizeHtml(content, SANITIZE_CONFIG);
};

// ==========================================
// Sub-Components
// ==========================================

const ArticleMeta: FC<{ data: News }> = ({ data }) => {
  const publishDate = data.publishedAt ?? data.createdAt;

  return (
    <div className={styles.meta}>
      {data.category && (
        <Link
          href={`/news/category/${data.category.id}`}
          className={styles.categoryLink}
        >
          <Category category={data.category} />
        </Link>
      )}
      <DateDisplay data={publishDate} />
    </div>
  );
};

const ArticleThumbnail: FC<{ thumbnail: News["thumbnail"] }> = ({
  thumbnail,
}) => {
  if (!thumbnail) return null;

  return (
    <Image
      src={thumbnail.url}
      alt=""
      className={styles.thumbnail}
      width={thumbnail.width}
      height={thumbnail.height}
    />
  );
};

// ==========================================
// Main Component
// ==========================================

const Article: FC<ArticleProps> = ({ data }) => {
  const sanitizedContent = sanitizeContent(data.content);

  return (
    <main>
      <h1 className={styles.title}>{data.title}</h1>
      <p className={styles.description}>{data.description}</p>
      <ArticleMeta data={data} />
      <ArticleThumbnail thumbnail={data.thumbnail} />
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </main>
  );
};

export default Article;
