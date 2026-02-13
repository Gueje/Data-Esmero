
import React, { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ConfigModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('GEMINI_API_KEY') || '';
    setApiKey(savedKey);
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('GEMINI_API_KEY', apiKey);
    onClose();
    window.location.reload(); // Recargar para que el servicio tome la nueva llave
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1A2233] w-full max-w-md rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden text-white">
        <div className="p-10">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-brand/20 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-key text-brand text-lg"></i>
              </div>
              <h2 className="text-xl font-bold tracking-tight">Configuración</h2>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
              <i className="fa-solid fa-xmark text-lg text-gray-400 hover:text-white"></i>
            </button>
          </div>

          <div className="bg-blue-900/20 border border-blue-400/10 rounded-2xl p-5 mb-8">
            <div className="flex items-start space-x-3">
              <i className="fa-solid fa-shield-halved text-blue-400 mt-1"></i>
              <div>
                <h4 className="text-blue-300 text-[10px] font-black uppercase tracking-widest mb-1">Nota de Seguridad</h4>
                <p className="text-[11px] text-blue-100/60 leading-relaxed font-medium">
                  Tu API Key se almacena localmente en el navegador y solo se usa para conectar con los servidores oficiales de Google.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">
                Google Gemini API Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-[#0F172A] border border-white/5 rounded-2xl px-5 py-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all placeholder:text-gray-700"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-3 ml-1 leading-relaxed">
                Obtén tu llave en <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-brand hover:underline">Google AI Studio</a>.
              </p>
            </div>
          </div>

          <div className="flex space-x-4 mt-10">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-4 rounded-2xl border border-white/5 text-xs font-bold hover:bg-white/5 transition-all text-gray-400"
            >
              Cerrar
            </button>
            <button 
              onClick={handleSave}
              className="flex-[2] px-4 py-4 rounded-2xl bg-brand text-white text-xs font-black hover:bg-brand/90 transition-all shadow-xl shadow-brand/20 flex items-center justify-center space-x-3 uppercase tracking-widest"
            >
              <i className="fa-solid fa-circle-check"></i>
              <span>Guardar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigModal;