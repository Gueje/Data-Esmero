
import React from 'react';

const Header: React.FC = () => {
  const isConnected = !!process.env.API_KEY && process.env.API_KEY.length > 5;

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
            <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-brand-accent animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
                {isConnected ? 'Sistema Activo' : 'Clave no detectada'}
              </span>
            </div>
            
            {!isConnected && (
              <a 
                href="https://vercel.com/docs/projects/environment-variables" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden sm:block text-[9px] font-bold text-white/40 hover:text-white transition-colors uppercase underline"
              >
                Ayuda de configuración
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
