import type { FC, ReactNode } from "react";
import styles from "./index.module.css";

// ==========================================
// Types & Interfaces
// ==========================================

interface SheetProps {
  readonly children: ReactNode;
}

// ==========================================
// Main Component
// ==========================================

const Sheet: FC<SheetProps> = ({ children }) => (
  <div className={styles.container}>{children}</div>
);

export default Sheet;
