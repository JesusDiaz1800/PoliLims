
'use server';
/**
 * @fileOverview Flow to generate a professional email summary for lab reports.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const EmailContentInputSchema = z.object({
  Material: z.string().describe("The name of the raw material or product type."),
  Producto: z.string().describe("The specific product name."),
  Lotes: z.string().describe("A comma-separated string of all lot numbers included in the summary."),
  Averages: z.any().describe("An object containing the pre-calculated and formatted averages for all relevant tests. The AI should only mention tests with non-zero values."),
  FilterType: z.string().describe("The category of the report (e.g., 'Materia Prima', 'Reprocesado', 'Tubería HDPE'). This determines the context of the email."),
  Ensayos: z.any().describe("An array of the selected assays. Used for single-item reports like HDPE pipe to extract individual results instead of averages."),
});
type EmailContentInput = z.infer<typeof EmailContentInputSchema>;

const EmailContentOutputSchema = z.object({
  subject: z.string().describe("The subject line for the email."),
  htmlBody: z.string().describe("The full HTML content for the email body."),
});
export type EmailContentOutput = z.infer<typeof EmailContentOutputSchema>;

const emailPrompt = ai.definePrompt({
    name: 'professionalEmailReportGenerator',
    input: { schema: EmailContentInputSchema },
    output: { schema: EmailContentOutputSchema },
    prompt: `
      You are an expert assistant responsible for drafting professional laboratory result summary emails in Spanish for a company named Polifusión S.A.
      Your tone must be formal, concise, and clear.

      **Task:**
      Based on the data provided, generate a compelling subject line and a well-formatted HTML email body.

      **Data Provided:**
      - Report Category: {{{FilterType}}}
      - Material/Product: {{{Material}}}
      - Specific Product Name: {{{Producto}}}
      - Lot(s): {{{Lotes}}}
      - Average Results: {{json Averages}}
      - Individual Assays (if applicable): {{json Ensayos}}

      **Instructions:**

      1.  **Subject Line:**
          - Create a subject line that is informative and easy to track.
          - Example for Materia Prima/Reprocesado: "Informe de Resultados de Laboratorio: {{{FilterType}}} {{{Material}}} - Lotes {{{Lotes}}}"
          - Example for Tubería: "Certificado de Análisis: Tubería {{{Producto}}} - Lote {{{Lotes}}}"

      2.  **HTML Email Body:**
          - The body MUST be valid, clean HTML.
          - Start with a formal greeting ("Estimados,").
          - State the purpose of the email clearly.
          - Present the results in a bulleted list (\`<ul><li>...</li></ul>\`).
          - **CRITICAL:** Only include list items for tests where the average value is greater than zero or is a non-empty string. Do not show parameters with "0.00" or "N/A" values.
          - For each result, bold the value and include its unit (e.g., "El resultado promedio de Melt Index es <b>0.241 g/10min</b>.").
          - For Tubería reports, if normative values are available in the examples, include them in parentheses.
          - Conclude with a professional closing.
          - The signature must always be "Maximiliano Miranda Valdés", followed by his title on the next line.

      **Example Structure:**
      \`\`\`html
      <html>
      <body>
      Estimados,
      <br><br>
      Junto con saludar, adjunto los resultados de laboratorio correspondientes a <b>{{{FilterType}}} de {{{Material}}} ({{{Producto}}})</b>, para los lotes: <b>{{{Lotes}}}</b>.
      <br><br>
      A continuación, el resumen de los resultados promedio:
      <br>
      <ul>
        {{#if Averages.meltIndex}}<li>Melt Index: <b>{{toFixed Averages.meltIndex 3}} [g/10min]</b></li>{{/if}}
        {{#if Averages.densidad}}<li>Densidad: <b>{{toFixed Averages.densidad 3}} [g/cm³]</b></li>{{/if}}
        {{#if Averages.dsc}}<li>DSC: <b>{{toFixed Averages.dsc 2}} [°C]</b></li>{{/if}}
        {{#if Averages.negroHumo}}<li>Negro de Humo: <b>{{toFixed Averages.negroHumo 2}} %</b></li>{{/if}}
        {{#if Averages.tio}}<li>TIO: <b>{{toFixed Averages.tio 2}} min</b></li>{{/if}}
        {{#if Averages.cenizas}}<li>Cenizas: <b>{{toFixed Averages.cenizas 2}} %</b></li>{{/if}}
      </ul>
      <br>
      Sin otro particular, se despide atentamente,
      <br><br>
      Maximiliano Miranda Valdés<br>
      <b>Ing. Analista de Control de Calidad</b><br>
      Polifusión S.A.
      </body>
      </html>
      \`\`\`
      
      **IMPORTANT FOR TUBERIA REPORTS:**
      If 'FilterType' is 'Tubería HDPE' or 'Tubería PP', use the first item from the 'Ensayos' array to get the specific values instead of 'Averages'. Adapt the list of results to match the specific tests for that product type, including normative values as shown in your previous examples.
    `,
});

export async function generateEmailContent(input: EmailContentInput): Promise<EmailContentOutput> {
  const { output } = await emailPrompt(input);
  return output!;
}
