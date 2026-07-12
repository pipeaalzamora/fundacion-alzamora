import React, { useState, useEffect, useCallback } from 'react';
import {
  Lock,
  LogOut,
  LogIn,
  ShieldCheck,
  PackageCheck,
  Receipt,
  Repeat,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Plus,
  XCircle,
} from 'lucide-react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  auth,
  hasFirebase,
  ADMIN_EMAIL,
  signInWithGoogle,
  signOutAdmin,
  getIdToken,
} from '../lib/firebase';
import {
  CreateDeliveryInput,
  CreateExpenseInput,
  Delivery,
  DeliveryType,
  Expense,
  ExpenseCategory,
  Subscription,
} from '../types';
import {
  ApiError,
  adminCreateDelivery,
  adminListDeliveries,
  adminCreateExpense,
  adminListExpenses,
  adminListSubscriptions,
  adminCancelSubscription,
} from '../lib/api';

const TOKEN_KEY = 'alzamora_admin_token';

type AdminSection = 'entregas' | 'gastos' | 'suscripciones';

const DELIVERY_TYPES: { value: DeliveryType; label: string }[] = [
  { value: 'comida', label: 'Comida' },
  { value: 'kit', label: 'Kit de dignidad' },
  { value: 'biblia', label: 'Biblia' },
  { value: 'ropa', label: 'Ropa / Abrigo' },
];

const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: 'alimentos', label: 'Alimentos' },
  { value: 'kits', label: 'Kits' },
  { value: 'biblias', label: 'Biblias' },
  { value: 'ropa', label: 'Ropa' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'operacional', label: 'Operacional' },
  { value: 'otro', label: 'Otro' },
];

// ---------------- Utilidades de formato ----------------

const formatCLP = (n: number) => `$${(Number(n) || 0).toLocaleString('es-CL')}`;

const formatMoney = (amount: number, currency: string) =>
  currency === 'CLP'
    ? formatCLP(amount)
    : `US$${(Number(amount) || 0).toLocaleString('en-US')}`;

const formatDate = (value?: string) => {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const statusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return { label: 'Activa', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    case 'pending':
      return { label: 'Pendiente', className: 'bg-amber-100 text-amber-800 border-amber-200' };
    case 'cancelled':
      return { label: 'Cancelada', className: 'bg-slate-100 text-slate-600 border-slate-200' };
    case 'failed':
      return { label: 'Fallida', className: 'bg-red-100 text-red-800 border-red-200' };
    default:
      return { label: status, className: 'bg-slate-100 text-slate-600 border-slate-200' };
  }
};

// ============================================================
// Componente principal
// ============================================================

export default function AdminPanel() {
  // Si Firebase está configurado, usamos el login con Google (solo la cuenta
  // autorizada entra). Si no, mantenemos el fallback de token manual para
  // desarrollo.
  return hasFirebase ? <FirebaseAdminPanel /> : <TokenAdminPanel />;
}

// ============================================================
// Acceso con Firebase Authentication (login con Google)
// ============================================================

function FirebaseAdminPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string>('');
  const [signingIn, setSigningIn] = useState<boolean>(false);

  // Reaccionamos a los cambios de sesión. Solo el email autorizado entra;
  // cualquier otra cuenta se cierra inmediatamente.
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setChecking(false);
      if (!nextUser) {
        setUser(null);
        return;
      }
      const email = (nextUser.email || '').toLowerCase();
      if (email !== ADMIN_EMAIL) {
        setAuthError('Cuenta no autorizada. Solo el administrador puede ingresar.');
        setUser(null);
        void signOutAdmin();
        return;
      }
      setAuthError('');
      setUser(nextUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setAuthError('');
    setSigningIn(true);
    try {
      await signInWithGoogle();
      // El resto (validación de email / entrada) lo maneja onAuthStateChanged.
    } catch {
      setAuthError('No pudimos iniciar sesión con Google. Inténtalo nuevamente.');
    } finally {
      setSigningIn(false);
    }
  };

  const handleLogout = () => {
    void signOutAdmin();
    setUser(null);
    setAuthError('');
  };

  // Cierre de sesión forzado ante un 401/403 en una llamada admin.
  const handleUnauthorized = () => {
    void signOutAdmin();
    setUser(null);
    setAuthError('Tu sesión expiró o no tiene permisos. Inicia sesión nuevamente.');
  };

  // Siempre pedimos un ID token fresco a Firebase justo antes de cada llamada.
  const getToken = useCallback(async () => {
    if (!auth || !auth.currentUser) {
      throw new ApiError('Sesión no válida. Inicia sesión nuevamente.', 401);
    }
    return getIdToken(auth.currentUser);
  }, []);

  // Mientras Firebase resuelve el estado inicial de la sesión.
  if (checking) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-20 animate-fade-in">
        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Verificando sesión...
        </div>
      </div>
    );
  }

  // Vista no autenticada: botón de inicio de sesión con Google.
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 animate-fade-in">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden">
          <div className="flex items-center gap-2 p-5 text-white bg-brand-blue">
            <Lock className="w-5 h-5 text-brand-yellow" />
            <h3 className="text-lg font-bold font-display">Acceso Administración</h3>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              Esta sección es privada. Inicia sesión con la cuenta de Google autorizada
              para gestionar entregas, gastos y suscripciones de socios.
            </p>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-start gap-2 animate-scale-up">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <button
              id="admin-google-login-button"
              type="button"
              onClick={handleGoogleLogin}
              disabled={signingIn}
              className="w-full bg-brand-blue hover:bg-blue-900 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              {signingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Iniciar sesión con Google
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vista autenticada.
  return (
    <AdminDashboard
      getToken={getToken}
      onLogout={handleLogout}
      onUnauthorized={handleUnauthorized}
      adminEmail={user.email || undefined}
    />
  );
}

