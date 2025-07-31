
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types for our data structures
export interface Ensayo {
  id: string;
  tipo: string;
  analista: string;
  fecha: string;
  estado: 'Aprobado' | 'En Progreso' | 'Rechazado' | 'Pendiente de Revisión';
  producto: string;
}

export interface Registro {
  id: string;
  fecha: string;
  hora: string;
  inspector: string;
  maquina: string;
  producto: string;
  resultado: 'Conforme' | 'No Conforme';
  enviado_lab: boolean;
}

export interface RecentActivity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}

// Initial data
const initialEnsayos: Ensayo[] = [
  { id: "MP-001", tipo: "Materia Prima", analista: "Jesus Diaz", fecha: "2024-07-22", estado: "Aprobado", producto: "Tuberia PEAD 20 mm PN10" },
  { id: "HDPE-0821-A", tipo: "Tubería HDPE", analista: "Maximiliano Miranda", fecha: "2024-07-21", estado: "En Progreso", producto: "Tuberia PEAD 90 mm PN10" },
  { id: "PP-559", tipo: "Tubería PP", analista: "Antonia Figueroa", fecha: "2024-07-21", estado: "Rechazado", producto: "Tuberia FASER BETA-FIBRA 25 mm PN20" },
  { id: "REPRO-034", tipo: "Reprocesado", analista: "Robinson Córdova", fecha: "2024-07-20", estado: "Pendiente de Revisión", producto: "Tuberia PP-R 20 mm PN20" },
  { id: "ACC-012", tipo: "Control de Accesorios", analista: "Bryan Vásquez", fecha: "2024-07-19", estado: "Aprobado", producto: "Tuberia PEAD 63 mm PN10" },
];

const initialRegistros: Registro[] = [
  { id: "REG-001", fecha: "2024-07-25", hora: "10:30", inspector: "Elias Ibañez", maquina: "Máquina 5", producto: "Tuberia PEAD 90 mm PN10", resultado: "Conforme", enviado_lab: true },
  { id: "REG-002", fecha: "2024-07-25", hora: "11:15", inspector: "Cristian Montellano", maquina: "Máquina 2", producto: "Tuberia FASER BETA-FIBRA 25 mm PN20", resultado: "No Conforme", enviado_lab: true, },
  { id: "REG-003", fecha: "2024-07-24", hora: "14:00", inspector: "Daniel Palma", maquina: "PE1", producto: "Tuberia PEAD 20 mm PN10", resultado: "Conforme", enviado_lab: false, },
  { id: "REG-004", fecha: "2024-07-24", hora: "16:45", inspector: "Luis Parada", maquina: "Máquina 9", producto: "Tuberia PP-R 20 mm PN20", resultado: "Conforme", enviado_lab: true, },
];

const initialRecentActivity: RecentActivity[] = [
    { id: "act-1", user: "Jesus Diaz", action: "completó análisis para Muestra #HDPE-0821.", timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
    { id: "act-2", user: "Antonia Figueroa", action: "registró nuevo lote de accesorios PP-R Fusión Socket.", timestamp: new Date(Date.now() - 24 * 60 * 1000).toISOString() },
    { id: "act-3", user: "Sistema", action: "Calibración de equipo GC-MS 01 vence en 10 días.", timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
];

// Context shape
interface DataContextType {
  ensayos: Ensayo[];
  registros: Registro[];
  recentActivity: RecentActivity[];
  addEnsayo: (ensayo: Ensayo) => void;
  addRegistro: (registro: Registro) => void;
  addRecentActivity: (activity: Omit<RecentActivity, 'id' | 'timestamp'>) => void;
}

// Create context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider component
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [ensayos, setEnsayos] = useState<Ensayo[]>(initialEnsayos);
  const [registros, setRegistros] = useState<Registro[]>(initialRegistros);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>(initialRecentActivity);

  const addEnsayo = (ensayo: Ensayo) => {
    setEnsayos(prev => [ensayo, ...prev]);
  };

  const addRegistro = (registro: Registro) => {
    setRegistros(prev => [registro, ...prev]);
  };

  const addRecentActivity = (activity: Omit<RecentActivity, 'id' | 'timestamp'>) => {
    const newActivity: RecentActivity = {
        ...activity,
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString()
    };
    setRecentActivity(prev => [newActivity, ...prev].slice(0, 20)); // Keep last 20 activities
  }

  const value = {
    ensayos,
    registros,
    recentActivity,
    addEnsayo,
    addRegistro,
    addRecentActivity
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Custom hook to use the context
export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};
