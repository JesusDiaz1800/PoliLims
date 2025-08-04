

"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect, useCallback } from 'react';
import { getMatrizProductos, type TipoProducto } from "@/lib/matriz-datos";
import { getProductsFromSap, type SapProduct } from "@/services/sap-service";
import * as dataService from '@/services/data-service';

// --- DEMO DATA ---
const demoRegistros: Registro[] = [
    { id: 'CTRL-001', fecha: '2025-07-20', hora: '10:30', inspector: 'Elias Ibañez', maquinista: 'ANDRÉS REYES', maquina: 'PE1', producto: 'Tubería HDPE 90mm PN-16 SDR-11', marca: 'POLIFUSIÓN S.A.', diametro: 90.1, espesor_min: 8.2, espesor_max: 8.3, largo: 1000, peso_muestra: 2200, peso_kg_m: 2.2, ovalidad: 0.5, observaciones_visuales: 'Sin observaciones', color_tuberia: 'Negro', color_linea: 'Azul', resultado: 'Conforme', enviado_lab: true },
    { id: 'CTRL-002', fecha: '2025-07-20', hora: '11:15', inspector: 'Cristian Montellano', maquinista: 'ALEXIS SANDOVAL', maquina: 'PE2', producto: 'Tubería HDPE 110mm PN-10 SDR-17', marca: 'POLIFUSIÓN S.A.', diametro: 110.2, espesor_min: 6.5, espesor_max: 6.6, largo: 1000, peso_muestra: 2100, peso_kg_m: 2.1, ovalidad: 0.6, observaciones_visuales: '', color_tuberia: 'Negro', color_linea: 'Azul', resultado: 'Conforme', enviado_lab: true },
    { id: 'CTRL-003', fecha: '2025-07-19', hora: '14:00', inspector: 'Daniel Palma', maquinista: 'CARLOS DOMÍNGUEZ', maquina: 'PP3', producto: 'Tubería PP-R 25mm PN-20', marca: 'SMART PIPES SpA', diametro: 25.3, espesor_min: 4.2, espesor_max: 4.3, largo: 1000, peso_muestra: 300, peso_kg_m: 0.3, ovalidad: 0.2, observaciones_visuales: 'Superficie ligeramente rugosa', color_tuberia: 'Verde', color_linea: 'Roja', resultado: 'No Conforme', enviado_lab: false },
    { id: 'CTRL-004', fecha: '2025-07-19', hora: '09:05', inspector: 'Luis Parada', maquinista: 'CRISTIAN DUQUE', maquina: 'PE3', producto: 'Tubería HDPE 63mm PN-16 SDR-11', marca: 'POLIFUSIÓN S.A.', diametro: 63.1, espesor_min: 5.8, espesor_max: 5.9, largo: 1000, peso_muestra: 1100, peso_kg_m: 1.1, ovalidad: 0.4, observaciones_visuales: '', color_tuberia: 'Negro', color_linea: 'Azul', resultado: 'Conforme', enviado_lab: true },
];

