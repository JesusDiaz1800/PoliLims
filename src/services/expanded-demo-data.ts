/**
 * Datos demo expandidos para PoliLims - Prototipo 100% funcional
 * 
 * Este archivo contiene una amplia gama de datos simulados realistas
 * para demostrar todas las funcionalidades del sistema LIMS.
 */

import type { User } from '@/services/user-service';

// Usuarios reales originales
export const expandedUsuarios: User[] = [
  {
    username: "jdiaz",
    fullName: "Jesus Diaz",
    role: "Ing. Analista de Calidad",
    initials: "JD",
    avatarUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiMzQjgyRjYiLz4KPHR2ZCB4PSIyMCIgeT0iMjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCIgZm9udC1mYW1pbHk9IkFyaWFsIj5KRDwvdGV4dD4KPC9zdmc+Cg=="
  },
  {
    username: "vlutz",
    fullName: "Victor Lutz",
    role: "Jefe de Calidad",
    initials: "VL",
    avatarUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiNGRjY4NzUiLz4KPHR2ZCB4PSIyMCIgeT0iMjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCIgZm9udC1mYW1pbHk9IkFyaWFsIj5WTDwvdGV4dD4KPC9zdmc+Cg=="
  },
  {
    username: "afigueroa",
    fullName: "Antonia Figueroa",
    role: "Analista de Calidad",
    initials: "AF",
    avatarUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiNGRjA5ODAiLz4KPHR2ZCB4PSIyMCIgeT0iMjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCIgZm9udC1mYW1pbHk9IkFyaWFsIj5BRjwvdGV4dD4KPC9zdmc+Cg=="
  },
  {
    username: "rcordova",
    fullName: "Robinson Córdova",
    role: "Inspector de Calidad",
    initials: "RC",
    avatarUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiM0QzFGNSIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCIgZm9udC1mYW1pbHk9IkFyaWFsIj5SQzwvdGV4dD4KPC9zdmc+Cg=="
  },
  {
    username: "mmiranda",
    fullName: "Maximiliano Miranda",
    role: "Ing. Analista de Calidad",
    initials: "MM",
    avatarUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiNGRjU3MjIiLz4KPHR2ZCB4PSIyMCIgeT0iMjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCIgZm9udC1mYW1pbHk9IkFyaWFsIj5NTTwvdGV4dD4KPC9zdmc+Cg=="
  }
];

