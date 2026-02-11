import styles from "./index.module.css";
import {
  getDefaultGitHubLogin,
  getGitHubContributionCalendar,
} from "@/app/lids/github";
import TechStackMarquee from "@/app/components/TechStackMarquee";
import ContributionSection from "./ContributionSection";

// ==========================================
// Constants
// ==========================================

const REVALIDATE_SECONDS = 3600; // 1 hour

// ==========================================
// Main Component
// ==========================================

interface Props {
  readonly login?: string;
}

export default async function GitHubTechShowcase({ login }: Props) {
  const resolvedLogin = login ?? getDefaultGitHubLogin();
  if (!resolvedLogin) return null;

  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  // Fetch both years' data on the server
  const [currentYearCalendar, previousYearCalendar] = await Promise.all([
    getGitHubContributionCalendar({
      login: resolvedLogin,
      year: currentYear,
      token: process.env.GITHUB_TOKEN,
      revalidateSeconds: REVALIDATE_SECONDS,
    }),
    getGitHubContributionCalendar({
      login: resolvedLogin,
      year: previousYear,
      token: process.env.GITHUB_TOKEN,
      revalidateSeconds: REVALIDATE_SECONDS,
    }),
  ]);

  return (
    <section className={styles.container}>
      {/* GitHub Contributions Section */}
      <ContributionSection
        login={resolvedLogin}
        currentYear={currentYear}
        previousYear={previousYear}
        currentYearCalendar={currentYearCalendar}
        previousYearCalendar={previousYearCalendar}
      />

      {/* Divider */}
      <div className={styles.divider} aria-hidden="true" />

      {/* Tech Stack Section */}
      <div className={styles.techStackSection}>
        <TechStackMarquee />
      </div>
    </section>
  );
}