const demoEnsayos = [
    // --- July 2025 Data ---
    { id: 'LAB-07-01', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '2025-07-23', estado: 'Pendiente de Revisión' as const, producto: 'Tubería HDPE 90mm', lote: 'Lote-250722-PE1', meltIndexCalculado: null, meltIndexVariacion: null, densidadCalculada: null, negroHumoCalculado: null, fecha_ingreso: '2025-07-22', hora: '15:00', inspector: 'Luis Parada', maquina: 'PE1' },
    { id: 'LAB-07-02', tipo: 'Tubería PP', analista: 'Antonia Figueroa', fecha: '2025-07-23', estado: 'En Análisis' as const, producto: 'Tubería PP-R 50mm', lote: 'Lote-250722-PP2', meltIndexCalculado: 0.28, meltIndexVariacion: 1.5, densidadCalculada: 0.905, negroHumoCalculado: null, fecha_ingreso: '2025-07-22', hora: '13:20', inspector: 'Cristian Montellano', maquina: 'PP2' },
    { id: 'LAB-07-03', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '2025-07-23', estado: 'Aprobado' as const, producto: 'HE3490LS', lote: '1325115', proveedor: 'BOREALIS CO.', orden_compra: '170708', melt_index_reportado: '0.2308', meltIndexCalculado: 0.241, meltIndexVariacion: 4.42, densidad_liquido: '0.959', densidadCalculada: 0.959, negroHumoCalculado: 2.25 },
    { id: 'LAB-07-04', tipo: 'Reprocesado', analista: 'Robinson Córdova', fecha: '2025-07-22', estado: 'En Progreso' as const, producto: 'Reprocesado Lote RP-0720', lote: 'RP-0720', meltIndexCalculado: 0.29, meltIndexVariacion: 3.2, densidadCalculada: 0.955, negroHumoCalculado: 2.3 },
    { id: 'LAB-07-05', tipo: 'Tubería HDPE', analista: 'Bryan Vásquez', fecha: '2025-07-22', estado: 'Aprobado' as const, producto: 'Tubería HDPE 110mm', lote: 'Lote-250719-PE2', meltIndexCalculado: 0.25, meltIndexVariacion: 2.0, densidadCalculada: 0.960, negroHumoCalculado: 2.15, fecha_ingreso: '2025-07-19', hora: '11:15', inspector: 'Cristian Montellano', maquina: 'PE2' },
    { id: 'LAB-07-06', tipo: 'Tubería PP', analista: 'Jesus Diaz', fecha: '2025-07-21', estado: 'Rechazado' as const, producto: 'Tubería PP-R 25mm', lote: 'Lote-250718-PP3', meltIndexCalculado: 0.35, meltIndexVariacion: 15.3, densidadCalculada: 0.910, negroHumoCalculado: null, fecha_ingreso: '2025-07-18', hora: '14:00', inspector: 'Daniel Palma', maquina: 'PP3' },
    { id: 'LAB-07-07', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '2025-07-21', estado: 'Aprobado' as const, producto: 'R202P', lote: '500312', proveedor: 'AUSTRADE', orden_compra: '170320', melt_index_reportado: '0.2075', meltIndexCalculado: 0.21, meltIndexVariacion: 1.2, densidad_liquido: '0.900', densidadCalculada: 0.901, negroHumoCalculado: null },
    { id: 'LAB-07-08', tipo: 'Tubería HDPE', analista: 'Maximiliano Miranda', fecha: '2025-07-20', estado: 'Aprobado' as const, producto: 'Tubería HDPE 63mm', lote: 'Lote-250715-PE3', meltIndexCalculado: 0.23, meltIndexVariacion: 1.8, densidadCalculada: 0.958, negroHumoCalculado: 2.2, fecha_ingreso: '2025-07-15', hora: '09:05', inspector: 'Luis Parada', maquina: 'PE3' },
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
  { id: 'EQ-01', nombre: 'Espectrómetro FTIR', estado: 'Activo' as const },
  { id: 'EQ-02', nombre: 'Prensa de Impacto', estado: 'Activo' as const },
  { id: 'EQ-03', nombre: 'Calorímetro DSC', estado: 'Activo' as const },
  { id: 'EQ-04', nombre: 'Plastómetro MFI', estado: 'Activo' as const },
  { id: 'EQ-05', nombre: 'Balanza Analítica', estado: 'Activo' as const },
  { id: 'EQ-06', nombre: 'Mufla para Cenizas', estado: 'Activo' as const },
  { id: 'EQ-07', nombre: 'Máquina de Tracción', estado: 'En Mantenimiento' as const },
  { id: 'EQ-08', nombre: 'Termociclador PHI', estado: 'Activo' as const },
  { id: 'EQ-09', nombre: 'Microscopio Óptico', estado: 'Activo' as const },
  { id: 'EQ-10', nombre: 'Medidor de Densidad', estado: 'Activo' as const },
  { id: 'EQ-11', nombre: 'Cámara Climática', estado: 'Inactivo' as const },
  { id: 'EQ-12', nombre: 'Horno de Contracción', estado: 'Activo' as const },
  { id: 'EQ-13', nombre: 'Rugosímetro', estado: 'Activo' as const },
  { id: 'EQ-14', nombre: 'Equipo TIO', estado: 'Activo' as const },
  { id: 'EQ-15', nombre: 'Prensa de Impacto #2', estado: 'Activo' as const },
  { id: 'EQ-16', nombre: 'Calorímetro DSC #2', estado: 'Activo' as const },
  { id: 'EQ-17', nombre: 'Plastómetro MFI #2', estado: 'En Mantenimiento' as const },
  { id: 'EQ-18', nombre: 'Balanza Analítica #2', estado: 'Activo' as const },
  { id: 'EQ-19', nombre: 'Máquina de Tracción #2', estado: 'Activo' as const },
  { id: 'EQ-20', nombre: 'Termociclador PHI #2', estado: 'Activo' as const },
  { id: 'EQ-21', nombre: 'Microscopio Óptico #2', estado: 'Inactivo' as const },
  { id: 'EQ-22', nombre: 'Medidor de Densidad #2', estado: 'Activo' as const },
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
    estado: 'Activo' | 'En Mantenimiento' | 'Inactivo';
}


interface DynamicDataContextType {
  ensayos: Ensayo[];
  registros: Registro[];
  recentActivity: RecentActivity[];
  equipos: Equipo[];
  addEnsayo: (ensayo: Omit<Ensayo, 'id'>) => Promise<Ensayo>;
  updateEnsayo: (id: string, ensayo: Partial<Ensayo>) => Promise<void>;
  deleteEnsayo: (id: string) => Promise<void>;
  addRegistro: (registro: Omit<Registro, 'id'>) => Promise<Registro>;
  deleteRegistro: (registroId: string) => Promise<void>;
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
    addEnsayo,
    updateEnsayo,
    deleteEnsayo,
    addRegistro,
    deleteRegistro,
    addRecentActivity,
    isLoading,
  }), [ensayos, registros, recentActivity, equipos, isLoading, addEnsayo, updateEnsayo, deleteEnsayo, addRegistro, deleteRegistro, addRecentActivity]);

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
