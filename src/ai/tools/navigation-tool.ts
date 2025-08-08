
'use server';
/**
 * @fileOverview A Genkit tool for navigating within the application.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// The validation enum is now defined directly in the flow that uses it (soporte-laboratorio.ts)
// to avoid exporting non-async functions from a 'use server' file.

export const navigateTool = ai.defineTool(
  {
    name: 'navigate',
    description: 'Navega a una página específica dentro de la aplicación. Utiliza esta herramienta cuando el usuario pida ir a una sección o ver una página.',
    inputSchema: z.object({
      path: z.string().describe("La ruta a la que se debe navegar. Por ejemplo, '/dashboard' para el panel principal."),
    }),
    outputSchema: z.string(),
  },
  async ({ path }) => {
    // This function doesn't actually perform the navigation.
    // It returns the path, and the client-side code will handle the redirection.
    return path;
  }
);
