
import React, { useState } from 'react';
import { optimizePrompt } from '../services/geminiService';
import { OptimizedPromptResponse, OptimizationMode } from '../types';

interface Props {
  mode: OptimizationMode;
  title: string;
  description: string;
  icon: string;
  placeholder: string;
}

const OptimizationCard: React.FC<Props> = ({ mode, title, description, icon, placeholder }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizedPromptResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleOptimize = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setErrorMsg(null);
    
    try {
      const data = await optimizePrompt(input, mode);
      setResult(data);
    } catch (error: any) {
      console.error("Optimization Error:", error);
      
      if (error.message === "MISSING_KEY" || error.message === "INVALID_KEY") {
        if (window.aistudio) {
          setErrorMsg("Acceso no configurado. Por favor, selecciona una clave.");
          await window.aistudio.openSelectKey();
        } else {
          setErrorMsg("La API Key en Vercel no es válida o falta. Revisa la configuración de Vercel.");
        }
      } else {
        setErrorMsg("Error de conexión. Verifica tu internet o la clave de API.");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.optimizedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="p-8 pb-0">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-brand-light text-brand flex items-center justify-center rounded-2xl shadow-sm">
            <i className={`fa-solid ${icon} text-lg`}></i>
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-800 tracking-tight">{title}</h2>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">{description}</p>
          </div>
        </div>
        
        <div className="relative mb-6">
          <textarea
            className="w-full h-32 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand/10 focus:border-brand transition-all outline-none resize-none text-gray-700 placeholder:text-gray-300 text-sm"
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleOptimize}
            disabled={loading || !input.trim()}
            className="absolute bottom-3 right-3 bg-brand hover:bg-brand/90 disabled:bg-gray-200 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all active:scale-95 shadow-lg"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-bolt"></i>}
            <span>{loading ? 'Optimizando...' : 'Optimizar'}</span>
          </button>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl flex items-center justify-between border border-red-100 animate-fadeIn">
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{errorMsg}</span>
            </div>
            {window.aistudio && (
              <button 
                onClick={() => window.aistudio?.openSelectKey()}
                className="bg-white px-3 py-1 rounded-lg shadow-sm text-[10px] hover:bg-gray-50 transition-colors"
              >
                Configurar
              </button>
            )}
          </div>
        )}
      </div>

      {result && (
        <div className="p-8 pt-0 bg-white animate-slideUp border-t-2 border-gray-50">
          <div className="flex justify-between items-center mb-4 pt-4">
            <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase ${
              result.suggestedMode === 'DATO EXACTO' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {result.suggestedMode}
            </span>
            <button
              onClick={copyToClipboard}
              className={`${copied ? 'text-green-500' : 'text-brand hover:text-brand/70'} font-bold text-xs flex items-center space-x-1`}
            >
              <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
              <span>{copied ? '¡Listo!' : 'Copiar'}</span>
            </button>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl text-gray-300 font-mono text-[11px] leading-relaxed max-h-40 overflow-y-auto mb-3 border-l-2 border-brand-accent">
            {result.optimizedPrompt}
          </div>
          <div className="bg-brand-light/5 p-3 rounded-xl border border-brand-light/10">
            <p className="text-[10px] text-gray-500 font-medium leading-tight">
              {result.reasoning}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizationCard;
