"use client";

import { useFormState } from "react-dom";
import { useCallback, type FC, type FormEvent } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { createContactData } from "@/app/actions/contact";
import styles from "./index.module.css";

// ==========================================
// Types & Interfaces
// ==========================================

interface FormFieldProps {
  readonly id: string;
  readonly label: string;
  readonly type?: "text" | "email";
  readonly isTextarea?: boolean;
}

interface FormState {
  readonly status: string;
  readonly message: string;
}

// ==========================================
// Constants
// ==========================================

const INITIAL_STATE: FormState = {
  status: "",
  message: "",
} as const;

const FORM_FIELDS = {
  name: [
    { id: "lastname", label: "姓" },
    { id: "firstname", label: "名" },
  ],
  company: { id: "company", label: "会社名" },
  email: { id: "email", label: "メールアドレス", type: "email" as const },
  message: { id: "message", label: "メッセージ", isTextarea: true },
} as const;

const MESSAGES = {
  success: "お問い合わせいただき、ありがとうございます。",
  waiting: "お返事まで今しばらくお待ちください。",
  submit: "送信する",
} as const;

const GA_EVENT = {
  event: "contact",
  value: "submit",
} as const;

// ==========================================
// Sub-Components
// ==========================================

const FormField: FC<FormFieldProps> = ({
  id,
  label,
  type = "text",
  isTextarea = false,
}) => (
  <div className={styles.item}>
    <label className={styles.label} htmlFor={id}>
      {label}
    </label>
    {isTextarea ? (
      <textarea className={styles.textarea} id={id} name={id} />
    ) : (
      <input className={styles.textfield} type={type} id={id} name={id} />
    )}
  </div>
);

const SuccessMessage: FC = () => (
  <p className={styles.success}>
    {MESSAGES.success}
    <br />
    {MESSAGES.waiting}
  </p>
);

// ==========================================
// Main Component
// ==========================================

const ContactForm: FC = () => {
  const [state, formAction] = useFormState(createContactData, INITIAL_STATE);

  const handleSubmit = useCallback((_e: FormEvent<HTMLFormElement>) => {
    sendGAEvent(GA_EVENT);
  }, []);

  if (state.status === "success") {
    return <SuccessMessage />;
  }

  return (
    <form className={styles.form} action={formAction} onSubmit={handleSubmit}>
      <div className={styles.horizontal}>
        {FORM_FIELDS.name.map((field) => (
          <FormField key={field.id} {...field} />
        ))}
      </div>
      <FormField {...FORM_FIELDS.company} />
      <FormField {...FORM_FIELDS.email} />
      <FormField {...FORM_FIELDS.message} />
      <div className={styles.actions}>
        {state.status === "error" && (
          <p className={styles.error}>{state.message}</p>
        )}
        <input
          type="submit"
          value={MESSAGES.submit}
          className={styles.button}
        />
      </div>
    </form>
  );
};

export default ContactForm;
