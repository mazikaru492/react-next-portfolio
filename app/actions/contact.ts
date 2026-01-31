"use server";

// ==========================================
// Types & Interfaces
// ==========================================

interface ContactFormState {
  readonly status: "success" | "error" | "";
  readonly message: string;
}

interface ContactFormData {
  readonly lastname: string;
  readonly firstname: string;
  readonly company: string;
  readonly email: string;
  readonly message: string;
}

interface HubSpotField {
  readonly objectTypeId: string;
  readonly name: string;
  readonly value: string;
}

// ==========================================
// Constants
// ==========================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const HUBSPOT_OBJECT_TYPE_ID = "0-1" as const;

const ERROR_MESSAGES = {
  lastname: "姓を入力してください",
  firstname: "名を入力してください",
  company: "会社名を入力してください",
  email: "メールアドレスを入力してください",
  emailInvalid: "メールアドレスの形式が誤っています",
  message: "メッセージを入力してください",
  submitFailed: "お問い合わせに失敗しました",
} as const;

const SUCCESS_MESSAGE = "OK" as const;

// ==========================================
// Utility Functions
// ==========================================

const isValidEmail = (email: string): boolean => EMAIL_REGEX.test(email);

const createErrorResponse = (message: string): ContactFormState => ({
  status: "error",
  message,
});

const createSuccessResponse = (): ContactFormState => ({
  status: "success",
  message: SUCCESS_MESSAGE,
});

const extractFormData = (formData: FormData): ContactFormData => ({
  lastname: formData.get("lastname") as string,
  firstname: formData.get("firstname") as string,
  company: formData.get("company") as string,
  email: formData.get("email") as string,
  message: formData.get("message") as string,
});

const validateFormData = (data: ContactFormData): string | null => {
  if (!data.lastname) return ERROR_MESSAGES.lastname;
  if (!data.firstname) return ERROR_MESSAGES.firstname;
  if (!data.company) return ERROR_MESSAGES.company;
  if (!data.email) return ERROR_MESSAGES.email;
  if (!isValidEmail(data.email)) return ERROR_MESSAGES.emailInvalid;
  if (!data.message) return ERROR_MESSAGES.message;
  return null;
};

const createHubSpotFields = (
  data: ContactFormData,
): readonly HubSpotField[] => [
  {
    objectTypeId: HUBSPOT_OBJECT_TYPE_ID,
    name: "lastname",
    value: data.lastname,
  },
  {
    objectTypeId: HUBSPOT_OBJECT_TYPE_ID,
    name: "firstname",
    value: data.firstname,
  },
  {
    objectTypeId: HUBSPOT_OBJECT_TYPE_ID,
    name: "company",
    value: data.company,
  },
  { objectTypeId: HUBSPOT_OBJECT_TYPE_ID, name: "email", value: data.email },
  {
    objectTypeId: HUBSPOT_OBJECT_TYPE_ID,
    name: "message",
    value: data.message,
  },
];

const buildHubSpotUrl = (): string =>
  `https://api.hsforms.com/submissions/v3/integration/submit/${process.env.HUBSPOT_PORTAL_ID}/${process.env.HUBSPOT_FORM_ID}`;

// ==========================================
// Server Action
// ==========================================

export async function createContactData(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const contactData = extractFormData(formData);

  const validationError = validateFormData(contactData);
  if (validationError) {
    return createErrorResponse(validationError);
  }

  const response = await fetch(buildHubSpotUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: createHubSpotFields(contactData) }),
  });

  try {
    await response.json();
  } catch {
    return createErrorResponse(ERROR_MESSAGES.submitFailed);
  }

  return createSuccessResponse();
}
