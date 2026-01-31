"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, type FC, type FormEvent } from "react";
import styles from "./index.module.css";

// ==========================================
// Types & Interfaces
// ==========================================

interface SearchIconProps {
  readonly src: string;
  readonly alt: string;
  readonly size: number;
}

// ==========================================
// Constants
// ==========================================

const SEARCH_ICON: SearchIconProps = {
  src: "/search.svg",
  alt: "検索",
  size: 16,
} as const;

const SEARCH_CONFIG = {
  paramName: "q",
  placeholder: "キーワードを入力",
  searchPath: "/news/search",
} as const;

// ==========================================
// Sub-Components
// ==========================================

const SearchFieldComponent: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      const query = formData.get(SEARCH_CONFIG.paramName);

      if (typeof query === "string" && query.trim()) {
        const params = new URLSearchParams();
        params.set(SEARCH_CONFIG.paramName, query.trim());
        router.push(`${SEARCH_CONFIG.searchPath}?${params.toString()}`);
      }
    },
    [router],
  );

  const defaultValue = searchParams.get(SEARCH_CONFIG.paramName) ?? undefined;

  return (
    <form onSubmit={handleSubmit} className={styles.form} role="search">
      <label className={styles.search}>
        <Image
          src={SEARCH_ICON.src}
          alt={SEARCH_ICON.alt}
          width={SEARCH_ICON.size}
          height={SEARCH_ICON.size}
          loading="eager"
        />
        <input
          type="search"
          name={SEARCH_CONFIG.paramName}
          defaultValue={defaultValue}
          placeholder={SEARCH_CONFIG.placeholder}
          className={styles.searchInput}
          aria-label={SEARCH_CONFIG.placeholder}
        />
      </label>
    </form>
  );
};

// ==========================================
// Main Component
// ==========================================

const SearchField: FC = () => (
  <Suspense fallback={null}>
    <SearchFieldComponent />
  </Suspense>
);

export default SearchField;
