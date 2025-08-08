

import type { Ensayo, Registro, RecentActivity, Equipo, ControlEvento, NoConformidad, Importacion, GeneratedReport } from "@/context/data-context";
import { isPast, parse } from 'date-fns';


// --- DEMO DATA ---
const demoRegistros: Registro[] = [
    { id: 'CTRL-001', fecha: '20-07-2025', hora: '10:30', inspector: 'Elias Ibañez', maquinista: 'ANDRÉS REYES', maquina: 'PE1', producto: 'Tubería HDPE 90mm PN-16 SDR-11', marca: 'POLIFUSIÓN S.A.', diametro: 90.1, espesor_min: 8.2, espesor_max: 8.3, largo: 1000, peso_muestra: 2200, peso_kg_m: 2.2, ovalidad: 0.5, observaciones_visuales: 'Sin observaciones', color_tuberia: 'Negro', color_linea: 'Azul', resultado: 'Conforme', enviado_lab: true },
    { id: 'CTRL-002', fecha: '20-07-2025', hora: '11:15', inspector: 'Cristian Montellano', maquinista: 'ALEXIS SANDOVAL', maquina: 'PE2', producto: 'Tubería HDPE 110mm PN-10 SDR-17', marca: 'POLIFUSIÓN S.A.', diametro: 110.2, espesor_min: 6.5, espesor_max: 6.6, largo: 1000, peso_muestra: 2100, peso_kg_m: 2.1, ovalidad: 0.6, observaciones_visuales: '', color_tuberia: 'Negro', color_linea: 'Azul', resultado: 'Conforme', enviado_lab: true },
    { id: 'CTRL-003', fecha: '19-07-2025', hora: '14:00', inspector: 'Daniel Palma', maquinista: 'CARLOS DOMÍNGUEZ', maquina: 'PP3', producto: 'Tubería PP-R 25mm PN-20', marca: 'SMART PIPES SpA', diametro: 25.3, espesor_min: 4.2, espesor_max: 4.3, largo: 1000, peso_muestra: 300, peso_kg_m: 0.3, ovalidad: 0.2, observaciones_visuales: 'Superficie ligeramente rugosa', color_tuberia: 'Verde', color_linea: 'Roja', resultado: 'No Conforme', enviado_lab: false },
    { id: 'CTRL-004', fecha: '19-07-2025', hora: '09:05', inspector: 'Luis Parada', maquinista: 'CRISTIAN DUQUE', maquina: 'PE3', producto: 'Tubería HDPE 63mm PN-16 SDR-11', marca: 'POLIFUSIÓN S.A.', diametro: 63.1, espesor_min: 5.8, espesor_max: 5.9, largo: 1000, peso_muestra: 1100, peso_kg_m: 1.1, ovalidad: 0.4, observaciones_visuales: '', color_tuberia: 'Negro', color_linea: 'Azul', resultado: 'Conforme', enviado_lab: true },
];

