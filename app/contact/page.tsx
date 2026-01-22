import styles from "./page.module.css";
import HubSpotForm from "@/app/components/HubSpotForm";

export default function Page() {
  return (
    <div className={styles.container}>
      <p className={styles.text}>
        ご質問やご相談は下記フォームよりご連絡ください。
        <br />
        内容を確認後、通常3営業日以内にご連絡させていただきます。
      </p>
      <p className={styles.email}>

        <a className={styles.emailLink} href="mailto:ktc25a31e0014@edu.kyoto-tech.ac.jp">
          ktc25a31e0014@edu.kyoto-tech.ac.jp
        </a>
      </p>
      <HubSpotForm
        portalId="244676217"
        formId="f8ec7adb-b284-4076-93ac-188f9fd44fe1"
        region="na2"
      />
    </div>
  );
}
