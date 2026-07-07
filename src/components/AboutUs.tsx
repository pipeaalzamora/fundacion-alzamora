import React, { useState } from 'react';
import { Landmark, Compass, Award, ShieldCheck, Mail, Send, CheckCircle2 } from 'lucide-react';
import { Region } from '../types';
import MapInteractive from './MapInteractive';
import { IMAGES } from '../data';

interface AboutUsProps {
  region: Region;
}

export default function AboutUs({ region }: AboutUsProps) {
  const isChile = region === 'chile';

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !message) {
      alert('Por favor completa todos los campos requeridos (*)');
      return;
    }

    // Save mock contact message
    const newMessage = {
      id: Date.now(),
      contactName,
      contactEmail,
      subject,
      message,
      region,
      timestamp: new Date().toLocaleString()
    };

    const existing = localStorage.getItem('alzamora_contact_messages') || '[]';
    try {
      const parsed = JSON.parse(existing);
      parsed.push(newMessage);
      localStorage.setItem('alzamora_contact_messages', JSON.stringify(parsed));
    } catch (e) {
      localStorage.setItem('alzamora_contact_messages', JSON.stringify([newMessage]));
    }

    setContactName('');
    setContactEmail('');
    setSubject('');
    setMessage('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 animate-fade-in">
      
      {/* Our History Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        <div className="lg:col-span-6 space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-bold text-brand-red uppercase tracking-widest block">Fundación Alzamora</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 tracking-tight leading-none">
              Nuestra Historia de Fe y Amor
            </h2>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            La Fundación Alzamora nació de una inquietud profunda en el corazón de un grupo de familias y profesionales cristianos en el invierno de 2018. Al contemplar el frío y la soledad extrema en la que pernoctaban decenas de personas bajo los puentes y en los soportales de las grandes urbes, decidimos actuar. 
          </p>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            Empezamos preparando termos de café caliente y sándwiches en nuestra propia cocina, saliendo a caminar las calles para conversar y orar con quienes se sintieran abandonados. Con el tiempo, Dios multiplicó los panes y los corazones generosos de cientos de voluntarios.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            Hoy en día, la fundación cuenta con sedes activas en España (Madrid y Barcelona) y delegaciones consolidadas en Chile (Santiago y Valparaíso), sirviendo miles de desayunos y raciones de abrigo todos los meses, y llevando sobre todo la Luz y la Palabra de Dios para restaurar la fe y la autoestima de nuestros hermanos de la calle.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nuestra Visión</span>
              <p className="text-xs text-slate-600 font-medium leading-relaxed font-sans">
                Ser un faro de dignidad y esperanza que reconecte a las personas sin hogar con la sociedad y con su creador.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nuestro Pilar</span>
              <p className="text-xs text-slate-600 font-medium leading-relaxed font-sans">
                Servir con amor incondicional, honestidad rigurosa y un profundo respeto a la libertad individual de cada ser humano.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 relative h-[360px] rounded-2xl overflow-hidden shadow-xs bg-slate-100">
          <img 
            src={IMAGES.architectureBg} 
            alt="Sede Alzamora" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-blue/25 mix-blend-multiply"></div>
          <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/95 backdrop-blur-xs rounded-xl flex items-center gap-3 shadow-md">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Acreditación Oficial</span>
              <p className="text-xs text-slate-600 font-medium font-sans mt-0.5">Sometidos a auditorías externas anuales para asegurar la máxima transparencia de tus recursos.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Embedded Map Section */}
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h3 className="text-2xl font-bold font-display text-slate-900 tracking-tight">Presencia en el Territorio</h3>
          <p className="text-xs text-slate-500 font-sans">Visualiza las sedes globales que respaldan nuestro esfuerzo de calle diario.</p>
        </div>
        <MapInteractive region={region} />
      </div>

      {/* Contact Form Section */}
      <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-brand-red uppercase tracking-widest block">Canal Directo</span>
            <h3 className="text-2xl font-bold font-display text-slate-800">Contáctanos</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            ¿Tienes alguna consulta de transparencia, propuestas de colaboración empresarial o deseas donar materiales (ropa de abrigo, termos, alimentos)? 
          </p>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            Escríbenos directamente a través de este formulario oficial. Nuestro equipo de secretaría te responderá en un plazo máximo de 48 horas hábiles.
          </p>

          <div className="space-y-2 pt-2 text-xs text-slate-500">
            <p><strong>Horario de Atención:</strong> Lunes a Viernes de 09:00 a 18:00 hrs.</p>
            <p><strong>Email Institucional:</strong> coordinacion@fundacionalzamora.org</p>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/30 shadow-xs">
          
          {success && (
            <div className="p-4 mb-5 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-scale-up">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              <span>¡Mensaje Enviado! Tu consulta ha sido guardada de forma segura en nuestro simulador de mensajes entrantes.</span>
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Nombre Completo *</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="Tu nombre"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Correo Electrónico *</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="nombre@ejemplo.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Asunto</label>
              <input
                id="contact-subject"
                type="text"
                placeholder="Ej. Donación corporativa, aporte de frazadas"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Mensaje *</label>
              <textarea
                id="contact-message"
                required
                rows={4}
                placeholder="Escribe aquí tu consulta en detalle..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <button
              id="submit-contact-btn"
              type="submit"
              className="w-full bg-brand-blue hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Mensaje</span>
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}