const demoEnsayos = [
    // --- July 2025 Data ---
    { id: 'LAB-07-01', id_muestra: 'CTRL-001', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '23-07-2025', estado: 'Pendiente de Revisión' as const, producto: 'Tubería HDPE 90mm', lote: 'Lote-250722-PE1', meltIndexCalculado: null, meltIndexVariacion: null, densidadCalculada: null, negroHumoCalculado: null, fecha_ingreso: '22-07-2025', hora: '15:00', inspector: 'Luis Parada', maquina: 'PE1' },
    { id: 'LAB-07-02', tipo: 'Tubería PP', analista: 'Antonia Figueroa', fecha: '23-07-2025', estado: 'En Análisis' as const, producto: 'Tubería PP-R 50mm', lote: 'Lote-250722-PP2', meltIndexCalculado: 0.28, meltIndexVariacion: 1.5, densidadCalculada: 0.905, negroHumoCalculado: null, fecha_ingreso: '22-07-2025', hora: '13:20', inspector: 'Cristian Montellano', maquina: 'PP2' },
    { id: 'LAB-07-03', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '23-07-2025', estado: 'Aprobado' as const, producto: 'HE3490LS', lote: '1325115', proveedor: 'BOREALIS CO.', orden_compra: '170708', melt_index_reportado: '0.2308', meltIndexCalculado: 0.241, meltIndexVariacion: 4.42, densidad_liquido: '0.959', densidadCalculada: 0.959, negroHumoCalculado: 2.25 },
    { id: 'LAB-07-04', tipo: 'Reprocesado', analista: 'Robinson Córdova', fecha: '22-07-2025', estado: 'En Progreso' as const, producto: 'Reprocesado Lote RP-0720', lote: 'RP-0720', meltIndexCalculado: 0.29, meltIndexVariacion: 3.2, densidadCalculada: 0.955, negroHumoCalculado: 2.3 },
    { id: 'LAB-07-05', id_muestra: 'CTRL-002', tipo: 'Tubería HDPE', analista: 'Bryan Vásquez', fecha: '22-07-2025', estado: 'Aprobado' as const, producto: 'Tubería HDPE 110mm', lote: 'Lote-250719-PE2', meltIndexCalculado: 0.25, meltIndexVariacion: 2.0, densidadCalculada: 0.960, negroHumoCalculado: 2.15, fecha_ingreso: '19-07-2025', hora: '11:15', inspector: 'Cristian Montellano', maquina: 'PE2' },
    { id: 'LAB-07-06', tipo: 'Tubería PP', analista: 'Jesus Diaz', fecha: '21-07-2025', estado: 'Rechazado' as const, producto: 'Tubería PP-R 25mm', lote: 'Lote-250718-PP3', meltIndexCalculado: 0.35, meltIndexVariacion: 15.3, densidadCalculada: 0.910, negroHumoCalculado: null, fecha_ingreso: '18-07-2025', hora: '14:00', inspector: 'Daniel Palma', maquina: 'PP3' },
    { id: 'LAB-07-07', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '21-07-2025', estado: 'Aprobado' as const, producto: 'R202P', lote: '500312', proveedor: 'AUSTRADE', orden_compra: '170320', melt_index_reportado: '0.2075', meltIndexCalculado: 0.21, meltIndexVariacion: 1.2, densidad_liquido: '0.900', densidadCalculada: 0.901, negroHumoCalculado: null },
    { id: 'LAB-07-08', id_muestra: 'CTRL-004', tipo: 'Tubería HDPE', analista: 'Maximiliano Miranda', fecha: '20-07-2025', estado: 'Aprobado' as const, producto: 'Tubería HDPE 63mm', lote: 'Lote-250715-PE3', meltIndexCalculado: 0.23, meltIndexVariacion: 1.8, densidadCalculada: 0.958, negroHumoCalculado: 2.2, fecha_ingreso: '15-07-2025', hora: '09:05', inspector: 'Luis Parada', maquina: 'PE3' },
    { id: 'LAB-07-09', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '20-07-2025', estado: 'En Análisis' as const, producto: 'Tubería HDPE 200mm', lote: 'Lote-250714-PE4', meltIndexCalculado: 0.26, meltIndexVariacion: 0.5, densidadCalculada: 0.959, negroHumoCalculado: 2.22, fecha_ingreso: '14-07-2025', hora: '10:00', inspector: 'Daniel Palma', maquina: 'PE4' },
    { id: 'LAB-07-10', tipo: 'Reprocesado', analista: 'Robinson Córdova', fecha: '19-07-2025', estado: 'Pendiente de Revisión' as const, producto: 'Reprocesado Lote RP-0712', lote: 'RP-0712', meltIndexCalculado: null, meltIndexVariacion: null, densidadCalculada: null, negroHumoCalculado: null },
    { id: 'LAB-07-11', tipo: 'Tubería PP', analista: 'Bryan Vásquez', fecha: '19-07-2025', estado: 'Aprobado' as const, producto: 'Tubería PP-R 32mm', lote: 'Lote-250710-PP1', meltIndexCalculado: 0.29, meltIndexVariacion: 2.1, densidadCalculada: 0.903, negroHumoCalculado: null, fecha_ingreso: '10-07-2025', hora: '08:45', inspector: 'Elias Ibañez', maquina: 'PP1' },
    { id: 'LAB-07-12', tipo: 'Tubería HDPE', analista: 'Antonia Figueroa', fecha: '18-07-2025', estado: 'Aprobado' as const, producto: 'Tubería HDPE 90mm', lote: 'Lote-250708-PE1', meltIndexCalculado: 0.24, meltIndexVariacion: 1.7, densidadCalculada: 0.958, negroHumoCalculado: 2.28, fecha_ingreso: '08-07-2025', hora: '15:00', inspector: 'Luis Parada', maquina: 'PE1' },
    { id: 'LAB-07-13', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '18-07-2025', estado: 'Aprobado' as const, producto: 'R200P', lote: '500312', proveedor: 'AUSTRADE', orden_compra: '170320', melt_index_reportado: '0.2536', meltIndexCalculado: 0.25, meltIndexVariacion: 1.42, densidad_liquido: '0.901', densidadCalculada: 0.900, negroHumoCalculado: null },
    { id: 'LAB-07-14', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '17-07-2025', estado: 'En Progreso' as const, producto: 'Tubería HDPE 110mm', lote: 'Lote-250702-PE2', meltIndexCalculado: 0.255, meltIndexVariacion: 2.5, densidadCalculada: 0.959, negroHumoCalculado: 2.18, fecha_ingreso: '02-07-2025', hora: '11:15', inspector: 'Cristian Montellano', maquina: 'PE2' },
    { id: 'LAB-07-15', tipo: 'Tubería PP', analista: 'Bryan Vásquez', fecha: '16-07-2025', estado: 'Pendiente de Revisión' as const, producto: 'Tubería PP-R 50mm', lote: 'Lote-250701-PP2', meltIndexCalculado: null, meltIndexVariacion: null, densidadCalculada: null, negroHumoCalculado: null, fecha_ingreso: '01-07-2025', hora: '13:20', inspector: 'Cristian Montellano', maquina: 'PP2' },
    { id: 'LAB-07-16', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '15-07-2025', estado: 'Aprobado' as const, producto: 'Tubería HDPE 63mm', lote: 'Lote-250715-PE3', meltIndexCalculado: 0.235, meltIndexVariacion: 2.2, densidadCalculada: 0.958, negroHumoCalculado: 2.21, fecha_ingreso: '15-07-2025', hora: '09:05', inspector: 'Luis Parada', maquina: 'PE3' },
    { id: 'LAB-07-17', tipo: 'Tubería PP', analista: 'Antonia Figueroa', fecha: '14-07-2025', estado: 'Aprobado' as const, producto: 'Tubería PP-R 32mm', lote: 'Lote-250710-PP1', meltIndexCalculado: 0.285, meltIndexVariacion: 1.9, densidadCalculada: 0.902, negroHumoCalculado: null, fecha_ingreso: '10-07-2025', hora: '08:45', inspector: 'Elias Ibañez', maquina: 'PP1' },
    { id: 'LAB-07-18', tipo: 'Tubería HDPE', analista: 'Bryan Vásquez', fecha: '13-07-2025', estado: 'Aprobado' as const, producto: 'Tubería HDPE 90mm', lote: 'Lote-250708-PE1', meltIndexCalculado: 0.245, meltIndexVariacion: 2.1, densidadCalculada: 0.957, negroHumoCalculado: 2.29, fecha_ingreso: '08-07-2025', hora: '15:00', inspector: 'Luis Parada', maquina: 'PE1' },
    { id: 'LAB-07-19', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '12-07-2025', estado: 'Aprobado' as const, producto: 'K1280 40%', lote: 'E8082625E', proveedor: 'IRIA S.A.', orden_compra: '10954', melt_index_reportado: '3.6036', meltIndexCalculado: 3.61, meltIndexVariacion: 0.18, densidad_liquido: '1.136', densidadCalculada: 1.135, negroHumoCalculado: null },
    { id: 'LAB-07-20', tipo: 'Tubería HDPE', analista: 'Robinson Córdova', fecha: '11-07-2025', estado: 'En Progreso' as const, producto: 'Tubería HDPE 110mm', lote: 'Lote-250702-PE2', meltIndexCalculado: 0.25, meltIndexVariacion: 2.0, densidadCalculada: 0.960, negroHumoCalculado: 2.15, fecha_ingreso: '02-07-2025', hora: '11:15', inspector: 'Cristian Montellano', maquina: 'PE2' },
    { id: 'LAB-07-21', tipo: 'Tubería PP', analista: 'Jesus Diaz', fecha: '10-07-2025', estado: 'Pendiente de Revisión' as const, producto: 'Tubería PP-R 50mm', lote: 'Lote-250701-PP2', meltIndexCalculado: null, meltIndexVariacion: null, densidadCalculada: null, negroHumoCalculado: null, fecha_ingreso: '01-07-2025', hora: '13:20', inspector: 'Cristian Montellano', maquina: 'PP2' },
    { id: 'LAB-07-22', tipo: 'Reprocesado', analista: 'Antonia Figueroa', fecha: '09-07-2025', estado: 'Aprobado' as const, producto: 'Reprocesado Lote RP-0709', lote: 'RP-0709', meltIndexCalculado: 0.31, meltIndexVariacion: 4.1, densidadCalculada: 0.951, negroHumoCalculado: 2.35 },
    { id: 'LAB-07-23', tipo: 'Tubería HDPE', analista: 'Bryan Vásquez', fecha: '08-07-2025', estado: 'Aprobado' as const, producto: 'Tubería HDPE 200mm', lote: 'Lote-250705-PE4', meltIndexCalculado: 0.26, meltIndexVariacion: 0.8, densidadCalculada: 0.959, negroHumoCalculado: 2.22, fecha_ingreso: '05-07-2025', hora: '10:00', inspector: 'Daniel Palma', maquina: 'PE4' },
    { id: 'LAB-07-24', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '07-07-2025', estado: 'Aprobado' as const, producto: 'RA130E', lote: '82250251', proveedor: 'BOREALIS CO.', orden_compra: '170714', melt_index_reportado: '0.2212', meltIndexCalculado: 0.22, meltIndexVariacion: 0.54, densidad_liquido: '0.891', densidadCalculada: 0.892, negroHumoCalculado: null },
    { id: 'LAB-07-25', tipo: 'Tubería PP', analista: 'Robinson Córdova', fecha: '06-07-2025', estado: 'Rechazado' as const, producto: 'Tubería PP-R 25mm', lote: 'Lote-250705-PP3', meltIndexCalculado: 0.36, meltIndexVariacion: 18.2, densidadCalculada: 0.911, negroHumoCalculado: null, fecha_ingreso: '05-07-2025', hora: '14:00', inspector: 'Daniel Palma', maquina: 'PP3' },
    { id: 'LAB-07-26', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '05-07-2025', estado: 'Aprobado' as const, producto: 'Tubería HDPE 63mm', lote: 'Lote-250705-PE3', meltIndexCalculado: 0.23, meltIndexVariacion: 1.5, densidadCalculada: 0.958, negroHumoCalculado: 2.2, fecha_ingreso: '05-07-2025', hora: '09:05', inspector: 'Luis Parada', maquina: 'PE3' },
    { id: 'LAB-07-27', tipo: 'Reprocesado', analista: 'Antonia Figueroa', fecha: '04-07-2025', estado: 'Aprobado' as const, producto: 'Reprocesado Lote RP-0704', lote: 'RP-0704', meltIndexCalculado: 0.30, meltIndexVariacion: 3.5, densidadCalculada: 0.952, negroHumoCalculado: 2.33 },
    { id: 'LAB-07-28', tipo: 'Tubería PP', analista: 'Bryan Vásquez', fecha: '03-07-2025', estado: 'Aprobado' as const, producto: 'Tubería PP-R 32mm', lote: 'Lote-250703-PP1', meltIndexCalculado: 0.29, meltIndexVariacion: 2.3, densidadCalculada: 0.903, negroHumoCalculado: null, fecha_ingreso: '03-07-2025', hora: '08:45', inspector: 'Elias Ibañez', maquina: 'PP1' },
    { id: 'LAB-07-29', tipo: 'Tubería HDPE', analista: 'Maximiliano Miranda', fecha: '02-07-2025', estado: 'En Análisis' as const, producto: 'Tubería HDPE 90mm', lote: 'Lote-250702-PE1', meltIndexCalculado: 0.24, meltIndexVariacion: 1.9, densidadCalculada: 0.958, negroHumoCalculado: 2.25, fecha_ingreso: '02-07-2025', hora: '15:00', inspector: 'Luis Parada', maquina: 'PE1' },
    { id: 'LAB-07-30', tipo: 'Materia Prima', analista: 'Robinson Córdova', fecha: '01-07-2025', estado: 'Aprobado' as const, producto: 'Hostalen CRP 100', lote: 'MP-2025-07F', meltIndexCalculado: 0.22, meltIndexVariacion: 0.9, densidadCalculada: 0.959, negroHumoCalculado: 2.19 },
    
    // --- June 2025 Data ---
    { id: 'LAB-06-01', tipo: 'Tubería HDPE', analista: 'Antonia Figueroa', fecha: '30-06-2025', estado: 'Aprobado' as const, producto: 'Tubería HDPE 90mm', lote: 'Lote-250628-PE1', meltIndexCalculado: 0.24, meltIndexVariacion: 1.7, densidadCalculada: 0.958, negroHumoCalculado: 2.28 },
    { id: 'LAB-06-11', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '29-06-2025', estado: 'Aprobado' as const, producto: 'Tubería HDPE 110mm', lote: 'Lote-250629-PE2', meltIndexCalculado: 0.25, meltIndexVariacion: 2.0, densidadCalculada: 0.960, negroHumoCalculado: 2.15 },
    { id: 'LAB-06-02', tipo: 'Materia Prima', analista: 'Jesus Diaz', fecha: '28-06-2025', estado: 'Aprobado' as const, producto: 'EL-Lene H1000PC', lote: 'MP-2025-06A', meltIndexCalculado: 0.26, meltIndexVariacion: 0.8, densidadCalculada: 0.959, negroHumoCalculado: 2.22 },
    { id: 'LAB-06-12', tipo: 'Tubería PP', analista: 'Bryan Vásquez', fecha: '27-06-2025', estado: 'Aprobado' as const, producto: 'Tubería PP-R 50mm', lote: 'Lote-250627-PP2', meltIndexCalculado: 0.28, meltIndexVariacion: 1.5, densidadCalculada: 0.905, negroHumoCalculado: null },
    { id: 'LAB-06-03', tipo: 'Tubería PP', analista: 'Maximiliano Miranda', fecha: '26-06-2025', estado: 'Aprobado' as const, producto: 'Tubería PP-R 25mm', lote: 'Lote-250622-PP3', meltIndexCalculado: 0.29, meltIndexVariacion: 2.1, densidadCalculada: 0.904, negroHumoCalculado: null },
    { id: 'LAB-06-13', tipo: 'Tubería HDPE', analista: 'Robinson Córdova', fecha: '25-06-2025', estado: 'Aprobado' as const, producto: 'Tubería HDPE 63mm', lote: 'Lote-250625-PE3', meltIndexCalculado: 0.23, meltIndexVariacion: 1.8, densidadCalculada: 0.958, negroHumoCalculado: 2.2 },
    { id: 'LAB-06-04', tipo: 'Reprocesado', analista: 'Robinson Córdova', fecha: '24-06-2025', estado: 'Rechazado' as const, producto: 'Reprocesado Lote RP-0620', lote: 'RP-0620', meltIndexCalculado: 0.40, meltIndexVariacion: 25.0, densidadCalculada: 0.940, negroHumoCalculado: 2.5 },
    { id: 'LAB-06-14', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '23-06-2025', estado: 'Aprobado' as const, producto: 'BorSafe HE3490-LS', lote: 'MP-2025-06C', meltIndexCalculado: 0.24, meltIndexVariacion: 1.1, densidadCalculada: 0.959, negroHumoCalculado: 2.25 },
    { id: 'LAB-06-05', tipo: 'Tubería HDPE', analista: 'Bryan Vásquez', fecha: '22-06-2025', estado: 'Aprobado' as const, producto: 'Tubería HDPE 110mm', lote: 'Lote-250618-PE2', meltIndexCalculado: 0.25, meltIndexVariacion: 2.0, densidadCalculada: 0.960, negroHumoCalculado: 2.15 },
    { id: 'LAB-06-06', tipo: 'Tubería HDPE', analista: 'Antonia Figueroa', fecha: '21-06-2025', estado: 'Aprobado' as const, producto: 'Tubería HDPE 63mm', lote: 'Lote-250615-PE3', meltIndexCalculado: 0.23, meltIndexVariacion: 1.8, densidadCalculada: 0.958, negroHumoCalculado: 2.2 },
    { id: 'LAB-06-15', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '20-06-2025', estado: 'Aprobado' as const, producto: 'Tubería HDPE 200mm', lote: 'Lote-250620-PE4', meltIndexCalculado: 0.26, meltIndexVariacion: 0.8, densidadCalculada: 0.959, negroHumoCalculado: 2.22 },
    { id: 'LAB-06-07', tipo: 'Materia Prima', analista: 'Jesus Diaz', fecha: '19-06-2025', estado: 'Aprobado' as const, producto: 'Hostalen CRP 100', lote: 'MP-2025-06B', meltIndexCalculado: 0.22, meltIndexVariacion: 0.9, densidadCalculada: 0.959, negroHumoCalculado: 2.19 },
    { id: 'LAB-06-08', tipo: 'Tubería PP', analista: 'Maximiliano Miranda', fecha: '18-06-2025', estado: 'Aprobado' as const, producto: 'Tubería PP-R 32mm', lote: 'Lote-250610-PP1', meltIndexCalculado: 0.29, meltIndexVariacion: 2.1, densidadCalculada: 0.903, negroHumoCalculado: null },
    { id: 'LAB-06-09', tipo: 'Tubería HDPE', analista: 'Robinson Córdova', fecha: '17-06-2025', estado: 'Aprobado' as const, producto: 'Tubería HDPE 200mm', lote: 'Lote-250605-PE4', meltIndexCalculado: 0.26, meltIndexVariacion: 0.8, densidadCalculada: 0.959, negroHumoCalculado: 2.22 },
    { id: 'LAB-06-10', tipo: 'Reprocesado', analista: 'Bryan Vásquez', fecha: '16-06-2025', estado: 'Aprobado' as const, producto: 'Reprocesado Lote RP-0602', lote: 'RP-0602', meltIndexCalculado: 0.29, meltIndexVariacion: 3.2, densidadCalculada: 0.955, negroHumoCalculado: 2.3 },
    { id: 'LAB-06-16', tipo: 'Tubería PP', analista: 'Antonia Figueroa', fecha: '15-06-2025', estado: 'Aprobado' as const, producto: 'Tubería PP-R 50mm', lote: 'Lote-250615-PP2', meltIndexCalculado: 0.28, meltIndexVariacion: 1.5, densidadCalculada: 0.905, negroHumoCalculado: null },
    { id: 'LAB-06-17', tipo: 'Materia Prima', analista: 'Maximiliano Miranda', fecha: '10-06-2025', estado: 'Aprobado' as const, producto: 'EL-Lene H1000PC', lote: 'MP-2025-06D', meltIndexCalculado: 0.26, meltIndexVariacion: 0.8, densidadCalculada: 0.959, negroHumoCalculado: 2.22 },
    { id: 'LAB-06-18', tipo: 'Reprocesado', analista: 'Jesus Diaz', fecha: '08-06-2025', estado: 'Aprobado' as const, producto: 'Reprocesado Lote RP-0608', lote: 'RP-0608', meltIndexCalculado: 0.31, meltIndexVariacion: 4.1, densidadCalculada: 0.951, negroHumoCalculado: 2.35 },
    { id: 'LAB-06-19', tipo: 'Tubería HDPE', analista: 'Bryan Vásquez', fecha: '05-06-2025', estado: 'Aprobado' as const, producto: 'Tubería HDPE 90mm', lote: 'Lote-250605-PE1', meltIndexCalculado: 0.24, meltIndexVariacion: 1.7, densidadCalculada: 0.958, negroHumoCalculado: 2.28 },
    { id: 'LAB-06-20', tipo: 'Tubería PP', analista: 'Robinson Córdova', fecha: '02-06-2025', estado: 'Aprobado' as const, producto: 'Tubería PP-R 32mm', lote: 'Lote-250602-PP1', meltIndexCalculado: 0.29, meltIndexVariacion: 2.1, densidadCalculada: 0.903, negroHumoCalculado: null },

    // --- May 2025 Data ---
    { id: 'LAB-05-01', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '29-05-2025', estado: 'Aprobado' as const, producto: 'Tubería HDPE 90mm', lote: 'Lote-250529-PE1', meltIndexCalculado: 0.24, meltIndexVariacion: 1.7, densidadCalculada: 0.958, negroHumoCalculado: 2.28 },
    { id: 'LAB-05-02', tipo: 'Tubería PP', analista: 'Antonia Figueroa', fecha: '25-05-2025', estado: 'Aprobado' as const, producto: 'Tubería PP-R 50mm', lote: 'Lote-250525-PP2', meltIndexCalculado: 0.28, meltIndexVariacion: 1.5, densidadCalculada: 0.905, negroHumoCalculado: null },
    { id: 'LAB-05-03', tipo: 'Materia Prima', analista: 'Maximiliano Miranda', fecha: '20-05-2025', estado: 'Aprobado' as const, producto: 'BorSafe HE3490-LS', lote: 'MP-2025-05A', meltIndexCalculado: 0.24, meltIndexVariacion: 1.1, densidadCalculada: 0.959, negroHumoCalculado: 2.25 },
    { id: 'LAB-05-04', tipo: 'Tubería HDPE', analista: 'Robinson Córdova', fecha: '15-05-2025', estado: 'Aprobado' as const, producto: 'Tubería HDPE 110mm', lote: 'Lote-250515-PE2', meltIndexCalculado: 0.25, meltIndexVariacion: 2.0, densidadCalculada: 0.960, negroHumoCalculado: 2.15 },
    { id: 'LAB-05-05', tipo: 'Reprocesado', analista: 'Bryan Vásquez', fecha: '10-05-2025', estado: 'Rechazado' as const, producto: 'Reprocesado Lote RP-0510', lote: 'RP-0510', meltIndexCalculado: 0.40, meltIndexVariacion: 25.0, densidadCalculada: 0.940, negroHumoCalculado: 2.5 },
    { id: 'LAB-05-06', tipo: 'Tubería PP', analista: 'Jesus Diaz', fecha: '05-05-2025', estado: 'Aprobado' as const, producto: 'Tubería PP-R 25mm', lote: 'Lote-250505-PP3', meltIndexCalculado: 0.29, meltIndexVariacion: 2.1, densidadCalculada: 0.904, negroHumoCalculado: null },

    // --- April 2025 Data ---
    { id: 'LAB-04-01', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '28-04-2025', estado: 'Aprobado' as const, producto: 'EL-Lene H1000PC', lote: 'MP-2025-04A', meltIndexCalculado: 0.26, meltIndexVariacion: 0.8, densidadCalculada: 0.959, negroHumoCalculado: 2.22 },
    { id: 'LAB-04-02', tipo: 'Tubería HDPE', analista: 'Maximiliano Miranda', fecha: '22-04-2025', estado: 'Aprobado' as const, producto: 'Tubería HDPE 63mm', lote: 'Lote-250422-PE3', meltIndexCalculado: 0.23, meltIndexVariacion: 1.8, densidadCalculada: 0.958, negroHumoCalculado: 2.2 },
    { id: 'LAB-04-03', tipo: 'Reprocesado', analista: 'Robinson Córdova', fecha: '18-04-2025', estado: 'Aprobado' as const, producto: 'Reprocesado Lote RP-0418', lote: 'RP-0418', meltIndexCalculado: 0.29, meltIndexVariacion: 3.2, densidadCalculada: 0.955, negroHumoCalculado: 2.3 },
    { id: 'LAB-04-04', tipo: 'Tubería PP', analista: 'Bryan Vásquez', fecha: '12-04-2025', estado: 'Aprobado' as const, producto: 'Tubería PP-R 32mm', lote: 'Lote-250412-PP1', meltIndexCalculado: 0.29, meltIndexVariacion: 2.1, densidadCalculada: 0.903, negroHumoCalculado: null },
    { id: 'LAB-04-05', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '05-04-2025', estado: 'Aprobado' as const, producto: 'Tubería HDPE 200mm', lote: 'Lote-250405-PE4', meltIndexCalculado: 0.26, meltIndexVariacion: 0.8, densidadCalculada: 0.959, negroHumoCalculado: 2.22 },
    
    // --- March 2025 Data ---
    { id: 'LAB-03-01', tipo: 'Tubería HDPE', analista: 'Antonia Figueroa', fecha: '28-03-2025', estado: 'Aprobado' as const, producto: 'Tubería HDPE 90mm', lote: 'Lote-250328-PE1', meltIndexCalculado: 0.24, meltIndexVariacion: 1.7, densidadCalculada: 0.958, negroHumoCalculado: 2.28 },
    { id: 'LAB-03-02', tipo: 'Materia Prima', analista: 'Maximiliano Miranda', fecha: '20-03-2025', estado: 'Aprobado' as const, producto: 'Hostalen CRP 100', lote: 'MP-2025-03A', meltIndexCalculado: 0.22, meltIndexVariacion: 0.9, densidadCalculada: 0.959, negroHumoCalculado: 2.19 },
    { id: 'LAB-03-03', tipo: 'Tubería PP', analista: 'Robinson Córdova', fecha: '15-03-2025', estado: 'Aprobado' as const, producto: 'Tubería PP-R 50mm', lote: 'Lote-250315-PP2', meltIndexCalculado: 0.28, meltIndexVariacion: 1.5, densidadCalculada: 0.905, negroHumoCalculado: null },
    { id: 'LAB-03-04', tipo: 'Tubería HDPE', analista: 'Bryan Vásquez', fecha: '10-03-2025', estado: 'Rechazado' as const, producto: 'Tubería HDPE 110mm', lote: 'Lote-250310-PE2', meltIndexCalculado: 0.28, meltIndexVariacion: 12.0, densidadCalculada: 0.965, negroHumoCalculado: 2.05 },
    { id: 'LAB-03-05', tipo: 'Reprocesado', analista: 'Jesus Diaz', fecha: '05-03-2025', estado: 'Aprobado' as const, producto: 'Reprocesado Lote RP-0305', lote: 'RP-0305', meltIndexCalculado: 0.31, meltIndexVariacion: 4.1, densidadCalculada: 0.951, negroHumoCalculado: 2.35 },

    // --- February 2025 Data ---
    { id: 'LAB-02-01', tipo: 'Tubería PP', analista: 'Antonia Figueroa', fecha: '25-02-2025', estado: 'Aprobado' as const, producto: 'Tubería PP-R 25mm', lote: 'Lote-250225-PP3', meltIndexCalculado: 0.29, meltIndexVariacion: 2.1, densidadCalculada: 0.904, negroHumoCalculado: null },
    { id: 'LAB-02-02', tipo: 'Materia Prima', analista: 'Maximiliano Miranda', fecha: '18-02-2025', estado: 'Aprobado' as const, producto: 'BorSafe HE3490-LS', lote: 'MP-2025-02A', meltIndexCalculado: 0.24, meltIndexVariacion: 1.1, densidadCalculada: 0.959, negroHumoCalculado: 2.25 },
    { id: 'LAB-02-03', tipo: 'Tubería HDPE', analista: 'Robinson Córdova', fecha: '10-02-2025', estado: 'Aprobado' as const, producto: 'Tubería HDPE 63mm', lote: 'Lote-250210-PE3', meltIndexCalculado: 0.23, meltIndexVariacion: 1.8, densidadCalculada: 0.958, negroHumoCalculado: 2.2 },
    
    // --- January 2025 Data ---
    { id: 'LAB-01-01', tipo: 'Reprocesado', analista: 'Bryan Vásquez', fecha: '20-01-2025', estado: 'Aprobado' as const, producto: 'Reprocesado Lote RP-0120', lote: 'RP-0120', meltIndexCalculado: 0.29, meltIndexVariacion: 3.2, densidadCalculada: 0.955, negroHumoCalculado: 2.3 },
    { id: 'LAB-01-02', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '15-01-2025', estado: 'Aprobado' as const, producto: 'Tubería HDPE 200mm', lote: 'Lote-250115-PE4', meltIndexCalculado: 0.26, meltIndexVariacion: 0.8, densidadCalculada: 0.959, negroHumoCalculado: 2.22 },
];


