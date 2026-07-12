import React, { useState } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { LOGO_URL } from '../data';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenDonate: () => void;
}

export default function Navbar({ currentTab, setCurrentTab, onOpenDonate }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Pestañas de navegación (siempre en español, enfocadas en la Quinta Región)
  const tabs = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'programas', label: 'Programas' },
    { id: 'voluntarios', label: 'Voluntarios' },
    { id: 'historias', label: 'Historias' },
    { id: 'nosotros', label: 'Nosotros' },
    { id: 'alerta', label: 'Alerta Social 🚨' }
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
                Amor y Fe en la Calle • Valparaíso
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

          {/* Right Section: Donate CTA */}
          <div className="hidden md:flex items-center gap-4">
            {/* Donate Action Button */}
            <button
              id="navbar-donate-button"
              onClick={onOpenDonate}
              className="bg-brand-red text-white hover:bg-red-600 font-semibold text-sm px-5 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Donar Ahora</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
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
            <button
              id="mobile-donate-cta"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenDonate();
              }}
              className="w-full bg-brand-red text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xs"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>Donar Ahora</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
