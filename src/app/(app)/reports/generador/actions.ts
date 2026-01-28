
"use server";

import { z } from "zod";
import type { Ensayo, GeneratedReport } from "@/context/data-context";
import * as dataService from "@/services/data-service";
import { format, parseISO } from "date-fns";
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
  estadisticas?: {
      [key: string]: {
          promedio: number;
          min: number;
          max: number;
          desvEst: number;
      };
  };
  tendencias?: {
    [key: string]: {
      fecha: string;
      valor: number;
    }[]
  };
  filterType: string;
  selectedParameter?: string;
  parameterLabel?: string;
}

const reportFormSchema = z.object({
  selectedIds: z.string().transform((str) => JSON.parse(str)),
  filterType: z.string(),
});

const certificateFormSchema = z.object({
  producto: z.string().nonempty("Debe seleccionar un producto."),
  parameter: z.string().nonempty("Debe seleccionar un parámetro para analizar."),
});

type FormState = {
  reportData: ReportData | null;
  error?: string | null;
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
  meltIndexVariacion: '% Var. MI',
  resistencia_traccion: 'Resistencia a la Tracción',
  elongacion_rotura: 'Elongación de Ruptura',
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
  meltIndexVariacion: '%',
  resistencia_traccion: 'MPa',
  elongacion_rotura: '%',
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

// --- Report Generation for Multiple Lots ---
export async function generateReportAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = reportFormSchema.safeParse({
    selectedIds: formData.get("selectedIds"),
    filterType: formData.get("filterType"),
  });

  if (!parsed.success) {
    return { reportData: null, error: "Datos de formulario inválidos." };
  }
  
  const { selectedIds, filterType } = parsed.data;

  if (!selectedIds || selectedIds.length === 0) {
      return { reportData: null, error: "Debe seleccionar al menos un ensayo para generar el informe." };
  }
  
  const { ensayos } = await dataService.getInitialData();

  const selectedEnsayos = ensayos
    .filter(e => selectedIds.includes(e.id))
    .sort((a,b) => {
      const fechaA = a.fecha || a.fecha_ingreso || '';
      const fechaB = b.fecha || b.fecha_ingreso || '';
      return parseISO(fechaB.split('-').reverse().join('-')).getTime() - parseISO(fechaA.split('-').reverse().join('-')).getTime();
    });

  if(selectedEnsayos.length === 0) {
      return { reportData: null, error: "No se encontraron los ensayos seleccionados." };
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
    
  return {
      reportData,
      error: null,
  };
}

// --- Certificate Generation for a Single Product ---
function calculateStats(data: number[]) {
    if (data.length === 0) return { promedio: 0, min: 0, max: 0, desvEst: 0 };
    const sum = data.reduce((a, b) => a + b, 0);
    const promedio = sum / data.length;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const squaredDiffs = data.map(val => (val - promedio) ** 2);
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / data.length;
    const desvEst = Math.sqrt(avgSquaredDiff);
    return { promedio, min, max, desvEst };
}

export async function generateProductCertificateAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = certificateFormSchema.safeParse({
    producto: formData.get("producto"),
    parameter: formData.get("parameter"),
  });

  if (!parsed.success) {
    return { reportData: null, error: "Producto o parámetro inválido." };
  }
  
  const { producto, parameter } = parsed.data;
  
  const { ensayos } = await dataService.getInitialData();

  const productEnsayos = ensayos
    .filter(e => e.producto === producto && e[parameter] !== null && e[parameter] !== undefined)
    .sort((a,b) => {
      const fechaA = a.fecha || a.fecha_ingreso || '';
      const fechaB = b.fecha || b.fecha_ingreso || '';
      return parseISO(fechaB.split('-').reverse().join('-')).getTime() - parseISO(fechaA.split('-').reverse().join('-')).getTime();
    });

  if(productEnsayos.length === 0) {
      return { reportData: null, error: `No se encontraron ensayos para el producto: ${producto} con el parámetro seleccionado.` };
  }
  
  const firstEnsayo = productEnsayos[0];
  const promedios = calculateAverages(productEnsayos);

  const estadisticas: ReportData['estadisticas'] = {};
  const tendencias: ReportData['tendencias'] = {};

  const values = productEnsayos.map(e => e[parameter]).filter(v => typeof v === 'number' && !isNaN(v)) as number[];
  if (values.length > 0) {
      estadisticas[parameter] = calculateStats(values);
      tendencias[parameter] = productEnsayos
        .map(e => ({ fecha: e.fecha, valor: e[parameter] }))
        .filter(item => typeof item.valor === 'number')
        .reverse();
  }
  
  const reportData: ReportData = {
      lotes: Array.from(new Set(productEnsayos.map(e => e.lote || 'N/A'))),
      material: firstEnsayo.tipo_material || firstEnsayo.tipo,
      producto: firstEnsayo.producto,
      fechaGeneracion: new Date().toLocaleDateString('es-ES'),
      inspector: 'Sistema',
      corroborador: "Maximiliano Miranda Valdés",
      ensayos: productEnsayos,
      promedios,
      estadisticas,
      tendencias,
      filterType: `Certificado Histórico: ${producto}`,
      selectedParameter: parameter,
      parameterLabel: parameterNameMapping[parameter] || parameter,
  };
    
  return {
      reportData,
      error: null,
  };
}