const now = new Date('2025-07-23T10:30:00Z');

const demoRecentActivity = [
    { id: 'ACT-1', user: 'Jesus Diaz', action: 'actualizó el ensayo LAB-07-01', timestamp: new Date(now.getTime() - 5 * 60 * 1000).toISOString() }, // 5 minutes ago
    { id: 'ACT-2', user: 'Elias Ibañez', action: 'registró un nuevo control para Tubería HDPE 90mm', timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString() }, // 15 minutes ago
    { id: 'ACT-3', user: 'Victor Lutz', action: 'ha iniciado sesión', timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString() }, // 2 hours ago
    { id: 'ACT-4', user: 'Antonia Figueroa', action: 'comenzó a procesar el ensayo LAB-07-02', timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString() }, // 5 hours ago
    { id: 'ACT-5', user: 'Cristian Montellano', action: 'registró un control no conforme para Tubería HDPE 200mm', timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString() }, // Yesterday
    { id: 'ACT-6', user: 'Maximiliano Miranda', action: 'aprobó el informe para el ensayo LAB-07-03', timestamp: new Date(now.getTime() - 1.5 * 24 * 60 * 60 * 1000).toISOString() }, // 1.5 days ago
    { id: 'ACT-7', user: 'Robinson Córdova', action: 'registró un nuevo ensayo de reprocesado', timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() }, // 2 days ago
    { id: 'ACT-8', user: 'Bryan Vásquez', action: 'actualizó el ensayo LAB-07-05', timestamp: new Date(now.getTime() - 2.2 * 24 * 60 * 60 * 1000).toISOString() }, // ~2 days ago
    { id: 'ACT-9', user: 'Daniel Palma', action: 'registró un control para Tubería PP-R 25mm', timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString() }, // 3 days ago
    { id: 'ACT-10', user: 'Luis Parada', action: 'ha iniciado sesión', timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString() }, // 4 days ago
];


