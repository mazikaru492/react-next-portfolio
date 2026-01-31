import type { FC } from "react";
import type { Category as CategoryType } from "@/app/lids/microcms";
import styles from "./index.module.css";

// ==========================================
// Types & Interfaces
// ==========================================

interface CategoryProps {
  readonly category: CategoryType;
}

// ==========================================
// Main Component
// ==========================================

const Category: FC<CategoryProps> = ({ category }) => (
  <span className={styles.tag}>{category.name}</span>
);

export default Category;
