import { createClient } from "microcms-js-sdk";
import type {
  MicroCMSImage,
  MicroCMSListContent,
  MicroCMSListResponse,
  MicroCMSQueries,
} from "microcms-js-sdk";

// ==========================================
// Types & Interfaces
// ==========================================

export interface Member extends MicroCMSListContent {
  readonly name: string;
  readonly position: string;
  readonly profile: string;
  readonly image: MicroCMSImage;
}

export interface Category extends MicroCMSListContent {
  readonly name: string;
}

export interface News extends MicroCMSListContent {
  readonly title: string;
  readonly description: string;
  readonly content: string;
  readonly thumbnail?: MicroCMSImage;
  readonly category?: Category;
}

export interface Profile extends MicroCMSListContent {
  readonly name: string;
  readonly title: string;
  readonly subtitle: string;
  readonly avatar?: MicroCMSImage;
  readonly githubUrl?: string;
  readonly instagramUrl?: string;
  readonly linkedinUrl?: string;
}

export interface Work extends MicroCMSListContent {
  readonly name1: string;
  readonly name2?: MicroCMSImage;
  readonly name3?: string;
  readonly name4?: string;
}

type MicroCMSClient = ReturnType<typeof createClient>;

// ==========================================
// Constants
// ==========================================

const ENDPOINTS = {
  members: "members",
  news: "news",
  categories: "categories",
  profile: "profile",
  works: "works",
} as const;

const REVALIDATE_SECONDS = 60;

const DEFAULT_PROFILE: Profile = {
  id: "default",
  name: "古家悠貴",
  title: "学生・ホワイトハッカー専攻",
  subtitle:
    "サイバーセキュリティの専門知識を活かし、より安全なデジタル社会の実現を目指しています",
  githubUrl: "https://github.com/mazikaru492",
  instagramUrl: "https://www.instagram.com/mark_c2c/",
  linkedinUrl: "https://www.linkedin.com/in/huruya-yuki",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  publishedAt: new Date().toISOString(),
  revisedAt: new Date().toISOString(),
};

// ==========================================
// Configuration
// ==========================================

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;
const isConfigured = Boolean(serviceDomain && apiKey);

let clientInstance: MicroCMSClient | null = null;

// ==========================================
// Utility Functions
// ==========================================

const getClient = (): MicroCMSClient | null => {
  if (clientInstance) return clientInstance;

  if (!isConfigured) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "MICROCMS_SERVICE_DOMAIN と MICROCMS_API_KEY が必要です（.env.local を確認してください）",
      );
    }
    console.warn(
      "[microcms] MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY が未設定のため、空データでフォールバックします",
    );
    return null;
  }

  clientInstance = createClient({
    serviceDomain: serviceDomain!,
    apiKey: apiKey!,
  });

  return clientInstance;
};

const createEmptyListResponse = <T>(): MicroCMSListResponse<T> => ({
  contents: [],
  totalCount: 0,
  offset: 0,
  limit: 0,
});

// ==========================================
// API Functions - Members
// ==========================================

export const getMembers = async (
  queries?: MicroCMSQueries,
): Promise<MicroCMSListResponse<Member>> => {
  const client = getClient();
  if (!client) return createEmptyListResponse<Member>();

  return client.getList<Member>({
    endpoint: ENDPOINTS.members,
    queries,
  });
};

// ==========================================
// API Functions - News
// ==========================================

export const getNewsList = async (
  queries?: MicroCMSQueries,
): Promise<MicroCMSListResponse<News>> => {
  const client = getClient();
  if (!client) return createEmptyListResponse<News>();

  return client.getList<News>({
    endpoint: ENDPOINTS.news,
    queries,
  });
};

export const getNewsDetail = async (
  contentId: string,
  queries?: MicroCMSQueries,
): Promise<News | null> => {
  const client = getClient();
  if (!client) return null;

  const revalidateTime =
    queries?.draftKey === undefined ? REVALIDATE_SECONDS : 0;

  return client.getListDetail<News>({
    endpoint: ENDPOINTS.news,
    contentId,
    queries,
    customRequestInit: {
      next: { revalidate: revalidateTime },
    },
  });
};

// ==========================================
// API Functions - Categories
// ==========================================

export const getCategories = async (
  queries?: MicroCMSQueries,
): Promise<MicroCMSListResponse<Category>> => {
  const client = getClient();
  if (!client) return createEmptyListResponse<Category>();

  return client.getList<Category>({
    endpoint: ENDPOINTS.categories,
    queries,
  });
};

export const getCategoryDetail = async (
  contentId: string,
  queries?: MicroCMSQueries,
): Promise<Category> => {
  const client = getClient();
  if (!client) {
    throw new Error(
      "microCMS が未設定です（MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY）",
    );
  }

  return client.getListDetail<Category>({
    endpoint: ENDPOINTS.categories,
    contentId,
    queries,
  });
};

/** @deprecated Use getCategoryDetail instead */
export const getCategorise = getCategoryDetail;

// ==========================================
// API Functions - Profile
// ==========================================

export const getProfile = async (): Promise<Profile> => {
  const client = getClient();
  if (!client) return DEFAULT_PROFILE;

  try {
    return await client.getObject<Profile>({
      endpoint: ENDPOINTS.profile,
      customRequestInit: {
        next: { revalidate: REVALIDATE_SECONDS },
      },
    });
  } catch (error) {
    console.warn(
      "[microcms] プロフィール取得エラー、デフォルト値を返します",
      error,
    );
    return DEFAULT_PROFILE;
  }
};

// ==========================================
// API Functions - Works
// ==========================================

export const getWorksList = async (
  queries?: MicroCMSQueries,
): Promise<MicroCMSListResponse<Work>> => {
  const client = getClient();
  if (!client) return createEmptyListResponse<Work>();

  try {
    return await client.getList<Work>({
      endpoint: ENDPOINTS.works,
      queries,
      customRequestInit: {
        next: { revalidate: REVALIDATE_SECONDS },
      },
    });
  } catch (error) {
    console.warn("[microcms] Works取得エラー、空データを返します", error);
    return createEmptyListResponse<Work>();
  }
};