const demoEquipos: Equipo[] = [
  { id: 'EQ-01', nombre: 'Espectrómetro FTIR', estado: 'Activo' as const, marca: 'PerkinElmer', modelo: 'Spectrum Two', numero_serie: 'FTIR-9876', fecha_puesta_marcha: '10-01-2022', proxima_calibracion: '15-01-2026', ubicacion: 'Mesón Central, Lab. Principal', criticidad: 'Alta' as const, fotoUrl: 'https://placehold.co/400x400/cccccc/313437?text=FTIR', observaciones: 'Equipo sensible a vibraciones.', ensayos_asociados: ['dsc', 'tio'], manual_url: '#', procedimiento_url: '#' },
  { id: 'EQ-02', nombre: 'Prensa de Impacto', estado: 'Activo' as const, marca: 'CEAST', modelo: '9050', numero_serie: 'IMP-5432', fecha_puesta_marcha: '05-03-2021', proxima_calibracion: '20-12-2025', ubicacion: 'Área de Ensayos Mecánicos', criticidad: 'Media' as const, fotoUrl: 'https://placehold.co/400x400/94a3b8/313437?text=Impacto' },
  { id: 'EQ-03', nombre: 'Calorímetro DSC', estado: 'Activo' as const, marca: 'TA Instruments', modelo: 'Q200', numero_serie: 'DSC-1122', fecha_puesta_marcha: '15-06-2020', proxima_calibracion: '30-11-2025', ubicacion: 'Sala de Análisis Térmico', criticidad: 'Alta' as const, fotoUrl: '', ensayos_asociados: ['dsc', 'tio'] },
  { id: 'EQ-04', nombre: 'Plastómetro MFI', estado: 'Activo' as const, marca: 'CEAST', modelo: 'Melt Flow 2000', numero_serie: 'MFI-3344', fecha_puesta_marcha: '20-02-2023', proxima_calibracion: '01-03-2026', ubicacion: 'Mesón Central, Lab. Principal', criticidad: 'Media' as const, fotoUrl: 'https://placehold.co/400x400/6ee7b7/313437?text=MFI', ensayos_asociados: ['melt_index'] },
  { id: 'EQ-05', nombre: 'Balanza Analítica', estado: 'En Mantenimiento' as const, marca: 'Mettler Toledo', modelo: 'MS-TS', numero_serie: 'BAL-5566', fecha_puesta_marcha: '01-09-2019', proxima_calibracion: '10-08-2025', ubicacion: 'Sala de Pesaje', criticidad: 'Alta' as const, fotoUrl: '', ensayos_asociados: ['densidad', 'negro_humo', 'fibra_vidrio', 'humedad'] },
  { id: 'EQ-06', nombre: 'Mufla para Cenizas', estado: 'Activo' as const, marca: 'Thermo Scientific', modelo: 'Thermolyne', numero_serie: 'MUF-7788', fecha_puesta_marcha: '12-11-2018', proxima_calibracion: '28-02-2026', ubicacion: 'Área de Hornos', criticidad: 'Baja' as const, fotoUrl: 'https://placehold.co/400x400/f87171/313437?text=Mufla', ensayos_asociados: ['negro_humo', 'fibra_vidrio'] },
  { id: 'EQ-07', nombre: 'Máquina de Tracción', estado: 'Inactivo' as const, marca: 'Instron', modelo: '3369', numero_serie: 'TRAC-9900', fecha_puesta_marcha: '30-01-2017', proxima_calibracion: '30-07-2025', ubicacion: 'Área de Ensayos Mecánicos', criticidad: 'Media' as const, fotoUrl: '', ensayos_asociados: ['traccion'] },
];

