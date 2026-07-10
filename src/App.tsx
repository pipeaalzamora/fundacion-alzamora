import React, { useState, useEffect } from 'react';
import { 
  Heart, Users, Award, Coffee, Compass, BookOpen, 
  ArrowRight, ShieldCheck, AlertCircle, Sparkles, Flame, CheckCircle 
} from 'lucide-react';

// Types
import { Region, TransparencyStats } from './types';

// API
import { getStats } from './lib/api';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Programs from './components/Programs';
import Volunteers from './components/Volunteers';
import Stories from './components/Stories';
import AboutUs from './components/AboutUs';
import NeedReporter from './components/NeedReporter';
import DonationModal from './components/DonationModal';
import AdminPanel from './components/AdminPanel';

// Mock Data
import { IMAGES, LOGO_URL, STORIES } from './data';

export default function App() {
  const [region, setRegion] = useState<Region>('chile'); // Defaulting to Chile (high-fidelity screens focus on Chile)
  const [currentTab, setCurrentTab] = useState<string>('inicio');
  const [isDonateOpen, setIsDonateOpen] = useState<boolean>(false);
  const [preselectedProgramTitle, setPreselectedProgramTitle] = useState<string | undefined>(undefined);

  // Estadísticas reales obtenidas de la API (sin números inventados en localStorage)
  const [stats, setStats] = useState<TransparencyStats | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);

  // Mensaje de retorno de la pasarela de pago (?donacion=exito|fallo)
  const [donationResult, setDonationResult] = useState<'exito' | 'fallo' | null>(null);

  // Mensaje de retorno de la suscripción mensual (?suscripcion=exito|fallo)
  const [subscriptionResult, setSubscriptionResult] = useState<'exito' | 'fallo' | null>(null);

  // Carga de estadísticas reales al montar la app
  useEffect(() => {
    const controller = new AbortController();
    setStatsLoading(true);
    getStats(controller.signal)
      .then((data) => setStats(data))
      .catch(() => setStats(null)) // Estado neutro: mostramos "—" en lugar de datos falsos
      .finally(() => setStatsLoading(false));
    return () => controller.abort();
  }, []);

  // Lectura del retorno de la pasarela de pago (Webpay / PayPal) y de la suscripción mensual
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let changed = false;

    const result = params.get('donacion');
    if (result === 'exito' || result === 'fallo') {
      setDonationResult(result);
      params.delete('donacion');
      changed = true;
    }

    const subResult = params.get('suscripcion');
    if (subResult === 'exito' || subResult === 'fallo') {
      setSubscriptionResult(subResult);
      params.delete('suscripcion');
      changed = true;
    }

    if (changed) {
      // Limpiamos los query params de la URL sin recargar
      const newQuery = params.toString();
      const newUrl = window.location.pathname + (newQuery ? `?${newQuery}` : '');
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  // Formatea un contador real; si no hay datos, muestra "—" (estado neutro)
  const formatStat = (value: number | undefined) =>
    typeof value === 'number' ? `+${value.toLocaleString()}` : '—';

  // Switch to volunteer tab with matched program pre-filled
  const handleSelectParticipate = (programTitle: string) => {
    setPreselectedProgramTitle(programTitle);
    setCurrentTab('voluntarios');
    // Scroll smoothly to form card
    setTimeout(() => {
      const formEl = document.getElementById('volunteer-signup-card');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Interactive Maps custom route trigger
  const handleSelectRouteForAction = (route: any, actionType: 'volunteer' | 'report') => {
    if (actionType === 'volunteer') {
      handleSelectParticipate(route.name);
    } else {
      setCurrentTab('alerta');
      setTimeout(() => {
        const inputEl = document.getElementById('need-location-input');
        if (inputEl) {
          inputEl.focus();
          (inputEl as HTMLInputElement).value = `Cerca de: ${route.name}`;
        }
      }, 100);
    }
  };

  // Scroll to top when changing tab
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  const isChile = region === 'chile';

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col font-sans selection:bg-brand-blue/10 selection:text-brand-blue">
      
      {/* Navbar header */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        region={region} 
        setRegion={setRegion} 
        onOpenDonate={() => setIsDonateOpen(true)}
      />

      {/* Banner de retorno de la pasarela de pago */}
      {donationResult && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
          {donationResult === 'exito' ? (
            <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl flex items-start gap-3 animate-scale-up">
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-sm">¡Gracias por tu donación!</p>
                <p className="text-xs text-green-700 mt-0.5 leading-relaxed">
                  Tu aporte se procesó correctamente. Recibirás un comprobante en tu correo. Con tu ayuda seguimos llegando a las calles con alimentos, abrigo y acompañamiento.
                </p>
              </div>
              <button
                onClick={() => setDonationResult(null)}
                className="text-green-600 hover:text-green-800 shrink-0"
                aria-label="Cerrar mensaje"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-start gap-3 animate-scale-up">
              <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-sm">No se pudo completar tu donación</p>
                <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                  El pago no se concretó o fue cancelado. No se realizó ningún cargo. Puedes intentarlo nuevamente cuando quieras.
                </p>
                <button
                  onClick={() => {
                    setDonationResult(null);
                    setIsDonateOpen(true);
                  }}
                  className="mt-2 text-xs font-bold text-brand-red hover:text-red-700 underline"
                >
                  Reintentar donación
                </button>
              </div>
              <button
                onClick={() => setDonationResult(null)}
                className="text-red-600 hover:text-red-800 shrink-0"
                aria-label="Cerrar mensaje"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {/* Banner de retorno de la suscripción mensual (?suscripcion=exito|fallo) */}
      {subscriptionResult && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
          {subscriptionResult === 'exito' ? (
            <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl flex items-start gap-3 animate-scale-up">
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-sm">¡Tu aporte mensual quedó activo, gracias por ser socio!</p>
                <p className="text-xs text-green-700 mt-0.5 leading-relaxed">
                  Tu medio de pago quedó inscrito y renovaremos tu aporte automáticamente cada mes. Recibirás un comprobante en tu correo. Puedes cancelar tu suscripción cuando quieras escribiéndonos.
                </p>
              </div>
              <button
                onClick={() => setSubscriptionResult(null)}
                className="text-green-600 hover:text-green-800 shrink-0"
                aria-label="Cerrar mensaje"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-start gap-3 animate-scale-up">
              <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-sm">No pudimos activar tu aporte mensual</p>
                <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                  La inscripción de tu suscripción no se completó o fue cancelada. No se realizó ningún cargo. Puedes intentarlo nuevamente cuando quieras.
                </p>
                <button
                  onClick={() => {
                    setSubscriptionResult(null);
                    setIsDonateOpen(true);
                  }}
                  className="mt-2 text-xs font-bold text-brand-red hover:text-red-700 underline"
                >
                  Reintentar suscripción
                </button>
              </div>
              <button
                onClick={() => setSubscriptionResult(null)}
                className="text-red-600 hover:text-red-800 shrink-0"
                aria-label="Cerrar mensaje"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Screen Content Router */}
      <main className="flex-1">
        
        {currentTab === 'inicio' && (
          <div className="space-y-16 animate-fade-in">
            
            {/* HERO HERO SECTION */}
            <section className="relative bg-brand-navy text-white overflow-hidden py-20 lg:py-28">
              {/* Overlay graphics */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={isChile ? IMAGES.heroGeneral : IMAGES.heroGeneral} 
                  alt="Fundación Alzamora Calle" 
                  className="w-full h-full object-cover opacity-25"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/95 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-cream to-transparent"></div>
              </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Hero Words */}
                <div className="lg:col-span-7 space-y-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30">
                    <Sparkles className="w-3.5 h-3.5 fill-brand-yellow" />
                    {isChile ? 'Sede Oficial Chile' : 'Transformando vidas desde 2018'}
                  </span>
                  
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display leading-tight tracking-tight text-white">
                    {isChile 
                      ? 'Transformando vidas en las calles de Chile con amor y fe'
                      : 'Transformando vidas en la calle con amor y fe'
                    }
                  </h1>

                  <p className="text-base sm:text-lg text-slate-300 font-sans max-w-2xl leading-relaxed">
                    {isChile 
                      ? 'Salimos al encuentro de nuestros hermanos en situación de calle en Santiago y Valparaíso, entregando desayunos calientes, kits de abrigo y la palabra esperanzadora del Evangelio.'
                      : 'Acompañamos a personas sin hogar en sus noches más frías, entregando alimentación nutritiva, elementos de aseo personal y el abrigo de una comunidad de fe activa.'
                    }
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      id="hero-donate-cta"
                      onClick={() => setIsDonateOpen(true)}
                      className="bg-brand-red text-white hover:bg-red-600 font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    >
                      <Heart className="w-5 h-5 fill-white" />
                      <span>{isChile ? 'Donar un Kit de Invierno' : 'Donar Ahora'}</span>
                    </button>
                    <button
                      id="hero-volunteers-cta"
                      onClick={() => setCurrentTab('voluntarios')}
                      className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-xl transition-all border border-white/25 flex items-center gap-1.5"
                    >
                      <span>{isChile ? 'Sé Voluntario de Calle' : 'Ser un Voluntario'}</span>
                      <ArrowRight className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>

                {/* Live Activity Quick Card on right */}
                <div className="lg:col-span-5">
                  <div className="p-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 text-slate-800 space-y-4 animate-scale-up">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-blue uppercase tracking-widest font-mono">Consola de Impacto</span>
                      <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" title="Actualizado hace segundos"></span>
                    </div>

                    <h4 className="text-lg font-bold font-display text-slate-900 leading-snug">
                      {isChile ? 'Rutas Activas en Santiago Centro' : 'Asistencia Nocturna Activa'}
                    </h4>

                    <div className="space-y-3">
                      <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Coffee className="w-4 h-4 text-brand-blue" />
                          <span className="text-xs font-semibold">Tazas servidas hoy</span>
                        </div>
                        <span className="text-sm font-bold font-mono text-slate-800">120 desayunos</span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Compass className="w-4 h-4 text-brand-red" />
                          <span className="text-xs font-semibold">Sectores cubiertos</span>
                        </div>
                        <span className="text-sm font-bold font-mono text-slate-800">Alameda, Estación Central</span>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex gap-2 items-start">
                      <Award className="w-4.5 h-4.5 text-brand-blue shrink-0 mt-0.5" />
                      <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                        <strong>Llamado Solidario:</strong> Registra una alerta si ves a alguien con frío o hambre. Haz clic en "Alerta Social" arriba.
                      </p>
                    </div>

                    <button
                      id="hero-quick-report-cta"
                      onClick={() => setCurrentTab('alerta')}
                      className="w-full bg-brand-blue text-white hover:bg-blue-900 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      🚨 Reportar una Necesidad en Calle
                    </button>
                  </div>
                </div>

              </div>
            </section>

            {/* DYNAMIC IMPACT METRICS BAR */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8 lg:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
                
                <div className="space-y-1.5 p-4 md:p-0">
                  <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-2">
                    <Coffee className="w-6 h-6" />
                  </div>
                  <span className="block text-3xl sm:text-4xl font-extrabold font-mono text-slate-900">
                    {statsLoading ? (
                      <span className="inline-block h-8 w-24 mx-auto bg-slate-100 rounded-md animate-pulse align-middle"></span>
                    ) : (
                      formatStat(stats?.mealsCount)
                    )}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-sans block">
                    comidas servidas
                  </span>
                </div>

                <div className="space-y-1.5 p-4 md:p-0 pt-6 md:pt-0">
                  <div className="w-12 h-12 bg-red-50 text-brand-red rounded-full flex items-center justify-center mx-auto mb-2">
                    <Heart className="w-6 h-6 fill-brand-red" />
                  </div>
                  <span className="block text-3xl sm:text-4xl font-extrabold font-mono text-slate-900">
                    {statsLoading ? (
                      <span className="inline-block h-8 w-24 mx-auto bg-slate-100 rounded-md animate-pulse align-middle"></span>
                    ) : (
                      formatStat(stats?.kitsCount)
                    )}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-sans block">
                    kits de dignidad entregados
                  </span>
                </div>

                <div className="space-y-1.5 p-4 md:p-0 pt-6 md:pt-0">
                  <div className="w-12 h-12 bg-amber-50 text-brand-yellow rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="block text-3xl sm:text-4xl font-extrabold font-mono text-slate-900">
                    {statsLoading ? (
                      <span className="inline-block h-8 w-24 mx-auto bg-slate-100 rounded-md animate-pulse align-middle"></span>
                    ) : (
                      formatStat(stats?.volunteersCount)
                    )}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-sans block">
                    voluntarios activos
                  </span>
                </div>

              </div>
            </section>

            {/* STATEMENT & MISSION SECTION */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
              <span className="text-xs font-bold text-brand-blue uppercase tracking-widest block">Nuestra Misión</span>
              <blockquote className="text-xl sm:text-2xl font-bold font-display text-slate-800 leading-snug tracking-tight">
                "En la Fundación Alzamora tenemos la firme convicción de que nadie debe ser invisible. Salimos al encuentro de quienes duermen en la calle no solo para saciar su hambre de hoy, sino para brindarles dignidad, compañía de fe y la esperanza sincera de una vida restaurada."
              </blockquote>
              <div className="flex justify-center items-center gap-2">
                <span className="h-px w-8 bg-slate-300"></span>
                <span className="text-xs text-slate-500 font-bold font-mono uppercase tracking-widest">Sello de Amor y Fe</span>
                <span className="h-px w-8 bg-slate-300"></span>
              </div>
            </section>

            {/* INTERACTIVE CÓMO AYUDAR / CHILE OPTION BANNER (Image 6) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="text-center max-w-xl mx-auto space-y-1">
                <span className="text-xs font-bold text-brand-red uppercase tracking-widest block">Canales de Acción</span>
                <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">¿Cómo puedes ayudar hoy?</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Card 1: Voluntario de calle */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all space-y-4">
                  <div className="p-3 bg-blue-50 text-brand-blue rounded-2xl w-12 h-12 flex items-center justify-center font-bold text-lg">
                    🤝
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800 font-display">Sé un Voluntario de Calle</h4>
                    <p className="text-xs text-slate-500 mt-1 font-sans leading-relaxed">
                      Únete a nuestras rutas matutinas o nocturnas en Santiago y Valparaíso. Regala unas horas para escuchar y servir.
                    </p>
                  </div>
                  <button
                    id="help-card-vol-cta"
                    onClick={() => setCurrentTab('voluntarios')}
                    className="text-xs font-bold text-brand-blue hover:text-blue-900 flex items-center gap-1 transition-colors"
                  >
                    <span>Postular como Voluntario</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card 2: Dona Kit Invierno */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all space-y-4">
                  <div className="p-3 bg-red-50 text-brand-red rounded-2xl w-12 h-12 flex items-center justify-center font-bold text-lg">
                    🧥
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800 font-display">Dona un Kit de Invierno</h4>
                    <p className="text-xs text-slate-500 mt-1 font-sans leading-relaxed">
                      Financia mochilas de dignidad con frazadas, guantes, parka impermeable y artículos básicos de higiene personal.
                    </p>
                  </div>
                  <button
                    id="help-card-donate-cta"
                    onClick={() => setIsDonateOpen(true)}
                    className="text-xs font-bold text-brand-red hover:text-red-700 flex items-center gap-1 transition-colors"
                  >
                    <span>Canalizar Aporte</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card 3: Reporta Necesidad */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all space-y-4">
                  <div className="p-3 bg-amber-50 text-brand-yellow rounded-2xl w-12 h-12 flex items-center justify-center font-bold text-lg">
                    🚨
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800 font-display">Reporta una Necesidad</h4>
                    <p className="text-xs text-slate-500 mt-1 font-sans leading-relaxed">
                      ¿Has visto a alguien durmiendo a la intemperie desprotegido? Avísanos de inmediato para acudir en su ayuda.
                    </p>
                  </div>
                  <button
                    id="help-card-report-cta"
                    onClick={() => setCurrentTab('alerta')}
                    className="text-xs font-bold text-brand-yellow hover:text-amber-700 flex items-center gap-1 transition-colors"
                  >
                    <span>Enviar Alerta de Calle</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </section>

            {/* SELLO DE TRANSPARENCIA BRAND BANNER */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-slate-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-200/50">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold font-display text-slate-800">Compromiso con la Transparencia</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans mt-0.5">
                      Publicamos el detalle de nuestros ingresos y gastos. Puedes revisar nuestro registro de donaciones y las entregas realizadas para ver cómo se usa tu aporte.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    id="transparency-banner-cta"
                    onClick={() => setCurrentTab('voluntarios')}
                    className="text-xs font-bold font-mono text-emerald-700 bg-emerald-100/60 px-3 py-1.5 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-colors"
                  >
                    Ver registro de fondos
                  </button>
                </div>
              </div>
            </section>

            {/* FEATURED STORY SLIDESHOW PREVIEW */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs font-bold text-brand-blue uppercase tracking-widest block">Historias Reales</span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">Milagros en las Calles</h3>
                </div>
                <button
                  id="view-all-stories-btn"
                  onClick={() => setCurrentTab('historias')}
                  className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1 transition-all"
                >
                  <span>Ver todas las historias</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {STORIES.slice(0, 2).map((story) => (
                  <div 
                    key={story.id} 
                    className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden flex flex-col sm:flex-row items-stretch"
                  >
                    <div className="sm:w-2/5 relative h-48 sm:h-auto bg-slate-100">
                      <img 
                        src={story.imageUrl} 
                        alt={story.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-6 sm:w-3/5 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                          <span>{story.location}</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-800 leading-snug font-display">{story.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-sans line-clamp-2">{story.summary}</p>
                      </div>

                      <button
                        id={`story-preview-${story.id}`}
                        onClick={() => {
                          setCurrentTab('historias');
                        }}
                        className="text-xs font-bold text-brand-blue hover:text-brand-navy flex items-center gap-1 transition-colors self-start"
                      >
                        <span>Leer historia de fe</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {currentTab === 'programas' && (
          <Programs 
            region={region} 
            onSelectParticipate={handleSelectParticipate}
          />
        )}

        {currentTab === 'voluntarios' && (
          <Volunteers 
            region={region} 
            preselectedProgramTitle={preselectedProgramTitle}
            onClearPreselection={() => setPreselectedProgramTitle(undefined)}
          />
        )}

        {currentTab === 'historias' && (
          <Stories 
            region={region} 
            onOpenDonate={() => setIsDonateOpen(true)}
          />
        )}

        {currentTab === 'nosotros' && (
          <AboutUs region={region} />
        )}

        {currentTab === 'alerta' && (
          <NeedReporter region={region} />
        )}

        {currentTab === 'admin' && (
          <AdminPanel />
        )}

      </main>

      {/* Shared Donation modal popup */}
      <DonationModal 
        isOpen={isDonateOpen} 
        onClose={() => setIsDonateOpen(false)} 
        region={region}
      />

      {/* Standard brand footer */}
      <Footer 
        region={region} 
        onOpenDonate={() => setIsDonateOpen(true)}
        setCurrentTab={setCurrentTab}
      />

    </div>
  );
}
