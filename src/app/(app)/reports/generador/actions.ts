
"use server";

import { z } from "zod";
import { generateEmailContent } from "@/ai/flows/email-report-flow";
import type { Ensayo, GeneratedReport } from "@/context/data-context";
import * as dataService from "@/services/data-service";
import { format } from "date-fns";

export interface ReportData {
  lotes: string[];
  material: string;
  producto: string;
  fechaGeneracion: string;
  inspector: string;
  corroborador: string;
  ensayos: Ensayo[];
  promedios: {
    [key: string]: any;
  };
  filterType: string;
}

const formSchema = z.object({
  selectedIds: z.string().transform((str) => JSON.parse(str)),
  filterType: z.string(),
});

type FormState = {
  reportData: ReportData | null;
  emailBody: string | null;
  emailSubject: string | null;
  newReportId?: string;
  error?: string | null;
};

function calculateAverages(ensayos: Ensayo[]) {
  const result: { [key: string]: { sum: number; count: number } } = {};
  
  ensayos.forEach(ensayo => {
    Object.keys(ensayo).forEach(key => {
      const value = ensayo[key];
      if (typeof value === 'number' && !isNaN(value)) {
        if (!result[key]) {
          result[key] = { sum: 0, count: 0 };
        }
        result[key].sum += value;
        result[key].count++;
      }
    });
  });

  const averages: { [key: string]: number } = {};
  Object.keys(result).forEach(key => {
    if (result[key].count > 0) {
      averages[key] = result[key].sum / result[key].count;
    }
  });

  return averages;
}


export async function generateReportAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = formSchema.safeParse({
    selectedIds: formData.get("selectedIds"),
    filterType: formData.get("filterType"),
  });

  if (!parsed.success) {
    return { ...prevState, reportData: null, emailBody: null, emailSubject: null, error: "Datos de formulario inválidos." };
  }
  
  const { selectedIds, filterType } = parsed.data;

  if (!selectedIds || selectedIds.length === 0) {
      return { ...prevState, reportData: null, emailBody: null, emailSubject: null, error: "Debe seleccionar al menos un ensayo para generar el informe." };
  }
  
  const { ensayos } = await dataService.getInitialData();
  const selectedEnsayos = ensayos.filter(e => selectedIds.includes(e.id));
  
  if(selectedEnsayos.length === 0) {
      return { ...prevState, reportData: null, emailBody: null, emailSubject: null, error: "No se encontraron los ensayos seleccionados." };
  }

  const firstEnsayo = selectedEnsayos[0];
  const promedios = calculateAverages(selectedEnsayos);
  
  const reportData: ReportData = {
      lotes: selectedEnsayos.map(e => e.lote || 'N/A'),
      material: firstEnsayo.tipo_material || firstEnsayo.tipo,
      producto: firstEnsayo.producto,
      fechaGeneracion: new Date().toLocaleDateString('es-ES'),
      inspector: firstEnsayo.analista || 'N/A',
      corroborador: "Maximiliano Miranda Valdés",
      ensayos: selectedEnsayos,
      promedios,
      filterType,
  };
  
  const lotesString = reportData.lotes.length > 2 
    ? `${reportData.lotes[0]} al ${reportData.lotes[reportData.lotes.length - 1]}` 
    : reportData.lotes.join(', ');

  const newReport: Omit<GeneratedReport, 'id'> = {
      nombre: `${format(new Date(), 'yyyy-MM-dd')} - ${reportData.producto} - ${lotesString}.pdf`,
      tipo: filterType,
      fecha_creacion: format(new Date(), 'dd-MM-yyyy'),
      ensayoIds: selectedIds,
      path: `/informes/${filterType.toLowerCase().replace(/\s+/g, '-')}/${format(new Date(), 'yyyy-MM-dd')}-${reportData.producto}-${lotesString}.pdf`
  }
  
  const savedReport = await dataService.addGeneratedReport(newReport);
  
  const formattedAverages = {
      meltIndex: promedios.meltIndexCalculado?.toFixed(3) || '0.000',
      densidad: promedios.densidadCalculada?.toFixed(3) || '0.000',
      dsc: promedios.dsc_punto_fusion?.toFixed(2) || '0.00',
      negroHumo: promedios.negroHumoCalculado?.toFixed(2) || '0.00',
      tio: promedios.tio_tiempo?.toFixed(2) || '0.00',
      cenizas: promedios.cenizasCalculado?.toFixed(2) || '0.00',
      // Add other relevant averages here, formatted as strings.
  };

  const emailInput = {
    Material: reportData.material,
    Producto: reportData.producto,
    Lotes: reportData.lotes.join(', '),
    Averages: formattedAverages,
    FilterType: filterType,
    Ensayos: selectedEnsayos,
  };
  
  const emailResult = await generateEmailContent(emailInput);

  return {
      reportData,
      emailBody: emailResult.htmlBody,
      emailSubject: emailResult.subject,
      newReportId: savedReport.id,
      error: null,
  }
}
