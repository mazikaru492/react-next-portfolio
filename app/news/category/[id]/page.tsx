import { getNewsList, getCategoryDetail } from "@/app/lids/microcms";
import { notFound } from "next/navigation";
import NewsList from "@/app/components/NewsList";
import Pagination from "@/app/components/Pagination";
import Category from "@/app/components/Category";
import { NEWS_LIST_LIMIT } from "@/app/constants";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page(props: Props) {
  const params = await props.params;
  const category = await getCategoryDetail(params.id).catch(notFound);

  const { contents: news, totalCount } = await getNewsList({
    limit: NEWS_LIST_LIMIT,
    filters: `category[equals]${category.id}`,
  });
  return (
    <>
      <p>
        <Category category={category} /> の一覧
      </p>
      <NewsList news={news} />
      <Pagination
        totalCount={totalCount}
        basePath={`/news/category/${category.id}`}
      />
    </>
  );
}