// Ensayos expandidos con datos realistas y completos
export const expandedEnsayos = [
  // --- Julio 2025 Data (Más reciente) ---
  { id: 'LAB-07-01', id_muestra: 'CTRL-001', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '23-07-2025', estado: 'Pendiente de Revisión', producto: 'Tubería HDPE 90mm PN-16 SDR-11', lote: 'Lote-250720-PE1', meltIndexCalculado: 0.245, meltIndexVariacion: 2.1, densidadCalculada: 0.958, negroHumoCalculado: 2.2, tio_tiempo: 25, resistencia_traccion: 23.5, elongacion_rotura: 610, dispersion_nh: 'A2', fecha_ingreso: '20-07-2025', hora: '10:30', inspector: 'Elias Ibañez', maquina: 'PE1', cliente: 'Constructora San Pedro Ltda.', observaciones: 'Ensayo en proceso de revisión final', tipo_ensayo: 'Caracterización Completa' },
  { id: 'LAB-07-02', tipo: 'Tubería PP', analista: 'Antonia Figueroa', fecha: '23-07-2025', estado: 'En Análisis', producto: 'Tubería PP-R 50mm PN-20 con fibra de vidrio', lote: 'Lote-250722-PP2', meltIndexCalculado: 0.28, meltIndexVariacion: 1.5, densidadCalculada: 0.905, negroHumoCalculado: null, fvTotalPorcentaje: 18.2, fvIntermediaPorcentaje: 20.1, fecha_ingreso: '22-07-2025', hora: '13:20', inspector: 'Cristian Montellano', maquina: 'PP2', cliente: 'Hidrotec S.A.', observaciones: 'Análisis de fibra de vidrio en curso', tipo_ensayo: 'Contenido de Fibra de Vidrio' },
  { id: 'LAB-07-03', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '23-07-2025', estado: 'Aprobado', producto: 'HE3490LS', lote: '1325115', proveedor: 'BOREALIS CO.', orden_compra: '170708', melt_index_reportado: '0.2308', meltIndexCalculado: 0.241, meltIndexVariacion: 4.42, densidad_liquido: '0.959', densidadCalculada: 0.959, negroHumoCalculado: 2.25, tio_tiempo: 45, dsc_punto_fusion: 133, cliente: 'BOREALIS CO.', observaciones: 'Material cumple especificaciones según ficha técnica', tipo_ensayo: 'Melt Index y Densidad', fecha_ingreso: '20-07-2025' },
  { id: 'LAB-07-04', tipo: 'Reprocesado', analista: 'Robinson Córdova', fecha: '22-07-2025', estado: 'En Progreso', producto: 'Reprocesado Lote RP-0720-PE1', lote: 'RP-0720', meltIndexCalculado: 0.29, meltIndexVariacion: 3.2, densidadCalculada: 0.955, negroHumoCalculado: 2.3, tio_tiempo: 21, cliente: 'Control Interno', observaciones: 'Análisis de contaminación y viabilidad', tipo_ensayo: 'Caracterización para Reproceso', fecha_ingreso: '21-07-2025' },
  { id: 'LAB-07-05', id_muestra: 'CTRL-002', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '24-07-2025', estado: 'Aprobado', producto: 'Tubería HDPE 110mm PN-10 SDR-17', lote: 'Lote-250720-PE2', meltIndexCalculado: 0.25, meltIndexVariacion: 1.8, densidadCalculada: 0.959, negroHumoCalculado: 2.3, tio_tiempo: 28, resistencia_traccion: 24.1, elongacion_rotura: 620, dispersion_nh: 'A1', fecha_ingreso: '20-07-2025', hora: '11:15', inspector: 'Cristian Montellano', maquina: 'PE2', cliente: 'Obras Sanitarias del Norte', observaciones: 'Cumple especificaciones NCh 399 y ASTM F714', tipo_ensayo: 'Presión Hidrostática' },
  { id: 'LAB-07-06', tipo: 'Tubería PP', analista: 'Maximiliano Miranda', fecha: '24-07-2025', estado: 'Aprobado', producto: 'Tubería PP-R 32mm PN-20', lote: 'Lote-250720-PP3', meltIndexCalculado: 0.29, meltIndexVariacion: 2.0, densidadCalculada: 0.903, fvTotalPorcentaje: 17.8, fvIntermediaPorcentaje: 19.5, fecha_ingreso: '20-07-2025', hora: '11:00', inspector: 'Daniel Palma', maquina: 'PP3', cliente: 'Instalaciones Técnicas SpA', observaciones: 'Ensayo de presión hidrostática exitoso - 1000 horas', tipo_ensayo: 'Presión Hidrostática' },
  { id: 'LAB-07-07', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '25-07-2025', estado: 'Rechazado', producto: 'PPR-Y40 Genérico', lote: 'XYZ-987', proveedor: 'GENERICO', orden_compra: '170701', melt_index_reportado: '0.3', meltIndexCalculado: 0.45, meltIndexVariacion: 50, densidad_liquido: '0.901', densidadCalculada: 0.901, cliente: 'Proveedor Secundario', observaciones: 'Melt Index fuera de especificación (12.5 vs 10±2)', tipo_ensayo: 'Melt Index', fecha_ingreso: '24-07-2025' },
  { id: 'LAB-07-08', tipo: 'Tubería HDPE', analista: 'Robinson Córdova', fecha: '25-07-2025', estado: 'Aprobado', producto: 'Tubería HDPE 63mm PN-16 SDR-11', lote: 'Lote-250725-PE3', meltIndexCalculado: 0.25, meltIndexVariacion: 2.5, densidadCalculada: 0.956, negroHumoCalculado: 2.4, tio_tiempo: 30, resistencia_traccion: 23.0, elongacion_rotura: 605, dispersion_nh: 'A1', fecha_ingreso: '25-07-2025', hora: '08:30', inspector: 'Luis Parada', maquina: 'PE3', cliente: 'Ductos y Accesorios Ltda.', observaciones: 'Cumple todos los parámetros NCh 399', tipo_ensayo: 'Caracterización Completa' },
  { id: 'LAB-07-09', tipo: 'Tubería HDPE', analista: 'Maximiliano Miranda', fecha: '26-07-2025', estado: 'Aprobado', producto: 'Tubería HDPE 160mm PN-10 SDR-17', lote: 'Lote-250726-PE4', meltIndexCalculado: 0.24, meltIndexVariacion: 1.5, densidadCalculada: 0.957, negroHumoCalculado: 2.1, tio_tiempo: 26, resistencia_traccion: 23.8, elongacion_rotura: 615, dispersion_nh: 'A1', fecha_ingreso: '25-07-2025', hora: '09:00', inspector: 'Elias Ibañez', maquina: 'PE1', cliente: 'Aguas del Valle S.A.', observaciones: 'Ensayo de tracción y elongación aprobado', tipo_ensayo: 'Propiedades Mecánicas' },
  { id: 'LAB-07-10', tipo: 'Conexiones', analista: 'Robinson Córdova', fecha: '26-07-2025', estado: 'En Análisis', producto: 'Fitting PP-R 25mm Codo 90°', lote: 'Lote-250726-FIT1', meltIndexCalculado: 0.28, meltIndexVariacion: 1.8, densidadCalculada: 0.904, fecha_ingreso: '25-07-2025', hora: '14:00', inspector: 'Daniel Palma', maquina: 'PP3', cliente: 'Conexiones del Sur', observaciones: 'Ensayo de resistencia en curso', tipo_ensayo: 'Resistencia Mecánica' },
  { id: 'LAB-07-11', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '27-07-2025', estado: 'Aprobado', producto: 'Masterbatch Negro MB-001', lote: 'MB-0727-001', proveedor: 'Clariant Chile', orden_compra: '170702', negroHumoCalculado: 2.15, dispersion_nh: 'A1', cliente: 'Clariant Chile', observaciones: 'Dispersión y concentración dentro de especificación', tipo_ensayo: 'Caracterización de Aditivos', fecha_ingreso: '26-07-2025' },
  { id: 'LAB-07-12', tipo: 'Tubería PP', analista: 'Jesus Diaz', fecha: '27-07-2025', estado: 'Pendiente de Revisión', producto: 'Tubería PP-R 75mm PN-16', lote: 'Lote-250727-PP4', meltIndexCalculado: 0.27, meltIndexVariacion: 2.2, densidadCalculada: 0.906, fvTotalPorcentaje: 19.1, fvIntermediaPorcentaje: 21.3, fecha_ingreso: '26-07-2025', hora: '15:30', inspector: 'Cristian Montellano', maquina: 'PP2', cliente: 'Termofusión Chile', observaciones: 'Esperando segunda opinión en resistencia al impacto', tipo_ensayo: 'Resistencia al Impacto' },
  { id: 'LAB-07-13', tipo: 'Tubería HDPE', analista: 'Maximiliano Miranda', fecha: '28-07-2025', estado: 'En Análisis', producto: 'Tubería HDPE 200mm PN-6 SDR-26', lote: 'Lote-250728-PE5', meltIndexCalculado: 0.26, meltIndexVariacion: 1.9, densidadCalculada: 0.958, negroHumoCalculado: 2.3, tio_tiempo: 32, fecha_ingreso: '27-07-2025', hora: '10:15', inspector: 'Luis Parada', maquina: 'PE3', cliente: 'Construcciones del Maule', observaciones: 'Ensayo de OIT en curso', tipo_ensayo: 'Tiempo de Inducción Oxidativa' },
  { id: 'LAB-07-14', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '28-07-2025', estado: 'Aprobado', producto: 'PP Copolímero Random H110-02', lote: 'H110-0728-002', proveedor: 'Lyondell Basell', orden_compra: '170703', melt_index_reportado: '0.25', meltIndexCalculado: 0.248, meltIndexVariacion: 0.8, densidad_liquido: '0.905', densidadCalculada: 0.905, cliente: 'Lyondell Basell', observaciones: 'Todas las propiedades dentro de especificación', tipo_ensayo: 'Caracterización Completa', fecha_ingreso: '27-07-2025' },
  { id: 'LAB-07-15', tipo: 'Conexiones', analista: 'Robinson Córdova', fecha: '29-07-2025', estado: 'Pendiente de Revisión', producto: 'Unión Electrofusión HDPE 90mm', lote: 'Lote-250729-FIT2', meltIndexCalculado: 0.25, meltIndexVariacion: 1.2, densidadCalculada: 0.958, fecha_ingreso: '28-07-2025', hora: '16:45', inspector: 'Elias Ibañez', maquina: 'PE1', cliente: 'Fusiones Industriales', observaciones: 'Evaluando resistencia de la soldadura', tipo_ensayo: 'Resistencia de Soldadura' },
  
  // --- Junio 2025 Data ---
  { id: 'LAB-06-01', tipo: 'Tubería HDPE', analista: 'Antonia Figueroa', fecha: '18-06-2025', estado: 'Aprobado', producto: 'Tubería HDPE 90mm PN-16 SDR-11', lote: 'Lote-250615-PE1', meltIndexCalculado: 0.24, meltIndexVariacion: 1.5, densidadCalculada: 0.957, negroHumoCalculado: 2.1, tio_tiempo: 26, resistencia_traccion: 23.8, elongacion_rotura: 615, dispersion_nh: 'A1', fecha_ingreso: '15-06-2025', hora: '09:00', inspector: 'Elias Ibañez', maquina: 'PE1', cliente: 'Constructora San Pedro Ltda.', observaciones: 'Cumple especificaciones NCh 399', tipo_ensayo: 'Caracterización Completa' },
  { id: 'LAB-06-02', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '19-06-2025', estado: 'Aprobado', producto: 'Tubería HDPE 90mm PN-16 SDR-11', lote: 'Lote-250616-PE1', meltIndexCalculado: 0.242, meltIndexVariacion: 1.7, densidadCalculada: 0.958, negroHumoCalculado: 2.2, tio_tiempo: 27, resistencia_traccion: 23.9, elongacion_rotura: 618, dispersion_nh: 'A2', fecha_ingreso: '16-06-2025', hora: '10:00', inspector: 'Elias Ibañez', maquina: 'PE1', cliente: 'Constructora San Pedro Ltda.', observaciones: 'Segundo lote del día, calidad consistente', tipo_ensayo: 'Caracterización Completa' },
  { id: 'LAB-06-03', tipo: 'Materia Prima', analista: 'Robinson Córdova', fecha: '12-06-2025', estado: 'Rechazado', producto: 'PPR-Y40', lote: 'XYZ-987', proveedor: 'GENERICO', orden_compra: '170601', melt_index_reportado: '0.3', meltIndexCalculado: 0.45, meltIndexVariacion: 50, densidad_liquido: '0.901', densidadCalculada: 0.901, cliente: 'Proveedor Secundario', observaciones: 'Melt Index fuera de especificación, posible contaminación', tipo_ensayo: 'Melt Index', fecha_ingreso: '11-06-2025' },
  { id: 'LAB-06-04', tipo: 'Tubería PP', analista: 'Antonia Figueroa', fecha: '25-06-2025', estado: 'Aprobado', producto: 'Tubería PP-R 50mm PN-20', lote: 'Lote-250622-PP2', meltIndexCalculado: 0.28, meltIndexVariacion: 1.5, densidadCalculada: 0.905, negroHumoCalculado: null, fvTotalPorcentaje: 18.2, fvIntermediaPorcentaje: 20.1, fecha_ingreso: '22-06-2025', hora: '13:20', inspector: 'Cristian Montellano', maquina: 'PP2', cliente: 'Hidrotec S.A.', observaciones: 'Ensayo de presión hidrostática exitoso', tipo_ensayo: 'Presión Hidrostática' },
  { id: 'LAB-06-05', tipo: 'Tubería HDPE', analista: 'Maximiliano Miranda', fecha: '28-06-2025', estado: 'Aprobado', producto: 'Tubería HDPE 160mm PN-10 SDR-17', lote: 'Lote-250625-PE4', meltIndexCalculado: 0.25, meltIndexVariacion: 2.0, densidadCalculada: 0.956, negroHumoCalculado: 2.3, tio_tiempo: 29, resistencia_traccion: 24.0, elongacion_rotura: 620, dispersion_nh: 'A1', fecha_ingreso: '25-06-2025', hora: '14:30', inspector: 'Luis Parada', maquina: 'PE3', cliente: 'Aguas del Valle S.A.', observaciones: 'Ensayo de tracción y elongación aprobado', tipo_ensayo: 'Propiedades Mecánicas' },
  { id: 'LAB-06-06', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '30-06-2025', estado: 'Aprobado', producto: 'HE3490LS', lote: '1325110', proveedor: 'BOREALIS CO.', orden_compra: '170602', melt_index_reportado: '0.23', meltIndexCalculado: 0.235, meltIndexVariacion: 2.17, densidad_liquido: '0.959', densidadCalculada: 0.959, negroHumoCalculado: 2.15, tio_tiempo: 48, dsc_punto_fusion: 133, cliente: 'BOREALIS CO.', observaciones: 'Material cumple especificaciones según ficha técnica', tipo_ensayo: 'Melt Index y Densidad', fecha_ingreso: '29-06-2025' },
  
  // --- Mayo 2025 Data ---
  { id: 'LAB-05-01', tipo: 'Tubería PP', analista: 'Jesus Diaz', fecha: '25-05-2025', estado: 'Aprobado', producto: 'Tubería PP-R 25mm PN-20', lote: 'Lote-250522-PP3', meltIndexCalculado: 0.29, meltIndexVariacion: 2.0, densidadCalculada: 0.903, fvTotalPorcentaje: 17.8, fvIntermediaPorcentaje: 19.5, fecha_ingreso: '22-05-2025', hora: '11:00', inspector: 'Daniel Palma', maquina: 'PP3', cliente: 'Fontanería Urbana', observaciones: 'Cumple especificaciones para agua caliente', tipo_ensayo: 'Resistencia Térmica' },
  { id: 'LAB-05-02', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '15-05-2025', estado: 'Aprobado', producto: 'HE3490LS', lote: '1325110', proveedor: 'BOREALIS CO.', orden_compra: '170502', melt_index_reportado: '0.23', meltIndexCalculado: 0.235, meltIndexVariacion: 2.17, densidad_liquido: '0.959', densidadCalculada: 0.959, negroHumoCalculado: 2.15, tio_tiempo: 48, dsc_punto_fusion: 133, cliente: 'BOREALIS CO.', observaciones: 'Primer lote del año, calidad superior confirmada', tipo_ensayo: 'Control de Primer Lote', fecha_ingreso: '14-05-2025' },
  { id: 'LAB-05-03', tipo: 'Tubería HDPE', analista: 'Robinson Córdova', fecha: '20-05-2025', estado: 'Aprobado', producto: 'Tubería HDPE 75mm PN-16 SDR-11', lote: 'Lote-250520-PE2', meltIndexCalculado: 0.26, meltIndexVariacion: 1.8, densidadCalculada: 0.957, negroHumoCalculado: 2.2, tio_tiempo: 28, resistencia_traccion: 23.7, elongacion_rotura: 612, dispersion_nh: 'A1', fecha_ingreso: '19-05-2025', hora: '08:30', inspector: 'Elias Ibañez', maquina: 'PE1', cliente: 'Distribución Industrial', observaciones: 'Ensayo de impacto exitoso a -10°C', tipo_ensayo: 'Resistencia al Impacto' },
  { id: 'LAB-05-04', tipo: 'Tubería PP', analista: 'Maximiliano Miranda', fecha: '15-05-2025', estado: 'Aprobado', producto: 'Tubería PP-R 25mm PN-20', lote: 'Lote-250515-PP1', meltIndexCalculado: 0.28, meltIndexVariacion: 1.6, densidadCalculada: 0.904, fvTotalPorcentaje: 18.0, fvIntermediaPorcentaje: 19.8, fecha_ingreso: '14-05-2025', hora: '09:15', inspector: 'Daniel Palma', maquina: 'PP3', cliente: 'Fontanería Urbana', observaciones: 'Presión hidrostática 1000h exitosa', tipo_ensayo: 'Presión Hidrostática' },
  { id: 'LAB-05-05', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '10-05-2025', estado: 'Rechazado', producto: 'PE100 Negro Desconocido', lote: 'PE100-0510-001', proveedor: 'Proveedor No Calificado', orden_compra: '170501', cliente: 'Proveedor No Calificado', observaciones: 'No cumple especificaciones PE100, posible contaminación', tipo_ensayo: 'Análisis de Pureza', fecha_ingreso: '09-05-2025' },
  { id: 'LAB-05-06', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '30-05-2025', estado: 'Aprobado', producto: 'Tubería HDPE 110mm PN-10 SDR-17', lote: 'Lote-250530-PE3', meltIndexCalculado: 0.24, meltIndexVariacion: 1.5, densidadCalculada: 0.958, negroHumoCalculado: 2.1, tio_tiempo: 26, resistencia_traccion: 23.8, elongacion_rotura: 615, dispersion_nh: 'A1', fecha_ingreso: '29-05-2025', hora: '10:00', inspector: 'Cristian Montellano', maquina: 'PE2', cliente: 'Obras Públicas Región', observaciones: 'Cumple especificaciones para obra pública', tipo_ensayo: 'Certificación Obras Públicas' },
  { id: 'LAB-05-07', tipo: 'Reprocesado', analista: 'Maximiliano Miranda', fecha: '15-05-2025', estado: 'Aprobado', producto: 'Reprocesado Lote RP-0515-HDPE', lote: 'RP-0515', meltIndexCalculado: 0.31, meltIndexVariacion: 3.5, densidadCalculada: 0.954, negroHumoCalculado: 2.4, tio_tiempo: 18, cliente: 'Control Interno', observaciones: 'Material apto para reprocesamiento', tipo_ensayo: 'Caracterización para Reproceso', fecha_ingreso: '14-05-2025' },
  { id: 'LAB-05-08', tipo: 'Conexiones', analista: 'Robinson Córdova', fecha: '31-05-2025', estado: 'Aprobado', producto: 'Tee HDPE 63mm', lote: 'Lote-250531-FIT3', meltIndexCalculado: 0.25, meltIndexVariacion: 1.8, densidadCalculada: 0.957, fecha_ingreso: '30-05-2025', hora: '15:45', inspector: 'Luis Parada', maquina: 'PE3', cliente: 'Conexiones Rurales', observaciones: 'Soldadura electrofusión verificada', tipo_ensayo: 'Verificación de Soldadura' },

  // Junio 2025
  { id: 'LAB-06-01', tipo: 'Tubería HDPE', analista: 'Antonia Figueroa', fecha: '18-06-2025', estado: 'Aprobado', producto: 'Tubería HDPE 90mm PN-16 SDR-11', cliente: 'Constructora Los Andes', resultado: 'Aprobado', observaciones: 'Ensayo de tracción satisfactorio según ASTM D638', tipo_ensayo: 'Tracción', fecha_ingreso: '17-06-2025' },
  { id: 'LAB-06-02', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '19-06-2025', estado: 'Aprobado', producto: 'Tubería HDPE 90mm PN-16 SDR-11', cliente: 'Ingeniería Hidráulica del Norte', resultado: 'Aprobado', observaciones: 'Densidad dentro de especificaciones - 0.952 g/cm³', tipo_ensayo: 'Densidad', fecha_ingreso: '18-06-2025' },
  { id: 'LAB-06-03', tipo: 'Materia Prima', analista: 'Robinson Córdova', fecha: '12-06-2025', estado: 'Rechazado', producto: 'PPR-Y40 Importado', cliente: 'Distribuidor Genérico', resultado: 'Rechazado', observaciones: 'Variación de Melt Index excesiva (8.2 a 14.1)', tipo_ensayo: 'Melt Index', fecha_ingreso: '11-06-2025' },
  { id: 'LAB-06-04', tipo: 'Tubería PP', analista: 'Antonia Figueroa', fecha: '25-06-2025', estado: 'Aprobado', producto: 'Tubería PP-R 50mm PN-20', cliente: 'Sistemas del Pacífico', resultado: 'Aprobado', observaciones: 'Contenido de fibra de vidrio 4.2% (dentro de 3-5%)', tipo_ensayo: 'Contenido de Fibra de Vidrio', fecha_ingreso: '24-06-2025' },
  { id: 'LAB-06-05', tipo: 'Tubería HDPE', analista: 'Maximiliano Miranda', fecha: '26-06-2025', estado: 'Aprobado', producto: 'Tubería HDPE 75mm PN-16 SDR-11', cliente: 'Obras Menores S.A.', resultado: 'Aprobado', observaciones: 'Ensayo de impacto satisfactorio - sin fracturas frágiles', tipo_ensayo: 'Resistencia al Impacto', fecha_ingreso: '25-06-2025' },
  { id: 'LAB-06-06', tipo: 'Reprocesado', analista: 'Jesus Diaz', fecha: '27-06-2025', estado: 'Aprobado', producto: 'Reprocesado Lote RP-0620-PP1', cliente: 'Control Interno', resultado: 'Aprobado', observaciones: 'Material apto para reprocesamiento hasta 30%', tipo_ensayo: 'Caracterización para Reproceso', fecha_ingreso: '26-06-2025' },
  { id: 'LAB-06-07', tipo: 'Tubería PP', analista: 'Bryan Vásquez', fecha: '28-06-2025', estado: 'En Análisis', producto: 'Tubería PP-R 20mm PN-25', cliente: 'Calefont Express', resultado: 'En proceso', observaciones: 'Evaluando resistencia a alta temperatura', tipo_ensayo: 'Resistencia Térmica', fecha_ingreso: '27-06-2025' },
  { id: 'LAB-06-08', tipo: 'Materia Prima', analista: 'Carolina Pérez', fecha: '29-06-2025', estado: 'Aprobado', producto: 'PE100 Negro con Estabilizante UV', cliente: 'Borealis', resultado: 'Aprobado', observaciones: 'Excelente dispersión de negro de carbón', tipo_ensayo: 'Dispersión de Negro de Carbón', fecha_ingreso: '28-06-2025' },
  { id: 'LAB-06-09', tipo: 'Conexiones', analista: 'Luis Rojas', fecha: '30-06-2025', estado: 'Aprobado', produto: 'Tee PP-R 32mm', cliente: 'Accesorios del Sur', resultado: 'Aprobado', observaciones: 'Resistencia a presión interna aprobada', tipo_ensayo: 'Presión Interna', fecha_ingreso: '29-06-2025' },

  // Mayo 2025
  { id: 'LAB-05-01', tipo: 'Tubería PP', analista: 'Jesus Diaz', fecha: '25-05-2025', estado: 'Aprobado', produto: 'Tubería PP-R 25mm PN-20', cliente: 'Instalaciones Domiciliarias Ltda.', resultado: 'Aprobado', observaciones: 'Ensayo de presión exitoso - soporta 40 bar', tipo_ensayo: 'Presión Hidrostática', fecha_ingreso: '24-05-2025' },
  { id: 'LAB-05-02', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '15-05-2025', estado: 'Aprobado', produto: 'HE3490LS Lote 2505A', cliente: 'BOREALIS CO.', resultado: 'Aprobado', observaciones: 'Calidad superior confirmada - todas las propiedades OK', tipo_ensayo: 'Caracterización Completa', fecha_ingreso: '14-05-2025' },
  { id: 'LAB-05-03', tipo: 'Tubería HDPE', analista: 'Robinson Córdova', fecha: '20-05-2025', estado: 'Aprobado', produto: 'Tubería HDPE 50mm PN-16 SDR-11', cliente: 'Proyectos de Riego', resultado: 'Aprobado', observaciones: 'Cumple especificaciones para uso agrícola', tipo_ensayo: 'Caracterización para Riego', fecha_ingreso: '19-05-2025' },
  { id: 'LAB-05-04', tipo: 'Tubería PP', analista: 'Maximiliano Miranda', fecha: '22-05-2025', estado: 'Aprobado', produto: 'Tubería PP-R 40mm PN-20', cliente: 'Calefacción Central', resultado: 'Aprobado', observaciones: 'Ensayo de resistencia térmica a 95°C satisfactorio', tipo_ensayo: 'Resistencia Térmica', fecha_ingreso: '21-05-2025' },
  { id: 'LAB-05-05', tipo: 'Materia Prima', analista: 'Bryan Vásquez', fecha: '23-05-2025', estado: 'Aprobado', produto: 'Estabilizante UV 326', cliente: 'BASF Chile', resultado: 'Aprobado', observaciones: 'Concentración adecuada para protección UV', tipo_ensayo: 'Análisis de Aditivos', fecha_ingreso: '22-05-2025' },

  // Abril 2025  
  { id: 'LAB-04-01', tipo: 'Tubería HDPE', analista: 'Robinson Córdova', fecha: '28-04-2025', estado: 'Aprobado', producto: 'Tubería HDPE 63mm PN-16 SDR-11', cliente: 'Distribución de Agua Rural', resultado: 'Aprobado', observaciones: 'Densidad y tracción correctas para agua potable', tipo_ensayo: 'Aptitud para Agua Potable', fecha_ingreso: '27-04-2025' },
  { id: 'LAB-04-02', tipo: 'Reprocesado', analista: 'Jesus Diaz', fecha: '20-04-2025', estado: 'Pendiente de Revisión', producto: 'Reprocesado Lote RP-0420-HDPE', cliente: 'Control Interno', resultado: 'Pendiente', observaciones: 'Requiere análisis adicional de degradación térmica', tipo_ensayo: 'Análisis de Degradación', fecha_ingreso: '19-04-2025' },
  { id: 'LAB-04-03', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '15-04-2025', estado: 'Aprobado', producto: 'PPR-Y40 SABIC', cliente: 'SABIC', resultado: 'Aprobado', observaciones: 'Cumple especificaciones técnicas ISO 15874', tipo_ensayo: 'Caracterización ISO', fecha_ingreso: '14-04-2025' },
  { id: 'LAB-04-04', tipo: 'Tubería HDPE', analista: 'Maximiliano Miranda', fecha: '10-04-2025', estado: 'Aprobado', producto: 'Tubería HDPE 110mm PN-10 SDR-17', cliente: 'Alcantarillado Municipal', resultado: 'Aprobado', observaciones: 'Ensayo de presión hidrostática exitoso 1000h', tipo_ensayo: 'Presión Hidrostática', fecha_ingreso: '09-04-2025' },
  { id: 'LAB-04-05', tipo: 'Conexiones', analista: 'Carolina Pérez', fecha: '25-04-2025', estado: 'Aprobado', producto: 'Reducción HDPE 110x90mm', cliente: 'Conexiones Especiales', resultado: 'Aprobado', observaciones: 'Soldadura por termofusión satisfactoria', tipo_ensayo: 'Resistencia de Soldadura', fecha_ingreso: '24-04-2025' },
  
  // Marzo 2025
  { id: 'LAB-03-01', tipo: 'Tubería PP', analista: 'Jesus Diaz', fecha: '28-03-2025', estado: 'Aprobado', producto: 'Tubería PP-R 32mm PN-20', cliente: 'Termofusión Andina', resultado: 'Aprobado', observaciones: 'Cumple especificaciones DIN 8077', tipo_ensayo: 'Caracterización DIN', fecha_ingreso: '27-03-2025' },
  { id: 'LAB-03-02', tipo: 'Materia Prima', analista: 'Robinson Córdova', fecha: '25-03-2025', estado: 'Aprobado', producto: 'HE3490LS Lote 0325B', cliente: 'BOREALIS CO.', resultado: 'Aprobado', observaciones: 'Calidad premium, propiedades superiores', tipo_ensayo: 'Control de Calidad Premium', fecha_ingreso: '24-03-2025' },
  { id: 'LAB-03-03', tipo: 'Tubería HDPE', analista: 'Antonia Figueroa', fecha: '20-03-2025', estado: 'Aprobado', producto: 'Tubería HDPE 90mm PN-16 SDR-11', cliente: 'Proyectos Industriales', resultado: 'Aprobado', observaciones: 'Ensayo de tracción y elongación satisfactorio', tipo_ensayo: 'Propiedades Mecánicas', fecha_ingreso: '19-03-2025' },
  { id: 'LAB-03-04', tipo: 'Reprocesado', analista: 'Maximiliano Miranda', fecha: '15-03-2025', estado: 'Aprobado', producto: 'Reprocesado Lote RP-0320-PP', cliente: 'Control Interno', resultado: 'Aprobado', observaciones: 'Material apto para uso hasta 25% de mezcla', tipo_ensayo: 'Caracterización para Reproceso', fecha_ingreso: '14-03-2025' },
  { id: 'LAB-03-05', tipo: 'Conexiones', analista: 'Bryan Vásquez', fecha: '30-03-2025', estado: 'Aprobado', producto: 'Codo PP-R 50mm x 45°', cliente: 'Instalaciones Premium', resultado: 'Aprobado', observaciones: 'Resistencia a presión interna aprobada', tipo_ensayo: 'Presión Interna', fecha_ingreso: '29-03-2025' },
  
  // Febrero 2025
  { id: 'LAB-02-01', tipo: 'Tubería PP', analista: 'Jesus Diaz', fecha: '28-02-2025', estado: 'Aprobado', producto: 'Tubería PP-R 50mm PN-20', cliente: 'Calefacción Residencial', resultado: 'Aprobado', observaciones: 'Cumple especificaciones para agua caliente', tipo_ensayo: 'Resistencia Térmica', fecha_ingreso: '27-02-2025' },
  { id: 'LAB-02-02', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '25-02-2025', estado: 'Aprobado', producto: 'PPR-Y40 SABIC Lote 0225A', cliente: 'SABIC', resultado: 'Aprobado', observaciones: 'Calidad confirmada, lote especial', tipo_ensayo: 'Control de Lote Especial', fecha_ingreso: '24-02-2025' },
  { id: 'LAB-02-03', tipo: 'Tubería HDPE', analista: 'Robinson Córdova', fecha: '20-02-2025', estado: 'Aprobado', producto: 'Tubería HDPE 75mm PN-16 SDR-11', cliente: 'Distribución Industrial', resultado: 'Aprobado', observaciones: 'Ensayo de impacto exitoso a -10°C', tipo_ensayo: 'Resistencia al Impacto', fecha_ingreso: '19-02-2025' },
  { id: 'LAB-02-04', tipo: 'Tubería PP', analista: 'Maximiliano Miranda', fecha: '15-02-2025', estado: 'Aprobado', producto: 'Tubería PP-R 25mm PN-20', cliente: 'Fontanería Urbana', resultado: 'Aprobado', observaciones: 'Presión hidrostática 1000h exitosa', tipo_ensayo: 'Presión Hidrostática', fecha_ingreso: '14-02-2025' },
  { id: 'LAB-02-05', tipo: 'Materia Prima', analista: 'Carolina Pérez', fecha: '10-02-2025', estado: 'Rechazado', produto: 'PE100 Negro Desconocido', cliente: 'Proveedor No Calificado', resultado: 'Rechazado', observaciones: 'No cumple especificaciones PE100, posible contaminación', tipo_ensayo: 'Análisis de Pureza', fecha_ingreso: '09-02-2025' },
  
  // Enero 2025
  { id: 'LAB-01-01', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '30-01-2025', estado: 'Aprobado', produto: 'Tubería HDPE 110mm PN-10 SDR-17', cliente: 'Obras Públicas Región', resultado: 'Aprobado', observaciones: 'Cumple especificaciones para obra pública', tipo_ensayo: 'Certificación Obras Públicas', fecha_ingreso: '29-01-2025' },
  { id: 'LAB-01-02', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '25-01-2025', estado: 'Aprobado', produto: 'HE3490LS Primer lote 2025', cliente: 'BOREALIS CO.', resultado: 'Aprobado', observaciones: 'Primer lote del año, calidad superior confirmada', tipo_ensayo: 'Control de Primer Lote', fecha_ingreso: '24-01-2025' },
  { id: 'LAB-01-03', tipo: 'Tubería PP', analista: 'Robinson Córdova', fecha: '20-01-2025', estado: 'Aprobado', produto: 'Tubería PP-R 40mm PN-20', cliente: 'Instalaciones Comerciales', resultado: 'Aprobado', observaciones: 'Ensayo de resistencia satisfactorio', tipo_ensayo: 'Resistencia Mecánica', fecha_ingreso: '19-01-2025' },
  { id: 'LAB-01-04', tipo: 'Reprocesado', analista: 'Maximiliano Miranda', fecha: '15-01-2025', estado: 'Aprobado', produto: 'Reprocesado Lote RP-0120-HDPE', cliente: 'Control Interno', resultado: 'Aprobado', observaciones: 'Material apto para reprocesamiento', tipo_ensayo: 'Caracterización para Reproceso', fecha_ingreso: '14-01-2025' },
  { id: 'LAB-01-05', tipo: 'Conexiones', analista: 'Bryan Vásquez', fecha: '31-01-2025', estado: 'Aprobado', produto: 'Tee HDPE 63mm', cliente: 'Conexiones Rurales', resultado: 'Aprobado', observaciones: 'Soldadura electrofusión verificada', tipo_ensayo: 'Verificación de Soldadura', fecha_ingreso: '30-01-2025' }
];

