
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const isInitial = mode === 'INITIAL';

  const promptBody = isInitial 
    ? `Eres un experto senior en ingeniería de prompts corporativos. Tu tarea es integrar la consulta del usuario en el PROTOCOLO DE CERO ERRORES completo para INICIAR una conversación desde cero con máxima rigurosidad.
    
      Entrada del usuario: "${userInput}"
      
      Sigue este template estrictamente:
      ${INITIAL_PROMPT_TEMPLATE}
      
      Debes:
      1. Determinar si requiere "DATO EXACTO" o "ANÁLISIS".
      2. Reformular la pregunta para que sea técnica, clara y elimine ambigüedades.
      3. Asegurar que el prompt final sea una instrucción poderosa y completa.`
    : `Eres un asistente que ayuda a pulir preguntas para una IA en una conversación ya iniciada. 
      Tu objetivo es tomar la idea del usuario y hacerla más clara, técnica y profesional para que la IA entienda mejor la intención.
      
      IMPORTANTE: NO incluyas instrucciones sobre alucinaciones, protocolos de error, Python o archivos en el resultado final. Solo entrega la pregunta pulida y natural.
      
      Entrada del usuario: "${userInput}"
      
      Debes devolver:
      1. La pregunta optimizada (fresca, natural y directa).
      2. El modo sugerido ([DATO EXACTO] o [ANÁLISIS]).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: promptBody,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          optimizedPrompt: {
            type: Type.STRING,
            description: "El prompt final optimizado."
          },
          suggestedMode: {
            type: Type.STRING,
            enum: ["DATO EXACTO", "ANÁLISIS"],
            description: "El modo seleccionado para el contexto de la respuesta."
          },
          reasoning: {
            type: Type.STRING,
            description: "Breve explicación de por qué se optimizó de esta forma."
          }
        },
        required: ["optimizedPrompt", "suggestedMode", "reasoning"]
      }
    }
  });

  try {
    const text = response.text.trim();
    return JSON.parse(text) as OptimizedPromptResponse;
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    throw new Error("No se pudo optimizar el prompt.");
  }
};
