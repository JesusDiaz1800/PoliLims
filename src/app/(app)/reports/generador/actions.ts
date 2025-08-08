
"use server";

import { z } from "zod";
import type { Ensayo, GeneratedReport } from "@/context/data-context";
import * as dataService from "@/services/data-service";
import { format } from "date-fns";
import { getMatrizProductos } from "@/lib/matriz-datos";

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
  emailError?: string | null;
};

// --- Mapeos para los nombres de parámetros y unidades ---
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
};

// --- Función para generar correo desde una plantilla de texto plano ---
function generateEmailFromTemplate(data: ReportData) {
    const lotesStr = data.lotes.join(', ');
    
    const resultsText = Object.entries(data.promedios)
        .map(([key, value]) => {
            const name = parameterNameMapping[key] || key;
            const unit = unitMapping[key] || '';
            const formattedValue = parseFloat(value).toFixed(2);
            // Solo incluir resultados que tienen un nombre legible y un valor numérico válido
            if (name && !isNaN(parseFloat(formattedValue))) {
                return `- ${name}: ${formattedValue} ${unit}`;
            }
            return null;
        })
        .filter(Boolean) // Eliminar entradas nulas
        .join('\n');

    const subject = `Informe de Resultados: ${data.filterType} - Lote(s): ${lotesStr}`;

    const body = `Estimados,

Junto con saludar, se adjuntan los resultados de laboratorio correspondientes a ${data.filterType.toUpperCase()} de ${data.producto}, para el/los lote(s): ${lotesStr}.

A continuación, el resumen de los resultados promedio:
${resultsText}

Sin otro particular, se despide atentamente,

Maximiliano Miranda Valdés
Ing. Analista de Control de Calidad
Polifusión S.A.
`;

    return { subject, body };
}


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
  const matriz = await getMatrizProductos();

  const selectedEnsayos = ensayos
    .filter(e => selectedIds.includes(e.id))
    .map(e => ({
        ...e,
        productoInfo: matriz.find(p => p.producto === e.producto)
    }));

  if(selectedEnsayos.length === 0) {
      return { ...prevState, reportData: null, emailBody: null, emailSubject: null, error: "No se encontraron los ensayos seleccionados." };
  }

  const firstEnsayo = selectedEnsayos[0];
  const promedios = calculateAverages(selectedEnsayos);
  
  const reportData: ReportData = {
      lotes: Array.from(new Set(selectedEnsayos.map(e => e.lote || 'N/A'))),
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
  
  // Generar correo usando la plantilla local
  const { subject, body } = generateEmailFromTemplate(reportData);
    
  return {
      reportData,
      emailBody: body,
      emailSubject: subject,
      newReportId: savedReport.id,
      error: null,
      emailError: null,
  };
}

