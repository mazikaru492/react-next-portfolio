"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useCallback, type FC } from "react";
import cx from "classnames";
import style from "./index.module.css";

// ==========================================
// Type Definitions
// ==========================================

interface NavItem {
  readonly href: string;
  readonly label: string;
}

// ==========================================
// Constants
// ==========================================

const NAVIGATION_ITEMS: readonly NavItem[] = [
  { href: "/profile", label: "プロフィール" },
  { href: "/works", label: "制作" },
  { href: "/news", label: "ブログ" },
  { href: "/contact", label: "お問い合わせ" },
] as const;

const ICON_CONFIG = {
  size: 24,
  menu: { src: "/menu.svg", alt: "メニュー" },
  close: { src: "/close.svg", alt: "閉じる" },
} as const;

// ==========================================
// Main Component
// ==========================================

const Menu: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  const navClassName = cx(style.nav, { [style.open]: isOpen });
  const closeButtonClassName = cx(style.button, style.close);

  return (
    <div className={style.wrapper}>
      <nav className={navClassName} aria-label="メインナビゲーション">
        <ul className={style.items} role="list">
          {NAVIGATION_ITEMS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} onClick={handleClose}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <button
          className={closeButtonClassName}
          onClick={handleClose}
          aria-label="メニューを閉じる、"
          type="button"
        >
          <Image
            src={ICON_CONFIG.close.src}
            alt={ICON_CONFIG.close.alt}
            width={ICON_CONFIG.size}
            height={ICON_CONFIG.size}
            priority
          />
        </button>
      </nav>
      <button
        className={style.button}
        onClick={handleOpen}
        aria-label="メニューを開く"
        aria-expanded={isOpen}
        type="button"
      >
        <Image
          src={ICON_CONFIG.menu.src}
          alt={ICON_CONFIG.menu.alt}
          width={ICON_CONFIG.size}
          height={ICON_CONFIG.size}
        />
      </button>
    </div>
  );
};

export default Menu;
