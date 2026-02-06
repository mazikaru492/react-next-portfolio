"use client";

import { useState, type FC } from "react";
import styles from "./index.module.css";
import type { GitHubContributionCalendar } from "@/app/lids/github";

// ==========================================
// Constants
// ==========================================

const CONTRIBUTION_LEVELS = [0, 1, 2, 3, 4] as const;
const WEEKDAY_LABELS = ["", "月", "", "水", "", "金", ""] as const;

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

interface YearSelectorProps {
  readonly currentYear: number;
  readonly previousYear: number;
  readonly selectedYear: number;
  readonly onYearChange: (year: number) => void;
}

const YearSelector: FC<YearSelectorProps> = ({
  currentYear,
  previousYear,
  selectedYear,
  onYearChange,
}) => (
  <div className={styles.yearSelector}>
    <button
      type="button"
      className={`${styles.yearButton} ${selectedYear === currentYear ? styles.yearButtonActive : ""}`}
      onClick={() => onYearChange(currentYear)}
    >
      {currentYear}
    </button>
    <button
      type="button"
      className={`${styles.yearButton} ${selectedYear === previousYear ? styles.yearButtonActive : ""}`}
      onClick={() => onYearChange(previousYear)}
    >
      {previousYear}
    </button>
  </div>
);

interface FallbackChartProps {
  readonly login: string;
}

const FallbackChart: FC<FallbackChartProps> = ({ login }) => (
  <div className={styles.graphWrap}>
    <p className={styles.meta}>
      詳細表示には <code>GITHUB_TOKEN</code>{" "}
      の設定が必要です（未設定の場合は簡易表示になります）。
    </p>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      className={styles.fallbackImg}
      src={buildChartUrl(login)}
      alt={`${login} の GitHub コントリビューション`}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  </div>
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

interface ContributionGraphProps {
  readonly calendar: GitHubContributionCalendar;
  readonly login: string;
  readonly year: number;
}

const ContributionGraph: FC<ContributionGraphProps> = ({
  calendar,
  login,
  year,
}) => {
  const monthLabels = buildMonthLabels(calendar);

  return (
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
          aria-label={`${login} の ${year} 年の GitHub コントリビューション カレンダー`}
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
  );
};

// ==========================================
// Main Component
// ==========================================

interface ContributionSectionProps {
  readonly login: string;
  readonly currentYear: number;
  readonly previousYear: number;
  readonly currentYearCalendar: GitHubContributionCalendar | null;
  readonly previousYearCalendar: GitHubContributionCalendar | null;
}

export default function ContributionSection({
  login,
  currentYear,
  previousYear,
  currentYearCalendar,
  previousYearCalendar,
}: ContributionSectionProps) {
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const calendar =
    selectedYear === currentYear ? currentYearCalendar : previousYearCalendar;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>GitHubのコントリビューション</h3>
        <YearSelector
          currentYear={currentYear}
          previousYear={previousYear}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />
      </div>
      {calendar && (
        <p className={styles.meta}>
          {selectedYear}年のコントリビューションは {calendar.totalContributions}{" "}
          回です。
        </p>
      )}

      {calendar ? (
        <ContributionGraph
          calendar={calendar}
          login={login}
          year={selectedYear}
        />
      ) : (
        <FallbackChart login={login} />
      )}
    </div>
  );
}
