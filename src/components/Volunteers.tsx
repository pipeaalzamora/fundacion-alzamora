import React, { useState, useEffect } from 'react';
import { Award, CheckCircle, Handshake, ShieldCheck, Heart, Check, AlertCircle } from 'lucide-react';
import { Ledger, Region } from '../types';
import { IMAGES } from '../data';
import { createVolunteer, getLedger, ApiError } from '../lib/api';

interface VolunteersProps {
  region: Region;
  preselectedProgramTitle?: string;
  onClearPreselection?: () => void;
}

export default function Volunteers({ region, preselectedProgramTitle, onClearPreselection }: VolunteersProps) {
  const isChile = region === 'chile';

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [commune, setCommune] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Datos reales del registro contable (transparencia)
  const [ledger, setLedger] = useState<Ledger | null>(null);

  // Default volunteering categories
  const categories = [
    { id: 'desayunos', label: isChile ? 'Desayunos Solidarios' : 'Rutas de Desayunos', desc: 'Preparación de alimentos calientes y acompañamiento matutino directo.' },
    { id: 'lectura', label: isChile ? 'Lectura de Biblias y Oración' : 'Acompañamiento Bíblico', desc: 'Espacio de entrega espiritual, reflexión y escucha compasiva.' },
    { id: 'logistica', label: 'Logística y Acopio de Bodega', desc: 'Clasificación de donaciones, empaque de Kits de Dignidad y carga.' }
  ];

  // Set pre-selected interest if navigating from a program CTA
  useEffect(() => {
    if (preselectedProgramTitle) {
      const matched = categories.find(c =>
        preselectedProgramTitle.toLowerCase().includes(c.label.toLowerCase()) ||
        c.label.toLowerCase().includes(preselectedProgramTitle.toLowerCase())
      );
      if (matched && !selectedInterests.includes(matched.label)) {
        setSelectedInterests([matched.label]);
      } else if (!selectedInterests.includes(preselectedProgramTitle)) {
        setSelectedInterests([preselectedProgramTitle]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectedProgramTitle]);

  // Cargamos el registro contable real para la sección de transparencia
  useEffect(() => {
    const controller = new AbortController();
    getLedger(controller.signal)
      .then((data) => setLedger(data))
      .catch(() => setLedger(null)); // Si falla, mostramos un texto referencial honesto
    return () => controller.abort();
  }, []);

  const handleInterestToggle = (label: string) => {
    if (selectedInterests.includes(label)) {
      setSelectedInterests(selectedInterests.filter(i => i !== label));
    } else {
      setSelectedInterests([...selectedInterests, label]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!fullName || !phone || !email) {
      setErrorMessage('Por favor, completa tus datos de contacto principales.');
      return;
    }

    setIsSubmitting(true);
    try {
      // La fuente de verdad es la API: registramos la postulación en el backend.
      await createVolunteer({
        fullName,
        phone,
        email,
        commune,
        areasInterest: selectedInterests,
        message,
      });

      // Reset del formulario
      setFullName('');
      setPhone('');
      setEmail('');
      setCommune('');
      setSelectedInterests([]);
      setMessage('');
      setSuccess(true);
      if (onClearPreselection) onClearPreselection();
      setTimeout(() => setSuccess(false), 6000);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : 'No pudimos registrar tu postulación. Inténtalo nuevamente en unos minutos.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clp = (n: number) => `$${n.toLocaleString('es-CL')}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 animate-fade-in">
      
      {/* Top Section: Form + Hero info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Visual Hero Info on left */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-brand-red uppercase tracking-widest block">Haz la Diferencia</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight leading-none">
              Únete a la Familia Alzamora
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed font-sans">
              No necesitas habilidades especiales para ser un voluntario de calle, solo un corazón dispuesto a entregar amor, fe y respeto a quienes no tienen un techo. Cada par de manos adicionales nos permite ampliar nuestras rutas de ayuda.
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-xs h-64 bg-slate-100">
            <img 
              src={IMAGES.volunteersHero} 
              alt="Voluntariado Alzamora" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-brand-blue/30 mix-blend-multiply"></div>
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs p-3.5 rounded-xl text-xs text-slate-800">
              <span className="font-bold text-brand-blue block mb-0.5">Testimonio de Calle</span>
              "Surgir en la mañana sabiendo que llevas esperanza, un café y la palabra de Dios a quien lo necesita cambia tu vida tanto como la de ellos."
            </div>
          </div>

          {/* Categories Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Áreas Principales de Apoyo</h4>
            <div className="space-y-3">
              {categories.map((cat) => (
                <div key={cat.id} className="p-3.5 bg-slate-50 border border-slate-200/50 rounded-xl flex gap-3">
                  <div className="p-2 bg-blue-50 text-brand-blue rounded-lg shrink-0 h-9 w-9 flex items-center justify-center font-bold text-sm">
                    {cat.id === 'desayunos' && '☕'}
                    {cat.id === 'lectura' && '📖'}
                    {cat.id === 'logistica' && '📦'}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">{cat.label}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed font-sans">{cat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Signup Form on right */}
        <div className="lg:col-span-7">
          <div id="volunteer-signup-card" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm relative">
            <h3 className="text-xl font-bold font-display text-slate-800 mb-5 flex items-center gap-2">
              <Handshake className="w-5 h-5 text-brand-blue" />
              Formulario de Inscripción Voluntaria
            </h3>

            {success && (
              <div className="p-4 mb-6 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-semibold flex items-start gap-2.5 animate-scale-up">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">¡Postulación Recibida!</p>
                  <p className="font-medium text-green-700 mt-1">
                    Muchas gracias por tu generosidad. Tu postulación fue registrada en nuestro sistema. Nos pondremos en contacto contigo pronto para coordinar tu inducción.
                  </p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-start gap-2.5 animate-scale-up">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">No pudimos enviar tu postulación</p>
                  <p className="font-medium text-red-700 mt-1">{errorMessage}</p>
                </div>
              </div>
            )}

            {preselectedProgramTitle && (
              <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Te estás inscribiendo específicamente para: <strong>{preselectedProgramTitle}</strong></span>
                </div>
                <button 
                  onClick={onClearPreselection} 
                  className="text-[10px] font-bold text-slate-400 hover:text-slate-600 underline"
                >
                  Cambiar
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Nombre completo *</label>
                  <input
                    id="volunteer-name"
                    type="text"
                    required
                    placeholder="Tu nombre y apellidos"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Teléfono móvil *</label>
                  <input
                    id="volunteer-phone"
                    type="tel"
                    required
                    placeholder="Ej. +56 9 1234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Correo electrónico *</label>
                  <input
                    id="volunteer-email"
                    type="email"
                    required
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Comuna / Ciudad</label>
                  <input
                    id="volunteer-commune"
                    type="text"
                    placeholder="Ej. Valparaíso, Viña del Mar"
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                  />
                </div>
              </div>

              {/* Checkboxes Areas of Interest */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Áreas de interés (Selecciona todas las que gustes)</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {categories.map((cat) => {
                    const isChecked = selectedInterests.includes(cat.label);
                    return (
                      <button
                        id={`interest-tag-${cat.id}`}
                        key={cat.id}
                        type="button"
                        onClick={() => handleInterestToggle(cat.label)}
                        className={`p-3 border rounded-xl text-xs font-semibold transition-all text-left flex items-start gap-2 ${
                          isChecked
                            ? 'border-brand-blue bg-blue-50 text-brand-blue font-bold shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50'
                        }`}
                      >
                        <div className={`mt-0.5 h-4 w-4 rounded-md border flex items-center justify-center shrink-0 ${isChecked ? 'bg-brand-blue border-brand-blue text-white' : 'border-slate-300 bg-white'}`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Mensaje o motivaciones</label>
                <textarea
                  id="volunteer-message"
                  rows={4}
                  placeholder="Cuéntanos brevemente por qué te gustaría participar o si tienes disponibilidad en horarios específicos..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                />
              </div>

              <button
                id="submit-volunteer-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-blue hover:bg-blue-900 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Enviar Postulación Voluntaria</span>
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

      </div>

      {/* Transparencia y Destino de Fondos (datos reales del ledger cuando existen) */}
      <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-6 sm:p-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5 border-slate-200">
          <div>
            <h3 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              Transparencia y Destino de Fondos
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Publicamos el detalle de nuestros ingresos y gastos para que veas cómo se usa cada aporte.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
            <Award className="w-4.5 h-4.5 text-emerald-600 fill-emerald-600/10" />
            <span>Registro público de fondos</span>
          </div>
        </div>

        {ledger ? (
          <div className="space-y-6">
            {/* Resumen de ingresos, gastos y balance reales */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Ingresos totales</span>
                <span className="text-xl font-bold text-slate-800 font-mono">{clp(ledger.totalRaisedCLP)}</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                <span className="text-[11px] font-bold text-brand-red uppercase tracking-wider block">Gastos totales</span>
                <span className="text-xl font-bold text-slate-800 font-mono">{clp(ledger.totalExpensesCLP)}</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                <span className="text-[11px] font-bold text-brand-blue uppercase tracking-wider block">Balance disponible</span>
                <span className="text-xl font-bold text-slate-800 font-mono">{clp(ledger.balanceCLP)}</span>
              </div>
            </div>

            {/* Gastos por categoría (datos reales) */}
            {ledger.expensesByCategory && Object.keys(ledger.expensesByCategory).length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Gastos por categoría</span>
                {Object.entries(ledger.expensesByCategory).map(([cat, rawAmount]) => {
                  const amount = Number(rawAmount) || 0;
                  const pct = ledger.totalExpensesCLP > 0 ? Math.round((amount / ledger.totalExpensesCLP) * 100) : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-600 capitalize">{cat}</span>
                        <span className="font-mono text-slate-800">{clp(amount)} · {pct}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-blue rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Estamos publicando nuestro registro detallado de ingresos y gastos. A modo <strong>referencial</strong>, orientamos los fondos principalmente a alimentación (desayunos y rutas de calle), kits de dignidad y abrigo, y los costos de operación y logística necesarios para llegar a cada punto. Puedes escribirnos para solicitar el detalle actualizado.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
