
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
      console.error("Card Catch Error:", error);
      setErrorMsg(error.message || "Error de conexión. Revisa tu clave en Vercel.");
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
    <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col h-full transition-all duration-300 hover:scale-[1.01]">
      <div className="p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-brand to-brand/80 text-white flex items-center justify-center rounded-2xl shadow-lg shadow-brand/20">
            <i className={`fa-solid ${icon} text-xl`}></i>
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight leading-tight">{title}</h2>
            <p className="text-brand font-bold text-[10px] uppercase tracking-[0.15em]">{description}</p>
          </div>
        </div>
        
        <div className="relative group">
          <textarea
            className="w-full h-40 p-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-brand/30 transition-all outline-none resize-none text-gray-700 placeholder:text-gray-300 text-sm shadow-inner"
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleOptimize}
            disabled={loading || !input.trim()}
            className="absolute bottom-4 right-4 bg-gray-900 hover:bg-brand disabled:bg-gray-200 text-white px-6 py-3 rounded-2xl text-xs font-black flex items-center space-x-2 transition-all active:scale-95 shadow-xl shadow-black/10"
          >
            {loading ? <i className="fa-solid fa-sync fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
            <span>{loading ? 'Procesando...' : 'Optimizar'}</span>
          </button>
        </div>

        {errorMsg && (
          <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-2xl animate-fadeIn">
            <div className="flex space-x-3">
              <i className="fa-solid fa-triangle-exclamation text-orange-500 mt-0.5"></i>
              <div className="flex flex-col">
                <p className="text-[11px] font-black text-orange-800 uppercase tracking-wide">Estado del Sistema</p>
                <p className="text-[10px] text-orange-700 font-medium leading-relaxed mt-1">
                  {errorMsg}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="px-8 pb-8 pt-0 bg-white animate-slideUp">
          <div className="h-px bg-gray-100 mb-6 w-full"></div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${result.suggestedMode === 'DATO EXACTO' ? 'bg-orange-400' : 'bg-blue-400'}`}></span>
              <span className="text-[10px] font-black text-gray-500 tracking-widest uppercase">
                Modo: {result.suggestedMode}
              </span>
            </div>
            <button
              onClick={copyToClipboard}
              className={`${copied ? 'text-brand-accent' : 'text-brand hover:scale-105'} transition-all font-black text-[10px] uppercase tracking-tighter flex items-center space-x-1.5 bg-gray-50 px-3 py-1.5 rounded-full`}
            >
              <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
              <span>{copied ? 'Copiado' : 'Copiar Prompt'}</span>
            </button>
          </div>

          <div className="group relative">
            <div className="bg-gray-950 p-6 rounded-3xl text-gray-200 font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto mb-4 border-l-4 border-brand scrollbar-hide">
              {result.optimizedPrompt}
            </div>
          </div>

          <div className="bg-brand/5 p-4 rounded-2xl border border-brand/10">
            <div className="flex items-start space-x-3">
              <i className="fa-solid fa-brain text-brand text-xs mt-1"></i>
              <p className="text-[11px] text-gray-600 font-medium leading-normal italic">
                {result.reasoning}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizationCard;
