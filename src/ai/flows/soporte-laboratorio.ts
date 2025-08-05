
'use server';
/**
 * @fileOverview A unified AI assistant for laboratory support, capable of answering questions using RAG and providing troubleshooting steps.
 *
 * - soporteLaboratorio - A function that handles user queries for the lab.
 * - SoporteInput - The input type for the soporteLaboratorio function.
 * - SoporteOutput - The return type for the soporteLaboratorio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as fs from 'fs/promises';
import * as path from 'path';
import { navigateTool } from '../tools/navigation-tool';

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


const SoporteInputSchema = z.object({
  history: z.array(z.object({
    role: z.string(),
    content: z.string(),
  })).describe("The conversation history."),
  prompt: z.string().describe("The user's latest question or problem description."),
});
export type SoporteInput = z.infer<typeof SoporteInputSchema>;

const SoporteOutputSchema = z.object({
  response: z.string().describe('The generated answer or troubleshooting steps.'),
  navigation: z.string().nullable().describe('The path to navigate to, if requested.').optional(),
});
export type SoporteOutput = z.infer<typeof SoporteOutputSchema>;

export async function soporteLaboratorio(input: SoporteInput): Promise<SoporteOutput> {
  return soporteLaboratorioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'soporteLaboratorioPrompt',
  input: {schema: z.object({
      history: SoporteInputSchema.shape.history,
      prompt: SoporteInputSchema.shape.prompt,
      knowledgeBase: z.string(),
  })},
  output: {schema: SoporteOutputSchema},
  tools: [navigateTool],
  prompt: `Eres un asistente experto para el laboratorio de calidad de Polifusión S.A. Tu objetivo es responder las preguntas, solucionar problemas y ayudar a navegar la aplicación para el personal del laboratorio. Debes ser siempre preciso y hablar en español.

Primero, determina la intención del usuario a partir de su último mensaje:
1.  **Navegación:** Si el usuario pide ir a una sección, página o vista (ej: "llévame a...", "muéstrame los ensayos", "quiero ver el dashboard").
2.  **Pregunta sobre procedimiento o conocimiento:** Si el usuario hace una pregunta (ej: "¿cómo se hace...?", "¿cuál es la temperatura para...?").
3.  **Descripción de un problema:** Si el usuario describe un error, un fallo o un problema (ej: "el equipo no enciende", "los resultados son inconsistentes").

**SI LA INTENCIÓN ES NAVEGAR:**
- Utiliza la herramienta 'navigateTool' para redirigir al usuario.
- Confirma la acción con un mensaje corto, por ejemplo: "Claro, llevándote a la sección de Control Rutinario."
- NO incluyas ninguna otra información en tu respuesta, solo la confirmación.

**SI LA INTENCIÓN ES UNA PREGUNTA sobre un procedimiento, conocimiento o norma:**
Tu única misión es proporcionar la mejor respuesta posible. Para ello, debes basar tu respuesta en el siguiente orden de prioridad de fuentes de información:
1.  **Base de Conocimiento Interna (tus documentos):** Busca primero en la información proporcionada en la sección "Base de Conocimiento". Si encuentras la respuesta aquí, cítala (ej: "Según el documento X...").
2.  **Normas Técnicas (ISO, ASTM, NCh):** Si la información no está en los documentos, utiliza tu conocimiento experto sobre normas técnicas de plásticos para responder, citando la norma específica (ej: "De acuerdo a la norma ASTM D638...").
3.  **Conocimiento General:** Si ninguna de las fuentes anteriores tiene la respuesta, usa tu conocimiento general para dar la mejor respuesta posible.

**REGLAS CRÍTICAS PARA PREGUNTAS (OBLIGATORIO):**
- **BAJO NINGUNA CIRCUNSTANCIA respondas diciendo que no sabes o que no tienes la información.**
- **JAMÁS le digas al usuario que busque en internet o que consulte una norma. TU trabajo es consultar esa información y dar la respuesta.**
- **SIEMPRE debes intentar dar una respuesta útil, incluso si tienes que basarte en conocimiento general.** Sé directo, profesional y cita tu fuente si es posible.

**SI LA INTENCIÓN ES RESOLVER UN PROBLEMA:**
Tu misión es analizar el error y el contexto proporcionado y darle una guía clara y accionable.
1.  **Identifica el Problema:** Basado en la descripción, describe cuál crees que es la causa raíz más probable.
2.  **Sugiere Soluciones:** Proporciona una lista de pasos (numerada o con viñetas) que el analista puede seguir para intentar solucionar el problema. Empieza por las soluciones más simples.
3.  **Cita Documentación Relevante:** Si la solución está en la base de conocimiento, menciona el nombre del documento (ej: "Ver PNT-001.txt, sección 5.2").

**INFORMACIÓN DISPONIBLE:**

Base de Conocimiento (Documentos del Laboratorio):
{{{knowledgeBase}}}

Historial de la Conversación:
{{#each history}}
- **{{role}}**: {{content}}
{{/each}}

MENSAJE ACTUAL DEL USUARIO:
"{{{prompt}}}"
  `,
});

const soporteLaboratorioFlow = ai.defineFlow(
  {
    name: 'soporteLaboratorioFlow',
    inputSchema: SoporteInputSchema,
    outputSchema: SoporteOutputSchema,
  },
  async ({ history, prompt: userPrompt }) => {
    
    const knowledgeBase = await getKnowledgeBaseContent();

    const result = await prompt({
        history,
        prompt: userPrompt,
        knowledgeBase,
    });

    const toolRequest = result.toolRequest;
    
    if (toolRequest?.toolResponse && toolRequest.toolResponse.name === 'navigate' && toolRequest.toolResponse.output) {
      return {
        response: result.output?.response || "Navegando...",
        navigation: toolRequest.toolResponse.output as string
      };
    }
    
    return {
      response: result.output!.response,
      navigation: result.output!.navigation || undefined,
    };
  }
);
