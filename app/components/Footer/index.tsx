import Image from "next/image";
import styles from "./index.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.characterWrap}>
        <Image
          src="/footer-character.png"
          alt="HURUYA character"
          width={80}
          height={80}
          className={styles.character}
        />
      </div>
    </footer>
  );
}
