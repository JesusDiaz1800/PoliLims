
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
  FilterType: z.string().describe("The type of material being reported (e.g., 'Materia Prima', 'Reprocesado')."),
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
      The tone must be professional and the format must be precise.
      The report type is for: {{{FilterType}}}.

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
          The subject must be: "Resultados de Laboratorio para {{{FilterType}}} de {{{Material}}} ({{{Producto}}}) Lotes: {{{Lotes}}}"

      2.  **Generate the HTML Email Body:**
          The body must follow this HTML structure precisely, substituting the placeholders.
          Ensure all tags are correctly formatted and closed. Do not include metrics with a value of "0.00" or "0.000".

          "<html><body>Estimados, espero se encuentren bien:<br><br>Les envío los resultados de laboratorio para el/la {{{FilterType}}} de <b>{{{Material}}} ({{{Producto}}})</b>, correspondiente a los lotes: <b>{{{Lotes}}}</b>.<br><br>A continuación, se detallan los resultados promedio:<br><ul>{{#if (ne Averages.melt_index "0.000")}}<li>El Melt Index promedio es <b>{{{Averages.melt_index}}} [g/10min]</b>.</li>{{/if}}{{#if (ne Averages.densidad "0.000")}}<li>La densidad promedio es <b>{{{Averages.densidad}}} [g/cm³]</b>.</li>{{/if}}{{#if (ne Averages.dsc "0.00")}}<li>El DSC promedio es <b>{{{Averages.dsc}}} [°C]</b>.</li>{{/if}}{{#if (ne Averages.negro_humo "0.00")}}<li>El porcentaje de negro de humo promedio es <b>{{{Averages.negro_humo}}} [%]</b>.</li>{{/if}}{{#if (ne Averages.tio "0.00")}}<li>El tiempo de inducción a la oxidación promedio es <b>{{{Averages.tio}}} [min]</b>.</li>{{/if}}{{#if (ne Averages.cenizas "0.00")}}<li>El porcentaje de cenizas promedio es <b>{{{Averages.cenizas}}} [%]</b>.</li>{{/if}}</ul><br>Sin otro particular, me despido.<br><br>Maximiliano Miranda Valdés<br><b>Ing. Analista de Control de Calidad</b><br>Polifusion S.A.</body></html>"
    `,
});

export async function generateEmailContent(input: EmailContentInput): Promise<EmailContentOutput> {
  const { output } = await emailPrompt(input);
  return output!;
}
