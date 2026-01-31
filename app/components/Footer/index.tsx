import Image from "next/image";
import type { FC } from "react";
import styles from "./index.module.css";

// ==========================================
// Constants
// ==========================================

const FOOTER_IMAGE = {
  src: "/footer-character.png",
  alt: "HURUYA character",
  width: 80,
  height: 80,
} as const;

// ==========================================
// Main Component
// ==========================================

const Footer: FC = () => (
  <footer className={styles.footer}>
    <div className={styles.characterWrap}>
      <Image
        src={FOOTER_IMAGE.src}
        alt={FOOTER_IMAGE.alt}
        width={FOOTER_IMAGE.width}
        height={FOOTER_IMAGE.height}
        className={styles.character}
      />
    </div>
  </footer>
);

export default Footer;
