import React, { useState } from 'react';
import { Quote, Calendar, MapPin, Heart, ArrowRight, Check } from 'lucide-react';
import { STORIES } from '../data';
import { Story, Region } from '../types';

interface StoriesProps {
  region: Region;
  onOpenDonate: () => void;
}

export default function Stories({ region, onOpenDonate }: StoriesProps) {
  const isChile = region === 'chile';
  
  // State to filter stories
  const [filterRegion, setFilterRegion] = useState<'all' | Region>('all');
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  const filteredStories = STORIES.filter(story => {
    if (filterRegion === 'all') return true;
    return story.region === filterRegion;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-brand-red uppercase tracking-widest block">Vidas Restauradas</span>
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 tracking-tight leading-none">
          {isChile ? 'Testimonios de Esperanza' : 'Stories of Hope & Transformation'}
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed font-sans">
          Detrás de cada estadística hay un rostro, un nombre y una historia única que merece ser dignificada. Conoce los milagros de transformación que ocurren gracias a tu apoyo.
        </p>

        {/* Region Filter buttons */}
        <div className="inline-flex gap-1.5 p-1 bg-slate-100 rounded-xl mt-4">
          <button
            id="filter-stories-all"
            onClick={() => setFilterRegion('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${filterRegion === 'all' ? 'bg-white text-brand-blue shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Todos
          </button>
          <button
            id="filter-stories-es"
            onClick={() => setFilterRegion('general')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${filterRegion === 'general' ? 'bg-white text-brand-blue shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Sede España
          </button>
          <button
            id="filter-stories-cl"
            onClick={() => setFilterRegion('chile')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${filterRegion === 'chile' ? 'bg-white text-brand-blue shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Sede Chile 🇨🇱
          </button>
        </div>
      </div>

      {/* Grid of stories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredStories.map((story) => (
          <div 
            key={story.id} 
            className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div>
              {/* Photo */}
              <div className="relative h-52 bg-slate-100">
                <img 
                  src={story.imageUrl} 
                  alt={story.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-brand-blue/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                  {story.region === 'chile' ? '🇨🇱 Chile' : '🌐 España'}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-3.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium font-sans">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0" /> {story.location}
                  </span>
                  <span>{story.age ? `${story.age} años` : ''}</span>
                </div>

                <h3 className="text-lg font-bold font-display text-slate-800 leading-snug">
                  {story.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  {story.summary}
                </p>

                {/* Pull Quote preview */}
                <div className="p-3 bg-slate-50 border-l-2 border-brand-yellow rounded-r-xl">
                  <Quote className="w-4 h-4 text-brand-yellow/60 fill-brand-yellow/10 mb-1" />
                  <p className="text-[11px] text-slate-600 font-medium italic leading-relaxed">
                    "{story.quote}"
                  </p>
                </div>
              </div>
            </div>

            {/* Read action */}
            <div className="p-6 pt-0">
              <button
                id={`btn-read-story-${story.id}`}
                onClick={() => setActiveStory(story)}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <span>Leer Historia Completa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Donate banner */}
      <div className="bg-brand-navy text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-at-tl from-brand-blue-light/30 via-transparent to-transparent"></div>
        <div className="relative z-10 max-w-xl space-y-1.5 text-center md:text-left">
          <h4 className="text-xl font-bold font-display">Tú puedes escribir la siguiente historia de éxito</h4>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Tu generosidad aporta los recursos necesarios para rescatar a más personas del frío de las calles y de la soledad espiritual. Súmate hoy como socio o haz una donación única.
          </p>
        </div>
        <button
          id="stories-donate-cta"
          onClick={onOpenDonate}
          className="relative z-10 bg-brand-red text-white hover:bg-red-600 font-bold px-6 py-3 rounded-xl shadow-md transition-all shrink-0 flex items-center gap-1.5 text-sm"
        >
          <Heart className="w-4 h-4 fill-white animate-pulse" />
          <span>Quiero Donar Ahora</span>
        </button>
      </div>

      {/* Full story Modal viewer */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <div className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setActiveStory(null)}
              className="absolute top-4 right-4 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-all z-10 font-bold"
            >
              <Check className="w-4 h-4 rotate-45" />
            </button>

            {/* Banner top */}
            <div className="relative h-64 bg-slate-100">
              <img 
                src={activeStory.imageUrl} 
                alt={activeStory.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
              <div className="absolute bottom-5 left-6 right-6 text-white space-y-1">
                <div className="flex items-center gap-2 text-xs text-brand-yellow font-bold font-mono">
                  <MapPin className="w-3.5 h-3.5 fill-brand-yellow/10" />
                  <span>{activeStory.location}</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-bold font-display leading-tight">{activeStory.title}</h4>
                <p className="text-xs text-slate-200">Testimonio real de {activeStory.name}{activeStory.age ? `, ${activeStory.age} años` : ''}</p>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[50vh]">
              {/* Massive pullquote */}
              <div className="p-4 bg-blue-50/50 border-l-4 border-brand-blue rounded-r-2xl">
                <Quote className="w-6 h-6 text-brand-blue/30 fill-brand-blue/5 mb-1" />
                <p className="text-sm font-semibold text-slate-800 italic leading-relaxed">
                  "{activeStory.quote}"
                </p>
              </div>

              <div className="space-y-3.5">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">La historia de fondo</h5>
                <p className="text-xs text-slate-600 leading-relaxed font-sans whitespace-pre-line">
                  {activeStory.fullStory}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Registrado en: {activeStory.date}
                </span>
                <span className="text-brand-blue font-bold">✓ Identidad protegida por dignidad</span>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="p-6 pt-4 border-t border-slate-100 flex gap-3 bg-slate-50">
              <button
                onClick={() => setActiveStory(null)}
                className="flex-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs transition-all"
              >
                Cerrar Lectura
              </button>
              <button
                onClick={() => {
                  setActiveStory(null);
                  onOpenDonate();
                }}
                className="flex-1 bg-brand-red hover:bg-red-600 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Donar en honor a {activeStory.name.split(' ')[0]}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
