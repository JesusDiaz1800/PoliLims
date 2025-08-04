
'use server';
/**
 * @fileOverview An AI assistant for troubleshooting laboratory issues.
 *
 * - troubleshootingAssistant - A function that analyzes errors and suggests solutions.
 * - TroubleshootingInput - The input type for the troubleshootingAssistant function.
 * - TroubleshootingOutput - The return type for the troubleshootingAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as fs from 'fs/promises';
import * as path from 'path';

// Helper function to read all documents from the data directory
async function getKnowledgeBaseContent(): Promise<string> {
    const dataDirectory = path.join(process.cwd(), 'public', 'data');
    let knowledgeBase = '';
    try {
        const files = await fs.readdir(dataDirectory);
        for (const file of files) {
            if (file.endsWith('.txt')) {
                const filePath = path.join(dataDirectory, file);
                const content = await fs.readFile(filePath, 'utf-8');
                knowledgeBase += `--- INICIO DEL DOCUMENTO: ${file} ---\n\n${content}\n\n--- FIN DEL DOCUMENTO: ${file} ---\n\n`;
            }
        }
        return knowledgeBase;
    } catch (error) {
        console.error('Failed to read knowledge base:', error);
        return 'Error: No se pudo cargar la base de conocimiento.';
    }
}

const TroubleshootingInputSchema = z.object({
  errorMessage: z.string().describe("The error message reported by the equipment or system."),
  usagePatterns: z.string().describe("A description of what the user was doing when the error occurred."),
});
export type TroubleshootingInput = z.infer<typeof TroubleshootingInputSchema>;

const TroubleshootingOutputSchema = z.object({
  problemIdentification: z.string().describe("A clear and concise identification of the most likely root cause of the problem."),
  suggestedSolutions: z.string().describe("A step-by-step list of suggested solutions to resolve the issue. Should be formatted as a numbered or bulleted list."),
  relevantDocumentation: z.string().describe("The name of the relevant document(s) from the knowledge base that could help the user, if any."),
});
export type TroubleshootingOutput = z.infer<typeof TroubleshootingOutputSchema>;

export async function troubleshootingAssistant(input: TroubleshootingInput): Promise<TroubleshootingOutput> {
  return troubleshootingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'troubleshootingPrompt',
  input: {schema: TroubleshootingInputSchema},
  output: {schema: TroubleshootingOutputSchema},
  prompt: `Eres un experto en solución de problemas para equipos y procedimientos en un laboratorio de control de calidad de plásticos. Tu misión es analizar el error y el contexto proporcionado por un analista y darle una guía clara y accionable.

  **Contexto del Problema:**
  - **Mensaje de Error:** {{{errorMessage}}}
  - **Descripción del Usuario (qué estaba haciendo):** {{{usagePatterns}}}

  **Base de Conocimiento (Manuales, PNTs, etc.):**
  {{{knowledgeBase}}}

  **Tu Tarea:**
  1.  **Identifica el Problema:** Basado en el error y el contexto, describe cuál crees que es la causa raíz más probable del problema. Sé claro y directo.
  2.  **Sugiere Soluciones:** Proporciona una lista de pasos (numerada o con viñetas) que el analista puede seguir para intentar solucionar el problema. Empieza por las soluciones más simples.
  3.  **Cita Documentación Relevante:** Si la solución está en la base de conocimiento, menciona el nombre del documento (ej: "Ver PNT-001.txt, sección 5.2"). Si no hay un documento específico, indica que no se encontró documentación aplicable.
  
  Responde siempre en español.`,
});

const troubleshootingFlow = ai.defineFlow(
  {
    name: 'troubleshootingFlow',
    inputSchema: TroubleshootingInputSchema,
    outputSchema: TroubleshootingOutputSchema,
  },
  async (input) => {
    const knowledgeBase = await getKnowledgeBaseContent();
    
    const {output} = await prompt({
      ...input,
      context: {
          knowledgeBase
      }
    });

    return output!;
  }
);
