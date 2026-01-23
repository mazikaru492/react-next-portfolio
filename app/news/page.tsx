import { getNewsList } from "@/app/lids/microcms";
import NewsList from "@/app/components/NewsList";
import Pagenation from "@/app/components/Pagination";
import Hero from "@/app/components/Hero";
import { NEWS_LIST_LIMIT } from "@/app/constants";
import styles from "./page.module.css";

export default async function Page() {
  const { contents: news, totalCount } = await getNewsList({
    limit: NEWS_LIST_LIMIT,
  });
  return (
    <div className={styles.wrapper}>
      <Hero title="ニュース" sub="News" />
      <div className={styles.container}>
        <NewsList news={news} />
        <Pagenation totalCount={totalCount} />
      </div>
    </div>
  );
}
