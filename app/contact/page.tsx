"use client";

import styles from "./page.module.css";
import Image from "next/image";
import { useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";
import ContactForm from "@/app/components/ContactForm";

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
        ご質問やご相談がございましたら、下記フォームまたはメールアドレスまでご連絡ください。
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
      </div>

      <ContactForm />
    </>
  );
}
