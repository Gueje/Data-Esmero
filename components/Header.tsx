
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-brand text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <img 
              src="https://raw.githubusercontent.com/Gueje/Data-Esmero/refs/heads/main/Simbolo_Esmero_blanco.png" 
              alt="Logo Esmero" 
              className="h-10 w-auto object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">Data Esmero</h1>
              <p className="text-xs text-brand-light font-medium uppercase tracking-widest">Generador de prompts</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
