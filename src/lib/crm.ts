/**
 * Client-side CRM lead submission.
 *
 * Posts directly to the external CRM API from the browser.
 * API credentials are read from Vite env vars (VITE_ prefix).
 */

export interface CRMLead {
  name?: string;
  email: string;
  phone: string;
  message?: string;
  amount?: string;
}

export async function submitLeadToCRM(lead: CRMLead) {
  const apiToken =
    import.meta.env.VITE_AFFILIATE_API_TOKEN ||
    "AFF_1_92cbc1bc76284e19b711bab22587d75f";
  const apiUrl =
    import.meta.env.VITE_CRM_API_URL ||
    "https://inwo.crmcore.me/api/lead_management/api/affiliates";

  const [first_name, ...lastNameParts] = (lead.name || "Unknown").trim().split(" ");
  const last_name = lastNameParts.length > 0 ? lastNameParts.join(" ") : "Lead";

  let phone = (lead.phone || "").replace(/[^0-9+]/g, '');
  if (phone) {
    if (phone.startsWith('+')) {
      phone = '00' + phone.slice(1);
    }
    if (phone.startsWith('41') && phone.length === 11) {
      phone = '00' + phone;
    }
    if (!phone.startsWith('0041')) {
      if (phone.startsWith('0') && !phone.startsWith('00')) {
        phone = '0041' + phone.slice(1);
      } else if (!phone.startsWith('00')) {
        phone = '0041' + phone;
      }
    }
  } else {
    phone = "0000000000";
  }

  const payload = {
    country_name: "ch",
    description: lead.message || "Signup Lead",
    phone: phone,
    email: lead.email,
    first_name: first_name,
    last_name: last_name,
    custom_fields: {
      Source_ID: "website",
      How_Much_Invested: lead.amount || "0",
      Outline_Your_Case: lead.message || "",
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
