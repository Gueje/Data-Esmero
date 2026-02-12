
export type OptimizationMode = 'INITIAL' | 'FOLLOWUP';

export interface OptimizedPromptResponse {
  optimizedPrompt: string;
  suggestedMode: 'DATO EXACTO' | 'ANÁLISIS';
  reasoning: string;
}