// Actividad reciente expandida (solo usuarios reales)
export const expandedRecentActivity = [
  { id: 'ACT-1', user: 'Jesus Diaz', action: 'actualizó el ensayo LAB-07-01', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), tipo: 'ensayo' },
  { id: 'ACT-2', user: 'Victor Lutz', action: 'aprobó el ensayo de materia prima LAB-07-03', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), tipo: 'aprobacion' },
  { id: 'ACT-3', user: 'Robinson Córdova', action: 'registró un nuevo ensayo para el lote RP-0720', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), tipo: 'registro' },
  { id: 'ACT-4', user: 'Antonia Figueroa', action: 'comenzó el procesamiento del ensayo LAB-07-02', timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), tipo: 'analisis' },
  { id: 'ACT-5', user: 'Maximiliano Miranda', action: 'completó el ensayo de presión hidrostática LAB-07-06', timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(), tipo: 'ensayo' },
  { id: 'ACT-6', user: 'Jesus Diaz', action: 'inició el análisis de OIT para LAB-07-13', timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(), tipo: 'analisis' },
  { id: 'ACT-7', user: 'Antonia Figueroa', action: 'aprobó la caracterización completa LAB-07-14', timestamp: new Date(Date.now() - 150 * 60 * 1000).toISOString(), tipo: 'aprobacion' },
  { id: 'ACT-8', user: 'Robinson Córdova', action: 'realizó ensayo de soldadura para LAB-07-15', timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString(), tipo: 'ensayo' },
  { id: 'ACT-9', user: 'Robinson Córdova', action: 'rechazó materia prima LAB-07-07 por Melt Index', timestamp: new Date(Date.now() - 240 * 60 * 1000).toISOString(), tipo: 'control' },
  { id: 'ACT-10', user: 'Jesus Diaz', action: 'programó recalibración del Plastómetro MFI', timestamp: new Date(Date.now() - 300 * 60 * 1000).toISOString(), tipo: 'control' },
  { id: 'ACT-11', user: 'Antonia Figueroa', action: 'registró nueva condición ambiental Lab Principal', timestamp: new Date(Date.now() - 360 * 60 * 1000).toISOString(), tipo: 'registro' },
  { id: 'ACT-12', user: 'Maximiliano Miranda', action: 'actualizó el estado del equipo EQ-02', timestamp: new Date(Date.now() - 420 * 60 * 1000).toISOString(), tipo: 'control' },
  { id: 'ACT-13', user: 'Victor Lutz', action: 'aprobó la capacitación CAP-003', timestamp: new Date(Date.now() - 480 * 60 * 1000).toISOString(), tipo: 'aprobacion' },
  { id: 'ACT-14', user: 'Maximiliano Miranda', action: 'completó evaluación de competencia', timestamp: new Date(Date.now() - 540 * 60 * 1000).toISOString(), tipo: 'ensayo' },
  { id: 'ACT-15', user: 'Antonia Figueroa', action: 'generó informe de seguimiento mensual', timestamp: new Date(Date.now() - 600 * 60 * 1000).toISOString(), tipo: 'registro' }
];

