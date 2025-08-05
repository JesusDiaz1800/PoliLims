
'use server';
/**
 * @fileOverview A Genkit tool for navigating within the application.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Defines all the valid routes the AI can navigate to.
// This prevents hallucinations and ensures the AI only navigates to existing pages.
const availableRoutes = z.enum([
    '/dashboard',
    '/ensayos/control-rutinario',
    '/ensayos/tuberias/hdpe',
    '/ensayos/tuberias/pp',
    '/ensayos/materia-prima',
    '/ensayos/reprocesado',
    '/ensayos/seguimiento',
    '/equipos',
    '/equipos/control',
    '/equipos/programa',
    '/no-conformidades',
    '/importaciones',
    '/reports',
    '/biblioteca/documentos',
    '/biblioteca/upload',
    '/administracion/usuarios',
    '/administracion/configuracion',
]);

export const navigateTool = ai.defineTool(
  {
    name: 'navigate',
    description: 'Navega a una página específica dentro de la aplicación. Utiliza esta herramienta cuando el usuario pida ir a una sección o ver una página.',
    inputSchema: z.object({
      path: availableRoutes.describe("La ruta a la que se debe navegar. Por ejemplo, '/dashboard' para el panel principal."),
    }),
    outputSchema: z.string(),
  },
  async ({ path }) => {
    // This function doesn't actually perform the navigation.
    // It returns the path, and the client-side code will handle the redirection.
    return path;
  }
);
