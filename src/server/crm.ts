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
  const apiToken = process.env.AFFILIATE_API_TOKEN || "AFF_1_92cbc1bc76284e19b711bab22587d75f";
  const apiUrl = process.env.CRM_API_URL || "https://inwo.crmcore.me/api/lead_management/api/affiliates";

  const payload = {
    country_name: "cy", // Default required country code
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

  console.log("Submitting lead to CRM at URL:", apiUrl);
  console.log("Payload:", JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": apiToken,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("CRM Response Error Code:", response.status);
      console.error("CRM Response Error Body:", errorText);
      return { success: false, error: `CRM server error: ${response.status} ${response.statusText}` };
    }

    console.log("CRM Lead successfully registered.");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to make secure HTTP call to CRM:", error);
    return { success: false, error: error.message || "Failed to contact CRM server" };
  }
}
