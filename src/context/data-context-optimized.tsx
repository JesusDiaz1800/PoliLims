"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

// Interfaces básicas optimizadas
export interface Ensayo {
  id: string;
  tipo: string;
  estado: 'Pendiente' | 'En Proceso' | 'En Análisis' | 'Pendiente de Revisión' | 'Aprobado' | 'Rechazado' | 'Cancelado';
  fecha: string;
  analista: string;
  resultado: string;
  producto: string;
  lote: string;
  cliente: string;
  prioridad: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  tiempoEstimado: number;
  tiempoReal: number;
  observaciones: string;
  certificado: string;
  temperatura: number;
  humedad: number;
  presion: number;
  meltIndexCalculado?: number;
  densidadCalculada?: number;
  resistencia_traccion?: number;
  elongacion_rotura?: number;
}

export interface Equipo {
  id: string;
  nombre: string;
  tipo: string;
  estado: 'Activo' | 'En Mantenimiento' | 'Requiere Calibración' | 'Inactivo';
  ubicacion: string;
  responsable: string;
  ultimaCalibracion: string;
  proximaCalibracion: string;
  proxima_calibracion?: string; // Campo adicional para compatibilidad
  fabricante: string;
  modelo: string;
  serie: string;
  capacidad: string;
  precision: string;
  certificado: string;
}

export interface NoConformidad {
  id: string;
  tipo: 'Crítica' | 'Mayor' | 'Menor' | 'Observación';
  descripcion: string;
  fecha: string;
  responsable: string;
  estado: 'Abierta' | 'En Análisis' | 'En Investigación' | 'Cerrada';
  accionCorrectiva: string;
  fechaLimite: string;
  verificacion: string;
  costo: number;
  impacto: string;
}

export interface Usuario {
  id: string;
  username: string;
  email: string;
  rol: string;
  nombre: string;
  apellido: string;
  fullName: string;
  role: string;
  departamento: string;
  activo: boolean;
  ultimoAcceso: string;
  permisos: string[];
}

export interface ActividadReciente {
  id: string;
  tipo: 'Ensayo' | 'Equipo' | 'Usuario' | 'Sistema';
  accion: string;
  usuario: string;
  user: string;
  action: string;
  timestamp: string;
  fecha: string;
  descripcion: string;
  modulo: string;
}

export interface ControlEvento {
  id: string;
  equipoId: string;
  tipo: string;
  fecha: string;
  responsable: string;
  descripcion: string;
  resultado: string;
  observaciones: string;
}

