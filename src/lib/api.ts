// Cliente HTTP tipado para consumir la API real del backend de Fundación Alzamora.
// La URL base se lee de la variable de entorno VITE_API_URL (ver .env.example).
// Si no está definida, se usa http://localhost:4000 como valor por defecto de desarrollo.

import {
  CreateDonationInput,
  CreateDonationResponse,
  CreatedIdResponse,
  CreateNeedReportInput,
  CreateVolunteerInput,
  CreateSubscriptionInput,
  CreateSubscriptionResponse,
  SubscriptionStatus,
  CreateDeliveryInput,
  Delivery,
  CreateExpenseInput,
  Expense,
  Subscription,
  DonationStatus,
  Ledger,
  PublicDonation,
  TransparencyStats,
} from '../types';

export const API_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ||
  'http://localhost:4000';

/**
 * Error de API con mensaje legible en español para mostrar en la UI.
 */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST';
  body?: unknown;
  signal?: AbortSignal;
  /** Token de administrador; si viene, se envía como `Authorization: Bearer <token>`. */
  token?: string;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal, token } = options;

  const headers: Record<string, string> = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: Object.keys(headers).length ? headers : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    // Fallo de red / servidor caído / CORS.
    throw new ApiError(
      'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo nuevamente.',
      0,
    );
  }

  if (!response.ok) {
    // 401 en rutas admin: token ausente o incorrecto.
    if (response.status === 401) {
      throw new ApiError('Token de administrador inválido', 401);
    }

    // Intentamos extraer un mensaje de error del cuerpo, si viene en JSON.
    let serverMessage = '';
    try {
      const data = await response.json();
      serverMessage = (data && (data.message || data.error)) || '';
    } catch {
      // El cuerpo no era JSON; lo ignoramos.
    }

    const fallback =
      response.status >= 500
        ? 'El servidor tuvo un problema al procesar tu solicitud. Inténtalo más tarde.'
        : 'No pudimos completar la solicitud. Verifica los datos e inténtalo nuevamente.';

    throw new ApiError(serverMessage || fallback, response.status);
  }

  // Algunas respuestas (por ejemplo 204) pueden no tener cuerpo.
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError('La respuesta del servidor no tuvo un formato válido.', response.status);
  }
}

// ---------------- Donaciones ----------------

/**
 * Crea una donación y devuelve la URL de la pasarela de pago (Webpay o PayPal).
 * El navegador debe redirigirse a `redirectUrl` para completar el pago.
 */
export function createDonation(
  input: CreateDonationInput,
  signal?: AbortSignal,
): Promise<CreateDonationResponse> {
  return request<CreateDonationResponse>('/api/donations/create', {
    method: 'POST',
    body: input,
    signal,
  });
}

/**
 * Consulta el estado de una donación por su identificador.
 */
export function getDonationStatus(
  donationId: string,
  signal?: AbortSignal,
): Promise<DonationStatus> {
  return request<DonationStatus>(
    `/api/donations/${encodeURIComponent(donationId)}/status`,
    { signal },
  );
}

// ---------------- Transparencia ----------------

/**
 * Estadísticas de impacto reales (comidas, kits, biblias, voluntarios, montos, etc.).
 */
export function getStats(signal?: AbortSignal): Promise<TransparencyStats> {
  return request<TransparencyStats>('/api/transparency/stats', { signal });
}

/**
 * Listado público de donaciones (sin datos sensibles) para mostrar transparencia.
 */
export function getPublicDonations(signal?: AbortSignal): Promise<PublicDonation[]> {
  return request<PublicDonation[]>('/api/transparency/donations', { signal });
}

/**
 * Registro contable de ingresos, gastos y balance para la sección de transparencia.
 */
export function getLedger(signal?: AbortSignal): Promise<Ledger> {
  return request<Ledger>('/api/transparency/ledger', { signal });
}

// ---------------- Voluntarios ----------------

/**
 * Registra una postulación de voluntariado en el backend.
 */
export function createVolunteer(
  input: CreateVolunteerInput,
  signal?: AbortSignal,
): Promise<CreatedIdResponse> {
  return request<CreatedIdResponse>('/api/volunteers', {
    method: 'POST',
    body: input,
    signal,
  });
}

// ---------------- Alertas de calle ----------------

/**
 * Registra un reporte de necesidad en calle en el backend.
 */
export function createNeedReport(
  input: CreateNeedReportInput,
  signal?: AbortSignal,
): Promise<CreatedIdResponse> {
  return request<CreatedIdResponse>('/api/needs', {
    method: 'POST',
    body: input,
    signal,
  });
}

// ---------------- Suscripciones mensuales (socios) ----------------

/**
 * Crea una suscripción mensual recurrente y devuelve la URL de la pasarela
 * (Webpay Oneclick / suscripción de PayPal). El navegador debe redirigirse a
 * `redirectUrl` para inscribir el medio de pago y activar el aporte de socio.
 */
export function createSubscription(
  input: CreateSubscriptionInput,
  signal?: AbortSignal,
): Promise<CreateSubscriptionResponse> {
  return request<CreateSubscriptionResponse>('/api/subscriptions/create', {
    method: 'POST',
    body: input,
    signal,
  });
}

/**
 * Consulta el estado de una suscripción mensual por su identificador.
 */
export function getSubscriptionStatus(
  subscriptionId: string,
  signal?: AbortSignal,
): Promise<SubscriptionStatus> {
  return request<SubscriptionStatus>(
    `/api/subscriptions/${encodeURIComponent(subscriptionId)}/status`,
    { signal },
  );
}

// ---------------- Administración (requiere token) ----------------
// Todas estas funciones envían `Authorization: Bearer <token>`.
// Un 401 se traduce a ApiError con mensaje "Token de administrador inválido".

/**
 * Registra una entrega (comida, kit, biblia o ropa) realizada en terreno.
 */
export function adminCreateDelivery(
  token: string,
  input: CreateDeliveryInput,
  signal?: AbortSignal,
): Promise<CreatedIdResponse> {
  return request<CreatedIdResponse>('/api/admin/deliveries', {
    method: 'POST',
    body: input,
    token,
    signal,
  });
}

/**
 * Lista las entregas registradas.
 */
export function adminListDeliveries(
  token: string,
  signal?: AbortSignal,
): Promise<Delivery[]> {
  return request<Delivery[]>('/api/admin/deliveries', { token, signal });
}

/**
 * Registra un gasto de la fundación.
 */
export function adminCreateExpense(
  token: string,
  input: CreateExpenseInput,
  signal?: AbortSignal,
): Promise<CreatedIdResponse> {
  return request<CreatedIdResponse>('/api/admin/expenses', {
    method: 'POST',
    body: input,
    token,
    signal,
  });
}

/**
 * Lista los gastos registrados.
 */
export function adminListExpenses(
  token: string,
  signal?: AbortSignal,
): Promise<Expense[]> {
  return request<Expense[]>('/api/admin/expenses', { token, signal });
}

/**
 * Lista las suscripciones mensuales (socios).
 */
export function adminListSubscriptions(
  token: string,
  signal?: AbortSignal,
): Promise<Subscription[]> {
  return request<Subscription[]>('/api/admin/subscriptions', { token, signal });
}

/**
 * Cancela una suscripción mensual por su identificador.
 */
export function adminCancelSubscription(
  token: string,
  subscriptionId: string,
  signal?: AbortSignal,
): Promise<void> {
  return request<void>(
    `/api/admin/subscriptions/${encodeURIComponent(subscriptionId)}/cancel`,
    { method: 'POST', token, signal },
  );
}