// Proveedores expandidos
export const expandedProveedores = [
  {
    id: 'PROV-001',
    nombre: 'BOREALIS CO.',
    tipo: 'Materia Prima',
    contacto_nombre: 'Peter Schmidt',
    contacto_email: 'peter.schmidt@borealis.com',
    contacto_telefono: '+43 1 22 400 0',
    estado: 'Activo',
    certificacionesISO: 'ISO 9001, ISO 14001, ISO 45001',
    contratoUrl: '#',
    observaciones: 'Proveedor principal de HDPE PE100 y resinas especializadas',
    evaluaciones: [
      { fecha: '15-07-2025', calidad: 5, cumplimiento: 5, puntualidad: 4, comentarios: 'Excelente calidad constante, retraso menor en última entrega por temas portuarios.' },
      { fecha: '15-04-2025', calidad: 5, cumplimiento: 5, puntualidad: 5, comentarios: 'Servicio excepcional, entrega anticipada.' },
      { fecha: '15-01-2025', calidad: 5, cumplimiento: 5, puntualidad: 5, comentarios: 'Inicio de año excelente, calidad premium.' }
    ]
  },
  {
    id: 'PROV-002',
    nombre: 'SABIC',
    tipo: 'Materia Prima',
    contacto_nombre: 'Ahmed Al-Rashid',
    contacto_email: 'ahmed.alrashid@sabic.com',
    contacto_telefono: '+966 11 225 8000',
    estado: 'Activo',
    certificacionesISO: 'ISO 9001, ISO 14001, ISO 45001, ISCC Plus',
    contratoUrl: '#',
    observaciones: 'Proveedor de PP-R y copolímeros de alta calidad',
    evaluaciones: [
      { fecha: '20-07-2025', calidad: 5, cumplimiento: 5, puntualidad: 5, comentarios: 'Servicio excepcional y puntual, documentación completa.' },
      { fecha: '20-04-2025', calidad: 5, cumplimiento: 4, puntualidad: 5, comentarios: 'Pequeña demora en certificados, pero calidad excelente.' },
      { fecha: '20-01-2025', calidad: 5, cumplimiento: 5, puntualidad: 4, comentarios: 'Excelente calidad, retrasos menores por logística.' }
    ]
  },
  {
    id: 'PROV-003',
    nombre: 'Trescal Chile',
    tipo: 'Calibración',
    contacto_nombre: 'María González',
    contacto_email: 'maria.gonzalez@trescal.com',
    contacto_telefono: '+56 2 2345 6789',
    estado: 'Activo',
    certificacionesISO: 'ISO 17025, IAS Acreditado',
    contratoUrl: '#',
    observaciones: 'Servicio de calibración externa especializado en equipos de laboratorio',
    evaluaciones: [
      { fecha: '10-07-2025', calidad: 5, cumplimiento: 5, puntualidad: 5, comentarios: 'Servicio profesional, certificaciones válidas y trazables.' },
      { fecha: '10-04-2025', calidad: 5, cumplimiento: 5, puntualidad: 4, comentarios: 'Excelente trabajo, leve retraso por disponibilidad de equipo.' },
      { fecha: '10-01-2025', calidad: 5, cumplimiento: 5, puntualidad: 5, comentarios: 'Servicio impecable, documentación completa.' }
    ]
  },
  {
    id: 'PROV-004',
    nombre: 'Sigma-Aldrich',
    tipo: 'Reactivos',
    contacto_nombre: 'Juan Pérez',
    contacto_email: 'juan.perez@sigma.com',
    contacto_telefono: '+56 2 3456 7890',
    estado: 'Activo',
    certificacionesISO: 'ISO 9001, GMP',
    contratoUrl: '#',
    observaciones: 'Proveedor de reactivos analíticos y estándares de referencia',
    evaluaciones: [
      { fecha: '05-07-2025', calidad: 5, cumplimiento: 4, puntualidad: 4, comentarios: 'Calidad excelente, ocasional retraso en entregas especiales.' },
      { fecha: '05-04-2025', calidad: 5, cumplimiento: 5, puntualidad: 3, comentarios: 'Productos de calidad, mejoras necesarias en logística.' },
      { fecha: '05-01-2025', calidad: 5, cumplimiento: 4, puntualidad: 4, comentarios: 'Reactivos de alta pureza, tiempos de entrega variables.' }
    ]
  },
  {
    id: 'PROV-005',
    nombre: 'LyondellBasell',
    tipo: 'Materia Prima',
    contacto_nombre: 'Thomas Weber',
    contacto_email: 'thomas.weber@lyondellbasell.com',
    contacto_telefono: '+31 10 275 5555',
    estado: 'Activo',
    certificacionesISO: 'ISO 9001, ISO 14001, ISCC Plus, REACH',
    contratoUrl: '#',
    observaciones: 'Proveedor especializado en PP copolímero random para aplicaciones técnicas',
    evaluaciones: [
      { fecha: '25-07-2025', calidad: 5, cumplimiento: 5, puntualidad: 5, comentarios: 'Excelente calidad y servicio, entrega perfecta.' },
      { fecha: '25-04-2025', calidad: 5, cumplimiento: 5, puntualidad: 5, comentarios: 'Servicio de primera clase, sin observaciones.' }
    ]
  },
  {
    id: 'PROV-006',
    nombre: 'Clariant Chile',
    tipo: 'Aditivos',
    contacto_nombre: 'Roberto Silva',
    contacto_email: 'roberto.silva@clariant.com',
    contacto_telefono: '+56 2 4567 8901',
    estado: 'Activo',
    certificacionesISO: 'ISO 9001, ISO 14001, REACH',
    contratoUrl: '#',
    observaciones: 'Proveedor de masterbatch, estabilizantes y aditivos especializados',
    evaluaciones: [
      { fecha: '22-07-2025', calidad: 5, cumplimiento: 5, puntualidad: 5, comentarios: 'Excelente dispersión de masterbatch, servicio técnico de calidad.' }
    ]
  },
  {
    id: 'PROV-007',
    nombre: 'BASF Chile',
    tipo: 'Aditivos',
    contacto_nombre: 'Ana Carolina Mendez',
    contacto_email: 'ana.mendez@basf.com',
    contacto_telefono: '+56 2 5678 9012',
    estado: 'Activo',
    certificacionesISO: 'ISO 9001, ISO 14001, Responsible Care',
    contratoUrl: '#',
    observaciones: 'Proveedor de antioxidantes, estabilizantes UV y aditivos de procesamiento',
    evaluaciones: [
      { fecha: '18-07-2025', calidad: 5, cumplimiento: 5, puntualidad: 4, comentarios: 'Productos de excelente calidad, soporte técnico excepcional.' }
    ]
  }
];