const demoControles: ControlEvento[] = [
    { id: 'CE-01', equipoId: 'EQ-01', fecha: '15-01-2025', tipo: 'Calibración', responsable: 'Servicio Externo', observaciones: 'Calibración anual completa según procedimiento XYZ.', certificadoUrl: '#' },
    { id: 'CE-02', equipoId: 'EQ-01', fecha: '15-04-2025', tipo: 'Verificación', responsable: 'Jesus Diaz', observaciones: 'Verificación interna con patrón de referencia. Todo OK.' },
    { id: 'CE-03', equipoId: 'EQ-05', fecha: '10-07-2025', tipo: 'Mantenimiento Correctivo', responsable: 'Servicio Técnico Mettler', observaciones: 'Reemplazo de celda de carga. Requiere recalibración.' },
    { id: 'CE-04', equipoId: 'EQ-02', fecha: '20-12-2024', tipo: 'Calibración', responsable: 'Servicio Externo', certificadoUrl: '#' },
    { id: 'CE-05', equipoId: 'EQ-02', fecha: '20-06-2025', tipo: 'Verificación', responsable: 'Maximiliano Miranda' },
    { id: 'CE-06', equipoId: 'EQ-06', fecha: '01-06-2025', tipo: 'Mantenimiento Preventivo', responsable: 'Robinson Córdova', observaciones: 'Limpieza de cámara y revisión de termocupla.' },
];

