

"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect, useCallback } from 'react';
import { getMatrizProductos, type TipoProducto } from "@/lib/matriz-datos";
import { getProductsFromSap, type SapProduct } from "@/services/sap-service";
import * as dataService from '@/services/data-service';
import { isPast, parseISO } from 'date-fns';

// --- DEMO DATA ---
const demoRegistros: Registro[] = [
    { id: 'CTRL-001', fecha: '2025-07-20', hora: '10:30', inspector: 'Elias Ibañez', maquinista: 'ANDRÉS REYES', maquina: 'PE1', producto: 'Tubería HDPE 90mm PN-16 SDR-11', marca: 'POLIFUSIÓN S.A.', diametro: 90.1, espesor_min: 8.2, espesor_max: 8.3, largo: 1000, peso_muestra: 2200, peso_kg_m: 2.2, ovalidad: 0.5, observaciones_visuales: 'Sin observaciones', color_tuberia: 'Negro', color_linea: 'Azul', resultado: 'Conforme', enviado_lab: true },
    { id: 'CTRL-002', fecha: '2025-07-20', hora: '11:15', inspector: 'Cristian Montellano', maquinista: 'ALEXIS SANDOVAL', maquina: 'PE2', producto: 'Tubería HDPE 110mm PN-10 SDR-17', marca: 'POLIFUSIÓN S.A.', diametro: 110.2, espesor_min: 6.5, espesor_max: 6.6, largo: 1000, peso_muestra: 2100, peso_kg_m: 2.1, ovalidad: 0.6, observaciones_visuales: '', color_tuberia: 'Negro', color_linea: 'Azul', resultado: 'Conforme', enviado_lab: true },
    { id: 'CTRL-003', fecha: '2025-07-19', hora: '14:00', inspector: 'Daniel Palma', maquinista: 'CARLOS DOMÍNGUEZ', maquina: 'PP3', producto: 'Tubería PP-R 25mm PN-20', marca: 'SMART PIPES SpA', diametro: 25.3, espesor_min: 4.2, espesor_max: 4.3, largo: 1000, peso_muestra: 300, peso_kg_m: 0.3, ovalidad: 0.2, observaciones_visuales: 'Superficie ligeramente rugosa', color_tuberia: 'Verde', color_linea: 'Roja', resultado: 'No Conforme', enviado_lab: false },
    { id: 'CTRL-004', fecha: '2025-07-19', hora: '09:05', inspector: 'Luis Parada', maquinista: 'CRISTIAN DUQUE', maquina: 'PE3', producto: 'Tubería HDPE 63mm PN-16 SDR-11', marca: 'POLIFUSIÓN S.A.', diametro: 63.1, espesor_min: 5.8, espesor_max: 5.9, largo: 1000, peso_muestra: 1100, peso_kg_m: 1.1, ovalidad: 0.4, observaciones_visuales: '', color_tuberia: 'Negro', color_linea: 'Azul', resultado: 'Conforme', enviado_lab: true },
];

