
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#1A2233] w-full max-w-md rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden text-white">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <i className="fa-solid fa-key text-brand-accent text-xl"></i>
              <h2 className="text-xl font-bold tracking-tight">Configuración</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          <div className="bg-blue-900/30 border border-blue-400/20 rounded-2xl p-4 mb-6">
            <h4 className="text-blue-300 text-[11px] font-black uppercase tracking-widest mb-1">Nota de Seguridad:</h4>
            <p className="text-[11px] text-blue-100/70 leading-relaxed font-medium">
              Las llaves se guardan en el "Local Storage" de tu navegador. Nunca se envían a servidores externos que no sean los de Google.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Google Gemini API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all placeholder:text-gray-600"
              />
              <p className="text-[10px] text-gray-500 mt-2 ml-1">Requerida para el análisis de los guiones y optimización.</p>
            </div>
          </div>

          <div className="flex space-x-3 mt-8">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-xs font-bold hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              className="flex-[2] px-4 py-3 rounded-xl bg-brand text-white text-xs font-bold hover:bg-brand/90 transition-all shadow-lg shadow-brand/20 flex items-center justify-center space-x-2"
            >
              <i className="fa-solid fa-shield-check"></i>
              <span>Guardar Configuración</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigModal;
