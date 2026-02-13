
import React from 'react';
import Header from './components/Header';
import OptimizationCard from './components/OptimizationCard';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#F9FAFB] selection:bg-brand-accent selection:text-brand">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fadeIn">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
            ¿Qué puedes <span className="text-brand">hacer aquí?</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-500 font-medium">
            Para obtener los mejores resultados con Data Esmero, utiliza este optimizador para refinar tus instrucciones y potenciar tu productividad diaria.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <OptimizationCard 
            mode="INITIAL"
            title="Prompt de Apertura"
            description="Para iniciar un nuevo chat"
            icon="fa-rocket"
            placeholder="Ej: ¿Cuáles fueron los mejores clientes del 2025 según volumen de ventas?"
          />
          <OptimizationCard 
            mode="FOLLOWUP"
            title="Prompt de Seguimiento"
            description="Para hilos con contexto activo"
            icon="fa-comments"
            placeholder="Ej: Basado en estos datos, ¿qué estrategias sugieres para fidelizarlos?"
          />
        </div>

        <div className="mt-20">
          <div className="text-center mb-10 flex flex-col items-center">
            <div className="p-4 rounded-[2rem] bg-white shadow-sm border border-gray-100 mb-8">
              <img 
                src="https://www.esmero.com.co/wp-content/uploads/2025/03/logo_esmero_principal.svg" 
                alt="Logo Esmero Principal" 
                className="h-20 w-auto"
              />
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">
              ¡Juntos! vamos a llegar a otro nivel con la IA
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 flex items-center space-x-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                <i className="fa-solid fa-clock text-lg"></i>
              </div>
              <p className="text-[11px] text-gray-600 font-bold uppercase tracking-wide leading-relaxed">Ahorro de tiempo: Automatiza tareas repetitivas y gana horas de valor.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 flex items-center space-x-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-brand-accent/20 text-brand flex items-center justify-center shrink-0">
                <i className="fa-solid fa-chart-line text-lg"></i>
              </div>
              <p className="text-[11px] text-gray-600 font-bold uppercase tracking-wide leading-relaxed">Análisis profundo: Descubre patrones y datos clave de forma inmediata.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 flex items-center space-x-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                <i className="fa-solid fa-lightbulb text-lg"></i>
              </div>
              <p className="text-[11px] text-gray-600 font-bold uppercase tracking-wide leading-relaxed">Creatividad sin límites: Genera ideas innovadoras y soluciones en segundos.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
            Data Esmero es una herramienta exclusiva para los empleados de Esmero
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;