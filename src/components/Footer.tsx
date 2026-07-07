import React from 'react';
import { Heart, Mail, Phone, MapPin, Landmark, Award } from 'lucide-react';
import { Region } from '../types';
import { LOGO_URL } from '../data';

interface FooterProps {
  region: Region;
  onOpenDonate: () => void;
  setCurrentTab: (tab: string) => void;
}

export default function Footer({ region, onOpenDonate, setCurrentTab }: FooterProps) {
  const isChile = region === 'chile';

  return (
    <footer className="bg-brand-navy text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={LOGO_URL} 
                alt="Fundación Alzamora Icon" 
                className="h-10 w-auto bg-white/10 p-1 rounded-lg"
                referrerPolicy="no-referrer"
              />
              <span className="text-base font-bold font-display text-white tracking-tight">
                Fundación Alzamora
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              {isChile 
                ? "Una organización cristiana dedicada a servir con amor, fe y dignidad a nuestros hermanos que duermen en las calles de Chile, proveyendo alimentos, abrigo y acompañamiento espiritual."
                : "Organización de fe que asiste de manera integral a personas sin hogar, devolviéndoles la dignidad a través de comida caliente, acompañamiento bíblico y kits de higiene."
              }
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-slate-400 hover:text-white transition-colors" title="Facebook">
                <span className="text-sm font-bold">FB</span>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors" title="Instagram">
                <span className="text-sm font-bold">IG</span>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors" title="YouTube">
                <span className="text-sm font-bold">YT</span>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-display">
              {isChile ? "Navegación" : "Quick Links"}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => setCurrentTab('inicio')} 
                  className="hover:text-white transition-colors text-left"
                >
                  {isChile ? "Inicio / Portada" : "Home"}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentTab('programas')} 
                  className="hover:text-white transition-colors text-left"
                >
                  {isChile ? "Nuestros Programas" : "Our Programs"}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentTab('voluntarios')} 
                  className="hover:text-white transition-colors text-left"
                >
                  {isChile ? "Únete como Voluntario" : "Volunteer With Us"}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentTab('historias')} 
                  className="hover:text-white transition-colors text-left"
                >
                  {isChile ? "Historias de Impacto" : "Impact Stories"}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentTab('alerta')} 
                  className="hover:text-white text-red-400 transition-colors text-left font-semibold"
                >
                  {isChile ? "🚨 Alerta Social (Reportar)" : "🚨 Report Homeless Person"}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-display">
              {isChile ? "Contacto y Sedes" : "Contact & Offices"}
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
                <span>
                  {isChile 
                    ? "Sede Santiago: Av. Libertador Bernardo O'Higgins 1302, Santiago Centro" 
                    : "Sede España: Calle de Hortaleza 44, Centro, 28004 Madrid"
                  }
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-yellow shrink-0" />
                <span>
                  {isChile ? "+56 2 2489 1230" : "+34 91 522 1304"}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-yellow shrink-0" />
                <span>contacto@fundacionalzamora.org</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Tax Benefits & Seal */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-display">
              {isChile ? "Transparencia Tributaria" : "Tax Benefits"}
            </h4>
            <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl space-y-2.5">
              <div className="flex items-center gap-2 text-white">
                <Landmark className="w-4 h-4 text-brand-yellow" />
                <span className="text-xs font-semibold">
                  {isChile ? "Franquicia Tributaria" : "Deducción Fiscal"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal font-sans">
                {isChile 
                  ? "Las donaciones están acogidas a la Ley N° 21.015 o Ley de Donaciones Sociales, permitiendo un crédito tributario o rebaja de gasto según corresponda."
                  : "En España, las donaciones a fundaciones del Título II disfrutan de deducciones del IRPF de hasta el 80% para los primeros 150€ donados."
                }
              </p>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-emerald-950/40 border border-emerald-900/50 rounded-lg text-emerald-400 text-xs">
              <Award className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
              <span className="font-semibold">Sello de Transparencia 100%</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-sans">
          <p>
            &copy; {new Date().getFullYear()} Fundación Alzamora. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Canal Ético</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
