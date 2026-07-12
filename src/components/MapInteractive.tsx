import React, { useState } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { MapPin, Info, Users, Coffee, Clock, Compass } from 'lucide-react';
import { Route } from '../types';
import { CHILE_ROUTES } from '../data';
import { GOOGLE_MAPS_API_KEY, hasGoogleMaps, VALPARAISO_CENTER } from '../lib/googleMaps';

interface MapInteractiveProps {
  onSelectRouteForAction?: (route: Route, actionType: 'volunteer' | 'report') => void;
}

export default function MapInteractive({ onSelectRouteForAction }: MapInteractiveProps) {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(CHILE_ROUTES[0] ?? null);
  const [hoveredRouteId, setHoveredRouteId] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      <div className="p-5 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-lg font-bold font-display text-brand-blue flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-red animate-spin-slow" />
            Puntos de Entrega y Rutas de Calle
          </h3>
          <p className="text-xs text-slate-500 font-sans">
            Haz clic en los puntos interactivos del mapa para consultar la cobertura de nuestras brigadas solidarias en Valparaíso y Viña del Mar.
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
        {hasGoogleMaps ? (
          <div className="col-span-1 lg:col-span-7 relative min-h-[360px] lg:min-h-[460px]">
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
              <Map
                defaultCenter={VALPARAISO_CENTER}
                defaultZoom={12}
                gestureHandling="greedy"
                clickableIcons={false}
                className="w-full h-full min-h-[360px] lg:min-h-[460px]"
              >
                {CHILE_ROUTES.filter((r) => r.lat != null && r.lng != null).map((route) => (
                  <Marker
                    key={route.id}
                    position={{ lat: route.lat as number, lng: route.lng as number }}
                    title={route.name}
                    onClick={() => setSelectedRoute(route)}
                  />
                ))}
              </Map>
            </APIProvider>
          </div>
        ) : (
          <div className="col-span-1 lg:col-span-7 bg-slate-900 relative min-h-[360px] lg:min-h-[460px] flex items-center justify-center overflow-hidden p-6 select-none">
          
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35"></div>
          
          {/* Mapa estilizado de la bahía de Valparaíso y Viña del Mar */}
          <svg viewBox="0 0 400 400" className="w-full max-w-[320px] h-full max-h-[360px] text-slate-800 pointer-events-none transition-all">
            {/* Línea de costa estilizada de la bahía */}
            <path
              d="M40,300 Q120,260 180,200 Q240,140 360,120"
              fill="none"
              stroke="currentColor"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-20"
            />
            <path
              d="M40,300 Q120,260 180,200 Q240,140 360,120"
              fill="none"
              stroke="#0A3D62"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-40"
            />

            {/* Etiquetas de la Quinta Región */}
            <text x="60" y="330" fill="#94a3b8" fontSize="12" fontWeight="bold" fontFamily="monospace">Valparaíso</text>
            <text x="250" y="105" fill="#94a3b8" fontSize="12" fontWeight="bold" fontFamily="monospace">Viña del Mar</text>
            <text x="150" y="240" fill="#64748b" fontSize="10" fontWeight="bold" fontFamily="monospace">Bahía</text>
          </svg>

          {/* Marcadores interactivos de rutas (solo Quinta Región) */}
          {CHILE_ROUTES.map((route) => {
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
          })}

          {/* Compass Graphic overlay */}
          <div className="absolute bottom-4 right-4 text-slate-600 opacity-40 hidden sm:flex items-center gap-1">
            <Compass className="w-6 h-6" />
            <span className="text-[10px] font-mono">VALPARAÍSO - VIÑA DEL MAR</span>
          </div>

          </div>
        )}

        {/* Info detail Sidebar on the right */}
        <div className="col-span-1 lg:col-span-5 p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-100 bg-slate-50/50">
          
          {selectedRoute ? (
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
          )}

        </div>

      </div>
    </div>
  );
}
