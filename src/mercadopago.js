export const MP_PUBLIC_KEY = 'APP_USR-a5062ed0-0a13-4279-8526-56ea6dfa9bf6';
export const MP_ACCESS_TOKEN = 'APP_USR-3106572885220448-081111-b46798f51edf4c4331c4b8373ca854de-334504638';

export const PLANS_INFO = {
  annual: {
    title: 'Aventura de Leer Premium - Plan Anual (Ahorra 50%)',
    price: 499,
    unit: 'MXN',
  },
  monthly: {
    title: 'Aventura de Leer Premium - Plan Mensual',
    price: 89,
    unit: 'MXN',
  },
  lifetime: {
    title: 'Aventura de Leer Premium - Pase Vitalicio',
    price: 899,
    unit: 'MXN',
  },
};

/**
 * Creates a Mercado Pago checkout preference and returns the init_point URL
 */
export async function createMercadoPagoPreference(planKey = 'annual', userEmail = '') {
  const plan = PLANS_INFO[planKey] || PLANS_INFO.annual;
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';

  const body = {
    items: [
      {
        title: plan.title,
        quantity: 1,
        currency_id: 'MXN',
        unit_price: plan.price,
      },
    ],
    payer: {
      email: userEmail || 'usuario@abcdlearn.app',
    },
    back_urls: {
      success: `${currentOrigin}/?payment=success`,
      failure: `${currentOrigin}/?payment=failure`,
      pending: `${currentOrigin}/?payment=pending`,
    },
    statement_descriptor: 'ABCD LEARN',
  };

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error Mercado Pago HTTP ${response.status}`);
  }

  const data = await response.json();
  // Return production init_point URL
  return data.init_point || data.sandbox_init_point;
}
