
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
    meltIndex: number;
    densidad: number;
    dsc: number;
    negroHumo: number;
    tio: number;
    cenizas: number;
  };
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
  const result = {
    meltIndex: 0,
    densidad: 0,
    dsc: 0,
    negroHumo: 0,
    tio: 0,
    cenizas: 0,
  };
  
  const validEnsayos = {
    meltIndex: ensayos.filter(e => e.meltIndexCalculado !== null && e.meltIndexCalculado !== undefined && !isNaN(Number(e.meltIndexCalculado))),
    densidad: ensayos.filter(e => e.densidadCalculada !== null && e.densidadCalculada !== undefined && !isNaN(Number(e.densidadCalculada))),
    dsc: ensayos.filter(e => e.dsc_punto_fusion !== null && e.dsc_punto_fusion !== undefined && !isNaN(Number(e.dsc_punto_fusion))),
    negroHumo: ensayos.filter(e => e.negroHumoCalculado !== null && e.negroHumoCalculado !== undefined && !isNaN(Number(e.negroHumoCalculado))),
    tio: ensayos.filter(e => e.tio_tiempo !== null && e.tio_tiempo !== undefined && !isNaN(Number(e.tio_tiempo))),
    cenizas: ensayos.filter(e => e.cenizasCalculado !== null && e.cenizasCalculado !== undefined && !isNaN(Number(e.cenizasCalculado))),
  }

  if (validEnsayos.meltIndex.length > 0) {
    result.meltIndex = validEnsayos.meltIndex.reduce((sum, e) => sum + Number(e.meltIndexCalculado), 0) / validEnsayos.meltIndex.length;
  }
  if (validEnsayos.densidad.length > 0) {
    result.densidad = validEnsayos.densidad.reduce((sum, e) => sum + Number(e.densidadCalculada), 0) / validEnsayos.densidad.length;
  }
  if (validEnsayos.dsc.length > 0) {
      result.dsc = validEnsayos.dsc.reduce((sum, e) => sum + Number(e.dsc_punto_fusion), 0) / validEnsayos.dsc.length;
  }
  if (validEnsayos.negroHumo.length > 0) {
      result.negroHumo = validEnsayos.negroHumo.reduce((sum, e) => sum + Number(e.negroHumoCalculado), 0) / validEnsayos.negroHumo.length;
  }
   if (validEnsayos.tio.length > 0) {
      result.tio = validEnsayos.tio.reduce((sum, e) => sum + Number(e.tio_tiempo), 0) / validEnsayos.tio.length;
  }
  if (validEnsayos.cenizas.length > 0) {
      result.cenizas = validEnsayos.cenizas.reduce((sum, e) => sum + Number(e.cenizasCalculado), 0) / validEnsayos.cenizas.length;
  }

  return result;
}

export async function generateMateriaPrimaReportAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = formSchema.safeParse({
    selectedIds: formData.get("selectedIds"),
    filterType: formData.get("filterType"),
  });

  if (!parsed.success) {
    return { ...prevState, reportData: null, emailBody: null, emailSubject: null, error: "Invalid form data." };
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

  try {
      const emailInput = {
        Material: reportData.material,
        Producto: reportData.producto,
        Lotes: reportData.lotes.join(', '),
        Averages: {
          melt_index: promedios.meltIndex.toFixed(3),
          densidad: promedios.densidad.toFixed(3),
          dsc: promedios.dsc.toFixed(2),
          negro_humo: promedios.negroHumo.toFixed(2),
          tio: promedios.tio.toFixed(2),
          cenizas: promedios.cenizas.toFixed(2),
        }
    };
    const emailResult = await generateEmailContent(emailInput);

    return {
        reportData,
        emailBody: emailResult.htmlBody,
        emailSubject: emailResult.subject,
        newReportId: savedReport.id,
        error: null,
    }

  } catch(error) {
      console.error("Error generating email:", error);
      return { ...prevState, reportData, error: "Error al generar el correo. El informe se ha creado, pero no se pudo preparar el email."}
  }
}
