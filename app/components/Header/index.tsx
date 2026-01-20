import Image from "next/image";
import Link from "next/link";
import style from "./index.module.css";
import Menu from "../Menu";

export default function Header() {
  return (
    <header className={style.header}>
      <Link href="/" className={style.logoLink}>
        <Image
          src="/logo.svg"
          alt="HURUYA"
          className={style.logo}
          width={180}
          height={62}
          priority
        />
      </Link>
      <Menu />
    </header>
  );
}
