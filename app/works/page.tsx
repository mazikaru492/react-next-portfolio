import Hero from "@/app/components/Menu/Hero";
import Works from "@/app/components/Works";
import { getWorksList } from "@/app/lids/microcms";
import styles from "./page.module.css";

/** ISR: 60秒ごとにページを再生成し、microCMS の最新データを反映する */
export const revalidate = 60;

/**
 * Works 一覧ページ（/works）。
 * microCMS から制作物データを取得し、Works コンポーネントへ渡す。
 */
export default async function WorksPage() {
  const { contents: works } = await getWorksList();

  return (
    <div className={styles.wrapper}>
      <Hero title="制作" sub="Works & Projects" />
      <div className={styles.container}>
        <Works works={works} />
      </div>
    </div>
  );
}