// Registros expandidos con datos realistas
export const expandedRegistros = [
  { id: 'CTRL-001', fecha: '20-07-2025', hora: '10:30', inspector: 'Elias Ibañez', maquinista: 'ANDRÉS REYES', maquina: 'PE1', producto: 'Tubería HDPE 90mm PN-16 SDR-11', marca: 'POLIFUSIÓN S.A.', diametro: 90.1, espesor_min: 8.2, espesor_max: 8.3, largo: 1000, peso_muestra: 2200, peso_kg_m: 2.2, ovalidad: 0.5, observaciones_visuales: 'Sin observaciones', color_tuberia: 'Negro', color_linea: 'Azul', resultado: 'Conforme', enviado_lab: true },
  { id: 'CTRL-002', fecha: '20-07-2025', hora: '11:15', inspector: 'Cristian Montellano', maquinista: 'ALEXIS SANDOVAL', maquina: 'PE2', producto: 'Tubería HDPE 110mm PN-10 SDR-17', marca: 'POLIFUSIÓN S.A.', diametro: 110.2, espesor_min: 6.5, espesor_max: 6.6, largo: 1000, peso_muestra: 2100, peso_kg_m: 2.1, ovalidad: 0.6, observaciones_visuales: '', color_tuberia: 'Negro', color_linea: 'Azul', resultado: 'Conforme', enviado_lab: true },
  { id: 'CTRL-003', fecha: '19-07-2025', hora: '14:00', inspector: 'Daniel Palma', maquinista: 'CARLOS DOMÍNGUEZ', maquina: 'PP3', producto: 'Tubería PP-R 25mm PN-20', marca: 'SMART PIPES SpA', diametro: 25.3, espesor_min: 4.2, espesor_max: 4.3, largo: 1000, peso_muestra: 300, peso_kg_m: 0.3, ovalidad: 0.2, observaciones_visuales: 'Superficie ligeramente rugosa', color_tuberia: 'Verde', color_linea: 'Roja', resultado: 'No Conforme', enviado_lab: false },
  { id: 'CTRL-004', fecha: '19-07-2025', hora: '09:05', inspector: 'Luis Parada', maquinista: 'CRISTIAN DUQUE', maquina: 'PE3', producto: 'Tubería HDPE 63mm PN-16 SDR-11', marca: 'POLIFUSIÓN S.A.', diametro: 63.1, espesor_min: 5.8, espesor_max: 5.9, largo: 1000, peso_muestra: 1100, peso_kg_m: 1.1, ovalidad: 0.4, observaciones_visuales: '', color_tuberia: 'Negro', color_linea: 'Azul', resultado: 'Conforme', enviado_lab: true },
  { id: 'CTRL-005', fecha: '18-07-2025', hora: '08:45', inspector: 'Elias Ibañez', maquinista: 'ROBERTO MARTÍNEZ', maquina: 'PE1', producto: 'Tubería HDPE 160mm PN-10 SDR-17', marca: 'POLIFUSIÓN S.A.', diametro: 160.3, espesor_min: 9.4, espesor_max: 9.5, largo: 1000, peso_muestra: 3800, peso_kg_m: 3.8, ovalidad: 0.7, observaciones_visuales: 'Color uniforme, sin defectos', color_tuberia: 'Negro', color_linea: 'Azul', resultado: 'Conforme', enviado_lab: true },
  { id: 'CTRL-006', fecha: '18-07-2025', hora: '13:20', inspector: 'Cristian Montellano', maquinista: 'PEDRO LÓPEZ', maquina: 'PP2', producto: 'Tubería PP-R 50mm PN-20 con fibra de vidrio', marca: 'SMART PIPES SpA', diametro: 50.2, espesor_min: 6.8, espesor_max: 6.9, largo: 1000, peso_muestra: 850, peso_kg_m: 0.85, ovalidad: 0.3, observaciones_visuales: 'Fibra de vidrio visible, distribución uniforme', color_tuberia: 'Verde', color_linea: 'Roja', resultado: 'Conforme', enviado_lab: true },
  { id: 'CTRL-007', fecha: '17-07-2025', hora: '11:30', inspector: 'Daniel Palma', maquinista: 'MIGUEL ÁNGEL', maquina: 'PP3', producto: 'Tubería PP-R 32mm PN-20', marca: 'SMART PIPES SpA', diametro: 32.1, espesor_min: 5.2, espesor_max: 5.3, largo: 1000, peso_muestra: 420, peso_kg_m: 0.42, ovalidad: 0.4, observaciones_visuales: 'Superficie lisa, sin imperfecciones', color_tuberia: 'Verde', color_linea: 'Roja', resultado: 'Conforme', enviado_lab: true },
  { id: 'CTRL-008', fecha: '17-07-2025', hora: '16:15', inspector: 'Luis Parada', maquinista: 'JORGE SILVA', maquina: 'PE3', producto: 'Tubería HDPE 200mm PN-6 SDR-26', marca: 'POLIFUSIÓN S.A.', diametro: 200.1, espesor_min: 7.7, espesor_max: 7.8, largo: 1000, peso_muestra: 4500, peso_kg_m: 4.5, ovalidad: 0.8, observaciones_visuales: 'Diámetro ligeramente fuera de tolerancia', color_tuberia: 'Negro', color_linea: 'Azul', resultado: 'No Conforme', enviado_lab: false },
  { id: 'CTRL-009', fecha: '16-07-2025', hora: '09:20', inspector: 'Elias Ibañez', maquinista: 'FERNANDO RODRÍGUEZ', maquina: 'PE1', producto: 'Tubería HDPE 75mm PN-16 SDR-11', marca: 'POLIFUSIÓN S.A.', diametro: 75.2, espesor_min: 6.8, espesor_max: 6.9, largo: 1000, peso_muestra: 1800, peso_kg_m: 1.8, ovalidad: 0.5, observaciones_visuales: 'Calidad estándar, sin observaciones', color_tuberia: 'Negro', color_linea: 'Azul', resultado: 'Conforme', enviado_lab: true },
  { id: 'CTRL-010', fecha: '16-07-2025', hora: '14:45', inspector: 'Cristian Montellano', maquinista: 'DIEGO HERRERA', maquina: 'PP2', producto: 'Tubería PP-R 75mm PN-16', marca: 'SMART PIPES SpA', diametro: 75.3, espesor_min: 8.5, espesor_max: 8.6, largo: 1000, peso_muestra: 1200, peso_kg_m: 1.2, ovalidad: 0.6, observaciones_visuales: 'Color uniforme, acabado profesional', color_tuberia: 'Verde', color_linea: 'Roja', resultado: 'Conforme', enviado_lab: true }
];

// Exportar función para integrar con el sistema existente
export function getExpandedDemoData() {
  return {
    usuarios: expandedUsuarios,
    ensayos: expandedEnsayos,
    recentActivity: expandedRecentActivity,
    proveedores: expandedProveedores,
    registros: expandedRegistros
  };
}
