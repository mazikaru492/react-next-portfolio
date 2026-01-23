import { createClient } from "microcms-js-sdk";
import type {
  MicroCMSImage,
  MicroCMSListContent,
  MicroCMSListResponse,
  MicroCMSQueries,
} from "microcms-js-sdk";

export type Member = {
  name: string;
  position: string;
  profile: string;
  image: MicroCMSImage;
} & MicroCMSListContent;

export type Category = {
  name: string;
} & MicroCMSListContent;

export type News = {
  title: string;
  description: string;
  content: string;
  thumbnail?: MicroCMSImage;
  category?: Category;
} & MicroCMSListContent;

export type Profile = {
  name: string;
  title: string;
  subtitle: string;
  avatar?: MicroCMSImage;
  githubUrl?: string;
  instagramUrl?: string;
} & MicroCMSListContent;

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;
const isConfigured = Boolean(serviceDomain && apiKey);

let client: ReturnType<typeof createClient> | null = null;

const getClient = () => {
  if (client) return client;
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
  client = createClient({
    serviceDomain: serviceDomain!,
    apiKey: apiKey!,
  });
  return client;
};

const emptyList = <T>(): MicroCMSListResponse<T> => ({
  contents: [],
  totalCount: 0,
  offset: 0,
  limit: 0,
});

export const getMembers = async (queries?: MicroCMSQueries) => {
  const c = getClient();
  if (!c) return emptyList<Member>();
  const listData = await c.getList<Member>({
    endpoint: "members",
    queries,
  });
  return listData;
};

export const getNewsList = async (queries?: MicroCMSQueries) => {
  const c = getClient();
  if (!c) return emptyList<News>();
  const listData = await c.getList<News>({
    endpoint: "news",
    queries,
  });
  return listData;
};

export const getNewsDetail = async (
  contentId: string,
  queries?: MicroCMSQueries,
) => {
  const c = getClient();
  if (!c) return null;
  const detailData = await c.getListDetail<News>({
    endpoint: "news",
    contentId,
    queries,
    customRequestInit: {
      next: {
        revalidate: queries?.draftKey === undefined ? 60 : 0,
      },
    },
  });
  return detailData;
};

export const getCategories = async (queries?: MicroCMSQueries) => {
  const c = getClient();
  if (!c) return emptyList<Category>();
  const listData = await c.getList<Category>({
    endpoint: "categories",
    queries,
  });
  return listData;
};

export const getCategoryDetail = async (
  contentId: string,
  queries?: MicroCMSQueries,
) => {
  const c = getClient();
  if (!c) {
    return Promise.reject(
      new Error(
        "microCMS が未設定です（MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY）",
      ),
    );
  }
  const detailData = await c.getListDetail<Category>({
    endpoint: "categories",
    contentId,
    queries,
  });
  return detailData;
};

export const getCategorise = getCategoryDetail;

export const getProfile = async () => {
  const c = getClient();
  if (!c) {
    // microCMSが未設定の場合のフォールバック
    return {
      id: "default",
      name: "古家悠貴",
      title: "学生・ホワイトハッカー専攻",
      subtitle:
        "サイバーセキュリティの専門知識を活かし、より安全なデジタル社会の実現を目指しています",
      githubUrl: "https://github.com/mazikaru492",
      instagramUrl: "https://www.instagram.com/mark_c2c/",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      revisedAt: new Date().toISOString(),
    } as Profile;
  }
  try {
    const profileData = await c.getObject<Profile>({
      endpoint: "profile",
      customRequestInit: {
        next: {
          revalidate: 60,
        },
      },
    });
    return profileData;
  } catch (error) {
    console.warn(
      "[microcms] プロフィール取得エラー、デフォルト値を返します",
      error,
    );
    return {
      id: "default",
      name: "古家悠貴",
      title: "学生・ホワイトハッカー専攻",
      subtitle:
        "サイバーセキュリティの専門知識を活かし、より安全なデジタル社会の実現を目指しています",
      githubUrl: "https://github.com/mazikaru492",
      instagramUrl: "https://www.instagram.com/mark_c2c/",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      revisedAt: new Date().toISOString(),
    } as Profile;
  }
};