const demoNoConformidades: NoConformidad[] = [
    { id: 'NC-001', tipo: 'Interna', fecha_deteccion: '15-07-2025', descripcion: 'El equipo EQ-05 (Balanza Analítica) está fuera de calibración desde el 2025-07-10.', estado: 'En Investigación', severidad: 'Alta', responsable: 'Victor Lutz', fecha_vencimiento: '25-07-2025' },
    { id: 'NC-002', tipo: 'Reclamo de Cliente', fecha_deteccion: '18-07-2025', descripcion: 'El cliente "Constructora XYZ" reporta que el lote Lote-250710-PP1 presenta fragilidad.', estado: 'Abierta', severidad: 'Crítica', responsable: 'Jesus Diaz', fecha_vencimiento: '22-07-2025' },
    { id: 'NC-003', tipo: 'Auditoría', fecha_deteccion: '30-06-2025', descripcion: 'Durante la auditoría interna se detectó que el PNT para ensayos de impacto no está actualizado a la última versión de la norma.', estado: 'Resuelta', severidad: 'Media', responsable: 'Maximiliano Miranda', fecha_vencimiento: '15-07-2025', accion_correctiva: 'Se actualizó el PNT y se realizó capacitación al personal.' },
    { id: 'NC-004', tipo: 'Interna', fecha_deteccion: '21-07-2025', descripcion: 'Contaminación cruzada detectada en muestras de Reprocesado.', estado: 'Abierta', severidad: 'Alta', responsable: 'Robinson Córdova', fecha_vencimiento: '28-07-2025' },
];

