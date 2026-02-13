
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
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <img 
              src="https://www.esmero.com.co/wp-content/uploads/2025/03/logo_esmero_principal.svg" 
              alt="Logo Esmero" 
              className="h-10 w-auto object-contain"
            />
            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none">Data Intelligence</h1>
              <p className="text-[9px] text-brand font-bold uppercase tracking-[0.2em] mt-1">Prompt Optimization Suite</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className={`hidden md:flex items-center space-x-2 px-4 py-2 rounded-full border ${
              hasKey ? 'bg-green-50 border-green-100 text-green-700' : 'bg-orange-50 border-orange-100 text-orange-600'
            }`}>
              <div className={`w-2 h-2 rounded-full ${hasKey ? 'bg-green-500 animate-pulse' : 'bg-orange-400'}`}></div>
              <span className="text-[9px] font-black uppercase tracking-widest">
                {hasKey ? 'Sistema Listo' : 'Requiere Configuración'}
              </span>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-brand hover:text-white transition-all border border-gray-100 group shadow-sm"
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
