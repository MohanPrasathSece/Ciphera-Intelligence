/**
 * Client-side CRM lead submission.
 *
 * Posts directly to the external CRM API from the browser.
 * API credentials are read from Vite env vars (VITE_ prefix).
 */

export interface CRMLead {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  description: string;
  custom_fields?: {
    Source_ID?: string;
    How_Much_Invested?: string;
    Outline_Your_Case?: string;
  };
}

export async function submitLeadToCRM(lead: CRMLead) {
  const apiToken =
    import.meta.env.VITE_AFFILIATE_API_TOKEN ||
    "AFF_1_92cbc1bc76284e19b711bab22587d75f";
  const apiUrl =
    import.meta.env.VITE_CRM_API_URL ||
    "https://inwo.crmcore.me/api/lead_management/api/affiliates";

  const payload = {
    country_name: "cy",
    description: lead.description,
    phone: lead.phone,
    email: lead.email,
    first_name: lead.first_name,
    last_name: lead.last_name || "N/A",
    custom_fields: {
      Source_ID: lead.custom_fields?.Source_ID || "ciphera_intelligence",
      How_Much_Invested: lead.custom_fields?.How_Much_Invested || "0",
      Outline_Your_Case: lead.custom_fields?.Outline_Your_Case || "Lead registered",
    },
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: apiToken,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("CRM Error:", response.status, await response.text());
      return { success: false, error: `CRM error: ${response.status}` };
    }

    return { success: true };
  } catch (error: any) {
    console.error("CRM fetch failed:", error);
    return { success: false, error: error.message || "Failed to contact CRM" };
  }
}
