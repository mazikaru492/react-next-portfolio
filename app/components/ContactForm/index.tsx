import type { FC } from "react";
import styles from "./index.module.css";

// ==========================================
// Main Component
// ==========================================

const ContactForm: FC = () => {
  return (
    <div className={styles.formWrapper}>
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSeHxy5OkR3eKSGWf5gmo5b2hT6sesQZkfgFHmLkCGi2LyculA/viewform?embedded=true"
        width="100%"
        height="1101"
        style={{ border: 0, margin: 0 }}
        title="お問い合わせフォーム"
        loading="lazy"
        allowFullScreen
      >
        読み込んでいます…
      </iframe>
    </div>
  );
};

export default ContactForm;
