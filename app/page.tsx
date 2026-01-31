import styles from "./page.module.css";
import { getNewsList } from "@/app/lids/microcms";
import { TOP_NEWS_LIMIT } from "@/app/constants";
import NewsList from "@/app/components/NewsList";
import ButtonLink from "@/app/components/ButtonLink";
import GitHubContributions from "@/app/components/GitHubContributions";
import Profile from "@/app/components/Profile";
import TechStackMarquee from "@/app/components/TechStackMarquee";

export const revalidate = 60;

export default async function Home() {
  const data = await getNewsList({
    limit: TOP_NEWS_LIMIT,
  });

  return (
    <>
      <Profile />

      <div className={styles.sectionDivider} aria-hidden />

      <GitHubContributions />

      <TechStackMarquee />

      <div className={styles.sectionDivider} aria-hidden />

      <section className={styles.news}>
        <h2 className={styles.newsTitle}>News</h2>
        <NewsList news={data.contents} />
        <div className={styles.newsLink}>
          <ButtonLink href="/news">もっと見る</ButtonLink>
        </div>
      </section>
    </>
  );
}
