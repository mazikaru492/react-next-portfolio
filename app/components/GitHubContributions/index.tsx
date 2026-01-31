import styles from "./index.module.css";
import type { FC } from "react";
import {
  getDefaultGitHubLogin,
  getGitHubContributionCalendar,
  type GitHubContributionCalendar,
} from "@/app/lids/github";

// ==========================================
// Constants
// ==========================================

const CONTRIBUTION_LEVELS = [0, 1, 2, 3, 4] as const;
const WEEKDAY_LABELS = ["", "月", "", "水", "", "金", ""] as const;
const REVALIDATE_SECONDS = 60 * 60; // 1 hour

const CONTRIBUTION_THRESHOLDS = {
  level1: 3,
  level2: 7,
  level3: 12,
} as const;

// ==========================================
// Utility Functions
// ==========================================

const getJapaneseMonthLabel = (monthIndex: number): string =>
  `${monthIndex + 1}月`;

const getLevelForCount = (count: number): 0 | 1 | 2 | 3 | 4 => {
  if (count <= 0) return 0;
  if (count <= CONTRIBUTION_THRESHOLDS.level1) return 1;
  if (count <= CONTRIBUTION_THRESHOLDS.level2) return 2;
  if (count <= CONTRIBUTION_THRESHOLDS.level3) return 3;
  return 4;
};

const buildMonthLabels = (
  calendar: GitHubContributionCalendar,
): ReadonlyArray<{ weekIndex: number; label: string }> => {
  const labels: Array<{ weekIndex: number; label: string }> = [];
  let lastMonth: number | null = null;

  calendar.weeks.forEach((week, weekIndex) => {
    const firstDay = week.contributionDays[0];
    if (!firstDay) return;

    const month = new Date(firstDay.date).getUTCMonth();

    if (lastMonth === null || month !== lastMonth) {
      labels.push({ weekIndex, label: getJapaneseMonthLabel(month) });
      lastMonth = month;
    }
  });

  return labels;
};

const buildChartUrl = (login: string): string =>
  `https://ghchart.rshah.org/${encodeURIComponent(login)}`;

// ==========================================
// Sub Components
// ==========================================

interface FallbackChartProps {
  readonly login: string;
}

const FallbackChart: FC<FallbackChartProps> = ({ login }) => (
  <section className={styles.container}>
    <h2 className={styles.title}>GitHubのコントリビューション</h2>
    <p className={styles.meta}>
      詳細表示には <code>GITHUB_TOKEN</code>{" "}
      の設定が必要です（未設定の場合は簡易表示になります）。
    </p>
    <div className={styles.graphWrap}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.fallbackImg}
        src={buildChartUrl(login)}
        alt={`${login} の GitHub コントリビューション`}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </div>
  </section>
);

const WeekdayColumn: FC = () => (
  <div className={styles.weekdayCol} aria-hidden>
    {WEEKDAY_LABELS.map((label, index) => (
      <div key={index} className={styles.weekday}>
        {label}
      </div>
    ))}
  </div>
);

const ContributionLegend: FC = () => (
  <div className={styles.legend} aria-hidden>
    <span>少ない</span>
    <div className={styles.legendSwatches}>
      {CONTRIBUTION_LEVELS.map((level) => (
        <span key={level} className={styles.legendSwatch} data-level={level} />
      ))}
    </div>
    <span>多い</span>
  </div>
);

// ==========================================
// Main Component
// ==========================================

interface Props {
  readonly year?: number;
  readonly login?: string;
}

export default async function GitHubContributions({
  year = new Date().getFullYear(),
  login,
}: Props) {
  const resolvedLogin = login ?? getDefaultGitHubLogin();
  if (!resolvedLogin) return null;

  const calendar = await getGitHubContributionCalendar({
    login: resolvedLogin,
    year,
    token: process.env.GITHUB_TOKEN,
    revalidateSeconds: REVALIDATE_SECONDS,
  });

  if (!calendar) {
    return <FallbackChart login={resolvedLogin} />;
  }

  const monthLabels = buildMonthLabels(calendar);

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>GitHubのコントリビューション</h2>
      <p className={styles.meta}>
        {year}年のコントリビューションは {calendar.totalContributions} 回です。
      </p>

      <div className={styles.graphWrap}>
        <div className={styles.monthRow} aria-hidden>
          {calendar.weeks.map((_, weekIndex) => {
            const label = monthLabels.find((m) => m.weekIndex === weekIndex);
            return (
              <div key={weekIndex} className={styles.month}>
                {label?.label ?? ""}
              </div>
            );
          })}
        </div>

        <div className={styles.gridRow}>
          <WeekdayColumn />

          <div
            className={styles.grid}
            role="img"
            aria-label={`${resolvedLogin} の ${year} 年の GitHub コントリビューション カレンダー`}
          >
            {calendar.weeks.flatMap((week, weekIndex) =>
              week.contributionDays.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={styles.day}
                  data-level={getLevelForCount(day.contributionCount)}
                  title={`${day.date}: ${day.contributionCount}回`}
                />
              )),
            )}
          </div>
        </div>

        <ContributionLegend />
      </div>
    </section>
  );
}
