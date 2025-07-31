
import type { Ensayo, Registro, RecentActivity } from "@/context/data-context";

// This part simulates a database or server-side data source.
export const initialEnsayos: Ensayo[] = [
  { id: "MP-001", tipo: "Materia Prima", analista: "Jesus Diaz", fecha: "2024-07-22", estado: "Aprobado", producto: "Tuberia PEAD 20 mm PN10" },
  { id: "HDPE-0821-A", tipo: "Tubería HDPE", analista: "Maximiliano Miranda", fecha: "2024-07-21", estado: "En Progreso", producto: "Tuberia PEAD 90 mm PN10" },
  { id: "PP-559", tipo: "Tubería PP", analista: "Antonia Figueroa", fecha: "2024-07-21", estado: "Rechazado", producto: "Tuberia FASER BETA-FIBRA 25 mm PN20" },
  { id: "REPRO-034", tipo: "Reprocesado", analista: "Robinson Córdova", fecha: "2024-07-20", estado: "Pendiente de Revisión", producto: "Tuberia PP-R 20 mm PN20" },
  { id: "ACC-012", tipo: "Control de Accesorios", analista: "Bryan Vásquez", fecha: "2024-07-19", estado: "Aprobado", producto: "Tuberia PEAD 63 mm PN10" },
];

export const initialRegistros: Registro[] = [
  { id: "REG-001", fecha: "2024-07-25", hora: "10:30", inspector: "Elias Ibañez", maquina: "Máquina 5", producto: "Tuberia PEAD 90 mm PN10", resultado: "Conforme", enviado_lab: true },
  { id: "REG-002", fecha: "2024-07-25", hora: "11:15", inspector: "Cristian Montellano", maquina: "Máquina 2", producto: "Tuberia FASER BETA-FIBRA 25 mm PN20", resultado: "No Conforme", enviado_lab: true, },
  { id: "REG-003", fecha: "2024-07-24", hora: "14:00", inspector: "Daniel Palma", maquina: "PE1", producto: "Tuberia PEAD 20 mm PN10", resultado: "Conforme", enviado_lab: false, },
  { id: "REG-004", fecha: "2024-07-24", hora: "16:45", inspector: "Luis Parada", maquina: "Máquina 9", producto: "Tuberia PP-R 20 mm PN20", resultado: "Conforme", enviado_lab: true, },
];

export const initialRecentActivity: RecentActivity[] = [
    { id: "act-1", user: "Jesus Diaz", action: "completó análisis para Muestra #HDPE-0821.", timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
    { id: "act-2", user: "Antonia Figueroa", action: "registró nuevo lote de accesorios PP-R Fusión Socket.", timestamp: new Date(Date.now() - 24 * 60 * 1000).toISOString() },
    { id: "act-3", user: "Sistema", action: "Calibración de equipo GC-MS 01 vence en 10 días.", timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
    { id: "act-4", user: "Maximiliano Miranda", action: "aprobó el informe de la muestra #MP-001.", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { id: "act-5", user: "Elias Ibañez", action: "registró un nuevo control para Tuberia FASER AQUA-FIBRA 32 mm PN20.", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
];

// Server-side action to get data. In a real app, this would fetch from a database.
export async function getEnsayos() {
  // In a real app, you would fetch this from a database
  return initialEnsayos;
}

export async function getRecentActivity() {
  // In a real app, you would fetch this from a database
  return initialRecentActivity;
}

export async function getAnalystOptions() {
  // In a real app, you would fetch this from a database
  const analystSet = new Set(initialEnsayos.map(e => e.analista));
  return [{ value: "all", label: "Todos los Analistas" }, ...Array.from(analystSet).map(a => ({ value: a, label: a }))];
}
