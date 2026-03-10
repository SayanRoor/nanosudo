// Brevo (Sendinblue) API integration — newsletter contact management.
// Transactional emails use Resend; Brevo is only for mailing list / campaigns.

import { serverEnv } from "@/config";

type BrevoContactAttributes = {
  FIRSTNAME?: string;
  LASTNAME?: string;
  LANGUAGE?: string;
};

type AddContactPayload = {
  email: string;
  attributes?: BrevoContactAttributes;
  listIds?: number[];
  updateEnabled?: boolean;
};

type BrevoApiError = {
  code: string;
  message: string;
};

async function brevoPost(path: string, body: unknown): Promise<Response> {
  const apiKey = serverEnv.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not configured.");
  }

  return fetch(`https://api.brevo.com/v3${path}`, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
}

export type SubscribeResult =
  | { ok: true; alreadySubscribed: boolean }
  | { ok: false; message: string };

/**
 * Subscribe an email address to the newsletter list.
 * Returns alreadySubscribed=true when the contact already exists.
 */
export async function subscribeToNewsletter(
  email: string,
  options?: { firstName?: string; language?: string },
): Promise<SubscribeResult> {
  const listIdRaw = serverEnv.BREVO_NEWSLETTER_LIST_ID;
  if (!listIdRaw) {
    throw new Error("BREVO_NEWSLETTER_LIST_ID is not configured.");
  }

  const listId = Number(listIdRaw);
  if (Number.isNaN(listId)) {
    throw new Error("BREVO_NEWSLETTER_LIST_ID must be a numeric list ID.");
  }

  const payload: AddContactPayload = {
    email,
    updateEnabled: true,
    listIds: [listId],
  };

  if (options?.firstName ?? options?.language) {
    payload.attributes = {};
    if (options.firstName) payload.attributes.FIRSTNAME = options.firstName;
    if (options.language) payload.attributes.LANGUAGE = options.language;
  }

  const res = await brevoPost("/contacts", payload);

  // 201 = new contact created; 204 = contact updated (already existed)
  if (res.status === 201) {
    return { ok: true, alreadySubscribed: false };
  }
  if (res.status === 204) {
    return { ok: true, alreadySubscribed: true };
  }

  // Error response
  let message = `Brevo API error (HTTP ${res.status})`;
  try {
    const json = (await res.json()) as BrevoApiError;
    if (json.message) message = json.message;
  } catch {
    // ignore parse failure
  }

  return { ok: false, message };
}
