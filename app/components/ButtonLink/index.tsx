import type { FC, ReactNode } from "react";
import styles from "./index.module.css";

// ==========================================
// Types & Interfaces
// ==========================================

interface ButtonLinkProps {
  readonly href: string;
  readonly children: ReactNode;
}

// ==========================================
// Main Component
// ==========================================

const ButtonLink: FC<ButtonLinkProps> = ({ href, children }) => (
  <a href={href} className={styles.button}>
    {children}
  </a>
);

export default ButtonLink;
