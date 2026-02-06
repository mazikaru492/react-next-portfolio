import styles from "./page.module.css";
import { getNewsList } from "@/app/lids/microcms";
import { TOP_NEWS_LIMIT } from "@/app/constants";
import NewsList from "@/app/components/NewsList";
import ButtonLink from "@/app/components/ButtonLink";
import GitHubTechShowcase from "@/app/components/GitHubTechShowcase";
import Profile from "@/app/components/Profile";

// ==========================================
// Constants
// ==========================================

const REVALIDATE_SECONDS = 60;

const SECTION_CONTENT = {
  blog: {
    title: "ブログ",
    viewMoreLabel: "記事一覧へ",
    viewMoreHref: "/news",
  },
} as const;

// ==========================================
// Configuration
// ==========================================

export const revalidate = REVALIDATE_SECONDS;

// ==========================================
// Page Component
// ==========================================

export default async function HomePage() {
  const { contents: newsItems } = await getNewsList({
    limit: TOP_NEWS_LIMIT,
  });

  return (
    <>
      <Profile />

      <GitHubTechShowcase />

      <section className={styles.news}>
        <h2 className={styles.newsTitle}>{SECTION_CONTENT.blog.title}</h2>
        <NewsList news={newsItems} />
        <div className={styles.newsLink}>
          <ButtonLink href={SECTION_CONTENT.blog.viewMoreHref}>
            {SECTION_CONTENT.blog.viewMoreLabel}
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
