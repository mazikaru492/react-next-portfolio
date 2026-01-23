import Link from "next/link";
import Image from "next/image";
import sanitizeHtml from "sanitize-html";
import style from "./index.module.css";
import { News } from "@/app/lids/microcms";
import Date from "../Data";
import Category from "../Category";

type Props = {
  data: News;
};

// サニタイズ設定
const sanitizeOption = {
  allowedTags: [
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
  ],
  allowedAttributes: {
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt", "width", "height"],
    "*": ["class", "id", "style"],
  },
};

export default function Article({ data }: Props) {
  // CMSから取得したHTMLをサニタイズ（XSS対策）
  const sanitizedContent = sanitizeHtml(data.content, sanitizeOption);

  return (
    <main>
      <h1 className={style.title}>{data.title}</h1>
      <p className={style.description}>{data.description}</p>
      <div className={style.meta}>
        {data.category && (
          <Link
            href={`/news/category/${data.category.id}`}
            className={style.categoryLink}
          >
            <Category category={data.category} />
          </Link>
        )}
        <Date data={data.publishedAt ?? data.createdAt} />
      </div>
      {data.thumbnail && (
        <Image
          src={data.thumbnail.url}
          alt=""
          className={style.thumbnail}
          width={data.thumbnail.width}
          height={data.thumbnail.height}
        />
      )}
      <div
        className={style.content}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </main>
  );
}
