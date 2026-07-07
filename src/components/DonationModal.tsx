import React, { useState } from 'react';
import { X, Heart, CreditCard, CheckCircle, Flame, Gift, Coffee } from 'lucide-react';
import { Region } from '../types';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  region: Region;
  onDonationSuccess: (amount: number, currency: string, isMonthly: boolean) => void;
}

export default function DonationModal({ isOpen, onClose, region, onDonationSuccess }: DonationModalProps) {
  const isChile = region === 'chile';
  const currency = isChile ? 'CLP' : 'EUR';
  const currencySymbol = isChile ? '$' : '€';

  // State
  const [amountType, setAmountType] = useState<'preset' | 'custom'>('preset');
  const [selectedPreset, setSelectedPreset] = useState<number>(isChile ? 20000 : 20);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isMonthly, setIsMonthly] = useState<boolean>(false);
  
  // Form Info
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  
  // Flow State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  if (!isOpen) return null;

  // Preset configuration
  const presets = isChile
    ? [
        { value: 10000, label: '$10.000', labelDesc: '1 Kit de Dignidad completo' },
        { value: 20000, label: '$20.000', labelDesc: '15 Desayunos Calientes' },
        { value: 50000, label: '$50.000', labelDesc: 'Soporte y Abrigo p/ 5 personas' }
      ]
    : [
        { value: 10, label: '10 €', labelDesc: '1 Kit de Dignidad completo' },
        { value: 20, label: '20 €', labelDesc: '15 Desayunos Calientes' },
        { value: 50, label: '50 €', labelDesc: 'Soporte y Abrigo p/ 5 personas' }
      ];

  const getAmount = () => {
    if (amountType === 'preset') return selectedPreset;
    const val = parseFloat(customAmount);
    return isNaN(val) ? 0 : val;
  };

  const getImpactExplanation = (amt: number) => {
    if (isChile) {
      if (amt < 10000) return `Aportas ${currencySymbol}${amt.toLocaleString()} para insumos alimentarios de la ruta de calle.`;
      if (amt >= 10000 && amt < 20000) return `¡Increíble! Proveerás ${Math.floor(amt / 10000)} Kit(s) de Dignidad completos (artículos de higiene y calcetines gruesos).`;
      if (amt >= 20000 && amt < 50000) return `¡Espectacular! Financiarás aprox. ${Math.floor((amt / 20000) * 15)} desayunos calientes y completos para personas en situación de calle.`;
      return `¡Héroe de la calle! Entregarás kits de invierno, sacos de dormir térmicos y desayunos de alta energía para proteger a múltiples familias en Santiago o Valparaíso.`;
    } else {
      if (amt < 10) return `Aportas ${currencySymbol}${amt} para café y alimento en las rutas diarias de calle.`;
      if (amt >= 10 && amt < 20) return `¡Increíble! Proveerás ${Math.floor(amt / 10)} Kit(s) de Dignidad completos (higiene, cepillo de dientes, abrigo básico).`;
      if (amt >= 20 && amt < 50) return `¡Espectacular! Financiarás aprox. ${Math.floor((amt / 20) * 15)} desayunos calientes preparados y distribuidos con amor.`;
      return `¡Héroe de la calle! Entregarás asistencia integral, mantas térmicas impermeables y kits de higiene profunda para personas desamparadas de forma continua.`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (getAmount() <= 0) {
      alert(isChile ? 'Por favor ingresa un monto válido' : 'Por favor ingresa un importe válido');
      return;
    }
    if (!fullName || !email) {
      alert(isChile ? 'Por favor completa tu nombre y correo' : 'Por favor completa tu nombre y correo');
      return;
    }

    setIsSubmitting(true);
    // Simulate API payment gateway
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);
      onDonationSuccess(getAmount(), currency, isMonthly);
    }, 1800);
  };

  const handleReset = () => {
    setAmountType('preset');
    setSelectedPreset(isChile ? 20000 : 20);
    setCustomAmount('');
    setIsMonthly(false);
    setFullName('');
    setEmail('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setIsCompleted(false);
    onClose();
  };

  const formattedAmount = getAmount().toLocaleString(isChile ? 'es-CL' : 'es-ES');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        id="donation-modal-container"
        className="relative w-full max-w-lg overflow-hidden bg-white shadow-2xl rounded-2xl animate-fade-in"
      >
        {/* Header bar styled like Alzamora Foundation blue */}
        <div className="flex items-center justify-between p-5 text-white bg-brand-blue">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-brand-yellow fill-brand-yellow animate-pulse" />
            <h3 className="text-xl font-semibold font-display">
              {isCompleted ? '¡Gracias por tu Corazón!' : 'Canalizar Donación Segura'}
            </h3>
          </div>
          <button 
            id="close-modal-button"
            onClick={handleReset} 
            className="p-1 text-white/80 transition-colors hover:text-white hover:bg-white/10 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isCompleted ? (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh]">
            {/* Impact Promise banner */}
            <div className="p-3.5 mb-5 border rounded-xl bg-slate-50 border-brand-blue/10 flex items-start gap-3">
              <div className="p-2 text-brand-blue bg-blue-50 rounded-lg shrink-0">
                <Coffee className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Garantía de Transparencia Alzamora:</strong> El 100% de tu aporte va directo a insumos de calle (alimentos y kits). Los gastos operacionales se financian con patrocinadores corporativos independientes.
              </p>
            </div>

            {/* Type Switch (One-time vs Monthly) */}
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

            {/* Choose Amount */}
            <div className="mb-5">
              <label className="block mb-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Monto del Aporte
              </label>
              
              {/* Preset buttons */}
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

              {/* Custom Selector Toggle */}
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
                      placeholder={isChile ? "Monto mínimo 2.000" : "Monto mínimo 5"}
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full pl-7 pr-3 py-1 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:border-brand-blue"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Simulated Live Impact Text */}
            <div className="p-4 mb-5 border-l-4 border-brand-yellow bg-amber-50 rounded-r-xl">
              <span className="block text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1">Impacto de tu Donación</span>
              <p className="text-xs font-medium text-slate-700 leading-relaxed">
                {getImpactExplanation(getAmount())}
              </p>
            </div>

            {/* Personal Details */}
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

            {/* Simulated Payment Details */}
            <div className="space-y-4 mt-5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b pb-1 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" /> Detalle de Pago (Simulado)
              </h4>
              <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Número de Tarjeta</label>
                  <input
                    id="cc-number-input"
                    type="text"
                    placeholder="4000 1234 5678 9010"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Vencimiento</label>
                    <input
                      id="cc-expiry-input"
                      type="text"
                      placeholder="MM/AA"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Código (CVV)</label>
                    <input
                      id="cc-cvv-input"
                      type="password"
                      placeholder="123"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 italic text-center">
                  * Este formulario es un entorno de simulación seguro. No se procesarán cargos reales.
                </p>
              </div>
            </div>

            {/* Submission CTA */}
            <button
              id="submit-donation-button"
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 bg-brand-red text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-red-600 hover:shadow-lg focus:outline-hidden disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Procesando Aporte...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5 fill-white" />
                  Donar {currencySymbol}{formattedAmount} {isMonthly ? '/ Mes' : 'Ahora'}
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="p-8 text-center animate-scale-up">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-10 h-10" />
            </div>
            
            <h4 className="text-2xl font-bold font-display text-slate-800 mb-2">
              ¡Donación Recibida con Éxito!
            </h4>
            
            <p className="text-sm text-slate-600 max-w-sm mx-auto mb-6 leading-relaxed">
              Muchas gracias <strong>{fullName}</strong>. Tu aporte de <strong>{currencySymbol}{formattedAmount} {isMonthly ? 'al mes' : ''}</strong> ya ha sido simulado y asignado a nuestras rutas de asistencia en calle.
            </p>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl max-w-sm mx-auto text-left mb-6">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Impacto Realizado</span>
              <div className="flex gap-3 items-start">
                <div className="p-2 bg-brand-yellow/10 text-brand-yellow rounded-lg shrink-0 mt-0.5">
                  <Flame className="w-4 h-4 fill-brand-yellow" />
                </div>
                <p className="text-xs text-slate-700 leading-normal font-medium">
                  {getImpactExplanation(getAmount())}
                </p>
              </div>
            </div>

            <button
              id="success-close-button"
              type="button"
              onClick={handleReset}
              className="bg-brand-blue hover:bg-blue-950 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-sm"
            >
              Cerrar y Regresar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
