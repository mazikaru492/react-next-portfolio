import styles from "./page.module.css";
import HubSpotForm from "@/app/components/HubSpotForm";
import Image from "next/image";

export default function Page() {
  return (
    <>
      <p className={styles.text}>
        ご質問やご相談は下記フォームよりご連絡ください。
        <br />
        内容を確認後、通常3営業日以内にご連絡させていただきます。
      </p>

      <div className={styles.contactInfo}>
        <Image
          src="/kyoto-tech-logo.jpg"
          alt="Kyoto Tech Logo"
          width={60}
          height={60}
          className={styles.logo}
        />
        <a
          className={styles.emailLink}
          href="mailto:ktc25a31e0014@edu.kyoto-tech.ac.jp"
        >
          ktc25a31e0014@edu.kyoto-tech.ac.jp
        </a>
      </div>

      <HubSpotForm
        portalId="244676217"
        formId="f8ec7adb-b284-4076-93ac-188f9fd44fe1"
        region="na2"
      />
    </>
  );
}