const demoImportaciones: Importacion[] = [
    { id: 'IMP-001', bl: 'YMLUC236092186', fecha_embarque: '11-12-2021', sca: '65344', fecha_emision_cert: '07-03-2022', di: '2400301661-3', etiqueta_rango_inicio: '7820106', etiqueta_rango_fin: '7820606', operacion: '170389', proveedor: 'RYNO', fecha_solicitada: '03-02-2022', fecha_entrega_calidad: '21-02-2022', cantidad_lote: 15821, fecha_liberacion: '05-04-2022', ingresado_siss: true, estado: 'CADUCADO' },
    { id: 'IMP-002', bl: '(M)MEDUIG157023(H)GOA0051266', fecha_embarque: '02-12-2021', sca: '65792', fecha_emision_cert: '21-03-2022', di: '2400301371-1', etiqueta_rango_inicio: '7820907', etiqueta_rango_fin: '7821907', operacion: '170374', proveedor: 'UNIDELTA', fecha_solicitada: '16-02-2022', fecha_entrega_calidad: '02-03-2022', cantidad_lote: 16593, fecha_liberacion: '25-03-2022', ingresado_siss: true, estado: 'CADUCADO' },
    { id: 'IMP-003', bl: 'NBO210082100', fecha_embarque: '24-12-2021', sca: '65793', fecha_emision_cert: '21-03-2022', di: '2400302578-7', etiqueta_rango_inicio: '7821908', etiqueta_rango_fin: '7822908', operacion: '170412', proveedor: 'AOLONG', fecha_solicitada: '17-02-2022', fecha_entrega_calidad: '22-02-2022', cantidad_lote: 7202, fecha_devolucion: '21-03-2022', fecha_liberacion: '21-03-2022', ingresado_siss: true, estado: 'CADUCADO' },
];

