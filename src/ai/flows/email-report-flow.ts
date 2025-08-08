
'use server';
/**
 * @fileOverview Flow to generate an email summary for raw material lab reports.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const EmailContentInputSchema = z.object({
  Material: z.string().describe("The name of the raw material."),
  Producto: z.string().describe("The specific product name."),
  Lotes: z.string().describe("A comma-separated string of all lot numbers included in the summary."),
  Averages: z.object({
    melt_index: z.string().describe("The calculated average for Melt Index, formatted to 3 decimal places."),
    densidad: z.string().describe("The calculated average for Density, formatted to 3 decimal places."),
    dsc: z.string().describe("The calculated average for DSC, formatted to 2 decimal places."),
    negro_humo: z.string().describe("The calculated average for Black Smoke percentage, formatted to 2 decimal places."),
    tio: z.string().describe("The calculated average for TIO, formatted to 2 decimal places."),
    cenizas: z.string().describe("The calculated average for Ash percentage, formatted to 2 decimal places."),
  }).describe("An object containing the pre-calculated and formatted averages for all relevant tests."),
});
type EmailContentInput = z.infer<typeof EmailContentInputSchema>;

const EmailContentOutputSchema = z.object({
  subject: z.string().describe("The subject line for the email."),
  htmlBody: z.string().describe("The full HTML content for the email body."),
});
export type EmailContentOutput = z.infer<typeof EmailContentOutputSchema>;

const emailPrompt = ai.definePrompt({
    name: 'emailReportGeneratorPrompt',
    input: { schema: EmailContentInputSchema },
    output: { schema: EmailContentOutputSchema },
    prompt: `
      You are an assistant that generates laboratory result summary emails.
      Based on the provided data, generate a subject line and an HTML email body.
      Follow the user's structure and tone precisely. Do not add any extra information or formatting.

      **Data Provided:**
      - Material: {{{Material}}}
      - Product: {{{Producto}}}
      - Lots: {{{Lotes}}}
      - Averages:
        - Melt Index: {{{Averages.melt_index}}}
        - Density: {{{Averages.densidad}}}
        - DSC: {{{Averages.dsc}}}
        - Black Smoke: {{{Averages.negro_humo}}}
        - TIO: {{{Averages.tio}}}
        - Ash: {{{Averages.cenizas}}}

      **Task:**

      1.  **Generate the Subject Line:**
          The subject must be exactly: "Resultados de Laboratorio para la Materia Prima de {{{Material}}} ({{{Producto}}}) Lotes: {{{Lotes}}}"

      2.  **Generate the HTML Email Body:**
          The body must be exactly this HTML structure, substituting the placeholders with the provided data:
          "<html><body>Estimados, espero se encuentren bien:<br><br>Les envío los resultados de laboratorio para la materia prima de <b>{{{Material}}} ({{{Producto}}}) Lotes: {{{Lotes}}}</b><br><br><ul><li>El Melt Index promedio es <b>{{{Averages.melt_index}}} [g/10min]</b></li><li>La densidad promedio es <b>{{{Averages.densidad}}} [g/cm³]</b></li><li>El DSC promedio es <b>{{{Averages.dsc}}} [°C]</b></li><li>El porcentaje de negro de humo promedio es <b>{{{Averages.negro_humo}}} [%]</b></li><li>El tiempo de inducción a la oxidación promedio es <b>{{{Averages.tio}}} [min]</b></li><li>El porcentaje de cenizas promedio es <b>{{{Averages.cenizas}}} [%]</b></li></ul><br>Sin otro particular, me despido.<br><br>Maximiliano Miranda Valdés<br><b>Ing. Analista de Control de Calidad</b><br>Polifusion S.A.</body></html>"
    `,
});

export async function generateEmailContent(input: EmailContentInput): Promise<EmailContentOutput> {
  const { output } = await emailPrompt(input);
  return output!;
}
