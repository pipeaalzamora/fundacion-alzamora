import React, { useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { AlertCircle, MapPin, CheckCircle2, Navigation, Phone, User, Clock, Send } from 'lucide-react';
import { NeedType } from '../types';
import { createNeedReport, ApiError } from '../lib/api';
import { GOOGLE_MAPS_API_KEY, hasGoogleMaps } from '../lib/googleMaps';
import AddressAutocomplete from './AddressAutocomplete';

interface NeedReporterProps {
  onNewReportAdded?: () => void;
}

// Reporte enviado por el propio usuario durante esta sesión.
// NO persistimos ni mostramos reportes de terceros: la lista completa
// es privada y solo la puede ver el equipo administrador en el backend.
interface SessionReport {
  id: string;
  location: string;
  cityCommune: string;
  needType: NeedType;
  description: string;
  timestamp: string;
}

export default function NeedReporter({ onNewReportAdded }: NeedReporterProps) {
  const [sessionReports, setSessionReports] = useState<SessionReport[]>([]);
  const [location, setLocation] = useState('');
  const [cityCommune, setCityCommune] = useState('');
  const [needType, setNeedType] = useState<NeedType>('comida');
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!location || !cityCommune || !description) {
      setErrorMessage('Por favor completa los campos principales (ubicación, ciudad y descripción).');
      return;
    }

    setIsSubmitting(true);
    try {
      // Registramos el reporte en el backend (POST real).
      const { id } = await createNeedReport({
        location,
        cityCommune,
        needType,
        description,
        contactName: contactName || undefined,
        contactPhone: contactPhone || undefined,
      });

      // Guardamos SOLO el reporte del propio usuario en memoria de sesión.
      const mine: SessionReport = {
        id: id || `session-${Date.now()}`,
        location,
        cityCommune,
        needType,
        description,
        timestamp: new Date().toLocaleString(),
      };
      setSessionReports((prev) => [mine, ...prev]);

      // Reset del formulario
      setLocation('');
      setCityCommune('');
      setNeedType('comida');
      setDescription('');
      setContactName('');
      setContactPhone('');

      setSuccessMessage(true);
      if (onNewReportAdded) onNewReportAdded();
      setTimeout(() => setSuccessMessage(false), 6000);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : 'No pudimos enviar tu alerta. Inténtalo nuevamente en unos minutos.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
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

  const content = (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Visual Header */}
      <div className="bg-brand-blue text-white p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-md">
        <div className="absolute inset-0 bg-radial-at-tr from-brand-blue-light/40 via-transparent to-transparent"></div>
        <div className="relative z-10 max-w-3xl space-y-2">
          <span className="text-xs font-bold text-brand-yellow uppercase tracking-widest block">Alerta Social Activa</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display leading-tight">
            Reporta una Necesidad en la Calle
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
                    Tu reporte fue enviado a nuestro equipo. Coordinaremos una brigada para acudir al punto indicado en la próxima ruta disponible. Gracias por tu solidaridad.
                  </p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 mb-5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-start gap-2 animate-scale-up">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">No pudimos enviar tu alerta</p>
                  <p className="font-medium text-red-700 mt-1">{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Ubicación exacta / Punto de referencia *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400 z-10" />
                  <AddressAutocomplete
                    id="need-location-input"
                    required
                    placeholder="Ej. Plaza Sotomayor, Valparaíso"
                    value={location}
                    onChange={setLocation}
                    onSelect={(place) => {
                      setLocation(place.address);
                      // Autocompleta la comuna/ciudad si Google la detecta.
                      if (place.commune) setCityCommune(place.commune);
                    }}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                  />
                </div>
                {hasGoogleMaps && (
                  <p className="mt-1 text-[10px] text-slate-400">
                    Empieza a escribir y elige una dirección sugerida de la Quinta Región.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Comuna o Ciudad *
                </label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    id="need-city-input"
                    type="text"
                    required
                    placeholder="Ej. Valparaíso, Viña del Mar"
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
                disabled={isSubmitting}
                className="w-full bg-brand-red hover:bg-red-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 fill-white text-brand-red" />
                    <span>Enviar Alerta de Calle</span>
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

        {/* Columna: solo los reportes que el propio usuario envió en esta sesión */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold font-display text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-blue" />
                Tus Alertas Enviadas
              </h3>
              <span className="text-xs font-semibold font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {sessionReports.length} en esta sesión
              </span>
            </div>

            {/* Nota de privacidad */}
            <div className="p-3.5 mb-5 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
              <span>
                Por privacidad, aquí solo ves las alertas que <strong>tú</strong> has enviado en esta visita. Los reportes de otras personas contienen datos sensibles y solo son gestionados de forma reservada por nuestro equipo.
              </span>
            </div>

            {sessionReports.length === 0 ? (
              <div className="text-center py-10 px-4">
                <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Send className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-600">Aún no has enviado alertas</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                  Cuando envíes una alerta desde el formulario, aparecerá aquí como confirmación de tu reporte.
                </p>
              </div>
            ) : (
              <div className="space-y-4 overflow-y-auto max-h-[520px] pr-1">
                {sessionReports.map((report) => (
                  <div key={report.id} className="p-4 border border-slate-100 rounded-2xl shadow-xs bg-white">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {getNeedBadge(report.needType)}
                      <span className="text-[10px] font-bold text-slate-400 font-mono">{report.timestamp}</span>
                      <span className="ml-auto text-[11px] text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Enviada
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-700 text-xs font-bold font-sans">
                      <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0" />
                      <span>{report.location}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold block mb-2">{report.cityCommune}</span>
                    <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                      "{report.description}"
                    </p>
                    <p className="mt-3 text-[11px] text-slate-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      En revisión por nuestro equipo de brigadas.
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );

  // Con API key, envolvemos en APIProvider para habilitar Google Places.
  // Sin ella, el input de dirección funciona como texto normal.
  if (hasGoogleMaps) {
    return <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>{content}</APIProvider>;
  }
  return content;
}
