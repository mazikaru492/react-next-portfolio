import { notFound } from "next/navigation";
import { getCategoryDetail, getNewsList } from "@/app/lids/microcms";
import NewsList from "@/app/components/NewsList";
import Pagination from "@/app/components/Pagination";
import { NEWS_LIST_LIMIT } from "@/app/constants";

type Props = {
  params: Promise<{
    id: string;
    current: string;
  }>;
};

export default async function Page(props: Props) {
  const params = await props.params;
  const current = parseInt(params.current, 10);
  if (Number.isNaN(current) || current < 1) {
    notFound();
  }
  const category = await getCategoryDetail(params.id).catch(notFound);

  const { contents: news, totalCount } = await getNewsList({
    filters: `category[equals]${category.id}`,
    limit: NEWS_LIST_LIMIT,
    offset: NEWS_LIST_LIMIT * (current - 1),
  });
  if (news.length === 0) {
    notFound();
  }
  return (
    <>
      <NewsList news={news} />
      <Pagination
        totalCount={totalCount}
        current={current}
        basePath={`/news/category/${category.id}`}
      />
    </>
  );
}
