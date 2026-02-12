
import React, { useEffect, useState } from 'react';

const Header: React.FC = () => {
  const [hasKey, setHasKey] = useState(true);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected || !!process.env.API_KEY);
      }
    };
    checkKey();
  }, []);

  const handleConfigKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
    }
  };

  return (
    <header className="bg-brand text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <img 
              src="https://raw.githubusercontent.com/Gueje/Imagenes/refs/heads/main/Simbolo_Esmero_blanco.png" 
              alt="Logo Esmero" 
              className="h-12 w-auto object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://www.esmero.com.co/wp-content/uploads/2025/03/logo_esmero_principal.svg";
                target.style.filter = "brightness(0) invert(1)";
              }}
            />
            <div className="border-l border-white/20 pl-4">
              <h1 className="text-2xl font-black tracking-tighter text-white leading-none">Data Esmero</h1>
              <p className="text-[10px] text-brand-light font-bold uppercase tracking-[0.2em] mt-1 opacity-80">Generador de Prompts</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-4">
            <button 
              onClick={handleConfigKey}
              className={`text-[10px] font-bold px-4 py-2 rounded-full border transition-all ${
                hasKey ? 'border-white/20 hover:bg-white/10' : 'border-brand-accent text-brand-accent animate-pulse'
              }`}
            >
              <i className="fa-solid fa-key mr-2"></i>
              {hasKey ? 'Acceso Vinculado' : 'Configurar Acceso'}
            </button>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] text-white/50 hover:text-white transition-colors"
            >
              Docs Facturación
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
