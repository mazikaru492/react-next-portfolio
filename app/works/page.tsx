import Hero from "@/app/components/Menu/Hero";
import Works from "@/app/components/Works";
import { getWorksList } from "@/app/lids/microcms";
import styles from "./page.module.css";

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
