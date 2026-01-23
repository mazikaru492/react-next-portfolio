import Link from "next/link";
import styles from "./page.module.css";

export default function EntryPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            <span className={styles.titleLine}>ようこそ</span>
            <span className={styles.titleLine}>HURUYA Portfolio</span>
          </h1>
          <p className={styles.subtitle}>
            ホワイトハッカーを目指す学生のポートフォリオサイトへようこそ
          </p>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🛡️</div>
            <h3 className={styles.featureTitle}>セキュリティ</h3>
            <p className={styles.featureDesc}>
              サイバーセキュリティとホワイトハッキングの専門知識
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>💻</div>
            <h3 className={styles.featureTitle}>開発</h3>
            <p className={styles.featureDesc}>
              最新のWeb技術を活用した開発スキル
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🎓</div>
            <h3 className={styles.featureTitle}>学習</h3>
            <p className={styles.featureDesc}>
              kyoto-techで日々学び成長を続ける
            </p>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryButton}>
            <span>ポートフォリオを見る</span>
            <span className={styles.arrow}>→</span>
          </Link>
          <Link href="/profile" className={styles.secondaryButton}>
            <span>プロフィールを見る</span>
          </Link>
        </div>
      </div>

      <div className={styles.background}>
        <div className={styles.gradient1}></div>
        <div className={styles.gradient2}></div>
        <div className={styles.gradient3}></div>
      </div>
    </div>
  );
}