// Datos mock optimizados - solo los esenciales
const ensayosOptimizados: Ensayo[] = [
  { id: 'LAB-07-01', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '2025-07-23', estado: 'Pendiente de Revisión', producto: 'Tubería HDPE 90mm PN-16 SDR-11', lote: 'Lote-250720-PE1', cliente: 'Cliente A', prioridad: 'Alta', tiempoEstimado: 8, tiempoReal: 6, observaciones: 'Análisis de resistencia y elongación', certificado: 'CERT-07-01', temperatura: 23.5, humedad: 45, presion: 1013, meltIndexCalculado: 0.245, densidadCalculada: 0.958, resistencia_traccion: 23.5, elongacion_rotura: 610, resultado: 'Pendiente de revisión - Melt Index: 0.245 g/10min' },
  { id: 'LAB-07-02', tipo: 'Tubería PP', analista: 'Antonia Figueroa', fecha: '2025-07-23', estado: 'En Análisis', producto: 'Tubería PP-R 50mm PN-20', lote: 'Lote-250722-PP2', cliente: 'Cliente B', prioridad: 'Media', tiempoEstimado: 6, tiempoReal: 4, observaciones: 'Análisis de fibra de vidrio', certificado: 'CERT-07-02', temperatura: 23.2, humedad: 44, presion: 1012, meltIndexCalculado: 0.28, densidadCalculada: 0.905, resultado: 'En análisis - Fibra de vidrio: 18.2%' },
  { id: 'LAB-07-03', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '2025-07-23', estado: 'Aprobado', producto: 'HE3490LS', lote: '1325115', cliente: 'BOREALIS CO.', prioridad: 'Alta', tiempoEstimado: 4, tiempoReal: 3, observaciones: 'Análisis de materia prima', certificado: 'CERT-07-03', temperatura: 23.8, humedad: 46, presion: 1014, meltIndexCalculado: 0.241, densidadCalculada: 0.959, resultado: 'Aprobado - Melt Index: 0.241 g/10min' },
  { id: 'LAB-07-04', tipo: 'Reprocesado', analista: 'Robinson Córdova', fecha: '2025-07-22', estado: 'En Proceso', producto: 'Reprocesado Lote RP-0720', lote: 'RP-0720', cliente: 'Interno', prioridad: 'Media', tiempoEstimado: 10, tiempoReal: 8, observaciones: 'Análisis de contaminación', certificado: 'CERT-07-04', temperatura: 24.1, humedad: 47, presion: 1015, meltIndexCalculado: 0.29, densidadCalculada: 0.955, resultado: 'En progreso - Análisis de contaminación' },
  { id: 'LAB-07-05', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '2025-07-24', estado: 'Aprobado', producto: 'Tubería HDPE 110mm PN-10 SDR-17', lote: 'Lote-250720-PE2', cliente: 'Cliente C', prioridad: 'Alta', tiempoEstimado: 8, tiempoReal: 7, observaciones: 'Análisis completo de resistencia', certificado: 'CERT-07-05', temperatura: 23.6, humedad: 45, presion: 1013, meltIndexCalculado: 0.25, densidadCalculada: 0.959, resistencia_traccion: 24.1, elongacion_rotura: 620, resultado: 'Aprobado - Resistencia: 24.1 MPa' },
  { id: 'LAB-06-01', tipo: 'Tubería HDPE', analista: 'Antonia Figueroa', fecha: '2025-06-18', estado: 'Aprobado', producto: 'Tubería HDPE 90mm PN-16 SDR-11', lote: 'Lote-250615-PE1', cliente: 'Cliente A', prioridad: 'Media', tiempoEstimado: 8, tiempoReal: 7, observaciones: 'Análisis estándar', certificado: 'CERT-06-01', temperatura: 23.4, humedad: 44, presion: 1012, meltIndexCalculado: 0.24, densidadCalculada: 0.957, resistencia_traccion: 23.8, elongacion_rotura: 615, resultado: 'Aprobado - Resistencia: 23.8 MPa' },
  { id: 'LAB-06-02', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '2025-06-19', estado: 'Aprobado', producto: 'Tubería HDPE 90mm PN-16 SDR-11', lote: 'Lote-250616-PE1', cliente: 'Cliente A', prioridad: 'Media', tiempoEstimado: 8, tiempoReal: 6, observaciones: 'Análisis de control', certificado: 'CERT-06-02', temperatura: 23.7, humedad: 45, presion: 1013, meltIndexCalculado: 0.242, densidadCalculada: 0.958, resistencia_traccion: 23.9, elongacion_rotura: 618, resultado: 'Aprobado - Resistencia: 23.9 MPa' },
  { id: 'LAB-06-03', tipo: 'Materia Prima', analista: 'Robinson Córdova', fecha: '2025-06-12', estado: 'Rechazado', producto: 'PPR-Y40', lote: 'XYZ-987', cliente: 'GENERICO', prioridad: 'Crítica', tiempoEstimado: 4, tiempoReal: 2, observaciones: 'Melt Index fuera de especificación', certificado: 'CERT-06-03', temperatura: 24.2, humedad: 46, presion: 1014, meltIndexCalculado: 0.45, densidadCalculada: 0.901, resultado: 'Rechazado - Melt Index excesivo: 0.45 g/10min' },
];

