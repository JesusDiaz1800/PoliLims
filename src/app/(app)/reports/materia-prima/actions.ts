
"use server";

import { z } from "zod";
import { generateEmailContent } from "@/ai/flows/email-report-flow";
import type { Ensayo } from "@/context/data-context";

export type ReportData = {
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
    }
}

export type ReportState = {
  message: string;
  data?: {
    report: ReportData;
    email: {
        subject: string;
        htmlBody: string;
        to: string;
        cc: string;
    }
  } | null;
  error?: string | null;
}

const formSchema = z.object({
  ensayos: z.string().transform((str) => JSON.parse(str)),
});

export async function generateMateriaPrimaReportAction(prevState: ReportState, formData: FormData): Promise<ReportState> {
  const parsed = formSchema.safeParse({
    ensayos: formData.get("ensayos"),
  });

  if (!parsed.success) {
    return { 
      message: "Formulario inválido.",
      error: "Los datos de los ensayos no se enviaron correctamente.",
    };
  }

  const ensayos = parsed.data.ensayos as Ensayo[];

  if (!ensayos || ensayos.length === 0) {
      return { message: "Sin datos", error: "No se seleccionaron ensayos." };
  }

  // 1. Calculate Averages
  const totals = { mi: 0, den: 0, dsc: 0, nh: 0, tio: 0, cen: 0 };
  const counts = { mi: 0, den: 0, dsc: 0, nh: 0, tio: 0, cen: 0 };
  
  ensayos.forEach(e => {
    if (typeof e.meltIndexCalculado === 'number') { totals.mi += e.meltIndexCalculado; counts.mi++; }
    if (typeof e.densidadCalculada === 'number') { totals.den += e.densidadCalculada; counts.den++; }
    if (typeof e.dsc_punto_fusion === 'number') { totals.dsc += e.dsc_punto_fusion; counts.dsc++; }
    if (typeof e.negroHumoCalculado === 'number') { totals.nh += e.negroHumoCalculado; counts.nh++; }
    if (typeof e.tio_tiempo === 'number') { totals.tio += e.tio_tiempo; counts.tio++; }
    if (typeof e.cenizasCalculado === 'number') { totals.cen += e.cenizasCalculado; counts.cen++; }
  });

  const promedios = {
    meltIndex: counts.mi > 0 ? totals.mi / counts.mi : 0,
    densidad: counts.den > 0 ? totals.den / counts.den : 0,
    dsc: counts.dsc > 0 ? totals.dsc / counts.dsc : 0,
    negroHumo: counts.nh > 0 ? totals.nh / counts.nh : 0,
    tio: counts.tio > 0 ? totals.tio / counts.tio : 0,
    cenizas: counts.cen > 0 ? totals.cen / counts.cen : 0,
  };

  const firstEnsayo = ensayos[0];

  const reportData: ReportData = {
    lotes: ensayos.map(e => e.lote).filter((l): l is string => !!l),
    material: firstEnsayo.tipo_material || 'Materia Prima Genérica',
    producto: firstEnsayo.producto || 'Producto Genérico',
    fechaGeneracion: new Date().toLocaleDateString('es-CL'),
    inspector: firstEnsayo.analista || 'N/A',
    corroborador: "Maximiliano Miranda Valdés",
    ensayos: ensayos,
    promedios: promedios,
  }

  // 2. Call AI Flow for Email Content
  try {
    const emailContent = await generateEmailContent({
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
    });

    return {
        message: 'Success',
        data: {
            report: reportData,
            email: {
                ...emailContent,
                to: "jtapia@polifusion.cl; amendez@polifusion.cl; pestay@polifusion.cl",
                cc: "afigueroa@polifusion.cl; cmunizaga@polifusion.cl; vlutz@polifusion.cl; mgallardo@polifusion.cl; ccalidad4@polifusion.cl; rcruz@polifusion.cl",
            }
        }
    };
  } catch (error) {
      console.error("AI Email Generation Error:", error);
      return { message: "AI Error", error: (error as Error).message };
  }
}
