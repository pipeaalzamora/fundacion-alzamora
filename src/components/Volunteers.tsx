import React, { useState, useEffect } from 'react';
import { Award, CheckCircle, Handshake, ShieldCheck, Heart, PieChart, Users, Check, AlertCircle } from 'lucide-react';
import { Region, VolunteerSignup } from '../types';
import { IMAGES } from '../data';

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
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  // Default volunteering categories
  const categories = [
    { id: 'desayunos', label: isChile ? 'Desayunos Solidarios' : 'Rutas de Desayunos', desc: 'Preparación de alimentos calientes y acompañamiento matutino directo.' },
    { id: 'lectura', label: isChile ? 'Lectura de Biblias y Oración' : 'Acompañamiento Bíblico', desc: 'Espacio de entrega espiritual, reflexión y escucha compasiva.' },
    { id: 'logistica', label: 'Logística y Acopio de Bodega', desc: 'Clasificación de donaciones, empaque de Kits de Dignidad y carga.' }
  ];

  // Set pre-selected interest if navigating from a program CTA
  useEffect(() => {
    if (preselectedProgramTitle) {
      // Try to match category
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
  }, [preselectedProgramTitle]);

  const handleInterestToggle = (label: string) => {
    if (selectedInterests.includes(label)) {
      setSelectedInterests(selectedInterests.filter(i => i !== label));
    } else {
      setSelectedInterests([...selectedInterests, label]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email) {
      alert('Por favor, completa tus datos de contacto principales.');
      return;
    }

    const newSignup: VolunteerSignup = {
      id: `signup-${Date.now()}`,
      fullName,
      phone,
      email,
      areasInterest: selectedInterests,
      message,
      region,
      timestamp: new Date().toLocaleString()
    };

    // Save to LocalStorage list of signups
    const existing = localStorage.getItem('alzamora_signups') || '[]';
    try {
      const signups = JSON.parse(existing);
      signups.push(newSignup);
      localStorage.setItem('alzamora_signups', JSON.stringify(signups));
    } catch (e) {
      localStorage.setItem('alzamora_signups', JSON.stringify([newSignup]));
    }

    // Reset Form
    setFullName('');
    setPhone('');
    setEmail('');
    setSelectedInterests([]);
    setMessage('');
    setSuccess(true);
    if (onClearPreselection) onClearPreselection();
    setTimeout(() => setSuccess(false), 5000);
  };

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
                    Muchas gracias por tu generosidad. Tu postulación ha sido guardada con éxito en nuestro sistema de acopio local. Nos pondremos en contacto contigo pronto para coordinar tu inducción.
                  </p>
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
                className="w-full bg-brand-blue hover:bg-blue-900 text-white font-bold py-3.5 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Enviar Postulación Voluntaria</span>
              </button>

            </form>
          </div>
        </div>

      </div>

      {/* Transparency and Funds section from Image 3 lower section */}
      <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-6 sm:p-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5 border-slate-200">
          <div>
            <h3 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              Transparencia y Destino de Fondos
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Cada donación se transforma íntegramente en recursos y acompañamiento directo para las personas en situación de calle.
            </p>
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
            <Award className="w-4.5 h-4.5 text-emerald-600 fill-emerald-600/10" />
            <span>Sello de Transparencia Certificado</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">Alimentación</span>
              <span className="text-base font-bold text-slate-800 font-mono">50%</span>
            </div>
            {/* Visual 50% bar */}
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-blue rounded-full" style={{ width: '50%' }}></div>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal font-sans">
              Destinado a insumos de desayunos solidarios, pan, café, sopas calientes y raciones de alimento para las brigadas de calle diarias.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-brand-yellow uppercase tracking-wider">Educación y Cultura</span>
              <span className="text-base font-bold text-slate-800 font-mono">30%</span>
            </div>
            {/* Visual 30% bar */}
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-yellow rounded-full" style={{ width: '30%' }}></div>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal font-sans">
              Financia la compra de literatura motivacional, Biblias de estudio, encuentros grupales de fe y programas de consejería y reinserción.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-brand-red uppercase tracking-wider">Operación y Logística</span>
              <span className="text-base font-bold text-slate-800 font-mono">20%</span>
            </div>
            {/* Visual 20% bar */}
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-red rounded-full" style={{ width: '20%' }}></div>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal font-sans">
              Cubre combustible para las furgonetas de reparto, arriendo de bodegas de acopio y mantenimiento de termos de grado industrial.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