const equiposOptimizados: Equipo[] = [
  { id: 'EQ-01', nombre: 'Espectrómetro FTIR', tipo: 'Análisis Químico', estado: 'Activo', ubicacion: 'Mesón Central, Lab. Principal', responsable: 'Jesus Diaz', ultimaCalibracion: '2024-01-15', proximaCalibracion: '2026-01-15', proxima_calibracion: '2026-01-15', fabricante: 'PerkinElmer', modelo: 'Spectrum Two', serie: 'FTIR-9876', capacidad: '4000-400 cm⁻¹', precision: '±0.01 cm⁻¹', certificado: 'CERT-CAL-001-2024' },
  { id: 'EQ-02', nombre: 'Prensa de Impacto', tipo: 'Ensayo Mecánico', estado: 'En Mantenimiento', ubicacion: 'Área de Ensayos Mecánicos', responsable: 'Maximiliano Miranda', ultimaCalibracion: '2024-12-20', proximaCalibracion: '2025-12-20', proxima_calibracion: '2025-12-20', fabricante: 'CEAST', modelo: '9050', serie: 'IMP-5432', capacidad: '0-50 J', precision: '±1%', certificado: 'CERT-CAL-002-2024' },
  { id: 'EQ-03', nombre: 'Máquina de Tracción', tipo: 'Ensayo Mecánico', estado: 'Requiere Calibración', ubicacion: 'Área de Ensayos Mecánicos', responsable: 'Robinson Córdova', ultimaCalibracion: '2024-08-01', proximaCalibracion: '2025-08-01', proxima_calibracion: '2025-08-01', fabricante: 'Instron', modelo: '5967', serie: 'TRAC-1234', capacidad: '0-50 kN', precision: '±0.5%', certificado: 'CERT-CAL-003-2024' },
  { id: 'EQ-04', nombre: 'Plastómetro MFI', tipo: 'Análisis de Flujo', estado: 'Activo', ubicacion: 'Mesón Central, Lab. Principal', responsable: 'Antonia Figueroa', ultimaCalibracion: '2025-03-01', proximaCalibracion: '2026-03-01', proxima_calibracion: '2026-03-01', fabricante: 'CEAST', modelo: 'Melt Flow 2000', serie: 'MFI-3344', capacidad: '0.1-1000 g/10min', precision: '±2%', certificado: 'CERT-CAL-004-2025' },
  { id: 'EQ-05', nombre: 'Balanza Analítica', tipo: 'Pesaje', estado: 'Activo', ubicacion: 'Sala de Pesaje', responsable: 'Jesus Diaz', ultimaCalibracion: '2024-08-10', proximaCalibracion: '2025-08-10', proxima_calibracion: '2025-08-10', fabricante: 'Mettler Toledo', modelo: 'MS-TS', serie: 'BAL-5566', capacidad: '0-220 g', precision: '±0.0001 g', certificado: 'CERT-CAL-005-2024' },
  { id: 'EQ-06', nombre: 'Horno de Secado', tipo: 'Control de Temperatura', estado: 'Activo', ubicacion: 'Sala de Secado', responsable: 'Antonia Figueroa', ultimaCalibracion: '2024-06-15', proximaCalibracion: '2025-01-15', proxima_calibracion: '2025-01-15', fabricante: 'Memmert', modelo: 'UF110', serie: 'HOR-7890', capacidad: '0-200°C', precision: '±0.5°C', certificado: 'CERT-CAL-006-2024' },
  { id: 'EQ-07', nombre: 'Microscopio Óptico', tipo: 'Análisis Visual', estado: 'Requiere Calibración', ubicacion: 'Sala de Microscopía', responsable: 'Robinson Córdova', ultimaCalibracion: '2024-05-20', proximaCalibracion: '2024-11-20', proxima_calibracion: '2024-11-20', fabricante: 'Olympus', modelo: 'BX53', serie: 'MIC-4567', capacidad: '40x-1000x', precision: '±1%', certificado: 'CERT-CAL-007-2024' },
];

const noConformidadesOptimizadas: NoConformidad[] = [
  { id: 'NC-001', tipo: 'Mayor', descripcion: 'Melt Index fuera de especificación en lote XYZ-987', fecha: '2025-06-12', responsable: 'Robinson Córdova', estado: 'Abierta', accionCorrectiva: 'Revisar proceso de mezclado', fechaLimite: '2025-06-30', verificacion: 'Pendiente', costo: 5000, impacto: 'Retraso en producción' },
  { id: 'NC-002', tipo: 'Menor', descripcion: 'Equipo de tracción requiere calibración', fecha: '2024-08-01', responsable: 'Robinson Córdova', estado: 'En Análisis', accionCorrectiva: 'Programar calibración', fechaLimite: '2025-08-01', verificacion: 'En proceso', costo: 2000, impacto: 'Limitación temporal de ensayos' },
  { id: 'NC-003', tipo: 'Observación', descripcion: 'Variación en temperatura del laboratorio', fecha: '2025-07-15', responsable: 'Jesus Diaz', estado: 'Cerrada', accionCorrectiva: 'Ajustar sistema de climatización', fechaLimite: '2025-07-20', verificacion: 'Completada', costo: 1500, impacto: 'Mejora en condiciones ambientales' },
];

