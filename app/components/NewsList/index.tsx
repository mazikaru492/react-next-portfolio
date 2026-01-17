import Image from "next/image";
import Link from "next/link";
import style from "./index.module.css";
import Category from "../Category";
import Data from "../Data";
import { News } from "@/app/lids/microcms";

type Props = {
  news: News[];
};

export default function NewsList({ news }: Props) {
  if (news.length === 0) {
    return <p>No articles available.</p>;
  }
  return (
    <ul>
      {news.map((article) => (
        <li key={article.id} className={style.newsItem}>
          <Link href={`/news/${article.id}`} className={style.link}>
            {article.thumbnail ? (
              <Image
                src={article.thumbnail.url}
                alt=""
                className={style.image}
                width={article.thumbnail.width}
                height={article.thumbnail.height}
              />
            ) : (
              <Image
                className={style.image}
                src="/no-image.png"
                alt="no image"
                width={1200}
                height={630}
              />
            )}
            <dl className={style.contents}>
              <dt className={style.title}>{article.title}</dt>
              <dd className={style.meta}>
                {article.category && <Category category={article.category} />}
                <Data data={article.publishedAt ?? article.createdAt} />
              </dd>
            </dl>
          </Link>
        </li>
      ))}
    </ul>
  );
}
