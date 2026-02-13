
import { GoogleGenAI, Type } from "@google/genai";
import { OptimizedPromptResponse, OptimizationMode } from "../types";

const INITIAL_PROMPT_TEMPLATE = `
Protocolo de Cero Errores - Esmero 2025
"Vamos a trabajar sobre el [ARCHIVO MADRE 2025 (CLIENTES DICIEMBRE)].
Para esta consulta, activa el MODO [MODO_VARIABLE] y sigue estas reglas estrictas para evitar alucinaciones:
1. Lectura obligatoria con Python: Antes de responder, usa el intérprete de código para cargar el archivo, identificar los encabezados (limpiando las filas vacías iniciales) y filtrar la información solicitada.
2. Verificación de Existencia: Si un nombre de cliente, producto o zona no aparece literalmente en las celdas, indícalo como 'No encontrado' en lugar de sugerir similares.
3. Cita de Evidencia: Para cada cifra o dato entregado, añade al final una tabla de evidencia indicando la columna de origen y el número de registros procesados.
Mi pregunta es la siguiente: [USER_INPUT]"
`;

export const optimizePrompt = async (userInput: string, mode: OptimizationMode): Promise<OptimizedPromptResponse> => {
  // Acceso directo a la variable inyectada por el entorno
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("La clave de API no está definida. Por favor, asegúrate de haber realizado un 'Redeploy' en Vercel después de configurar las variables de entorno.");
  }

  // Usamos Gemini 3 Pro para máxima calidad en la optimización
  const ai = new GoogleGenAI({ apiKey });
  const isInitial = mode === 'INITIAL';

  const promptBody = isInitial 
    ? `Eres el Ingeniero de Prompts Principal de Esmero. Tu misión es transformar la siguiente consulta en una instrucción técnica infalible usando el PROTOCOLO DE CERO ERRORES.
      
      CONSULTA DEL USUARIO: "${userInput}"
      
      INSTRUCCIONES:
      1. Integra la consulta en este esquema: ${INITIAL_PROMPT_TEMPLATE}
      2. Asegúrate de que el prompt resultante obligue a la IA a usar Python.
      3. Elige el MODO_VARIABLE basado en si el usuario quiere "DATO EXACTO" o "ANÁLISIS".
      
      Responde EXCLUSIVAMENTE en formato JSON con la estructura:
      { "optimizedPrompt": "...", "suggestedMode": "...", "reasoning": "..." }`
    : `Eres un experto en refinamiento de consultas. Toma esta pregunta de seguimiento: "${userInput}" y hazla técnica, clara y orientada a resultados empresariales para Esmero. No repitas el protocolo inicial, solo mejora la pregunta.
    
      Responde EXCLUSIVAMENTE en formato JSON con la estructura:
      { "optimizedPrompt": "...", "suggestedMode": "...", "reasoning": "..." }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: promptBody,
      config: {
        thinkingConfig: { thinkingBudget: 10000 },
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
    console.error("Error detallado de Gemini:", error);
    throw new Error(error.message || "Error inesperado al conectar con Gemini");
  }
};