const demoEnsayos = [
    // --- July 2025 Data ---
    { id: 'LAB-07-01', id_muestra: 'CTRL-001', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '2025-07-23', estado: 'Pendiente de Revisión' as const, producto: 'Tubería HDPE 90mm', lote: 'Lote-250722-PE1', meltIndexCalculado: null, meltIndexVariacion: null, densidadCalculada: null, negroHumoCalculado: null, fecha_ingreso: '2025-07-22', hora: '15:00', inspector: 'Luis Parada', maquina: 'PE1' },
    { id: 'LAB-07-02', tipo: 'Tubería PP', analista: 'Antonia Figueroa', fecha: '2025-07-23', estado: 'En Análisis' as const, producto: 'Tubería PP-R 50mm', lote: 'Lote-250722-PP2', meltIndexCalculado: 0.28, meltIndexVariacion: 1.5, densidadCalculada: 0.905, negroHumoCalculado: null, fecha_ingreso: '2025-07-22', hora: '13:20', inspector: 'Cristian Montellano', maquina: 'PP2' },
    { id: 'LAB-07-03', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '2025-07-23', estado: 'Aprobado' as const, producto: 'HE3490LS', lote: '1325115', proveedor: 'BOREALIS CO.', orden_compra: '170708', melt_index_reportado: '0.2308', meltIndexCalculado: 0.241, meltIndexVariacion: 4.42, densidad_liquido: '0.959', densidadCalculada: 0.959, negroHumoCalculado: 2.25 },
    { id: 'LAB-07-04', tipo: 'Reprocesado', analista: 'Robinson Córdova', fecha: '2025-07-22', estado: 'En Progreso' as const, producto: 'Reprocesado Lote RP-0720', lote: 'RP-0720', meltIndexCalculado: 0.29, meltIndexVariacion: 3.2, densidadCalculada: 0.955, negroHumoCalculado: 2.3 },
    { id: 'LAB-07-05', id_muestra: 'CTRL-002', tipo: 'Tubería HDPE', analista: 'Bryan Vásquez', fecha: '2025-07-22', estado: 'Aprobado' as const, producto: 'Tubería HDPE 110mm', lote: 'Lote-250719-PE2', meltIndexCalculado: 0.25, meltIndexVariacion: 2.0, densidadCalculada: 0.960, negroHumoCalculado: 2.15, fecha_ingreso: '2025-07-19', hora: '11:15', inspector: 'Cristian Montellano', maquina: 'PE2' },
    { id: 'LAB-07-06', tipo: 'Tubería PP', analista: 'Jesus Diaz', fecha: '2025-07-21', estado: 'Rechazado' as const, producto: 'Tubería PP-R 25mm', lote: 'Lote-250718-PP3', meltIndexCalculado: 0.35, meltIndexVariacion: 15.3, densidadCalculada: 0.910, negroHumoCalculado: null, fecha_ingreso: '2025-07-18', hora: '14:00', inspector: 'Daniel Palma', maquina: 'PP3' },
    { id: 'LAB-07-07', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '2025-07-21', estado: 'Aprobado' as const, producto: 'R202P', lote: '500312', proveedor: 'AUSTRADE', orden_compra: '170320', melt_index_reportado: '0.2075', meltIndexCalculado: 0.21, meltIndexVariacion: 1.2, densidad_liquido: '0.900', densidadCalculada: 0.901, negroHumoCalculado: null },
    { id: 'LAB-07-08', id_muestra: 'CTRL-004', tipo: 'Tubería HDPE', analista: 'Maximiliano Miranda', fecha: '2025-07-20', estado: 'Aprobado' as const, producto: 'Tubería HDPE 63mm', lote: 'Lote-250715-PE3', meltIndexCalculado: 0.23, meltIndexVariacion: 1.8, densidadCalculada: 0.958, negroHumoCalculado: 2.2, fecha_ingreso: '2025-07-15', hora: '09:05', inspector: 'Luis Parada', maquina: 'PE3' },
    { id: 'LAB-07-09', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '2025-07-20', estado: 'En Análisis' as const, producto: 'Tubería HDPE 200mm', lote: 'Lote-250714-PE4', meltIndexCalculado: 0.26, meltIndexVariacion: 0.5, densidadCalculada: 0.959, negroHumoCalculado: 2.22, fecha_ingreso: '2025-07-14', hora: '10:00', inspector: 'Daniel Palma', maquina: 'PE4' },
    { id: 'LAB-07-10', tipo: 'Reprocesado', analista: 'Robinson Córdova', fecha: '2025-07-19', estado: 'Pendiente de Revisión' as const, producto: 'Reprocesado Lote RP-0712', lote: 'RP-0712', meltIndexCalculado: null, meltIndexVariacion: null, densidadCalculada: null, negroHumoCalculado: null },
    { id: 'LAB-07-11', tipo: 'Tubería PP', analista: 'Bryan Vásquez', fecha: '2025-07-19', estado: 'Aprobado' as const, producto: 'Tubería PP-R 32mm', lote: 'Lote-250710-PP1', meltIndexCalculado: 0.29, meltIndexVariacion: 2.1, densidadCalculada: 0.903, negroHumoCalculado: null, fecha_ingreso: '2025-07-10', hora: '08:45', inspector: 'Elias Ibañez', maquina: 'PP1' },
    { id: 'LAB-07-12', tipo: 'Tubería HDPE', analista: 'Antonia Figueroa', fecha: '2025-07-18', estado: 'Aprobado' as const, producto: 'Tubería HDPE 90mm', lote: 'Lote-250708-PE1', meltIndexCalculado: 0.24, meltIndexVariacion: 1.7, densidadCalculada: 0.958, negroHumoCalculado: 2.28, fecha_ingreso: '2025-07-08', hora: '15:00', inspector: 'Luis Parada', maquina: 'PE1' },
    { id: 'LAB-07-13', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '2025-07-18', estado: 'Aprobado' as const, producto: 'R200P', lote: '500312', proveedor: 'AUSTRADE', orden_compra: '170320', melt_index_reportado: '0.2536', meltIndexCalculado: 0.25, meltIndexVariacion: 1.42, densidad_liquido: '0.901', densidadCalculada: 0.900, negroHumoCalculado: null },
    { id: 'LAB-07-14', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '2025-07-17', estado: 'En Progreso' as const, producto: 'Tubería HDPE 110mm', lote: 'Lote-250702-PE2', meltIndexCalculado: 0.255, meltIndexVariacion: 2.5, densidadCalculada: 0.959, negroHumoCalculado: 2.18, fecha_ingreso: '2025-07-02', hora: '11:15', inspector: 'Cristian Montellano', maquina: 'PE2' },
    { id: 'LAB-07-15', tipo: 'Tubería PP', analista: 'Bryan Vásquez', fecha: '2025-07-16', estado: 'Pendiente de Revisión' as const, producto: 'Tubería PP-R 50mm', lote: 'Lote-250701-PP2', meltIndexCalculado: null, meltIndexVariacion: null, densidadCalculada: null, negroHumoCalculado: null, fecha_ingreso: '2025-07-01', hora: '13:20', inspector: 'Cristian Montellano', maquina: 'PP2' },
    { id: 'LAB-07-16', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '2025-07-15', estado: 'Aprobado' as const, producto: 'Tubería HDPE 63mm', lote: 'Lote-250715-PE3', meltIndexCalculado: 0.235, meltIndexVariacion: 2.2, densidadCalculada: 0.958, negroHumoCalculado: 2.21, fecha_ingreso: '2025-07-15', hora: '09:05', inspector: 'Luis Parada', maquina: 'PE3' },
    { id: 'LAB-07-17', tipo: 'Tubería PP', analista: 'Antonia Figueroa', fecha: '2025-07-14', estado: 'Aprobado' as const, producto: 'Tubería PP-R 32mm', lote: 'Lote-250710-PP1', meltIndexCalculado: 0.285, meltIndexVariacion: 1.9, densidadCalculada: 0.902, negroHumoCalculado: null, fecha_ingreso: '2025-07-10', hora: '08:45', inspector: 'Elias Ibañez', maquina: 'PP1' },
    { id: 'LAB-07-18', tipo: 'Tubería HDPE', analista: 'Bryan Vásquez', fecha: '2025-07-13', estado: 'Aprobado' as const, producto: 'Tubería HDPE 90mm', lote: 'Lote-250708-PE1', meltIndexCalculado: 0.245, meltIndexVariacion: 2.1, densidadCalculada: 0.957, negroHumoCalculado: 2.29, fecha_ingreso: '2025-07-08', hora: '15:00', inspector: 'Luis Parada', maquina: 'PE1' },
    { id: 'LAB-07-19', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '2025-07-12', estado: 'Aprobado' as const, producto: 'K1280 40%', lote: 'E8082625E', proveedor: 'IRIA S.A.', orden_compra: '10954', melt_index_reportado: '3.6036', meltIndexCalculado: 3.61, meltIndexVariacion: 0.18, densidad_liquido: '1.136', densidadCalculada: 1.135, negroHumoCalculado: null },
    { id: 'LAB-07-20', tipo: 'Tubería HDPE', analista: 'Robinson Córdova', fecha: '2025-07-11', estado: 'En Progreso' as const, producto: 'Tubería HDPE 110mm', lote: 'Lote-250702-PE2', meltIndexCalculado: 0.25, meltIndexVariacion: 2.0, densidadCalculada: 0.960, negroHumoCalculado: 2.15, fecha_ingreso: '2025-07-02', hora: '11:15', inspector: 'Cristian Montellano', maquina: 'PE2' },
    { id: 'LAB-07-21', tipo: 'Tubería PP', analista: 'Jesus Diaz', fecha: '2025-07-10', estado: 'Pendiente de Revisión' as const, producto: 'Tubería PP-R 50mm', lote: 'Lote-250701-PP2', meltIndexCalculado: null, meltIndexVariacion: null, densidadCalculada: null, negroHumoCalculado: null, fecha_ingreso: '2025-07-01', hora: '13:20', inspector: 'Cristian Montellano', maquina: 'PP2' },
    { id: 'LAB-07-22', tipo: 'Reprocesado', analista: 'Antonia Figueroa', fecha: '2025-07-09', estado: 'Aprobado' as const, producto: 'Reprocesado Lote RP-0709', lote: 'RP-0709', meltIndexCalculado: 0.31, meltIndexVariacion: 4.1, densidadCalculada: 0.951, negroHumoCalculado: 2.35 },
    { id: 'LAB-07-23', tipo: 'Tubería HDPE', analista: 'Bryan Vásquez', fecha: '2025-07-08', estado: 'Aprobado' as const, producto: 'Tubería HDPE 200mm', lote: 'Lote-250705-PE4', meltIndexCalculado: 0.26, meltIndexVariacion: 0.8, densidadCalculada: 0.959, negroHumoCalculado: 2.22, fecha_ingreso: '2025-07-05', hora: '10:00', inspector: 'Daniel Palma', maquina: 'PE4' },
    { id: 'LAB-07-24', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '2025-07-07', estado: 'Aprobado' as const, producto: 'RA130E', lote: '82250251', proveedor: 'BOREALIS CO.', orden_compra: '170714', melt_index_reportado: '0.2212', meltIndexCalculado: 0.22, meltIndexVariacion: 0.54, densidad_liquido: '0.891', densidadCalculada: 0.892, negroHumoCalculado: null },
    { id: 'LAB-07-25', tipo: 'Tubería PP', analista: 'Robinson Córdova', fecha: '2025-07-06', estado: 'Rechazado' as const, producto: 'Tubería PP-R 25mm', lote: 'Lote-250705-PP3', meltIndexCalculado: 0.36, meltIndexVariacion: 18.2, densidadCalculada: 0.911, negroHumoCalculado: null, fecha_ingreso: '2025-07-05', hora: '14:00', inspector: 'Daniel Palma', maquina: 'PP3' },
    { id: 'LAB-07-26', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '2025-07-05', estado: 'Aprobado' as const, producto: 'Tubería HDPE 63mm', lote: 'Lote-250705-PE3', meltIndexCalculado: 0.23, meltIndexVariacion: 1.5, densidadCalculada: 0.958, negroHumoCalculado: 2.2, fecha_ingreso: '2025-07-05', hora: '09:05', inspector: 'Luis Parada', maquina: 'PE3' },
    { id: 'LAB-07-27', tipo: 'Reprocesado', analista: 'Antonia Figueroa', fecha: '2025-07-04', estado: 'Aprobado' as const, producto: 'Reprocesado Lote RP-0704', lote: 'RP-0704', meltIndexCalculado: 0.30, meltIndexVariacion: 3.5, densidadCalculada: 0.952, negroHumoCalculado: 2.33 },
    { id: 'LAB-07-28', tipo: 'Tubería PP', analista: 'Bryan Vásquez', fecha: '2025-07-03', estado: 'Aprobado' as const, producto: 'Tubería PP-R 32mm', lote: 'Lote-250703-PP1', meltIndexCalculado: 0.29, meltIndexVariacion: 2.3, densidadCalculada: 0.903, negroHumoCalculado: null, fecha_ingreso: '2025-07-03', hora: '08:45', inspector: 'Elias Ibañez', maquina: 'PP1' },
    { id: 'LAB-07-29', tipo: 'Tubería HDPE', analista: 'Maximiliano Miranda', fecha: '2025-07-02', estado: 'En Análisis' as const, producto: 'Tubería HDPE 90mm', lote: 'Lote-250702-PE1', meltIndexCalculado: 0.24, meltIndexVariacion: 1.9, densidadCalculada: 0.958, negroHumoCalculado: 2.25, fecha_ingreso: '2025-07-02', hora: '15:00', inspector: 'Luis Parada', maquina: 'PE1' },
    { id: 'LAB-07-30', tipo: 'Materia Prima', analista: 'Robinson Córdova', fecha: '2025-07-01', estado: 'Aprobado' as const, producto: 'Hostalen CRP 100', lote: 'MP-2025-07F', meltIndexCalculado: 0.22, meltIndexVariacion: 0.9, densidadCalculada: 0.959, negroHumoCalculado: 2.19 },
    
    // --- June 2025 Data ---
    { id: 'LAB-06-01', tipo: 'Tubería HDPE', analista: 'Antonia Figueroa', fecha: '2025-06-30', estado: 'Aprobado' as const, producto: 'Tubería HDPE 90mm', lote: 'Lote-250628-PE1', meltIndexCalculado: 0.24, meltIndexVariacion: 1.7, densidadCalculada: 0.958, negroHumoCalculado: 2.28 },
    { id: 'LAB-06-11', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '2025-06-29', estado: 'Aprobado' as const, producto: 'Tubería HDPE 110mm', lote: 'Lote-250629-PE2', meltIndexCalculado: 0.25, meltIndexVariacion: 2.0, densidadCalculada: 0.960, negroHumoCalculado: 2.15 },
    { id: 'LAB-06-02', tipo: 'Materia Prima', analista: 'Jesus Diaz', fecha: '2025-06-28', estado: 'Aprobado' as const, producto: 'EL-Lene H1000PC', lote: 'MP-2025-06A', meltIndexCalculado: 0.26, meltIndexVariacion: 0.8, densidadCalculada: 0.959, negroHumoCalculado: 2.22 },
    { id: 'LAB-06-12', tipo: 'Tubería PP', analista: 'Bryan Vásquez', fecha: '2025-06-27', estado: 'Aprobado' as const, producto: 'Tubería PP-R 50mm', lote: 'Lote-250627-PP2', meltIndexCalculado: 0.28, meltIndexVariacion: 1.5, densidadCalculada: 0.905, negroHumoCalculado: null },
    { id: 'LAB-06-03', tipo: 'Tubería PP', analista: 'Maximiliano Miranda', fecha: '2025-06-26', estado: 'Aprobado' as const, producto: 'Tubería PP-R 25mm', lote: 'Lote-250622-PP3', meltIndexCalculado: 0.29, meltIndexVariacion: 2.1, densidadCalculada: 0.904, negroHumoCalculado: null },
    { id: 'LAB-06-13', tipo: 'Tubería HDPE', analista: 'Robinson Córdova', fecha: '2025-06-25', estado: 'Aprobado' as const, producto: 'Tubería HDPE 63mm', lote: 'Lote-250625-PE3', meltIndexCalculado: 0.23, meltIndexVariacion: 1.8, densidadCalculada: 0.958, negroHumoCalculado: 2.2 },
    { id: 'LAB-06-04', tipo: 'Reprocesado', analista: 'Robinson Córdova', fecha: '2025-06-24', estado: 'Rechazado' as const, producto: 'Reprocesado Lote RP-0620', lote: 'RP-0620', meltIndexCalculado: 0.40, meltIndexVariacion: 25.0, densidadCalculada: 0.940, negroHumoCalculado: 2.5 },
    { id: 'LAB-06-14', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '2025-06-23', estado: 'Aprobado' as const, producto: 'BorSafe HE3490-LS', lote: 'MP-2025-06C', meltIndexCalculado: 0.24, meltIndexVariacion: 1.1, densidadCalculada: 0.959, negroHumoCalculado: 2.25 },
    { id: 'LAB-06-05', tipo: 'Tubería HDPE', analista: 'Bryan Vásquez', fecha: '2025-06-22', estado: 'Aprobado' as const, producto: 'Tubería HDPE 110mm', lote: 'Lote-250618-PE2', meltIndexCalculado: 0.25, meltIndexVariacion: 2.0, densidadCalculada: 0.960, negroHumoCalculado: 2.15 },
    { id: 'LAB-06-06', tipo: 'Tubería HDPE', analista: 'Antonia Figueroa', fecha: '2025-06-21', estado: 'Aprobado' as const, producto: 'Tubería HDPE 63mm', lote: 'Lote-250615-PE3', meltIndexCalculado: 0.23, meltIndexVariacion: 1.8, densidadCalculada: 0.958, negroHumoCalculado: 2.2 },
    { id: 'LAB-06-15', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '2025-06-20', estado: 'Aprobado' as const, producto: 'Tubería HDPE 200mm', lote: 'Lote-250620-PE4', meltIndexCalculado: 0.26, meltIndexVariacion: 0.8, densidadCalculada: 0.959, negroHumoCalculado: 2.22 },
    { id: 'LAB-06-07', tipo: 'Materia Prima', analista: 'Jesus Diaz', fecha: '2025-06-19', estado: 'Aprobado' as const, producto: 'Hostalen CRP 100', lote: 'MP-2025-06B', meltIndexCalculado: 0.22, meltIndexVariacion: 0.9, densidadCalculada: 0.959, negroHumoCalculado: 2.19 },
    { id: 'LAB-06-08', tipo: 'Tubería PP', analista: 'Maximiliano Miranda', fecha: '2025-06-18', estado: 'Aprobado' as const, producto: 'Tubería PP-R 32mm', lote: 'Lote-250610-PP1', meltIndexCalculado: 0.29, meltIndexVariacion: 2.1, densidadCalculada: 0.903, negroHumoCalculado: null },
    { id: 'LAB-06-09', tipo: 'Tubería HDPE', analista: 'Robinson Córdova', fecha: '2025-06-17', estado: 'Aprobado' as const, producto: 'Tubería HDPE 200mm', lote: 'Lote-250605-PE4', meltIndexCalculado: 0.26, meltIndexVariacion: 0.8, densidadCalculada: 0.959, negroHumoCalculado: 2.22 },
    { id: 'LAB-06-10', tipo: 'Reprocesado', analista: 'Bryan Vásquez', fecha: '2025-06-16', estado: 'Aprobado' as const, producto: 'Reprocesado Lote RP-0602', lote: 'RP-0602', meltIndexCalculado: 0.29, meltIndexVariacion: 3.2, densidadCalculada: 0.955, negroHumoCalculado: 2.3 },
    { id: 'LAB-06-16', tipo: 'Tubería PP', analista: 'Antonia Figueroa', fecha: '2025-06-15', estado: 'Aprobado' as const, producto: 'Tubería PP-R 50mm', lote: 'Lote-250615-PP2', meltIndexCalculado: 0.28, meltIndexVariacion: 1.5, densidadCalculada: 0.905, negroHumoCalculado: null },
    { id: 'LAB-06-17', tipo: 'Materia Prima', analista: 'Maximiliano Miranda', fecha: '2025-06-10', estado: 'Aprobado' as const, producto: 'EL-Lene H1000PC', lote: 'MP-2025-06D', meltIndexCalculado: 0.26, meltIndexVariacion: 0.8, densidadCalculada: 0.959, negroHumoCalculado: 2.22 },
    { id: 'LAB-06-18', tipo: 'Reprocesado', analista: 'Jesus Diaz', fecha: '2025-06-08', estado: 'Aprobado' as const, producto: 'Reprocesado Lote RP-0608', lote: 'RP-0608', meltIndexCalculado: 0.31, meltIndexVariacion: 4.1, densidadCalculada: 0.951, negroHumoCalculado: 2.35 },
    { id: 'LAB-06-19', tipo: 'Tubería HDPE', analista: 'Bryan Vásquez', fecha: '2025-06-05', estado: 'Aprobado' as const, producto: 'Tubería HDPE 90mm', lote: 'Lote-250605-PE1', meltIndexCalculado: 0.24, meltIndexVariacion: 1.7, densidadCalculada: 0.958, negroHumoCalculado: 2.28 },
    { id: 'LAB-06-20', tipo: 'Tubería PP', analista: 'Robinson Córdova', fecha: '2025-06-02', estado: 'Aprobado' as const, producto: 'Tubería PP-R 32mm', lote: 'Lote-250602-PP1', meltIndexCalculado: 0.29, meltIndexVariacion: 2.1, densidadCalculada: 0.903, negroHumoCalculado: null },

    // --- May 2025 Data ---
    { id: 'LAB-05-01', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '2025-05-29', estado: 'Aprobado' as const, producto: 'Tubería HDPE 90mm', lote: 'Lote-250529-PE1', meltIndexCalculado: 0.24, meltIndexVariacion: 1.7, densidadCalculada: 0.958, negroHumoCalculado: 2.28 },
    { id: 'LAB-05-02', tipo: 'Tubería PP', analista: 'Antonia Figueroa', fecha: '2025-05-25', estado: 'Aprobado' as const, producto: 'Tubería PP-R 50mm', lote: 'Lote-250525-PP2', meltIndexCalculado: 0.28, meltIndexVariacion: 1.5, densidadCalculada: 0.905, negroHumoCalculado: null },
    { id: 'LAB-05-03', tipo: 'Materia Prima', analista: 'Maximiliano Miranda', fecha: '2025-05-20', estado: 'Aprobado' as const, producto: 'BorSafe HE3490-LS', lote: 'MP-2025-05A', meltIndexCalculado: 0.24, meltIndexVariacion: 1.1, densidadCalculada: 0.959, negroHumoCalculado: 2.25 },
    { id: 'LAB-05-04', tipo: 'Tubería HDPE', analista: 'Robinson Córdova', fecha: '2025-05-15', estado: 'Aprobado' as const, producto: 'Tubería HDPE 110mm', lote: 'Lote-250515-PE2', meltIndexCalculado: 0.25, meltIndexVariacion: 2.0, densidadCalculada: 0.960, negroHumoCalculado: 2.15 },
    { id: 'LAB-05-05', tipo: 'Reprocesado', analista: 'Bryan Vásquez', fecha: '2025-05-10', estado: 'Rechazado' as const, producto: 'Reprocesado Lote RP-0510', lote: 'RP-0510', meltIndexCalculado: 0.40, meltIndexVariacion: 25.0, densidadCalculada: 0.940, negroHumoCalculado: 2.5 },
    { id: 'LAB-05-06', tipo: 'Tubería PP', analista: 'Jesus Diaz', fecha: '2025-05-05', estado: 'Aprobado' as const, producto: 'Tubería PP-R 25mm', lote: 'Lote-250505-PP3', meltIndexCalculado: 0.29, meltIndexVariacion: 2.1, densidadCalculada: 0.904, negroHumoCalculado: null },

    // --- April 2025 Data ---
    { id: 'LAB-04-01', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '2025-04-28', estado: 'Aprobado' as const, producto: 'EL-Lene H1000PC', lote: 'MP-2025-04A', meltIndexCalculado: 0.26, meltIndexVariacion: 0.8, densidadCalculada: 0.959, negroHumoCalculado: 2.22 },
    { id: 'LAB-04-02', tipo: 'Tubería HDPE', analista: 'Maximiliano Miranda', fecha: '2025-04-22', estado: 'Aprobado' as const, producto: 'Tubería HDPE 63mm', lote: 'Lote-250422-PE3', meltIndexCalculado: 0.23, meltIndexVariacion: 1.8, densidadCalculada: 0.958, negroHumoCalculado: 2.2 },
    { id: 'LAB-04-03', tipo: 'Reprocesado', analista: 'Robinson Córdova', fecha: '2025-04-18', estado: 'Aprobado' as const, producto: 'Reprocesado Lote RP-0418', lote: 'RP-0418', meltIndexCalculado: 0.29, meltIndexVariacion: 3.2, densidadCalculada: 0.955, negroHumoCalculado: 2.3 },
    { id: 'LAB-04-04', tipo: 'Tubería PP', analista: 'Bryan Vásquez', fecha: '2025-04-12', estado: 'Aprobado' as const, producto: 'Tubería PP-R 32mm', lote: 'Lote-250412-PP1', meltIndexCalculado: 0.29, meltIndexVariacion: 2.1, densidadCalculada: 0.903, negroHumoCalculado: null },
    { id: 'LAB-04-05', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '2025-04-05', estado: 'Aprobado' as const, producto: 'Tubería HDPE 200mm', lote: 'Lote-250405-PE4', meltIndexCalculado: 0.26, meltIndexVariacion: 0.8, densidadCalculada: 0.959, negroHumoCalculado: 2.22 },
    
    // --- March 2025 Data ---
    { id: 'LAB-03-01', tipo: 'Tubería HDPE', analista: 'Antonia Figueroa', fecha: '2025-03-28', estado: 'Aprobado' as const, producto: 'Tubería HDPE 90mm', lote: 'Lote-250328-PE1', meltIndexCalculado: 0.24, meltIndexVariacion: 1.7, densidadCalculada: 0.958, negroHumoCalculado: 2.28 },
    { id: 'LAB-03-02', tipo: 'Materia Prima', analista: 'Maximiliano Miranda', fecha: '2025-03-20', estado: 'Aprobado' as const, producto: 'Hostalen CRP 100', lote: 'MP-2025-03A', meltIndexCalculado: 0.22, meltIndexVariacion: 0.9, densidadCalculada: 0.959, negroHumoCalculado: 2.19 },
    { id: 'LAB-03-03', tipo: 'Tubería PP', analista: 'Robinson Córdova', fecha: '2025-03-15', estado: 'Aprobado' as const, producto: 'Tubería PP-R 50mm', lote: 'Lote-250315-PP2', meltIndexCalculado: 0.28, meltIndexVariacion: 1.5, densidadCalculada: 0.905, negroHumoCalculado: null },
    { id: 'LAB-03-04', tipo: 'Tubería HDPE', analista: 'Bryan Vásquez', fecha: '2025-03-10', estado: 'Rechazado' as const, producto: 'Tubería HDPE 110mm', lote: 'Lote-250310-PE2', meltIndexCalculado: 0.28, meltIndexVariacion: 12.0, densidadCalculada: 0.965, negroHumoCalculado: 2.05 },
    { id: 'LAB-03-05', tipo: 'Reprocesado', analista: 'Jesus Diaz', fecha: '2025-03-05', estado: 'Aprobado' as const, producto: 'Reprocesado Lote RP-0305', lote: 'RP-0305', meltIndexCalculado: 0.31, meltIndexVariacion: 4.1, densidadCalculada: 0.951, negroHumoCalculado: 2.35 },

    // --- February 2025 Data ---
    { id: 'LAB-02-01', tipo: 'Tubería PP', analista: 'Antonia Figueroa', fecha: '2025-02-25', estado: 'Aprobado' as const, producto: 'Tubería PP-R 25mm', lote: 'Lote-250225-PP3', meltIndexCalculado: 0.29, meltIndexVariacion: 2.1, densidadCalculada: 0.904, negroHumoCalculado: null },
    { id: 'LAB-02-02', tipo: 'Materia Prima', analista: 'Maximiliano Miranda', fecha: '2025-02-18', estado: 'Aprobado' as const, producto: 'BorSafe HE3490-LS', lote: 'MP-2025-02A', meltIndexCalculado: 0.24, meltIndexVariacion: 1.1, densidadCalculada: 0.959, negroHumoCalculado: 2.25 },
    { id: 'LAB-02-03', tipo: 'Tubería HDPE', analista: 'Robinson Córdova', fecha: '2025-02-10', estado: 'Aprobado' as const, producto: 'Tubería HDPE 63mm', lote: 'Lote-250210-PE3', meltIndexCalculado: 0.23, meltIndexVariacion: 1.8, densidadCalculada: 0.958, negroHumoCalculado: 2.2 },
    
    // --- January 2025 Data ---
    { id: 'LAB-01-01', tipo: 'Reprocesado', analista: 'Bryan Vásquez', fecha: '2025-01-20', estado: 'Aprobado' as const, producto: 'Reprocesado Lote RP-0120', lote: 'RP-0120', meltIndexCalculado: 0.29, meltIndexVariacion: 3.2, densidadCalculada: 0.955, negroHumoCalculado: 2.3 },
    { id: 'LAB-01-02', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '2025-01-15', estado: 'Aprobado' as const, producto: 'Tubería HDPE 200mm', lote: 'Lote-250115-PE4', meltIndexCalculado: 0.26, meltIndexVariacion: 0.8, densidadCalculada: 0.959, negroHumoCalculado: 2.22 },
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


const demoEquipos = [
  { id: 'EQ-01', nombre: 'Espectrómetro FTIR', estado: 'Activo' as const, marca: 'PerkinElmer', modelo: 'Spectrum Two', proxima_calibracion: '2026-01-15', ubicacion: 'Mesón Central, Lab. Principal', criticidad: 'Alta' as const, fotoUrl: 'https://placehold.co/400x400/cccccc/313437?text=FTIR', observaciones: 'Equipo sensible a vibraciones.', ensayos_asociados: ['dsc', 'tio'] },
  { id: 'EQ-02', nombre: 'Prensa de Impacto', estado: 'Activo' as const, marca: 'CEAST', modelo: '9050', proxima_calibracion: '2025-12-20', ubicacion: 'Área de Ensayos Mecánicos', criticidad: 'Media' as const, fotoUrl: 'https://placehold.co/400x400/94a3b8/313437?text=Impacto' },
  { id: 'EQ-03', nombre: 'Calorímetro DSC', estado: 'Activo' as const, marca: 'TA Instruments', modelo: 'Q200', proxima_calibracion: '2025-11-30', ubicacion: 'Sala de Análisis Térmico', criticidad: 'Alta' as const, fotoUrl: '', ensayos_asociados: ['dsc', 'tio'] },
  { id: 'EQ-04', nombre: 'Plastómetro MFI', estado: 'Activo' as const, marca: 'CEAST', modelo: 'Melt Flow 2000', proxima_calibracion: '2026-03-01', ubicacion: 'Mesón Central, Lab. Principal', criticidad: 'Media' as const, fotoUrl: 'https://placehold.co/400x400/6ee7b7/313437?text=MFI', ensayos_asociados: ['melt_index'] },
  { id: 'EQ-05', nombre: 'Balanza Analítica', estado: 'En Mantenimiento' as const, marca: 'Mettler Toledo', modelo: 'MS-TS', proxima_calibracion: '2025-08-10', ubicacion: 'Sala de Pesaje', criticidad: 'Alta' as const, fotoUrl: '', ensayos_asociados: ['densidad', 'negro_humo', 'fibra_vidrio', 'humedad'] },
  { id: 'EQ-06', nombre: 'Mufla para Cenizas', estado: 'Activo' as const, marca: 'Thermo Scientific', modelo: 'Thermolyne', proxima_calibracion: '2026-02-28', ubicacion: 'Área de Hornos', criticidad: 'Baja' as const, fotoUrl: 'https://placehold.co/400x400/f87171/313437?text=Mufla', ensayos_asociados: ['negro_humo', 'fibra_vidrio'] },
  { id: 'EQ-07', nombre: 'Máquina de Tracción', estado: 'Inactivo' as const, marca: 'Instron', modelo: '3369', proxima_calibracion: '2025-07-30', ubicacion: 'Área de Ensayos Mecánicos', criticidad: 'Media' as const, fotoUrl: '', ensayos_asociados: ['traccion'] },
];

const demoControles: ControlEvento[] = [
    { id: 'CE-01', equipoId: 'EQ-01', fecha: '2025-01-15', tipo: 'Calibración', responsable: 'Servicio Externo', observaciones: 'Calibración anual completa según procedimiento XYZ.', certificadoUrl: '#' },
    { id: 'CE-02', equipoId: 'EQ-01', fecha: '2025-04-15', tipo: 'Verificación', responsable: 'Jesus Diaz', observaciones: 'Verificación interna con patrón de referencia. Todo OK.' },
    { id: 'CE-03', equipoId: 'EQ-05', fecha: '2025-07-10', tipo: 'Mantenimiento Correctivo', responsable: 'Servicio Técnico Mettler', observaciones: 'Reemplazo de celda de carga. Requiere recalibración.' },
    { id: 'CE-04', equipoId: 'EQ-02', fecha: '2024-12-20', tipo: 'Calibración', responsable: 'Servicio Externo', certificadoUrl: '#' },
    { id: 'CE-05', equipoId: 'EQ-02', fecha: '2025-06-20', tipo: 'Verificación', responsable: 'Maximiliano Miranda' },
    { id: 'CE-06', equipoId: 'EQ-06', fecha: '2025-06-01', tipo: 'Mantenimiento Preventivo', responsable: 'Robinson Córdova', observaciones: 'Limpieza de cámara y revisión de termocupla.' },
];

const demoNoConformidades: NoConformidad[] = [
    { id: 'NC-001', tipo: 'Interna', fecha_deteccion: '2025-07-15', descripcion: 'El equipo EQ-05 (Balanza Analítica) está fuera de calibración desde el 2025-07-10.', estado: 'En Investigación', severidad: 'Alta', responsable: 'Victor Lutz', fecha_vencimiento: '2025-07-25' },
    { id: 'NC-002', tipo: 'Reclamo de Cliente', fecha_deteccion: '2025-07-18', descripcion: 'El cliente "Constructora XYZ" reporta que el lote Lote-250710-PP1 presenta fragilidad.', estado: 'Abierta', severidad: 'Crítica', responsable: 'Jesus Diaz', fecha_vencimiento: '2025-07-22' },
    { id: 'NC-003', tipo: 'Auditoría', fecha_deteccion: '2025-06-30', descripcion: 'Durante la auditoría interna se detectó que el PNT para ensayos de impacto no está actualizado a la última versión de la norma.', estado: 'Resuelta', severidad: 'Media', responsable: 'Maximiliano Miranda', fecha_vencimiento: '2025-07-15', accion_correctiva: 'Se actualizó el PNT y se realizó capacitación al personal.' },
    { id: 'NC-004', tipo: 'Interna', fecha_deteccion: '2025-07-21', descripcion: 'Contaminación cruzada detectada en muestras de Reprocesado.', estado: 'Abierta', severidad: 'Alta', responsable: 'Robinson Córdova', fecha_vencimiento: '2025-07-28' },
];


// --- STATIC DATA (loaded once from client) ---
interface StaticDataContextType {
  productMatrix: TipoProducto[];
  sapProducts: SapProduct[];
  isLoaded: boolean;
}

const StaticDataContext = createContext<StaticDataContextType | undefined>(undefined);

// --- DYNAMIC DATA (client-side state) ---
export type Ensayo = {
  id: string;
  tipo: string;
  analista: string;
  fecha: string; // fecha de ensayo
  estado: 'Aprobado' | 'En Progreso' | 'Rechazado' | 'Pendiente de Revisión' | 'En Análisis' | 'Recibida' | 'Archivada';
  producto: string;
  id_muestra?: string; // Optional, to link back to control rutinario if needed
  fecha_ingreso?: string; // fecha de inspeccion
  hora?: string; // hora de inspeccion
  inspector?: string;
  maquina?: string;
  fvTotalPorcentaje?: number;
  fvIntermediaPorcentaje?: number;
  [key: string]: any; 
}

export interface Registro {
  id: string;
  fecha: string;
  hora: string;
  inspector: string;
  maquinista: string;
  maquina: string;
  producto: string;
  marca: string;
  diametro?: number | null;
  espesor_min?: number | null;
  espesor_max?: number | null;
  largo?: number | null;
  peso_muestra?: number | null;
  peso_kg_m?: number | null;
  ovalidad?: number | null;
  observaciones_visuales?: string | null;
  color_tuberia?: string | null;
  color_linea?: string | null;
  resultado: 'Conforme' | 'No Conforme';
  enviado_lab: boolean;
}

export interface RecentActivity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}