// ============================================================
// Acceso con token manual (fallback de desarrollo, sin Firebase)
// ============================================================

function TokenAdminPanel() {
  const [token, setToken] = useState<string>('');
  const [tokenInput, setTokenInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // Recuperamos el token guardado en sessionStorage al montar.
  useEffect(() => {
    const stored = sessionStorage.getItem(TOKEN_KEY);
    if (stored) setToken(stored);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const candidate = tokenInput.trim();
    if (!candidate) {
      setAuthError('Ingresa el token de administrador.');
      return;
    }

    setIsAuthenticating(true);
    try {
      // Validamos el token con una llamada real; si es inválido, 401.
      await adminListExpenses(candidate);
      sessionStorage.setItem(TOKEN_KEY, candidate);
      setToken(candidate);
      setTokenInput('');
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : 'No pudimos validar el token. Inténtalo nuevamente.';
      setAuthError(msg);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken('');
    setTokenInput('');
  };

  const getToken = useCallback(async () => token, [token]);

  // ---------- Vista no autenticada: login ----------
  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 animate-fade-in">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden">
          <div className="flex items-center gap-2 p-5 text-white bg-brand-blue">
            <Lock className="w-5 h-5 text-brand-yellow" />
            <h3 className="text-lg font-bold font-display">Acceso Administración</h3>
          </div>
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              Esta sección es privada. Ingresa tu token de administrador para gestionar
              entregas, gastos y suscripciones de socios.
            </p>
            <div>
              <label className="block mb-1 text-xs font-bold text-slate-700 uppercase tracking-wider">
                Token de administrador
              </label>
              <input
                id="admin-token-input"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-start gap-2 animate-scale-up">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <button
              id="admin-login-button"
              type="submit"
              disabled={isAuthenticating}
              className="w-full bg-brand-blue hover:bg-blue-900 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isAuthenticating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Validando...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Ingresar
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ---------- Vista autenticada ----------
  return <AdminDashboard getToken={getToken} onLogout={handleLogout} onUnauthorized={handleLogout} />;
}

// ============================================================
// Panel autenticado (compartido por ambos modos de acceso)
// ============================================================

interface AdminDashboardProps {
  /** Devuelve un token válido (ID token fresco de Firebase o token manual). */
  getToken: () => Promise<string>;
  /** Cierra la sesión desde el botón del encabezado. */
  onLogout: () => void;
  /** Se invoca ante un 401/403 en cualquier llamada admin. */
  onUnauthorized: () => void;
  /** Email del admin autenticado (solo en modo Firebase). */
  adminEmail?: string;
}

function AdminDashboard({ getToken, onLogout, onUnauthorized, adminEmail }: AdminDashboardProps) {
  const [section, setSection] = useState<AdminSection>('entregas');

  const sections: { id: AdminSection; label: string; icon: React.ReactNode }[] = [
    { id: 'entregas', label: 'Entregas', icon: <PackageCheck className="w-4 h-4" /> },
    { id: 'gastos', label: 'Gastos', icon: <Receipt className="w-4 h-4" /> },
    { id: 'suscripciones', label: 'Suscripciones', icon: <Repeat className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-brand-blue rounded-2xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold font-display text-slate-900 tracking-tight leading-none">
              Panel de Administración
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Gestión interna de entregas, gastos y socios de Fundación Alzamora.
            </p>
          </div>
        </div>
        <div className="self-start sm:self-auto flex flex-col items-start sm:items-end gap-1.5">
          {adminEmail && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              {adminEmail}
            </span>
          )}
          <button
            id="admin-logout-button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-red bg-slate-100 hover:bg-red-50 px-4 py-2.5 rounded-xl border border-slate-200 transition-all"
          >
            <LogOut className="w-4 h-4" />
            {adminEmail ? 'Cerrar sesión' : 'Salir'}
          </button>
        </div>
      </div>

      {/* Pestañas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        {sections.map((s) => {
          const isActive = section === s.id;
          return (
            <button
              id={`admin-tab-${s.id}`}
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-all -mb-px border-b-2 ${
                isActive
                  ? 'border-brand-blue text-brand-blue bg-blue-50/40'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {s.icon}
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Contenido de la pestaña */}
      {section === 'entregas' && (
        <DeliveriesSection getToken={getToken} onUnauthorized={onUnauthorized} />
      )}
      {section === 'gastos' && (
        <ExpensesSection getToken={getToken} onUnauthorized={onUnauthorized} />
      )}
      {section === 'suscripciones' && (
        <SubscriptionsSection getToken={getToken} onUnauthorized={onUnauthorized} />
      )}
    </div>
  );
}

// ============================================================
// Sección: Entregas
// ============================================================

interface SectionProps {
  /** Devuelve un token válido y fresco para cada llamada admin. */
  getToken: () => Promise<string>;
  onUnauthorized: () => void;
}

/** True si el error corresponde a una sesión inválida (401) o sin permisos (403). */
const isAuthError = (err: unknown): boolean =>
  err instanceof ApiError && (err.status === 401 || err.status === 403);

function DeliveriesSection({ getToken, onUnauthorized }: SectionProps) {
  const [items, setItems] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [listError, setListError] = useState<string>('');

  const [type, setType] = useState<DeliveryType>('comida');
  const [quantity, setQuantity] = useState<string>('');
  const [commune, setCommune] = useState<string>('');
  const [routeName, setRouteName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const load = useCallback(async () => {
    setLoading(true);
    setListError('');
    try {
      const data = await adminListDeliveries(await getToken());
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      if (isAuthError(err)) {
        onUnauthorized();
        return;
      }
      setListError(
        err instanceof ApiError ? err.message : 'No pudimos cargar las entregas.',
      );
    } finally {
      setLoading(false);
    }
  }, [getToken, onUnauthorized]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');

    const qty = Number(quantity);
    if (!quantity || isNaN(qty) || qty <= 0) {
      setFormError('La cantidad debe ser un número mayor a 0.');
      return;
    }
    if (!commune.trim()) {
      setFormError('La comuna es obligatoria.');
      return;
    }

    const input: CreateDeliveryInput = {
      type,
      quantity: qty,
      commune: commune.trim(),
      routeName: routeName.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    setSubmitting(true);
    try {
      await adminCreateDelivery(await getToken(), input);
      setSuccess('Entrega registrada correctamente.');
      setQuantity('');
      setCommune('');
      setRouteName('');
      setNotes('');
      await load();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      if (isAuthError(err)) {
        onUnauthorized();
        return;
      }
      setFormError(
        err instanceof ApiError ? err.message : 'No pudimos registrar la entrega.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Formulario */}
      <div className="lg:col-span-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-base font-bold font-display text-slate-800 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-brand-blue" />
            Registrar entrega
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tipo *
              </label>
              <select
                id="delivery-type"
                value={type}
                onChange={(e) => setType(e.target.value as DeliveryType)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
              >
                {DELIVERY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Cantidad *
                </label>
                <input
                  id="delivery-quantity"
                  type="number"
                  min={1}
                  placeholder="Ej. 30"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Comuna *
                </label>
                <input
                  id="delivery-commune"
                  type="text"
                  placeholder="Ej. Valparaíso"
                  value={commune}
                  onChange={(e) => setCommune(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Ruta (opcional)
              </label>
              <input
                id="delivery-route"
                type="text"
                placeholder="Ej. Ruta Alameda nocturna"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Notas (opcional)
              </label>
              <textarea
                id="delivery-notes"
                rows={3}
                placeholder="Detalles adicionales de la entrega..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
              />
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-start gap-2 animate-scale-up">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-semibold flex items-start gap-2 animate-scale-up">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            <button
              id="submit-delivery-button"
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-blue hover:bg-blue-900 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <PackageCheck className="w-4 h-4" />
                  Registrar entrega
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Tabla */}
      <div className="lg:col-span-7">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <h3 className="text-base font-bold font-display text-slate-800">Entregas recientes</h3>
            <button
              onClick={load}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-blue-900 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Actualizar
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Cargando entregas...
            </div>
          ) : listError ? (
            <div className="p-6 text-center text-red-600 text-xs font-semibold">{listError}</div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">Aún no hay entregas registradas.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-slate-500 uppercase tracking-wider border-b border-slate-100 bg-slate-50/50">
                    <th className="px-4 py-3 font-bold">Tipo</th>
                    <th className="px-4 py-3 font-bold">Cantidad</th>
                    <th className="px-4 py-3 font-bold">Comuna</th>
                    <th className="px-4 py-3 font-bold">Ruta</th>
                    <th className="px-4 py-3 font-bold">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-semibold text-slate-800 capitalize">{d.type}</td>
                      <td className="px-4 py-3 font-mono text-slate-700">{d.quantity}</td>
                      <td className="px-4 py-3 text-slate-600">{d.commune}</td>
                      <td className="px-4 py-3 text-slate-600">{d.routeName || '—'}</td>
                      <td className="px-4 py-3 text-slate-500 font-mono">
                        {formatDate(d.deliveredAt || d.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Sección: Gastos
// ============================================================

function ExpensesSection({ getToken, onUnauthorized }: SectionProps) {
  const [items, setItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [listError, setListError] = useState<string>('');

  const [category, setCategory] = useState<ExpenseCategory>('alimentos');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [commune, setCommune] = useState<string>('');
  const [receiptUrl, setReceiptUrl] = useState<string>('');

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const load = useCallback(async () => {
    setLoading(true);
    setListError('');
    try {
      const data = await adminListExpenses(await getToken());
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      if (isAuthError(err)) {
        onUnauthorized();
        return;
      }
      setListError(err instanceof ApiError ? err.message : 'No pudimos cargar los gastos.');
    } finally {
      setLoading(false);
    }
  }, [getToken, onUnauthorized]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');

    const amt = Number(amount);
    if (!amount || isNaN(amt) || amt <= 0) {
      setFormError('El monto debe ser un número mayor a 0.');
      return;
    }
    if (!description.trim()) {
      setFormError('La descripción es obligatoria.');
      return;
    }

    const input: CreateExpenseInput = {
      category,
      amount: amt,
      description: description.trim(),
      commune: commune.trim() || undefined,
      receiptUrl: receiptUrl.trim() || undefined,
    };

    setSubmitting(true);
    try {
      await adminCreateExpense(await getToken(), input);
      setSuccess('Gasto registrado correctamente.');
      setAmount('');
      setDescription('');
      setCommune('');
      setReceiptUrl('');
      await load();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      if (isAuthError(err)) {
        onUnauthorized();
        return;
      }
      setFormError(err instanceof ApiError ? err.message : 'No pudimos registrar el gasto.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Formulario */}
      <div className="lg:col-span-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-base font-bold font-display text-slate-800 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-brand-blue" />
            Registrar gasto
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Categoría *
              </label>
              <select
                id="expense-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Monto (CLP) *
              </label>
              <input
                id="expense-amount"
                type="number"
                min={1}
                placeholder="Ej. 150000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Descripción *
              </label>
              <input
                id="expense-description"
                type="text"
                placeholder="Ej. Compra de pan y café para rutas"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Comuna (opcional)
                </label>
                <input
                  id="expense-commune"
                  type="text"
                  placeholder="Ej. Valparaíso"
                  value={commune}
                  onChange={(e) => setCommune(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Comprobante URL (opcional)
                </label>
                <input
                  id="expense-receipt"
                  type="url"
                  placeholder="https://..."
                  value={receiptUrl}
                  onChange={(e) => setReceiptUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                />
              </div>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-start gap-2 animate-scale-up">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-semibold flex items-start gap-2 animate-scale-up">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            <button
              id="submit-expense-button"
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-blue hover:bg-blue-900 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Receipt className="w-4 h-4" />
                  Registrar gasto
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Tabla */}
      <div className="lg:col-span-7">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <h3 className="text-base font-bold font-display text-slate-800">Gastos recientes</h3>
            <button
              onClick={load}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-blue-900 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Actualizar
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Cargando gastos...
            </div>
          ) : listError ? (
            <div className="p-6 text-center text-red-600 text-xs font-semibold">{listError}</div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">Aún no hay gastos registrados.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-slate-500 uppercase tracking-wider border-b border-slate-100 bg-slate-50/50">
                    <th className="px-4 py-3 font-bold">Categoría</th>
                    <th className="px-4 py-3 font-bold">Monto</th>
                    <th className="px-4 py-3 font-bold">Descripción</th>
                    <th className="px-4 py-3 font-bold">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((ex) => (
                    <tr key={ex.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-semibold text-slate-800 capitalize">{ex.category}</td>
                      <td className="px-4 py-3 font-mono text-brand-red font-semibold">
                        {formatCLP(ex.amount)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{ex.description}</td>
                      <td className="px-4 py-3 text-slate-500 font-mono">
                        {formatDate(ex.spentAt || ex.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Sección: Suscripciones
// ============================================================

function SubscriptionsSection({ getToken, onUnauthorized }: SectionProps) {
  const [items, setItems] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [listError, setListError] = useState<string>('');
  const [cancellingId, setCancellingId] = useState<string>('');
  const [actionError, setActionError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const load = useCallback(async () => {
    setLoading(true);
    setListError('');
    try {
      const data = await adminListSubscriptions(await getToken());
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      if (isAuthError(err)) {
        onUnauthorized();
        return;
      }
      setListError(
        err instanceof ApiError ? err.message : 'No pudimos cargar las suscripciones.',
      );
    } finally {
      setLoading(false);
    }
  }, [getToken, onUnauthorized]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCancel = async (sub: Subscription) => {
    const confirmed = window.confirm(
      `¿Cancelar la suscripción mensual de ${sub.donorName} (${formatMoney(
        sub.amount,
        sub.currency,
      )}/mes)? El cobro recurrente dejará de realizarse.`,
    );
    if (!confirmed) return;

    setActionError('');
    setSuccess('');
    setCancellingId(sub.id);
    try {
      await adminCancelSubscription(await getToken(), sub.id);
      setSuccess(`Suscripción de ${sub.donorName} cancelada.`);
      await load();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      if (isAuthError(err)) {
        onUnauthorized();
        return;
      }
      setActionError(
        err instanceof ApiError ? err.message : 'No pudimos cancelar la suscripción.',
      );
    } finally {
      setCancellingId('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold font-display text-slate-800">Suscripciones de socios</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Aportes mensuales recurrentes. Puedes cancelar cualquier suscripción activa.
            </p>
          </div>
          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-blue-900 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Actualizar
          </button>
        </div>

        {actionError && (
          <div className="m-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{actionError}</span>
          </div>
        )}
        {success && (
          <div className="m-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-semibold flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Cargando suscripciones...
          </div>
        ) : listError ? (
          <div className="p-6 text-center text-red-600 text-xs font-semibold">{listError}</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">Aún no hay suscripciones registradas.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-slate-500 uppercase tracking-wider border-b border-slate-100 bg-slate-50/50">
                  <th className="px-4 py-3 font-bold">Donante</th>
                  <th className="px-4 py-3 font-bold">Monto</th>
                  <th className="px-4 py-3 font-bold">Método</th>
                  <th className="px-4 py-3 font-bold">Estado</th>
                  <th className="px-4 py-3 font-bold">Cobros</th>
                  <th className="px-4 py-3 font-bold">Próximo cobro</th>
                  <th className="px-4 py-3 font-bold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((sub) => {
                  const badge = statusBadge(sub.status);
                  const canCancel = sub.status === 'active' || sub.status === 'pending';
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <span className="block font-semibold text-slate-800">{sub.donorName}</span>
                        <span className="block text-[10px] text-slate-400">{sub.email}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {formatMoney(sub.amount, sub.currency)}/mes
                      </td>
                      <td className="px-4 py-3 text-slate-600 capitalize">{sub.method}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-bold ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">{sub.chargesCount}</td>
                      <td className="px-4 py-3 text-slate-500 font-mono">{formatDate(sub.nextChargeAt)}</td>
                      <td className="px-4 py-3 text-right">
                        {canCancel ? (
                          <button
                            onClick={() => handleCancel(sub)}
                            disabled={cancellingId === sub.id}
                            className="inline-flex items-center gap-1 text-xs font-bold text-brand-red hover:text-red-700 disabled:opacity-50 transition-colors"
                          >
                            {cancellingId === sub.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                            Cancelar
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
