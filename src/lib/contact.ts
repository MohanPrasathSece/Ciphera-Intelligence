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

  const parts = data.name.trim().split(/\s+/);
  const first_name = parts[0] || "Inquirer";
  const last_name = parts.slice(1).join(" ") || "N/A";

  const result = await submitLeadToCRM({
    first_name,
    last_name,
    email: data.email.toLowerCase().trim(),
    phone: data.phone.trim(),
    description: `Ciphera Intelligence Inquiry. Msg: ${data.message || "None"}`,
    custom_fields: {
      Source_ID: data.sourceId || "ciphera_contact",
      How_Much_Invested: "0",
      Outline_Your_Case: data.message || "Contact form inquiry",
    },
  });

  return result;
}