export interface Equipo {
    id: string;
    nombre: string;
    marca?: string;
    modelo?: string;
    ubicacion?: string;
    criticidad?: 'Alta' | 'Media' | 'Baja';
    estado: 'Activo' | 'En Mantenimiento' | 'Inactivo' | 'Requiere Calibración';
    proxima_calibracion: string;
    observaciones?: string;
    fotoUrl?: string;
    ensayos_asociados?: string[];
}

export interface ControlEvento {
    id: string;
    equipoId: string;
    fecha: string;
    tipo: 'Calibración' | 'Verificación' | 'Mantenimiento Preventivo' | 'Mantenimiento Correctivo';
    responsable: string;
    observaciones?: string;
    certificadoUrl?: string;
}

export interface NoConformidad {
    id: string;
    tipo: 'Interna' | 'Reclamo de Cliente' | 'Auditoría';
    fecha_deteccion: string;
    descripcion: string;
    estado: 'Abierta' | 'En Investigación' | 'Resuelta' | 'Cerrada';
    severidad: 'Baja' | 'Media' | 'Alta' | 'Crítica';
    responsable: string;
    fecha_vencimiento?: string;
    accion_correctiva?: string;
    productos_afectados?: string[];
    equipos_implicados?: string[];
}


interface DynamicDataContextType {
  ensayos: Ensayo[];
  registros: Registro[];
  recentActivity: RecentActivity[];
  equipos: Equipo[];
  controles: ControlEvento[];
  noConformidades: NoConformidad[];
  addEnsayo: (ensayo: Omit<Ensayo, 'id'>) => Promise<Ensayo>;
  updateEnsayo: (id: string, ensayo: Partial<Ensayo>) => Promise<void>;
  deleteEnsayo: (id: string) => Promise<void>;
  addRegistro: (registro: Omit<Registro, 'id'>) => Promise<Registro>;
  deleteRegistro: (registroId: string) => Promise<void>;
  addEquipo: (equipo: Omit<Equipo, 'id'>) => Promise<Equipo>;
  updateEquipo: (id: string, equipo: Partial<Equipo>) => Promise<void>;
  deleteEquipo: (id: string) => Promise<void>;
  addControlEvento: (evento: Omit<ControlEvento, 'id'>) => Promise<ControlEvento>;
  addIncidencia: (incidencia: Omit<NoConformidad, 'id'>) => Promise<NoConformidad>;
  updateIncidencia: (id: string, incidencia: Partial<NoConformidad>) => Promise<void>;
  deleteIncidencia: (id: string) => Promise<void>;
  addRecentActivity: (activity: Omit<RecentActivity, 'id' | 'timestamp'>) => Promise<void>;
  isLoading: boolean;
}

