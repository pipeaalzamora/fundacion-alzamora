import React, { useState } from 'react';
import { BookOpen, Coffee, HeartHandshake, Check, ChevronRight, Clock } from 'lucide-react';
import { PROGRAMS, ProgramDetails } from '../data';

interface ProgramsProps {
  onSelectParticipate: (programTitle: string) => void;
}

export default function Programs({ onSelectParticipate }: ProgramsProps) {
  const programList = PROGRAMS;

  const [selectedProgram, setSelectedProgram] = useState<ProgramDetails | null>(null);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Coffee':
        return <Coffee className="w-8 h-8 text-brand-blue" />;
      case 'BookOpen':
        return <BookOpen className="w-8 h-8 text-brand-blue" />;
      default:
        return <HeartHandshake className="w-8 h-8 text-brand-blue" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      
      {/* Intro section */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-brand-red uppercase tracking-widest block">Acción con Propósito</span>
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 tracking-tight">
          Nuestros Programas en la Quinta Región
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed font-sans">
          Cada iniciativa está diseñada para abordar tanto el bienestar corporal inmediato como el fortalecimiento emocional y de fe de las personas en situación de extrema vulnerabilidad.
        </p>
      </div>

      {/* Grid of Programs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {programList.map((program) => {
          return (
            <div 
              key={program.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Visual Header */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img 
                    src={program.imageUrl} 
                    alt={program.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-[10px] font-bold text-brand-yellow uppercase tracking-widest font-mono block mb-1">Impacto Continuo</span>
                    <span className="text-sm font-semibold font-mono">{program.stats}</span>
                  </div>
                </div>

                {/* Info and Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 text-brand-blue rounded-xl">
                      {getIcon(program.iconName)}
                    </div>
                    <h3 className="text-lg font-bold font-display text-slate-800 leading-snug">
                      {program.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    {program.description}
                  </p>

                  <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-600 font-sans">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{program.scheduleDetails}</span>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="p-6 pt-0 flex gap-3">
                <button
                  id={`btn-detail-${program.id}`}
                  onClick={() => setSelectedProgram(program)}
                  className="flex-1 border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-xs py-2.5 rounded-xl transition-all text-center"
                >
                  Saber Más
                </button>
                <button
                  id={`btn-participate-${program.id}`}
                  onClick={() => onSelectParticipate(program.title)}
                  className="flex-1 bg-brand-blue hover:bg-blue-900 text-white font-bold text-xs py-2.5 rounded-xl transition-all text-center"
                >
                  {program.buttonText}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Modal for Program info */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl overflow-hidden max-w-xl w-full shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setSelectedProgram(null)}
              className="absolute top-4 right-4 bg-black/40 text-white p-1.5 rounded-full hover:bg-black/60 transition-all z-10"
            >
              <Check className="w-5 h-5 rotate-45" />
            </button>

            <div className="relative h-56 bg-slate-100">
              <img 
                src={selectedProgram.imageUrl} 
                alt={selectedProgram.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent"></div>
              <div className="absolute bottom-5 left-6 text-white space-y-1">
                <span className="text-[10px] font-bold text-brand-yellow uppercase tracking-widest block font-mono">
                  Detalle del Programa
                </span>
                <h4 className="text-xl sm:text-2xl font-bold font-display">{selectedProgram.title}</h4>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {selectedProgram.fullDescription}
              </p>

              <div className="grid grid-cols-2 gap-4 border-t border-b py-4 border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Frecuencia / Rutas</span>
                  <span className="font-semibold text-slate-700">{selectedProgram.scheduleDetails}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Indicador de Impacto</span>
                  <span className="font-semibold text-brand-blue">{selectedProgram.stats}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-xs transition-all"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    onSelectParticipate(selectedProgram.title);
                    setSelectedProgram(null);
                  }}
                  className="flex-1 bg-brand-red hover:bg-red-600 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-xs"
                >
                  Sumarme como Voluntario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
