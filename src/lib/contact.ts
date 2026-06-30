/**
 * Client-side contact form submission.
 *
 * Replaces the TanStack Start createServerFn version.
 * Calls the CRM directly from the browser.
 */

import { submitLeadToCRM } from "./crm";

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message?: string;
  sourceId?: string;
}

export async function submitContactForm(data: ContactFormData) {
  if (!data.name || !data.email || !data.phone) {
    return { success: false, error: "Name, email, and phone number are required." };
  }

  const result = await submitLeadToCRM({
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
  });

  return result;
}
