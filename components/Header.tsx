
import React from 'react';

const Header: React.FC = () => {
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : null;
  const isConnected = !!apiKey && apiKey.length > 5;

  return (
    <header className="bg-brand text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-2 rounded-xl shadow-inner">
              <img 
                src="https://raw.githubusercontent.com/Gueje/Imagenes/refs/heads/main/Simbolo_Esmero_blanco.png" 
                alt="Logo Esmero" 
                className="h-10 w-auto object-contain brightness-0"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://www.esmero.com.co/wp-content/uploads/2025/03/logo_esmero_principal.svg";
                }}
              />
            </div>
            <div className="border-l border-white/20 pl-4">
              <h1 className="text-2xl font-black tracking-tighter text-white leading-none italic">Data Esmero</h1>
              <p className="text-[10px] text-brand-light font-bold uppercase tracking-[0.2em] mt-1">Intelligence Optimizer</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-brand-accent animate-pulse' : 'bg-orange-400'}`}></div>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/90">
              {isConnected ? 'Neural Link Active' : 'Waiting for Config'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
