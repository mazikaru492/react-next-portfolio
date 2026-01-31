// ==========================================
// Types & Interfaces
// ==========================================

export interface GitHubContributionDay {
  readonly date: string;
  readonly contributionCount: number;
}

export interface GitHubContributionWeek {
  readonly contributionDays: readonly GitHubContributionDay[];
}

export interface GitHubContributionCalendar {
  readonly totalContributions: number;
  readonly weeks: readonly GitHubContributionWeek[];
}

interface GitHubUserContributions {
  readonly user: {
    readonly contributionsCollection: {
      readonly contributionCalendar: GitHubContributionCalendar;
    };
  } | null;
}

type GraphQLResponse<T> =
  | { data: T; errors?: ReadonlyArray<{ message: string }> }
  | { data?: T; errors: ReadonlyArray<{ message: string }> };

interface GetContributionParams {
  readonly login: string;
  readonly year: number;
  readonly token?: string;
  readonly revalidateSeconds?: number;
}

// ==========================================
// Constants
// ==========================================

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
const DEFAULT_GITHUB_USERNAME = "mazikaru492";
const DEFAULT_REVALIDATE_SECONDS = 60 * 60;

const CONTRIBUTION_QUERY = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
` as const;

// ==========================================
// Utility Functions
// ==========================================

const toIsoUtc = (date: Date): string => date.toISOString();

const createYearDateRange = (year: number): { from: Date; to: Date } => ({
  from: new Date(Date.UTC(year, 0, 1, 0, 0, 0)),
  to: new Date(Date.UTC(year, 11, 31, 23, 59, 59)),
});

// ==========================================
// API Functions
// ==========================================

export const getDefaultGitHubLogin = (): string | undefined =>
  process.env.GITHUB_USERNAME ?? DEFAULT_GITHUB_USERNAME;

export const getGitHubContributionCalendar = async (
  params: GetContributionParams,
): Promise<GitHubContributionCalendar | null> => {
  const {
    login,
    year,
    token,
    revalidateSeconds = DEFAULT_REVALIDATE_SECONDS,
  } = params;

  if (!token) return null;

  const { from, to } = createYearDateRange(year);

  const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
    body: JSON.stringify({
      query: CONTRIBUTION_QUERY,
      variables: {
        login,
        from: toIsoUtc(from),
        to: toIsoUtc(to),
      },
    }),
    next: { revalidate: revalidateSeconds },
  });

  if (!response.ok) return null;

  const json =
    (await response.json()) as GraphQLResponse<GitHubUserContributions>;

  if ("errors" in json && json.errors?.length) return null;

  return json.data?.user?.contributionsCollection.contributionCalendar ?? null;
};