const DynamicDataContext = createContext<DynamicDataContextType | undefined>(undefined);


// --- PROVIDER COMPONENT ---
interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  // Static data state
  const [productMatrix, setProductMatrix] = useState<TipoProducto[]>([]);
  const [sapProducts, setSapProducts] = useState<SapProduct[]>([]);
  const [isStaticLoaded, setIsStaticLoaded] = useState(false);

  // Dynamic data state (initialized with demo data)
  const [ensayos, setEnsayos] = useState<Ensayo[]>(demoEnsayos);
  const [registros, setRegistros] = useState<Registro[]>(demoRegistros);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>(demoRecentActivity);
  const [equipos, setEquipos] = useState<Equipo[]>(demoEquipos);
  const [controles, setControles] = useState<ControlEvento[]>(demoControles);
  const [noConformidades, setNoConformidades] = useState<NoConformidad[]>(demoNoConformidades);
  const [isLoading, setIsLoading] = useState(true);

  // Load static data once
  useEffect(() => {
    const loadStaticData = async () => {
      setIsLoading(true);
      try {
        const matrix = await getMatrizProductos();
        setProductMatrix(matrix);
        const products = await getProductsFromSap();
        setSapProducts(products);

        // Check equipment calibration status on load
        const today = new Date();
        const updatedEquipos = demoEquipos.map(equipo => {
            if (equipo.estado === 'Activo' && isPast(parseISO(equipo.proxima_calibracion))) {
                return { ...equipo, estado: 'Requiere Calibración' as const };
            }
            return equipo;
        });
        setEquipos(updatedEquipos);

      } catch (error) {
        console.error("Failed to load initial static data", error);
      } finally {
        setIsStaticLoaded(true);
        setIsLoading(false); // Stop loading after static data is fetched
      }
    };
    loadStaticData();
  }, []);

  const addEnsayo = useCallback(async (ensayoData: Omit<Ensayo, 'id'>) => {
    // In demo mode, we just simulate adding to the list.
    const newId = `LAB-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const newEnsayo = { ...ensayoData, id: newId };
    setEnsayos(prev => [newEnsayo, ...prev]);
    console.log("Demo Mode: Added Ensayo", newEnsayo);
    return newEnsayo;
  }, []);

  const updateEnsayo = useCallback(async (id: string, updatedEnsayoData: Partial<Ensayo>) => {
    setEnsayos(prev => prev.map(e => e.id === id ? { ...e, ...updatedEnsayoData } : e));
    console.log("Demo Mode: Updated Ensayo", id, updatedEnsayoData);
  }, []);

  const deleteEnsayo = useCallback(async (id: string) => {
    setEnsayos(prev => prev.filter(e => e.id !== id));
    console.log("Demo Mode: Deleted Ensayo", id);
  }, []);

  const addRegistro = useCallback(async (registroData: Omit<Registro, 'id'>) => {
     // In demo mode, we just simulate adding to the list.
    const newId = `CTRL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const newRegistro = { ...registroData, id: newId };
    setRegistros(prev => [newRegistro, ...prev]);
    console.log("Demo Mode: Added Registro", newRegistro);
    return newRegistro;
  }, []);

  const deleteRegistro = useCallback(async (registroId: string) => {
    setRegistros(prev => prev.filter(r => r.id !== registroId));
    console.log("Demo Mode: Deleted Registro", registroId);
  }, []);
  
  const addEquipo = useCallback(async (equipoData: Omit<Equipo, 'id'>) => {
    const newEquipo = { ...equipoData, id: equipoData.id }; // Use provided ID
    setEquipos(prev => [newEquipo, ...prev].sort((a, b) => a.nombre.localeCompare(b.nombre)));
    console.log("Demo Mode: Added Equipo", newEquipo);
    return newEquipo;
  }, []);

  const updateEquipo = useCallback(async (id: string, updatedEquipoData: Partial<Equipo>) => {
      setEquipos(prev => prev.map(e => e.id === id ? { ...e, ...updatedEquipoData } : e).sort((a, b) => a.nombre.localeCompare(b.nombre)));
      console.log("Demo Mode: Updated Equipo", id, updatedEquipoData);
  }, []);
  
  const deleteEquipo = useCallback(async (id: string) => {
      setEquipos(prev => prev.filter(e => e.id !== id));
      console.log("Demo Mode: Deleted Equipo", id);
  }, []);

  const addControlEvento = useCallback(async (eventoData: Omit<ControlEvento, 'id'>) => {
    const newId = `CE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const newEvento = { ...eventoData, id: newId };
    setControles(prev => [newEvento, ...prev]);
    console.log("Demo Mode: Added Control Evento", newEvento);
    return newEvento;
  }, []);

  const addIncidencia = useCallback(async (incidenciaData: Omit<NoConformidad, 'id'>) => {
    const newId = `NC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const newIncidencia = { ...incidenciaData, id: newId };
    setNoConformidades(prev => [newIncidencia, ...prev]);
    console.log("Demo Mode: Added Incidencia", newIncidencia);
    return newIncidencia;
  }, []);

  const updateIncidencia = useCallback(async (id: string, updatedIncidenciaData: Partial<NoConformidad>) => {
      setNoConformidades(prev => prev.map(nc => nc.id === id ? { ...nc, ...updatedIncidenciaData } : nc));
      console.log("Demo Mode: Updated Incidencia", id, updatedIncidenciaData);
  }, []);

  const deleteIncidencia = useCallback(async (id: string) => {
      setNoConformidades(prev => prev.filter(nc => nc.id !== id));
      console.log("Demo Mode: Deleted Incidencia", id);
  }, []);

  const addRecentActivity = useCallback(async (activity: Omit<RecentActivity, 'id' | 'timestamp'>) => {
     const newActivity = {
        ...activity,
        id: `ACT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        timestamp: new Date().toISOString()
    };
    setRecentActivity(prev => [newActivity, ...prev]);
    console.log("Demo Mode: Added Activity", newActivity);
  }, []);

  const dynamicContextValue = useMemo(() => ({
    ensayos,
    registros,
    recentActivity,
    equipos,
    controles,
    noConformidades,
    addEnsayo,
    updateEnsayo,
    deleteEnsayo,
    addRegistro,
    deleteRegistro,
    addEquipo,
    updateEquipo,
    deleteEquipo,
    addControlEvento,
    addIncidencia,
    updateIncidencia,
    deleteIncidencia,
    addRecentActivity,
    isLoading,
  }), [ensayos, registros, recentActivity, equipos, controles, noConformidades, isLoading, addEnsayo, updateEnsayo, deleteEnsayo, addRegistro, deleteRegistro, addEquipo, updateEquipo, deleteEquipo, addControlEvento, addIncidencia, updateIncidencia, deleteIncidencia, addRecentActivity]);

  const staticContextValue = useMemo(() => ({
    productMatrix,
    sapProducts,
    isLoaded: isStaticLoaded
  }), [productMatrix, sapProducts, isStaticLoaded]);

  return (
    <StaticDataContext.Provider value={staticContextValue}>
      <DynamicDataContext.Provider value={dynamicContextValue}>
        {children}
      </DynamicDataContext.Provider>
    </StaticDataContext.Provider>
  );
};

// --- CUSTOM HOOKS ---
export const useStaticData = () => {
  const context = useContext(StaticDataContext);
  if (context === undefined) {
    throw new Error('useStaticData must be used within a DataProvider');
  }
  return context;
};

export const useDynamicData = () => {
  const context = useContext(DynamicDataContext);
  if (context === undefined) {
    throw new Error('useDynamicData must be used within a DataProvider');
  }
  return context;
};
