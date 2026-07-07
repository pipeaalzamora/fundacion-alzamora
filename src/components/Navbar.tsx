import React, { useState } from 'react';
import { Menu, X, Heart, Globe, Flag, MessageSquare } from 'lucide-react';
import { Region } from '../types';
import { LOGO_URL } from '../data';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  region: Region;
  setRegion: (region: Region) => void;
  onOpenDonate: () => void;
}

export default function Navbar({ currentTab, setCurrentTab, region, setRegion, onOpenDonate }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isChile = region === 'chile';

  // Navigation tabs matching the region
  const tabs = [
    { id: 'inicio', label: isChile ? 'Inicio' : 'Inicio' },
    { id: 'programas', label: isChile ? 'Programas' : 'Our Programs' },
    { id: 'voluntarios', label: isChile ? 'Voluntarios' : 'Volunteers' },
    { id: 'historias', label: isChile ? 'Historias' : 'Stories' },
    { id: 'nosotros', label: isChile ? 'Nosotros' : 'About Us' },
    { id: 'alerta', label: isChile ? 'Alerta Social 🚨' : 'Report Need 🚨' }
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('inicio')}>
            <img 
              src={LOGO_URL} 
              alt="Fundación Alzamora Logo" 
              className="h-14 w-auto object-contain transition-transform hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold font-display text-brand-blue tracking-tight leading-none">
                FUNDACIÓN ALZAMORA
              </span>
              <span className="text-[10px] text-slate-500 font-sans tracking-widest mt-0.5 font-medium uppercase">
                {isChile ? "Amor y Fe en la Calle • Chile" : "Transformando Vidas Con Amor y Fe"}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {tabs.map((tab) => {
              const isActive = currentTab === tab.id;
              const isAlert = tab.id === 'alerta';
              return (
                <button
                  id={`nav-tab-${tab.id}`}
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? isAlert 
                        ? 'bg-red-50 text-brand-red font-semibold'
                        : 'text-brand-blue font-semibold bg-blue-50/50'
                      : isAlert
                        ? 'text-brand-red hover:bg-red-50/50 font-medium'
                        : 'text-slate-600 hover:text-brand-blue hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                  {isActive && !isAlert && (
                    <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-brand-blue rounded-full"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Section: Region Selector & Donate CTA */}
          <div className="hidden md:flex items-center gap-4">
            {/* Region Switcher */}
            <div className="flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50">
              <button
                id="region-switcher-general"
                onClick={() => setRegion('general')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  region === 'general'
                    ? 'bg-white text-brand-blue shadow-xs border border-slate-200/50'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="España & Internacional"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Global/ES</span>
              </button>
              <button
                id="region-switcher-chile"
                onClick={() => setRegion('chile')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  region === 'chile'
                    ? 'bg-white text-brand-blue shadow-xs border border-slate-200/50'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Sede Chile"
              >
                <span className="text-sm leading-none">🇨🇱</span>
                <span>Chile</span>
              </button>
            </div>

            {/* Donate Action Button */}
            <button
              id="navbar-donate-button"
              onClick={onOpenDonate}
              className="bg-brand-red text-white hover:bg-red-600 font-semibold text-sm px-5 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{isChile ? 'Donar Ahora' : 'Donate Now'}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Mini Region selector for mobile */}
            <button
              id="mobile-region-quick-toggle"
              onClick={() => setRegion(isChile ? 'general' : 'chile')}
              className="p-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isChile ? '🇨🇱 CL' : '🌐 ES'}</span>
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-brand-blue rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white p-4 space-y-3 shadow-lg animate-slide-down">
          <div className="space-y-1">
            {tabs.map((tab) => {
              const isActive = currentTab === tab.id;
              const isAlert = tab.id === 'alerta';
              return (
                <button
                  id={`mobile-nav-${tab.id}`}
                  key={tab.id}
                  onClick={() => {
                    setCurrentTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? isAlert
                        ? 'bg-red-50 text-brand-red'
                        : 'bg-blue-50 text-brand-blue'
                      : isAlert
                        ? 'text-brand-red hover:bg-red-50'
                        : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl">
              <span className="text-xs font-semibold text-slate-500">Región de Ayuda:</span>
              <div className="flex gap-1 bg-slate-200 p-0.5 rounded-lg">
                <button
                  onClick={() => setRegion('general')}
                  className={`px-3 py-1 text-[11px] font-bold rounded-md ${region === 'general' ? 'bg-white text-brand-blue shadow-xs' : 'text-slate-500'}`}
                >
                  Global/ES
                </button>
                <button
                  onClick={() => setRegion('chile')}
                  className={`px-3 py-1 text-[11px] font-bold rounded-md ${region === 'chile' ? 'bg-white text-brand-blue shadow-xs' : 'text-slate-500'}`}
                >
                  Chile
                </button>
              </div>
            </div>

            <button
              id="mobile-donate-cta"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenDonate();
              }}
              className="w-full bg-brand-red text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xs"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>{isChile ? 'Donar Ahora' : 'Donate Now'}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
