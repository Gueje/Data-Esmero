
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
  // Prioridad 1: Key manual en localStorage
  const localKey = localStorage.getItem('GEMINI_API_KEY');
  // Prioridad 2: Key de entorno (Vercel)
  const envKey = process.env.API_KEY;
  
  const apiKey = localKey || envKey;
  
  if (!apiKey || apiKey.trim() === "") {
    throw new Error("MISSING_KEY");
  }

  const ai = new GoogleGenAI({ apiKey });
  const isInitial = mode === 'INITIAL';

  const promptBody = isInitial 
    ? `Eres un experto senior en ingeniería de prompts corporativos. Tu tarea es integrar la consulta del usuario en el PROTOCOLO DE CERO ERRORES.
    
      Entrada del usuario: "${userInput}"
      
      Estructura obligatoria del resultado (optimizedPrompt):
      ${INITIAL_PROMPT_TEMPLATE}
      
      Debes devolver un JSON con:
      1. optimizedPrompt: El prompt final listo para usar.
      2. suggestedMode: "DATO EXACTO" o "ANÁLISIS".
      3. reasoning: Tu explicación técnica breve.`
    : `Eres un asistente que pulida preguntas para una IA en una conversación ya iniciada. 
      Toma la idea del usuario y hazla más técnica, clara y profesional para un contexto de negocio.
      
      Entrada del usuario: "${userInput}"
      
      Debes devolver un JSON con:
      1. optimizedPrompt: La pregunta pulida.
      2. suggestedMode: "DATO EXACTO" o "ANÁLISIS".
      3. reasoning: Breve explicación de la mejora.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: promptBody,
      config: {
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

    return JSON.parse(response.text || "{}") as OptimizedPromptResponse;
  } catch (error: any) {
    if (error.message?.includes("API_KEY_INVALID") || error.message?.includes("403")) {
      throw new Error("INVALID_KEY");
    }
    throw error;
  }
};
