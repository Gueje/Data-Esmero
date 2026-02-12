
import { GoogleGenAI, Type } from "@google/genai";
import { OptimizedPromptResponse, OptimizationMode } from "../types";

const INITIAL_PROMPT_TEMPLATE = `
Protocolo de Cero Errores
"Vamos a trabajar sobre el [ARCHIVO MADRE 2025 (CLIENTES DICIEMBRE)].
Para esta consulta, activa el MODO [MODO_VARIABLE] y sigue estas reglas estrictas para evitar alucinaciones:
1. Lectura obligatoria con Python: Antes de responder, usa el intérprete de código para cargar el archivo, identificar los encabezados (limpiando las filas vacías iniciales) y filtrar la información solicitada.
2. Verificación de Existencia: Si un nombre de cliente, producto o zona no aparece literalmente en las celdas, indícalo como 'No encontrado' en lugar de sugerir similares.
3. Cita de Evidencia: Para cada cifra o dato entregado, añade al final una tabla de evidencia indicando la columna de origen y el número de registros procesados.
Mi pregunta es la siguiente: [USER_INPUT]"
`;

export const optimizePrompt = async (userInput: string, mode: OptimizationMode): Promise<OptimizedPromptResponse> => {
  // Inicializamos la IA justo antes de usarla para capturar la clave más reciente (Vercel o Selector)
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const isInitial = mode === 'INITIAL';

  const promptBody = isInitial 
    ? `Eres un experto senior en ingeniería de prompts corporativos. Tu tarea es integrar la consulta del usuario en el PROTOCOLO DE CERO ERRORES completo para INICIAR una conversación desde cero con máxima rigurosidad.
    
      Entrada del usuario: "${userInput}"
      
      Sigue este template estrictamente:
      ${INITIAL_PROMPT_TEMPLATE}
      
      Debes devolver un JSON con:
      1. optimizedPrompt: El prompt final listo para usar.
      2. suggestedMode: "DATO EXACTO" o "ANÁLISIS".
      3. reasoning: Tu explicación técnica.`
    : `Eres un asistente que ayuda a pulir preguntas para una IA en una conversación ya iniciada. 
      Toma la idea del usuario y hazla más clara, técnica y profesional. No incluyas protocolos de error o Python aquí.
      
      Entrada del usuario: "${userInput}"
      
      Debes devolver un JSON con:
      1. optimizedPrompt: La pregunta pulida.
      2. suggestedMode: "DATO EXACTO" o "ANÁLISIS".
      3. reasoning: Por qué se optimizó así.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: promptBody,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          optimizedPrompt: { type: Type.STRING },
          suggestedMode: { type: Type.STRING, enum: ["DATO EXACTO", "ANÁLISIS"] },
          reasoning: { type: Type.STRING }
        },
        required: ["optimizedPrompt", "suggestedMode", "reasoning"]
      }
    }
  });

  try {
    let text = response.text || "";
    // Limpieza de posibles bloques de código Markdown
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text) as OptimizedPromptResponse;
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    throw error;
  }
};
