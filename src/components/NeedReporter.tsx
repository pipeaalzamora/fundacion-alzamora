import React, { useState, useEffect } from 'react';
import { AlertCircle, MapPin, CheckCircle2, Navigation, MessageSquare, Phone, User, Clock, Check } from 'lucide-react';
import { NeedReport, NeedType, Region } from '../types';

interface NeedReporterProps {
  region: Region;
  onNewReportAdded?: () => void;
}

export default function NeedReporter({ region, onNewReportAdded }: NeedReporterProps) {
  const isChile = region === 'chile';

  // Initial dummy needs to populate the list with realistic data
  const getInitialReports = (): NeedReport[] => {
    return [
      {
        id: "report-1",
        location: "Plaza Italia, salida metro Baquedano, bajo el árbol grande",
        cityCommune: isChile ? "Providencia, Santiago" : "Centro, Madrid",
        needType: "abrigo",
        description: "Adulto mayor tiritando de frío, requiere frazadas térmicas o parka gruesa. Se ve muy desprotegido.",
        contactName: "Catalina Muñoz",
        contactPhone: isChile ? "+56 9 8833 2211" : "+34 612 345 678",
        region: region,
        status: "pendiente",
        timestamp: new Date(Date.now() - 3600000 * 2).toLocaleString() // 2 hours ago
      },
      {
        id: "report-2",
        location: "Av. Argentina con Colón, paradero de micros",
        cityCommune: isChile ? "Valparaíso" : "Sevilla",
        needType: "comida",
        description: "Persona en situación de calle solicita alimento y agua. Refiere no haber comido en todo el día.",
        contactName: "Gonzalo Retamal",
        contactPhone: isChile ? "+56 9 7711 5566" : "+34 689 111 222",
        region: region,
        status: "en_ruta",
        timestamp: new Date(Date.now() - 3600000 * 4).toLocaleString() // 4 hours ago
      },
      {
        id: "report-3",
        location: isChile ? "Estación Central, afuera del terminal de buses sur" : "Atocha, cerca de la estación de tren",
        cityCommune: isChile ? "Estación Central, Santiago" : "Madrid",
        needType: "salud",
        description: "Joven con una herida visible en su pierna derecha. Requiere curación básica y un kit de desinfección.",
        contactName: "Marcos Toledo",
        region: region,
        status: "atendido",
        timestamp: new Date(Date.now() - 3600000 * 24).toLocaleString() // Yesterday
      }
    ];
  };

  const [reports, setReports] = useState<NeedReport[]>([]);
  const [location, setLocation] = useState('');
  const [cityCommune, setCityCommune] = useState('');
  const [needType, setNeedType] = useState<NeedType>('comida');
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  
  const [successMessage, setSuccessMessage] = useState(false);

  // Load from local storage or set initial
  useEffect(() => {
    const stored = localStorage.getItem(`alzamora_needs_${region}`);
    if (stored) {
      try {
        setReports(JSON.parse(stored));
      } catch (e) {
        setReports(getInitialReports());
      }
    } else {
      const initial = getInitialReports();
      setReports(initial);
      localStorage.setItem(`alzamora_needs_${region}`, JSON.stringify(initial));
    }
  }, [region]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !cityCommune || !description) {
      alert(isChile ? 'Por favor completa los campos principales' : 'Por favor completa los campos principales');
      return;
    }

    const newReport: NeedReport = {
      id: `report-${Date.now()}`,
      location,
      cityCommune,
      needType,
      description,
      contactName: contactName || undefined,
      contactPhone: contactPhone || undefined,
      region,
      status: 'pendiente',
      timestamp: new Date().toLocaleString()
    };

    const updated = [newReport, ...reports];
    setReports(updated);
    localStorage.setItem(`alzamora_needs_${region}`, JSON.stringify(updated));

    // Reset Form
    setLocation('');
    setCityCommune('');
    setNeedType('comida');
    setDescription('');
    setContactName('');
    setContactPhone('');

    setSuccessMessage(true);
    if (onNewReportAdded) {
      onNewReportAdded();
    }
    setTimeout(() => setSuccessMessage(false), 5000);
  };

  // Allow simulating change of status to show interactive dispatch!
  const toggleStatus = (id: string, newStatus: 'pendiente' | 'en_ruta' | 'atendido') => {
    const updated = reports.map(r => {
      if (r.id === id) {
        return { ...r, status: newStatus };
      }
      return r;
    });
    setReports(updated);
    localStorage.setItem(`alzamora_needs_${region}`, JSON.stringify(updated));
  };

  const getNeedBadge = (type: NeedType) => {
    switch (type) {
      case 'comida':
        return <span className="bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">Comida Caliente</span>;
      case 'abrigo':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">Abrigo / Frazadas</span>;
      case 'salud':
        return <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">Atención Médica</span>;
      case 'apoyo':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">Acompañamiento</span>;
      default:
        return <span className="bg-slate-50 text-slate-700 border border-slate-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">General</span>;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Visual Header */}
      <div className="bg-brand-blue text-white p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-md">
        <div className="absolute inset-0 bg-radial-at-tr from-brand-blue-light/40 via-transparent to-transparent"></div>
        <div className="relative z-10 max-w-3xl space-y-2">
          <span className="text-xs font-bold text-brand-yellow uppercase tracking-widest block">Alerta Social Activa</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display leading-tight">
            {isChile 
              ? 'Reporta una Necesidad en la Calle' 
              : 'Report a Person in Need on the Street'
            }
          </h2>
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            ¿Viste a alguien durmiendo a la intemperie que necesita alimentos, frazadas, abrigo o contención espiritual? Completa esta alerta de calle. Nuestro equipo de brigadas solidarias evaluará la situación y asistirá al punto en la siguiente ruta programada.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
            <h3 className="text-lg font-bold font-display text-slate-800 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-brand-red" />
              Enviar Nueva Alerta de Calle
            </h3>

            {successMessage && (
              <div className="p-4 mb-5 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-semibold flex items-start gap-2 animate-scale-up">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">¡Alerta Recibida con Éxito!</p>
                  <p className="font-medium text-green-700 mt-1">
                    La alerta ha sido guardada en la consola local de despacho. Puedes visualizarla y simular su despacho en la lista de la derecha.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Ubicación exacta / Punto de referencia *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    id="need-location-input"
                    type="text"
                    required
                    placeholder="Ej. Esquina Alameda con Portugal, afuera del banco"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {isChile ? "Comuna o Ciudad *" : "Ciudad o Distrito *"}
                </label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    id="need-city-input"
                    type="text"
                    required
                    placeholder={isChile ? "Ej. Santiago Centro, Estación Central, Valparaíso" : "Ej. Madrid Centro, Sevilla"}
                    value={cityCommune}
                    onChange={(e) => setCityCommune(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tipo de Necesidad Principal
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['comida', 'abrigo', 'salud', 'apoyo'] as NeedType[]).map((type) => (
                    <button
                      id={`need-type-select-${type}`}
                      key={type}
                      type="button"
                      onClick={() => setNeedType(type)}
                      className={`py-2 px-3 border rounded-xl text-xs font-semibold transition-all text-center ${
                        needType === type
                          ? 'border-brand-blue bg-blue-50/50 text-brand-blue font-bold ring-2 ring-brand-blue/20'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      {type === 'comida' && '☕ Alimentación'}
                      {type === 'abrigo' && '🧣 Abrigo/Invierno'}
                      {type === 'salud' && '🩺 Curaciones/Salud'}
                      {type === 'apoyo' && '🙏 Escucha y Fe'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Descripción o Estado de la Persona *
                </label>
                <textarea
                  id="need-description-input"
                  required
                  rows={3}
                  placeholder="Describe cómo se encuentra la persona, si tiene abrigo, si habla contigo, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tus datos (Opcional - para aclarar ubicación)</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <User className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    <input
                      id="reporter-name-input"
                      type="text"
                      placeholder="Tu nombre"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full pl-8 pr-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    <input
                      id="reporter-phone-input"
                      type="text"
                      placeholder="Tu teléfono"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full pl-8 pr-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              <button
                id="submit-alert-button"
                type="submit"
                className="w-full bg-brand-red hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <AlertCircle className="w-4 h-4 fill-white text-brand-red" />
                <span>{isChile ? 'Enviar Alerta de Calle' : 'Report Urgent Need'}</span>
              </button>

            </form>
          </div>
        </div>

        {/* Dashboard / Active reports Feed column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold font-display text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-blue" />
                Consola de Alertas en Tiempo Real
              </h3>
              <span className="text-xs font-semibold font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {reports.length} reportadas
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed mb-5">
              Simula la gestión de las brigadas móviles de la Fundación. Haz clic en las etiquetas de estado en cada reporte para despachar voluntarios o marcar la alerta como atendida.
            </p>

            <div className="space-y-4 overflow-y-auto max-h-[520px] pr-1">
              {reports.map((report) => (
                <div 
                  key={report.id} 
                  className={`p-4 border rounded-2xl transition-all ${
                    report.status === 'atendido'
                      ? 'bg-slate-50/50 border-slate-200 opacity-80'
                      : report.status === 'en_ruta'
                        ? 'bg-amber-50/40 border-amber-200'
                        : 'bg-white border-slate-100 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2.5 mb-2 pb-2 border-b border-dashed border-slate-100">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {getNeedBadge(report.needType)}
                        <span className="text-[10px] font-bold text-slate-400 font-mono">
                          {report.timestamp}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-700 text-xs font-bold font-sans">
                        <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0" />
                        <span>{report.location}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold block">{report.cityCommune}</span>
                    </div>

                    {/* Simulation controls */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Simular Estado</span>
                      <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg border">
                        <button
                          id={`sim-status-pendiente-${report.id}`}
                          onClick={() => toggleStatus(report.id, 'pendiente')}
                          className={`px-2 py-0.5 text-[9px] font-bold rounded-md ${report.status === 'pendiente' ? 'bg-red-500 text-white shadow-xs' : 'text-slate-600'}`}
                        >
                          Pendiente
                        </button>
                        <button
                          id={`sim-status-enruta-${report.id}`}
                          onClick={() => toggleStatus(report.id, 'en_ruta')}
                          className={`px-2 py-0.5 text-[9px] font-bold rounded-md ${report.status === 'en_ruta' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600'}`}
                        >
                          En Ruta 🚚
                        </button>
                        <button
                          id={`sim-status-atendido-${report.id}`}
                          onClick={() => toggleStatus(report.id, 'atendido')}
                          className={`px-2 py-0.5 text-[9px] font-bold rounded-md ${report.status === 'atendido' ? 'bg-green-600 text-white shadow-xs' : 'text-slate-600'}`}
                        >
                          Atendido ✓
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{report.description}"
                  </p>

                  {/* Contact info metadata if available */}
                  {(report.contactName || report.contactPhone) && (
                    <div className="mt-3 flex items-center gap-3 text-[10px] text-slate-500 font-medium">
                      <span>Reportado por: <strong>{report.contactName || 'Anónimo'}</strong></span>
                      {report.contactPhone && (
                        <span className="flex items-center gap-1 text-brand-blue">
                          <Phone className="w-3 h-3" /> {report.contactPhone}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Process flow indicator */}
                  <div className="mt-3.5 flex items-center gap-2">
                    {report.status === 'pendiente' && (
                      <span className="text-[11px] text-red-600 bg-red-50 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> En cola de despacho - Pendiente de brigada móvil.
                      </span>
                    )}
                    {report.status === 'en_ruta' && (
                      <span className="text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        🚚 Brigada Alzamora está saliendo hacia la zona reportada.
                      </span>
                    )}
                    {report.status === 'atendido' && (
                      <span className="text-[11px] text-green-700 bg-green-50 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-green-600" /> ¡Atendido! Se proveyó abrigo, alimentación y apoyo.
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
