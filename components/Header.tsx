
import React, { useEffect, useState } from 'react';
import ConfigModal from './ConfigModal';

const Header: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  const checkKeyStatus = () => {
    const localKey = localStorage.getItem('GEMINI_API_KEY');
    const envKey = process.env.API_KEY;
    setHasKey(!!(localKey || (envKey && envKey.length > 5)));
  };

  useEffect(() => {
    checkKeyStatus();
    const interval = setInterval(checkKeyStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[#8B2EE2] border-b border-white/10 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <div className="p-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <img 
                src="https://raw.githubusercontent.com/Gueje/Imagenes/refs/heads/main/Simbolo_Esmero_blanco.png" 
                alt="Logo Esmero" 
                className="h-9 w-auto object-contain"
              />
            </div>
            <div className="h-8 w-px bg-white/20 hidden sm:block"></div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-none uppercase">Data Esmero</h1>
              <p className="text-[10px] text-white/80 font-bold uppercase tracking-[0.15em] mt-1">generador de prompts</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className={`hidden md:flex items-center space-x-2 px-4 py-2 rounded-full border ${
              hasKey ? 'bg-white/10 border-white/20 text-white' : 'bg-orange-400/20 border-orange-400/30 text-orange-200'
            }`}>
              <div className={`w-2 h-2 rounded-full ${hasKey ? 'bg-brand-accent animate-pulse shadow-[0_0_8px_rgba(80,227,194,0.8)]' : 'bg-orange-400'}`}></div>
              <span className="text-[9px] font-black uppercase tracking-widest">
                {hasKey ? 'Sistema Listo' : 'Configurar API'}
              </span>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all border border-white/20 group shadow-lg"
              title="Configurar API Key"
            >
              <i className="fa-solid fa-gear group-hover:rotate-90 transition-transform duration-500"></i>
            </button>
          </div>
        </div>
      </div>

      <ConfigModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
};

export default Header;