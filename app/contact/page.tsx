"use client";

import styles from "./page.module.css";
import Image from "next/image";
import { useState } from "react";
import { FaCopy, FaCheck, FaGithub, FaPhone } from "react-icons/fa";

export default function Page() {
  const [copied, setCopied] = useState(false);
  const email = "ktc25a31e0014@edu.kyoto-tech.ac.jp";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      <p className={styles.text}>
        ご質問やご相談がございましたら、下記メールアドレスまでご連絡ください。
        <br />
        内容を確認後、通常3営業日以内にご連絡させていただきます。
      </p>

      <div className={styles.contactCard}>
        <div className={styles.contactInfo}>
          <Image
            src="/kyoto-tech-logo.jpg"
            alt="Kyoto Tech Logo"
            width={60}
            height={60}
            className={styles.logo}
          />
          <div className={styles.emailWrapper}>
            <a className={styles.emailLink} href={`mailto:${email}`}>
              {email}
            </a>
            <button
              className={styles.copyButton}
              onClick={handleCopy}
              aria-label="メールアドレスをコピー"
            >
              {copied ? <FaCheck /> : <FaCopy />}
            </button>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.additionalInfo}>
          <a
            href="https://github.com/mazikaru"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.infoLink}
          >
            <FaGithub className={styles.icon} />
            <span>github.com/mazikaru</span>
          </a>

          <div className={styles.infoItem}>
            <Image
              src="/kyoto-tech-logo.jpg"
              alt="Kyoto Tech Logo"
              width={32}
              height={32}
              className={styles.infoLogo}
            />
            <div className={styles.infoText}>
              <span className={styles.infoLabel}>
                京都デザイン＆テクノロジー専門学校
              </span>
              <span>〒600-8357 京都府京都市下京区五条通猪熊西入柿本町596</span>
            </div>
          </div>

          <a href="tel:0120-109-525" className={styles.infoLink}>
            <FaPhone className={styles.icon} />
            <span>0120-109-525</span>
          </a>
        </div>
      </div>
    </>
  );
}
