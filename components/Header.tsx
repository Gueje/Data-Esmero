
import React, { useEffect, useState } from 'react';

const Header: React.FC = () => {
  const [keyStatus, setKeyStatus] = useState<'CHECKING' | 'CONNECTED' | 'DISCONNECTED'>('CHECKING');

  useEffect(() => {
    const checkKey = async () => {
      const envKey = process.env.API_KEY;
      if (envKey && envKey.length > 5) {
        setKeyStatus('CONNECTED');
        return;
      }

      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setKeyStatus(selected ? 'CONNECTED' : 'DISCONNECTED');
      } else {
        setKeyStatus('DISCONNECTED');
      }
    };
    checkKey();
    
    // Escuchar posibles cambios (por si el usuario abre el selector)
    const interval = setInterval(checkKey, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleConfigKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
    } else {
      alert("Para configurar la llave, debes definir API_KEY en las variables de entorno de Vercel y realizar un REDEPLOY.");
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

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 mr-4">
              <div className={`w-2 h-2 rounded-full ${
                keyStatus === 'CONNECTED' ? 'bg-brand-accent animate-pulse' : 
                keyStatus === 'CHECKING' ? 'bg-gray-400' : 'bg-red-400'
              }`}></div>
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">
                {keyStatus === 'CONNECTED' ? 'Sistema Online' : 
                 keyStatus === 'CHECKING' ? 'Verificando...' : 'Sin Conexión'}
              </span>
            </div>

            <button 
              onClick={handleConfigKey}
              className={`text-[10px] font-bold px-4 py-2 rounded-full border transition-all flex items-center space-x-2 ${
                keyStatus === 'CONNECTED' 
                  ? 'border-white/20 hover:bg-white/10' 
                  : 'border-brand-accent text-brand-accent bg-brand-accent/5'
              }`}
            >
              <i className={`fa-solid ${keyStatus === 'CONNECTED' ? 'fa-shield-check' : 'fa-key'}`}></i>
              <span>{keyStatus === 'CONNECTED' ? 'Acceso OK' : 'Vincular Acceso'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
