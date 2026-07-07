import React, { useState } from 'react';
import { MapPin, Info, Users, Coffee, Clock, Compass } from 'lucide-react';
import { Route, Region } from '../types';
import { CHILE_ROUTES } from '../data';

interface MapInteractiveProps {
  region: Region;
  onSelectRouteForAction?: (route: Route, actionType: 'volunteer' | 'report') => void;
}

export default function MapInteractive({ region, onSelectRouteForAction }: MapInteractiveProps) {
  const isChile = region === 'chile';
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(
    isChile ? CHILE_ROUTES[0] : null
  );

  const [hoveredRouteId, setHoveredRouteId] = useState<string | null>(null);

  // General region has markers for Santiago (Chile) and Madrid (Spain) to show international delivery
  const generalLocations = [
    {
      id: "loc-spain",
      name: "Sede Central España (Madrid)",
      city: "Madrid",
      routesCount: 4,
      breakfastsMonthly: 2000,
      kitsDelivered: 800,
      description: "Coordinamos las rutas nocturnas de Madrid, Barcelona y Sevilla desde la central española, entregando alimento y consuelo espiritual.",
      x: 35,
      y: 40,
    },
    {
      id: "loc-chile",
      name: "Sede Internacional Chile (Santiago)",
      city: "Santiago",
      routesCount: 3,
      breakfastsMonthly: 1500,
      kitsDelivered: 400,
      description: "Nuestra principal delegación en el Cono Sur, atendiendo Estación Central, Santiago Centro y las rutas costeras de Valparaíso.",
      x: 75,
      y: 75,
    }
  ];

  const [selectedGeneralLocation, setSelectedGeneralLocation] = useState<any>(generalLocations[0]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      <div className="p-5 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-lg font-bold font-display text-brand-blue flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-red animate-spin-slow" />
            {isChile ? 'Puntos de Entrega y Rutas de Calle' : 'Donde Entregamos Ayuda'}
          </h3>
          <p className="text-xs text-slate-500 font-sans">
            {isChile 
              ? 'Haz clic en los puntos interactivos del mapa para consultar la cobertura de nuestras brigadas solidarias.'
              : 'Nuestra presencia internacional llevando fe y dignidad a quienes lo necesitan.'
            }
          </p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
            Monitoreo en Vivo
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* Map Visualization Canvas */}
        <div className="col-span-1 lg:col-span-7 bg-slate-900 relative min-h-[360px] lg:min-h-[460px] flex items-center justify-center overflow-hidden p-6 select-none">
          
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35"></div>
          
          {/* Abstract stylized continents/country SVG */}
          {isChile ? (
            // Stylized map of Chile (slender shape)
            <svg viewBox="0 0 400 500" className="w-full max-w-[280px] h-full max-h-[400px] text-slate-800 pointer-events-none transition-all">
              <path 
                d="M180,50 L200,60 L210,120 L180,200 L170,260 L140,320 L130,380 L140,450" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="12" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="opacity-20"
              />
              <path 
                d="M180,50 L200,60 L210,120 L180,200 L170,260 L140,320 L130,380 L140,450" 
                fill="none" 
                stroke="#0A3D62" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="opacity-40"
              />
              
              {/* Regional labels */}
              <text x="210" y="80" fill="#64748b" fontSize="10" fontWeight="bold" fontFamily="monospace">Arica y P.</text>
              <text x="200" y="180" fill="#64748b" fontSize="10" fontWeight="bold" fontFamily="monospace">Coquimbo</text>
              <text x="110" y="270" fill="#94a3b8" fontSize="11" fontWeight="extrabold" fontFamily="monospace">Valparaíso</text>
              <text x="200" y="295" fill="#f1c40f" fontSize="11" fontWeight="extrabold" fontFamily="monospace">Santiago (RM)</text>
              <text x="160" y="390" fill="#64748b" fontSize="10" fontWeight="bold" fontFamily="monospace">Concepción</text>
            </svg>
          ) : (
            // Stylized World map showing Spain/Chile connection
            <svg viewBox="0 0 500 300" className="w-full max-w-[440px] h-auto text-slate-800 pointer-events-none transition-all">
              {/* Atlantic path */}
              <path 
                d="M 180 120 Q 280 150 380 220" 
                fill="none" 
                stroke="#F1C40F" 
                strokeWidth="1.5" 
                strokeDasharray="5,5" 
                className="opacity-60"
              />
              
              {/* Spain area contour */}
              <circle cx="180" cy="120" r="18" fill="rgba(10,61,98,0.15)" stroke="rgba(10,61,98,0.4)" strokeWidth="1" />
              <text x="135" y="105" fill="#94a3b8" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Sede España</text>

              {/* Chile area contour */}
              <circle cx="380" cy="220" r="18" fill="rgba(231,76,60,0.15)" stroke="rgba(231,76,60,0.4)" strokeWidth="1" />
              <text x="390" y="240" fill="#94a3b8" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Sede Chile</text>
            </svg>
          )}

          {/* Interactive Absolute Markers Overlay */}
          {isChile ? (
            CHILE_ROUTES.map((route) => {
              const isSelected = selectedRoute?.id === route.id;
              const isHovered = hoveredRouteId === route.id;
              
              return (
                <button
                  id={`route-marker-${route.id}`}
                  key={route.id}
                  onClick={() => setSelectedRoute(route)}
                  onMouseEnter={() => setHoveredRouteId(route.id)}
                  onMouseLeave={() => setHoveredRouteId(null)}
                  className="absolute transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2"
                  style={{ 
                    top: `${route.latitudePercent}%`, 
                    left: `${route.longitudePercent}%`,
                    zIndex: isSelected ? 30 : 20 
                  }}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Ripple pulse effects */}
                    <span className={`absolute inline-flex h-8 w-8 rounded-full opacity-60 transition-all ${
                      isSelected 
                        ? 'animate-ping bg-brand-yellow/30' 
                        : isHovered 
                          ? 'animate-pulse bg-brand-red/20' 
                          : 'bg-transparent'
                    }`}></span>
                    
                    {/* Pin body */}
                    <div className={`p-2 rounded-full shadow-lg transition-all ${
                      isSelected 
                        ? 'bg-brand-yellow text-brand-navy scale-125 border-2 border-white' 
                        : 'bg-brand-blue text-white hover:bg-brand-red hover:scale-110'
                    }`}>
                      <MapPin className="w-4 h-4" />
                    </div>

                    {/* Simple Tooltip on hover */}
                    {isHovered && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-950 text-white text-[10px] font-bold py-1 px-2.5 rounded-md whitespace-nowrap shadow-xl pointer-events-none z-40">
                        {route.name}
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          ) : (
            generalLocations.map((loc) => {
              const isSelected = selectedGeneralLocation?.id === loc.id;
              return (
                <button
                  id={`gen-loc-marker-${loc.id}`}
                  key={loc.id}
                  onClick={() => setSelectedGeneralLocation(loc)}
                  className="absolute transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2"
                  style={{ top: `${loc.y}%`, left: `${loc.x}%` }}
                >
                  <div className="relative">
                    <span className={`absolute inset-0 rounded-full h-10 w-10 -m-2 opacity-50 ${isSelected ? 'animate-ping bg-brand-yellow/30' : 'bg-transparent'}`}></span>
                    <div className={`p-3 rounded-full shadow-md transition-all ${
                      isSelected 
                        ? 'bg-brand-yellow text-brand-navy scale-110 ring-4 ring-white/20' 
                        : 'bg-slate-750 text-slate-300 hover:text-white hover:bg-brand-blue'
                    }`}>
                      <MapPin className="w-5 h-5" />
                    </div>
                  </div>
                </button>
              );
            })
          )}

          {/* Compass Graphic overlay */}
          <div className="absolute bottom-4 right-4 text-slate-600 opacity-40 hidden sm:flex items-center gap-1">
            <Compass className="w-6 h-6" />
            <span className="text-[10px] font-mono">VALPARAÍSO - SANTIAGO - MADRID</span>
          </div>

        </div>

        {/* Info detail Sidebar on the right */}
        <div className="col-span-1 lg:col-span-5 p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-100 bg-slate-50/50">
          
          {isChile ? (
            selectedRoute ? (
              <div className="space-y-5 animate-fade-in">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-brand-blue bg-blue-50 border border-blue-200/50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {selectedRoute.city}
                  </span>
                  <h4 className="text-xl font-bold font-display text-slate-800 leading-snug">
                    {selectedRoute.name}
                  </h4>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {selectedRoute.description}
                </p>

                {/* Key stats cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white border border-slate-100 rounded-xl">
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <Users className="w-3.5 h-3.5 text-brand-blue" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Voluntarios</span>
                    </div>
                    <span className="text-lg font-bold font-mono text-slate-800">
                      {selectedRoute.volunteersCount} activos
                    </span>
                  </div>
                  
                  <div className="p-3 bg-white border border-slate-100 rounded-xl">
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <Coffee className="w-3.5 h-3.5 text-brand-red" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Raciones/Día</span>
                    </div>
                    <span className="text-lg font-bold font-mono text-slate-800">
                      {selectedRoute.mealsDelivered} desayunos
                    </span>
                  </div>
                </div>

                {/* Schedule info */}
                <div className="flex items-center gap-2.5 p-3 bg-amber-50 border border-amber-200/30 rounded-xl text-amber-950">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <div className="text-xs">
                    <span className="font-bold block">Horario de Salida:</span>
                    <span className="text-amber-800 font-medium">{selectedRoute.schedule}</span>
                  </div>
                </div>

                {/* Action Hooks */}
                {onSelectRouteForAction && (
                  <div className="pt-2 grid grid-cols-2 gap-3">
                    <button
                      id={`btn-volunteer-${selectedRoute.id}`}
                      onClick={() => onSelectRouteForAction(selectedRoute, 'volunteer')}
                      className="bg-brand-blue hover:bg-blue-900 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-xs hover:shadow-md transition-all text-center"
                    >
                      Sumarme a esta Ruta
                    </button>
                    <button
                      id={`btn-report-${selectedRoute.id}`}
                      onClick={() => onSelectRouteForAction(selectedRoute, 'report')}
                      className="border border-brand-red text-brand-red hover:bg-red-50 text-xs font-bold py-3 px-4 rounded-xl transition-all text-center"
                    >
                      Reportar Necesidad
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <Info className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs font-medium text-slate-500">
                  Selecciona una ruta en el mapa para ver sus detalles específicos.
                </p>
              </div>
            )
          ) : (
            selectedGeneralLocation && (
              <div className="space-y-5 animate-fade-in">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-brand-yellow bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Presencia Global
                  </span>
                  <h4 className="text-xl font-bold font-display text-slate-800 leading-snug">
                    {selectedGeneralLocation.name}
                  </h4>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {selectedGeneralLocation.description}
                </p>

                {/* KPI stats for global location */}
                <div className="space-y-3">
                  <div className="p-3.5 bg-white border border-slate-100 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-50 text-brand-blue rounded-lg">
                        <Compass className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">Rutas de asistencia</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-slate-800">{selectedGeneralLocation.routesCount} activas</span>
                  </div>

                  <div className="p-3.5 bg-white border border-slate-100 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-red-50 text-brand-red rounded-lg">
                        <Coffee className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">Comidas Servidas al Mes</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-slate-800">+{selectedGeneralLocation.breakfastsMonthly.toLocaleString()} raciones</span>
                  </div>

                  <div className="p-3.5 bg-white border border-slate-100 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">Kits de Dignidad Anuales</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-slate-800">+{selectedGeneralLocation.kitsDelivered.toLocaleString()} unidades</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-100 border border-slate-200/50 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">Deseas aportar en {selectedGeneralLocation.city}?</span>
                  <p className="text-xs text-slate-600 font-medium">Cada aporte en esta plataforma es derivado directamente a la sede correspondiente para su óptimo impacto local.</p>
                </div>
              </div>
            )
          )}

        </div>

      </div>
    </div>
  );
}
