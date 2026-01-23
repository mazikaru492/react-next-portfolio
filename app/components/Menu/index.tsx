"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import cx from "classnames";
import style from "./index.module.css";

export default function Menu() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const open = () => setOpen(true);
  const close = () => setOpen(false);
  return (
    <div className={style.wrapper}>
      <nav className={cx(style.nav, isOpen && style.open)}>
        <ul className={style.items}>
          <li>
            <Link href="/entry" onClick={close}>
              エントリー
            </Link>
          </li>
          <li>
            <Link href="/profile" onClick={close}>
              プロフィール
            </Link>
          </li>
          <li>
            <Link href="/news" onClick={close}>
              ニュース
            </Link>
          </li>
          <li>
            <Link href="/members" onClick={close}>
              自己紹介
            </Link>
          </li>
          <li>
            <Link href="/contact" onClick={close}>
              お問い合わせ
            </Link>
          </li>
        </ul>
        <button className={cx(style.button, style.close)} onClick={close}>
          <Image
            src="/close.svg"
            alt="閉じる"
            width={24}
            height={24}
            priority
          />
        </button>
      </nav>
      <button className={style.button} onClick={open}>
        <Image src="/menu.svg" alt="メニュー" width={24} height={24} />
      </button>
    </div>
  );
}
