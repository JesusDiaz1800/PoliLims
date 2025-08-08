
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
  Averages: z.any().describe("An object containing the pre-calculated and formatted averages for all relevant tests."),
  FilterType: z.string().describe("The type of material being reported (e.g., 'Materia Prima', 'Reprocesado', 'Tubería HDPE')."),
  Ensayos: z.any().describe("An array of the selected assays. Used for single-item reports like HDPE pipe."),
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
      You are an assistant that generates laboratory result summary emails in Spanish.
      Based on the provided data, generate a subject line and an HTML email body.
      The tone must be professional and the format must be precise.

      **Data Provided:**
      - Report Type: {{{FilterType}}}
      - Material: {{{Material}}}
      - Product: {{{Producto}}}
      - Lots: {{{Lotes}}}
      - Averages: {{json Averages}}
      - Individual Assays (for single reports): {{json Ensayos}}

      **Task:**

      1.  **Generate the Subject Line:**
          - For 'Materia Prima' or 'Reprocesado': "Resultados de Laboratorio para {{{FilterType}}} de {{{Material}}} ({{{Producto}}}) Lotes: {{{Lotes}}}"
          - For 'Tubería HDPE' or 'Tubería PP': "Resultados de Laboratorio para Tubería {{{Producto}}} ({{{Lotes}}})"

      2.  **Generate the HTML Email Body:**
          - The body must be valid HTML.
          - The signature must always be "Maximiliano Miranda Valdés".
          - Do not include metrics with a value of "0.00", "0.000", or if they are not present in the Averages/Ensayos object.
          
          **IF FilterType is 'Materia Prima' or 'Reprocesado':**
          "<html><body>Estimados, espero se encuentren bien:<br><br>Les envío los resultados de laboratorio para el/la {{{FilterType}}} de <b>{{{Material}}} ({{{Producto}}})</b>, correspondiente a los lotes: <b>{{{Lotes}}}</b>.<br><br>A continuación, se detallan los resultados promedio:<br><ul>{{#if Averages.meltIndex}}<li>El Melt Index promedio es <b>{{toFixed Averages.meltIndex 3}} [g/10min]</b>.</li>{{/if}}{{#if Averages.densidad}}<li>La densidad promedio es <b>{{toFixed Averages.densidad 3}} [g/cm³]</b>.</li>{{/if}}{{#if Averages.dsc}}<li>El DSC promedio es <b>{{toFixed Averages.dsc 2}} [°C]</b>.</li>{{/if}}{{#if Averages.negroHumo}}<li>El porcentaje de negro de humo promedio es <b>{{toFixed Averages.negroHumo 2}} [%]</b>.</li>{{/if}}{{#if Averages.tio}}<li>El tiempo de inducción a la oxidación promedio es <b>{{toFixed Averages.tio 2}} [min]</b>.</li>{{/if}}{{#if Averages.cenizas}}<li>El porcentaje de cenizas promedio es <b>{{toFixed Averages.cenizas 2}} [%]</b>.</li>{{/if}}</ul><br>Sin otro particular, me despido.<br><br>Maximiliano Miranda Valdés<br><b>Ing. Analista de Control de Calidad</b><br>Polifusion S.A.</body></html>"
          
          **IF FilterType is 'Tubería HDPE':**
          (Use the first assay from the Ensayos array for the values)
          "<html><body>Estimados, espero se encuentren bien:<br><br>Les envío los resultados de laboratorio para la tubería <b>{{{Producto}}}</b>.<br><br>En resumen;<br><ul>{{#with (lookup Ensayos 0)}}{{#if meltIndexVariacion}}<li>La variación del Melt Index es <b>{{toFixed meltIndexVariacion 2}}%</b> (Valor normativo &lt; 30%).</li>{{/if}}{{#if densidadCalculada}}<li>La densidad es <b>{{toFixed densidadCalculada 3}} g/cm³</b> (Valor normativo &gt; 0.955 g/cm³).</li>{{/if}}{{#if negroHumoCalculado}}<li>El porcentaje de negro de humo es <b>{{toFixed negroHumoCalculado 2}}%</b> (Valor normativo entre 2.0 - 3.0%).</li>{{/if}}{{#if dispersion_nh}}<li>El grado de dispersión de negro de humo es <b>{{dispersion_nh}}</b> (Valor normativo &lt; 3.0).</li>{{/if}}{{#if elongacion_rotura}}<li>El porcentaje de elongación al quiebre es <b>{{toFixed elongacion_rotura 2}}%</b> (Valor normativo &gt; 500%).</li>{{/if}}{{#if resistencia_traccion}}<li>La resistencia a la traccion es <b>{{toFixed resistencia_traccion 2}} MPa</b> (Valor normativo &gt; 22 MPa).</li>{{/if}}{{#if limite_fluencia}}<li>El límite de fluencia es <b>{{toFixed limite_fluencia 2}} MPa</b> (Valor normativo &gt; 21 MPa).</li>{{/if}}{{#if tio_tiempo}}<li>El tiempo de inducción a la oxidación es <b>{{toFixed tio_tiempo 2}} min</b> (Valor normativo &gt; 20 min).</li>{{/if}}{{/with}}</ul><br>Sin otro particular, me despido.<br><br>Maximiliano Miranda Valdés<br><b>Ing. Analista de Control de Calidad</b><br>Polifusion S.A.</body></html>"
          
          **IF FilterType is 'Tubería PP':**
          (Use the first assay from the Ensayos array for the values)
          "<html><body>Estimados, espero se encuentren bien:<br><br>Les envío los resultados de laboratorio para la tubería <b>{{{Producto}}}</b>.<br><br>En resumen;<br><ul>{{#with (lookup Ensayos 0)}}{{#if meltIndexVariacion}}<li>La variación del Melt Index es <b>{{toFixed meltIndexVariacion 2}}%</b> (Valor normativo &lt; 30%).</li>{{/if}}{{#if fvTotalPorcentaje}}<li>El contenido de fibra total es <b>{{toFixed fvTotalPorcentaje 2}}%</b> (Valor normativo &gt; 5%).</li>{{/if}}{{#if fvIntermediaPorcentaje}}<li>El contenido de fibra intermedia es <b>{{toFixed fvIntermediaPorcentaje 2}}%</b> (Valor normativo &gt; 15%).</li>{{/if}}{{#if densidadCalculada}}<li>La densidad es <b>{{toFixed densidadCalculada 3}} g/cm³.</b></li>{{/if}}{{/with}}</ul><br>Los valores se encuentran dentro de lo esperado.<br><br>Sin otro particular, me despido.<br><br>Maximiliano Miranda Valdés<br><b>Ing. Analista de Control de Calidad</b><br>Polifusion S.A.</body></html>"
    `,
});

export async function generateEmailContent(input: EmailContentInput): Promise<EmailContentOutput> {
  const { output } = await emailPrompt(input);
  return output!;
}