const actividadRecienteOptimizada: ActividadReciente[] = [
  { id: 'ACT-001', tipo: 'Ensayo', accion: 'Iniciado', usuario: 'Jesus Diaz', user: 'Jesus Diaz', action: 'Iniciado', timestamp: '2025-07-23T10:30:00', fecha: '2025-07-23T10:30:00', descripcion: 'Ensayo LAB-07-01 iniciado', modulo: 'Ensayos' },
  { id: 'ACT-002', tipo: 'Ensayo', accion: 'Completado', usuario: 'Antonia Figueroa', user: 'Antonia Figueroa', action: 'Completado', timestamp: '2025-07-23T14:20:00', fecha: '2025-07-23T14:20:00', descripcion: 'Ensayo LAB-07-03 completado', modulo: 'Ensayos' },
  { id: 'ACT-003', tipo: 'Equipo', accion: 'Mantenimiento', usuario: 'Maximiliano Miranda', user: 'Maximiliano Miranda', action: 'Mantenimiento', timestamp: '2025-07-22T16:00:00', fecha: '2025-07-22T16:00:00', descripcion: 'Prensa de Impacto en mantenimiento', modulo: 'Equipos' },
  { id: 'ACT-004', tipo: 'Usuario', accion: 'Login', usuario: 'Robinson Córdova', user: 'Robinson Córdova', action: 'Login', timestamp: '2025-07-23T08:15:00', fecha: '2025-07-23T08:15:00', descripcion: 'Usuario conectado al sistema', modulo: 'Sistema' },
];

const controlesOptimizados: ControlEvento[] = [
  { id: 'CTRL-001', equipoId: 'EQ-01', tipo: 'Calibración', fecha: '2024-01-15', responsable: 'Jesus Diaz', descripcion: 'Calibración anual del espectrómetro', resultado: 'Aprobado', observaciones: 'Equipo funcionando correctamente' },
  { id: 'CTRL-002', equipoId: 'EQ-02', tipo: 'Mantenimiento', fecha: '2024-12-20', responsable: 'Maximiliano Miranda', descripcion: 'Mantenimiento preventivo', resultado: 'En proceso', observaciones: 'Requiere repuestos' },
  { id: 'CTRL-003', equipoId: 'EQ-03', tipo: 'Verificación', fecha: '2024-08-01', responsable: 'Robinson Córdova', descripcion: 'Verificación de precisión', resultado: 'Pendiente', observaciones: 'Programado para agosto' },
];

const usuarioMock: Usuario = {
  id: '1',
  username: 'jdiaz',
  email: 'jdiaz@polifusion.cl',
  rol: 'Ing. Analista de Calidad',
  nombre: 'Jesus',
  apellido: 'Diaz',
  fullName: 'Jesus Diaz',
  role: 'Ing. Analista de Calidad',
  departamento: 'Laboratorio',
  activo: true,
  ultimoAcceso: '23-07-2025 10:30',
  permisos: ['read', 'write', 'admin']
};

// Contexto optimizado
interface DataContextType {
  ensayos: Ensayo[];
  equipos: Equipo[];
  noConformidades: NoConformidad[];
  actividadReciente: ActividadReciente[];
  controles: ControlEvento[];
  user: Usuario;
  updateEnsayo: (id: string, updates: Partial<Ensayo>) => void;
  addRecentActivity: (activity: Omit<ActividadReciente, 'id'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DynamicDataProvider({ children }: { children: React.ReactNode }) {
  const [ensayos, setEnsayos] = useState<Ensayo[]>(ensayosOptimizados);
  const [actividadReciente, setActividadReciente] = useState<ActividadReciente[]>(actividadRecienteOptimizada);

  const updateEnsayo = useCallback((id: string, updates: Partial<Ensayo>) => {
    setEnsayos(prev => prev.map(ensayo => 
      ensayo.id === id ? { ...ensayo, ...updates } : ensayo
    ));
  }, []);

  const addRecentActivity = useCallback((activity: Omit<ActividadReciente, 'id'>) => {
    const newActivity: ActividadReciente = {
      ...activity,
      id: `ACT-${Date.now()}`
    };
    setActividadReciente(prev => [newActivity, ...prev.slice(0, 9)]); // Mantener solo 10 actividades
  }, []);

  const value = useMemo(() => ({
    ensayos,
    equipos: equiposOptimizados,
    noConformidades: noConformidadesOptimizadas,
    actividadReciente,
    controles: controlesOptimizados,
    user: usuarioMock, // Este será reemplazado por el usuario autenticado
    updateEnsayo,
    addRecentActivity
  }), [ensayos, actividadReciente, updateEnsayo, addRecentActivity]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useDynamicData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDynamicData must be used within a DynamicDataProvider');
  }
  return context;
}
