
export const PAYDUNYA_CONFIG = {
  MASTER_KEY: "test_public_nuDKWSbcHwANGfIof0kz4kB8ZFV",
  PUBLIC_KEY: "live_public_6Z3Lz0j3G2lGPymdGx21NTW6EpX",
  PRIVATE_KEY: "live_private_i7NgLNUX0a93CDEX0OOMhWDgBRt",
  TOKEN: "3dC5yzh8HzJQuBkwEd6o",
  ENDPOINT: "https://app.paydunya.com/api/v1/checkout-invoice"
};

export interface PaydunyaInvoiceData {
  total_amount: number; // in XOF
  description: string;
  store_name?: string;
  cancel_url: string;
  return_url: string;
  custom_data?: any;
}

export const createPaydunyaInvoice = async (data: PaydunyaInvoiceData) => {
  const payload = {
    invoice: {
      total_amount: data.total_amount,
      description: data.description,
    },
    store: {
      name: data.store_name || "LoveDK Tech",
      tagline: "Transforming Ideas into Digital Reality",
      website_url: window.location.origin,
    },
    custom_data: data.custom_data,
    actions: {
      cancel_url: data.cancel_url,
      return_url: data.return_url,
    }
  };

  try {
    const response = await fetch(PAYDUNYA_CONFIG.ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "PAYDUNYA-MASTER-KEY": PAYDUNYA_CONFIG.MASTER_KEY,
        "PAYDUNYA-PRIVATE-KEY": PAYDUNYA_CONFIG.PRIVATE_KEY,
        "PAYDUNYA-TOKEN": PAYDUNYA_CONFIG.TOKEN
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Paydunya API Error: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Paydunya Error:", error);
    throw error;
  }
};
