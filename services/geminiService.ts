
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
  // Intentamos obtener la clave de forma segura
  let apiKey = "";
  try {
    apiKey = process.env.API_KEY || "";
  } catch (e) {
    console.warn("Ambiente no configurado");
  }
  
  if (!apiKey || apiKey.length < 10) {
    throw new Error("KEY_NOT_FOUND");
  }

  const ai = new GoogleGenAI({ apiKey });
  const isInitial = mode === 'INITIAL';

  const promptBody = isInitial 
    ? `Eres un experto senior en ingeniería de prompts corporativos para Esmero.
      Entrada del usuario: "${userInput}"
      Sigue este template estrictamente para generar el prompt optimizado:
      ${INITIAL_PROMPT_TEMPLATE}
      Devuelve un JSON con: optimizedPrompt, suggestedMode ("DATO EXACTO" o "ANÁLISIS"), reasoning.`
    : `Optimiza esta consulta de seguimiento para un chat de IA: "${userInput}". 
      Hazla profesional y clara. Devuelve un JSON con: optimizedPrompt, suggestedMode, reasoning.`;

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

    const text = response.text || "{}";
    return JSON.parse(text) as OptimizedPromptResponse;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
