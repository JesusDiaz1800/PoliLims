
'use server';
/**
 * @fileOverview An AI flow for generating professional email summaries for lab reports.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EmailContentInputSchema = z.object({
  reportType: z.string().describe("El tipo de informe, por ejemplo: 'Materia Prima' o 'Tubería HDPE'."),
  material: z.string().describe("El material analizado, por ejemplo: 'Polietileno de Alta Densidad'."),
  product: z.string().describe("El nombre específico del producto o material, por ejemplo: 'HE3490LS'."),
  lots: z.array(z.string()).describe("Una lista de los números de lote incluidos en el informe."),
  averageResults: z.array(z.object({
    parameter: z.string().describe("El nombre del parámetro medido, por ejemplo: 'Melt Index'."),
    value: z.string().describe("El valor promedio del resultado para ese parámetro."),
  })).describe("Una lista de los resultados promedio de los ensayos.")
});
export type EmailContentInput = z.infer<typeof EmailContentInputSchema>;

const EmailContentOutputSchema = z.object({
  subject: z.string().describe("El asunto del correo electrónico, conciso y profesional."),
  body: z.string().describe("El cuerpo del correo electrónico en formato HTML. Debe ser profesional, claro y bien formateado."),
});
export type EmailContentOutput = z.infer<typeof EmailContentOutputSchema>;

// Mapeo de claves de parámetros a nombres legibles en español
const parameterNameMapping: { [key: string]: string } = {
  meltIndexCalculado: 'Melt Index',
  densidadCalculada: 'Densidad',
  dsc_punto_fusion: 'DSC',
  negroHumoCalculado: '% Negro de Humo',
  tio_tiempo: 'TIO',
  cenizasCalculado: '% de Cenizas',
  fvTotalPorcentaje: '% de Fibra de Vidrio (Total)',
  fvIntermediaPorcentaje: '% de Fibra de Vidrio (Capa Intermedia)',
  meltIndexVariacion: '% Var. MI'
};

const unitMapping: { [key: string]: string } = {
  meltIndexCalculado: 'g/10min',
  densidadCalculada: 'g/cm³',
  dsc_punto_fusion: '°C',
  negroHumoCalculado: '%',
  tio_tiempo: 'min',
  cenizasCalculado: '%',
  fvTotalPorcentaje: '%',
  fvIntermediaPorcentaje: '%',
  meltIndexVariacion: '%'
}

// Helper para formatear los resultados
const formatResultsForPrompt = (results: EmailContentInput['averageResults']) => {
  return results
    .map(res => {
        const readableName = parameterNameMapping[res.parameter] || res.parameter;
        const unit = unitMapping[res.parameter] || '';
        const formattedValue = parseFloat(res.value).toFixed(2);
        if (readableName && !isNaN(parseFloat(formattedValue))) {
            return `- ${readableName}: ${formattedValue} ${unit}`;
        }
        return null;
    })
    .filter(Boolean)
    .join('\n');
};

const emailPrompt = ai.definePrompt({
  name: 'emailReportPrompt',
  input: { schema: EmailContentInputSchema },
  output: { schema: EmailContentOutputSchema },
  prompt: `
    Eres un asistente de redacción para un laboratorio de control de calidad en una empresa llamada "Polifusión S.A.".
    Tu tarea es redactar un correo electrónico profesional y formal en español para comunicar los resultados de un informe de laboratorio.

    **Instrucciones:**
    1.  **Asunto:** Crea un asunto claro y conciso. Debe incluir el tipo de informe y los lotes. Por ejemplo: "Informe de Resultados: {reportType} - Lote(s): {lots}".
    2.  **Cuerpo del Correo (HTML):**
        *   Empieza con un saludo formal: "Estimados,".
        *   El primer párrafo debe indicar claramente de qué trata el correo, mencionando el tipo de informe, el material/producto y los lotes. Resalta estas partes en negrita con la etiqueta <b>.
        *   Presenta los resultados promedio en una lista no ordenada (<ul><li>). Cada ítem de la lista debe tener el nombre del parámetro, dos puntos, y el resultado con su unidad, también en negrita (<b>).
        *   Termina con una despedida formal: "Sin otro particular, se despide atentamente,".
        *   La firma debe ser:
            Maximiliano Miranda Valdés
            <b>Ing. Analista de Control de Calidad</b>
            Polifusión S.A.
        *   Usa saltos de línea (<br>) para separar los párrafos y la firma.

    **Datos para el Correo:**
    -   Tipo de Informe: {{{reportType}}}
    -   Material/Producto: {{{product}}}
    -   Lotes: {{{lots}}}
    -   Resultados Promedio:
        {{formatResultsForPrompt averageResults}}
  `,
  // Register the helper function
  helpers: {
      formatResultsForPrompt
  }
});


export async function generateEmailContent(input: EmailContentInput): Promise<EmailContentOutput> {
  const { output } = await emailPrompt(input);
  return output!;
}
