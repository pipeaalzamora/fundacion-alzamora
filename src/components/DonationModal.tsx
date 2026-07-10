import React, { useState } from 'react';
import { X, Heart, ShieldCheck, Coffee, ExternalLink, AlertCircle } from 'lucide-react';
import { PaymentCurrency, PaymentMethod, Region } from '../types';
import { createDonation, createSubscription, ApiError } from '../lib/api';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  region: Region;
}

export default function DonationModal({ isOpen, onClose, region }: DonationModalProps) {
  const isChile = region === 'chile';

  // Método de pago: Webpay opera en CLP, PayPal en USD.
  const [method, setMethod] = useState<PaymentMethod>('webpay');
  const currency: PaymentCurrency = method === 'webpay' ? 'CLP' : 'USD';
  const currencySymbol = currency === 'CLP' ? '$' : 'US$';

  // Monto
  const [amountType, setAmountType] = useState<'preset' | 'custom'>('preset');
  const [selectedPreset, setSelectedPreset] = useState<number>(currency === 'CLP' ? 20000 : 25);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isMonthly, setIsMonthly] = useState<boolean>(false);

  // Datos del donante
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // Estado del flujo
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  // Presets según moneda del método de pago seleccionado.
  const presets =
    currency === 'CLP'
      ? [
          { value: 10000, label: '$10.000', labelDesc: '1 Kit de Dignidad completo' },
          { value: 20000, label: '$20.000', labelDesc: '15 Desayunos Calientes' },
          { value: 50000, label: '$50.000', labelDesc: 'Soporte y Abrigo p/ 5 personas' },
        ]
      : [
          { value: 12, label: 'US$12', labelDesc: '1 Kit de Dignidad completo' },
          { value: 25, label: 'US$25', labelDesc: '15 Desayunos Calientes' },
          { value: 60, label: 'US$60', labelDesc: 'Soporte y Abrigo p/ 5 personas' },
        ];

  const getAmount = () => {
    if (amountType === 'preset') return selectedPreset;
    const val = parseFloat(customAmount);
    return isNaN(val) ? 0 : val;
  };

  // Cambia el método y ajusta el preset por defecto a la moneda correspondiente.
  const handleMethodChange = (next: PaymentMethod) => {
    setMethod(next);
    setAmountType('preset');
    setCustomAmount('');
    setSelectedPreset(next === 'webpay' ? 20000 : 25);
  };

  // Estimación REFERENCIAL del impacto (no es un compromiso contractual exacto).
  const getImpactExplanation = (amt: number) => {
    if (currency === 'CLP') {
      if (amt < 10000) return `Aportas ${currencySymbol}${amt.toLocaleString('es-CL')} para insumos alimentarios de la ruta de calle.`;
      if (amt >= 10000 && amt < 20000) return `Con este aporte podríamos proveer aprox. ${Math.floor(amt / 10000)} Kit(s) de Dignidad (artículos de higiene y calcetines gruesos).`;
      if (amt >= 20000 && amt < 50000) return `Con este aporte podríamos financiar aprox. ${Math.floor((amt / 20000) * 15)} desayunos calientes para personas en situación de calle.`;
      return `Con este aporte podríamos entregar kits de invierno, sacos de dormir térmicos y desayunos de alta energía en Santiago o Valparaíso.`;
    }
    if (amt < 12) return `Aportas ${currencySymbol}${amt} para café y alimento en las rutas diarias de calle.`;
    if (amt >= 12 && amt < 25) return `Con este aporte podríamos proveer aprox. ${Math.floor(amt / 12)} Kit(s) de Dignidad (higiene y abrigo básico).`;
    if (amt >= 25 && amt < 60) return `Con este aporte podríamos financiar aprox. ${Math.floor((amt / 25) * 15)} desayunos calientes preparados y distribuidos.`;
    return `Con este aporte podríamos entregar asistencia integral, mantas térmicas y kits de higiene para personas en situación de calle.`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const amount = getAmount();
    if (amount <= 0) {
      setErrorMessage('Por favor ingresa un monto válido.');
      return;
    }
    if (!fullName || !email) {
      setErrorMessage('Por favor completa tu nombre y correo.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isMonthly) {
        // Aporte mensual de socio: cobro recurrente real (Webpay Oneclick / suscripción PayPal).
        const { redirectUrl } = await createSubscription({
          amount,
          currency,
          donorName: fullName,
          email,
          method,
          impactText: getImpactExplanation(amount),
        });
        // Redirigimos para inscribir el medio de pago y activar la suscripción.
        window.location.href = redirectUrl;
      } else {
        // Donación única.
        const { redirectUrl } = await createDonation({
          amount,
          currency,
          donorName: fullName,
          email,
          method,
          isMonthly: false,
          impactText: getImpactExplanation(amount),
        });
        // Redirigimos el navegador a la pasarela de pago real (Webpay / PayPal).
        window.location.href = redirectUrl;
      }
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Ocurrió un error inesperado al iniciar el pago. Inténtalo nuevamente.';
      setErrorMessage(message);
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setMethod('webpay');
    setAmountType('preset');
    setSelectedPreset(20000);
    setCustomAmount('');
    setIsMonthly(false);
    setFullName('');
    setEmail('');
    setErrorMessage('');
    setIsSubmitting(false);
    onClose();
  };

  const formattedAmount = getAmount().toLocaleString(currency === 'CLP' ? 'es-CL' : 'en-US');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        id="donation-modal-container"
        className="relative w-full max-w-lg overflow-hidden bg-white shadow-2xl rounded-2xl animate-fade-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 text-white bg-brand-blue">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-brand-yellow fill-brand-yellow animate-pulse" />
            <h3 className="text-xl font-semibold font-display">Canalizar Donación Segura</h3>
          </div>
          <button
            id="close-modal-button"
            onClick={handleClose}
            className="p-1 text-white/80 transition-colors hover:text-white hover:bg-white/10 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh]">
          {/* Nota de transparencia honesta */}
          <div className="p-3.5 mb-5 border rounded-xl bg-slate-50 border-brand-blue/10 flex items-start gap-3">
            <div className="p-2 text-brand-blue bg-blue-50 rounded-lg shrink-0">
              <Coffee className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Transparencia Alzamora:</strong> publicamos el detalle de nuestros ingresos y gastos, y puedes revisar el registro de donaciones y entregas en nuestra sección de transparencia. Tu aporte se destina a las rutas de calle (alimentos y kits).
            </p>
          </div>

          {/* Selector de método de pago */}
          <div className="mb-5">
            <label className="block mb-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Método de Pago
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                id="payment-method-webpay"
                type="button"
                onClick={() => handleMethodChange('webpay')}
                className={`p-3 border rounded-xl text-left transition-all ${
                  method === 'webpay'
                    ? 'border-brand-blue bg-blue-50/50 text-brand-blue ring-2 ring-brand-blue/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-800'
                }`}
              >
                <span className="block text-sm font-bold font-display">Webpay</span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Tarjetas chilenas · Pesos (CLP)</span>
              </button>
              <button
                id="payment-method-paypal"
                type="button"
                onClick={() => handleMethodChange('paypal')}
                className={`p-3 border rounded-xl text-left transition-all ${
                  method === 'paypal'
                    ? 'border-brand-blue bg-blue-50/50 text-brand-blue ring-2 ring-brand-blue/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-800'
                }`}
              >
                <span className="block text-sm font-bold font-display">PayPal</span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Internacional · Dólares (USD)</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              El pago se procesa de forma segura en la plataforma de {method === 'webpay' ? 'Transbank Webpay' : 'PayPal'}. No pedimos ni guardamos los datos de tu tarjeta.
            </p>
          </div>

          {/* Única vs Mensual */}
          <div className="grid grid-cols-2 p-1 mb-5 bg-slate-100 rounded-lg">
            <button
              id="one-time-donation-button"
              type="button"
              className={`py-2 text-xs font-semibold rounded-md transition-all ${!isMonthly ? 'bg-white text-brand-blue shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              onClick={() => setIsMonthly(false)}
            >
              Donación Única
            </button>
            <button
              id="monthly-donation-button"
              type="button"
              className={`py-2 text-xs font-semibold rounded-md transition-all ${isMonthly ? 'bg-white text-brand-blue shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              onClick={() => setIsMonthly(true)}
            >
              Aporte Mensual (Socio)
            </button>
          </div>

          {/* Aviso honesto del cobro recurrente para aportes mensuales */}
          {isMonthly && (
            <div className="p-3.5 mb-5 border rounded-xl bg-blue-50/60 border-brand-blue/20 flex items-start gap-2.5 animate-scale-up">
              <ShieldCheck className="w-4.5 h-4.5 text-brand-blue shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-600 leading-relaxed">
                <strong>Aporte mensual como socio:</strong> es un <strong>cobro recurrente automático</strong> de {currencySymbol}
                {formattedAmount} cada mes. Con {method === 'webpay' ? 'Webpay se inscribe tu tarjeta vía Oneclick' : 'PayPal se crea una suscripción'} para renovar el aporte automáticamente. Puedes <strong>cancelarlo cuando quieras</strong> escribiéndonos y dejaremos de cobrarte; no hay permanencia mínima.
              </p>
            </div>
          )}

          {/* Monto */}
          <div className="mb-5">
            <label className="block mb-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Monto del Aporte ({currency})
            </label>

            <div className="grid grid-cols-3 gap-3 mb-3">
              {presets.map((preset) => (
                <button
                  id={`preset-btn-${preset.value}`}
                  key={preset.value}
                  type="button"
                  className={`p-3 text-left border rounded-xl flex flex-col justify-between transition-all ${
                    amountType === 'preset' && selectedPreset === preset.value
                      ? 'border-brand-blue bg-blue-50/50 text-brand-blue ring-2 ring-brand-blue/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                  onClick={() => {
                    setAmountType('preset');
                    setSelectedPreset(preset.value);
                  }}
                >
                  <span className="text-base font-bold font-display">{preset.label}</span>
                  <span className="text-[10px] text-slate-500 mt-1 font-sans leading-none block">{preset.labelDesc}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-4">
              <button
                id="custom-amount-tab-button"
                type="button"
                onClick={() => setAmountType('custom')}
                className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
                  amountType === 'custom'
                    ? 'bg-brand-blue/10 text-brand-blue'
                    : 'text-slate-500 hover:text-slate-700 bg-slate-50'
                }`}
              >
                Otro monto personalizado
              </button>
              {amountType === 'custom' && (
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{currencySymbol}</span>
                  <input
                    id="custom-amount-input"
                    type="number"
                    placeholder={currency === 'CLP' ? 'Monto mínimo 2.000' : 'Monto mínimo 5'}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full pl-10 pr-3 py-1 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:border-brand-blue"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Impacto referencial */}
          <div className="p-4 mb-5 border-l-4 border-brand-yellow bg-amber-50 rounded-r-xl">
            <span className="block text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1">
              Impacto estimado (referencial)
            </span>
            <p className="text-xs font-medium text-slate-700 leading-relaxed">
              {getImpactExplanation(getAmount())}
            </p>
            <p className="text-[10px] text-slate-500 mt-1.5 italic">
              Es una estimación referencial según costos promedio; el impacto real puede variar.
            </p>
          </div>

          {/* Datos del donante */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b pb-1">
              Datos del Donante
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Nombre Completo *</label>
                <input
                  id="donor-name-input"
                  type="text"
                  required
                  placeholder="Juan Pérez"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Correo Electrónico *</label>
                <input
                  id="donor-email-input"
                  type="email"
                  required
                  placeholder="juan@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                />
              </div>
            </div>
          </div>

          {/* Mensaje de error */}
          {errorMessage && (
            <div className="mt-5 p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-start gap-2 animate-scale-up">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* CTA */}
          <button
            id="submit-donation-button"
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 bg-brand-red text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-red-600 hover:shadow-lg focus:outline-hidden disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Redirigiendo a {method === 'webpay' ? 'Webpay' : 'PayPal'}...
              </>
            ) : (
              <>
                <ExternalLink className="w-5 h-5" />
                {isMonthly
                  ? `Suscribirme por ${currencySymbol}${formattedAmount} / Mes`
                  : `Continuar y Pagar ${currencySymbol}${formattedAmount}`}
              </>
            )}
          </button>

          <p className="text-[10px] text-slate-400 mt-3 text-center leading-relaxed">
            {isMonthly
              ? `Al continuar serás redirigido a ${method === 'webpay' ? 'Transbank Webpay (Oneclick)' : 'PayPal'} para inscribir tu medio de pago y activar tu aporte mensual recurrente. Puedes cancelarlo cuando quieras.`
              : `Al continuar serás redirigido a la pasarela de pago segura de ${method === 'webpay' ? 'Transbank Webpay' : 'PayPal'} para completar tu aporte.`}
          </p>
        </form>
      </div>
    </div>
  );
}
