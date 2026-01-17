import { notFound } from "next/navigation";
import { getNewsDetail } from "@/app/lids/microcms";
import Article from "@/app/components/Article";
import ButtonLink from "@/app/components/ButtonLink";
import style from "./page.module.css";

type Props = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    dk?: string;
  }>;
};

export default async function Page({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = (await searchParams) ?? {};

  const data = await getNewsDetail(resolvedParams.slug, {
    draftKey: resolvedSearchParams.dk,
  });

  if (!data) {
    notFound();
  }

  return (
    <>
      <Article data={data} />
      <div className={style.footer}>
        <ButtonLink href="/news">Back to News List</ButtonLink>
      </div>
    </>
  );
}
