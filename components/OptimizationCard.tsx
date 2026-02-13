
import React, { useState } from 'react';
import { optimizePrompt } from '../services/geminiService';
import { OptimizedPromptResponse, OptimizationMode } from '../types';
import ConfigModal from './ConfigModal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOptimize = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setErrorMsg(null);
    
    try {
      const data = await optimizePrompt(input, mode);
      setResult(data);
    } catch (error: any) {
      if (error.message === "MISSING_KEY" || error.message === "INVALID_KEY") {
        setErrorMsg("La API Key no es válida o no está configurada.");
        setIsModalOpen(true);
      } else {
        setErrorMsg("Error de conexión. Intenta de nuevo.");
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
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-500">
      <div className="p-10 pb-6">
        <div className="flex items-center space-x-5 mb-6">
          <div className="w-14 h-14 bg-gray-50 text-brand flex items-center justify-center rounded-2xl border border-gray-100">
            <i className={`fa-solid ${icon} text-xl`}></i>
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none">{title}</h2>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">{description}</p>
          </div>
        </div>
        
        <div className="relative group">
          <textarea
            className="w-full h-40 p-6 bg-gray-50/50 border-2 border-transparent rounded-3xl focus:bg-white focus:border-brand/20 transition-all outline-none resize-none text-gray-700 placeholder:text-gray-300 text-sm shadow-inner"
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleOptimize}
            disabled={loading || !input.trim()}
            className="absolute bottom-4 right-4 bg-brand hover:bg-brand/90 disabled:bg-gray-200 text-white px-6 py-3 rounded-2xl text-xs font-black flex items-center space-x-2 transition-all active:scale-95 shadow-lg shadow-brand/20"
          >
            {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-sparkles"></i>}
            <span>{loading ? 'Mejorando...' : 'Optimizar'}</span>
          </button>
        </div>

        {errorMsg && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 text-[11px] font-bold rounded-2xl border border-red-100 animate-fadeIn flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="underline">Configurar</button>
          </div>
        )}
      </div>

      {result && (
        <div className="p-10 pt-4 bg-white animate-slideUp">
          <div className="h-px bg-gray-100 mb-6 w-full"></div>
          
          <div className="flex justify-between items-center mb-5">
            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border ${
              result.suggestedMode === 'DATO EXACTO' ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-blue-50 border-blue-100 text-blue-600'
            }`}>
              Modo Sugerido: {result.suggestedMode}
            </span>
            <button
              onClick={copyToClipboard}
              className={`${copied ? 'text-green-500 bg-green-50' : 'text-brand bg-brand/5 hover:bg-brand/10'} px-4 py-2 rounded-xl transition-all font-bold text-[10px] flex items-center space-x-2`}
            >
              <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
              <span>{copied ? '¡Copiado!' : 'Copiar Resultado'}</span>
            </button>
          </div>

          <div className="bg-gray-900 p-6 rounded-[2rem] text-gray-300 font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto mb-5 border-l-4 border-brand">
            {result.optimizedPrompt}
          </div>

          <p className="text-[11px] text-gray-500 font-medium leading-relaxed italic border-l-2 border-gray-100 pl-4">
            {result.reasoning}
          </p>
        </div>
      )}

      <ConfigModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default OptimizationCard;