const demoGeneratedReports: GeneratedReport[] = [
    { id: 'REP-001', nombre: '2025-07-23 - HE3490LS - Lote 1325115.pdf', tipo: 'Materia Prima', fecha_creacion: '23-07-2025', path: '/informes/materia-prima/2025-07-23-HE3490LS-1325115.pdf', ensayoIds: ['LAB-07-03'] },
    { id: 'REP-002', nombre: '2025-07-21 - R202P - Lote 500312.pdf', tipo: 'Materia Prima', fecha_creacion: '21-07-2025', path: '/informes/materia-prima/2025-07-21-R202P-500312.pdf', ensayoIds: ['LAB-07-07'] },
];

let generatedReports = [...demoGeneratedReports];

export async function addGeneratedReport(report: Omit<GeneratedReport, 'id'>): Promise<GeneratedReport> {
    const newReport = { ...report, id: `REP-${String(generatedReports.length + 1).padStart(3, '0')}` };
    generatedReports.unshift(newReport);
    return newReport;
}

export async function deleteGeneratedReport(id: string): Promise<void> {
    generatedReports = generatedReports.filter(r => r.id !== id);
}

// Dummy add/update/delete functions to simulate API calls
export async function addEnsayo(ensayo: Omit<Ensayo, 'id'>) {
    const newEnsayo = { ...ensayo, id: `LAB-NEW-${Math.random().toString(16).slice(2)}` };
    // demoEnsayos.unshift(newEnsayo);
    return newEnsayo;
}
export async function updateEnsayo(id: string, updatedData: Partial<Ensayo>) { return; }
export async function deleteEnsayo(id: string) { return; }
export async function addRegistro(registro: Omit<Registro, 'id'>) { 
    const newRegistro = { ...registro, id: `CTRL-NEW-${Math.random().toString(16).slice(2)}` };
    return newRegistro;
}
export async function deleteRegistro(id: string) { return; }
export async function addEquipo(equipo: Omit<Equipo, 'id'>) {
    const newEquipo = { ...equipo, id: `EQ-NEW-${Math.random().toString(16).slice(2)}` };
    return newEquipo;
}
export async function updateEquipo(id: string, updatedData: Partial<Equipo>) { return; }
export async function deleteEquipo(id: string) { return; }
export async function addControlEvento(evento: Omit<ControlEvento, 'id'>) { 
    const newEvento = { ...evento, id: `CE-NEW-${Math.random().toString(16).slice(2)}` };
    return newEvento;
}
export async function addIncidencia(incidencia: Omit<NoConformidad, 'id'>) { 
    const newIncidencia = { ...incidencia, id: `NC-NEW-${Math.random().toString(16).slice(2)}` };
    return newIncidencia;
}
export async function updateIncidencia(id: string, updatedData: Partial<NoConformidad>) { return; }
export async function deleteIncidencia(id: string) { return; }
export async function addImportacion(importacion: Omit<Importacion, 'id'>) {
    const newImportacion = { ...importacion, id: `IMP-NEW-${Math.random().toString(16).slice(2)}` };
    return newImportacion;
 }
export async function updateImportacion(id: string, updatedData: Partial<Importacion>) { return; }
export async function deleteImportacion(id: string) { return; }
export async function addRecentActivity(activity: Omit<RecentActivity, 'id' | 'timestamp'>) { 
     const newActivity = { ...activity, id: `ACT-NEW-${Math.random().toString(16).slice(2)}`, timestamp: new Date().toISOString() };
    return newActivity;
}

export async function getInitialData() {
    const today = new Date();
    const updatedEquipos = demoEquipos.map(equipo => {
        if (equipo.estado === 'Activo' && isPast(parse(equipo.proxima_calibracion, 'dd-MM-yyyy', new Date()))) {
            return { ...equipo, estado: 'Requiere Calibración' as const };
        }
        return equipo;
    });

    return {
        ensayos: demoEnsayos,
        registros: demoRegistros,
        recentActivity: demoRecentActivity,
        equipos: updatedEquipos,
        controles: demoControles,
        noConformidades: demoNoConformidades,
        importaciones: demoImportaciones,
        generatedReports: generatedReports,
    };
}
