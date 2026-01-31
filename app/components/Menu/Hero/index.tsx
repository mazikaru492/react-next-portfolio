import Image from "next/image";
import style from "./index.module.css";

type Props = {
  title: string;
  sub: string;
};
export default function Hero({ title, sub }: Props) {
  return (
    <section className={style.container}>
      <div>
        <h1 className={style.title}>{title}</h1>
        <p className={style.sub}>{sub}</p>
      </div>
      <Image
        className={style.bgimg}
        src="/img-mv.jpg"
        alt=""
        width={4000}
        height={1200}
      />
    </section>
  );
}
