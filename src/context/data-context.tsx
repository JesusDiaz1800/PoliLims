
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getProductsFromSap, SapProduct } from '@/services/sap-service';
import { getMatrizProductos, TipoProducto } from '@/lib/matriz-datos';

// Extensible type for any kind of assay data
type EnsayoData = {
  id: string;
  tipo: string;
  analista: string;
  fecha: string;
  estado: 'Aprobado' | 'En Progreso' | 'Rechazado' | 'Pendiente de Revisión';
  producto: string;
  [key: string]: any; // Allows for any other properties
}

export type Ensayo = EnsayoData;

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

// Initial data (can be empty or placeholders)
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
    { id: "act-4", user: "Maximiliano Miranda", action: "aprobó el informe de la muestra #MP-001.", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { id: "act-5", user: "Elias Ibañez", action: "registró un nuevo control para Tuberia FASER AQUA-FIBRA 32 mm PN20.", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
];

// Context shape
interface DataContextType {
  ensayos: Ensayo[];
  registros: Registro[];
  recentActivity: RecentActivity[];
  sapProducts: SapProduct[];
  productMatrix: TipoProducto[];
  loading: boolean;
  addEnsayo: (ensayo: Ensayo) => void;
  updateEnsayo: (ensayo: Ensayo) => void;
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
  const [sapProducts, setSapProducts] = useState<SapProduct[]>([]);
  const [productMatrix, setProductMatrix] = useState<TipoProducto[]>([]);
  const [loading, setLoading] = useState(false); // Set to false initially

  // Load static data on initial mount. This runs once.
  useEffect(() => {
    try {
        setLoading(true);
        // These functions are now synchronous and return the cached data
        const sapData = getProductsFromSap();
        const matrixData = getMatrizProductos();
        setSapProducts(sapData);
        setProductMatrix(matrixData);
    } catch (error) {
        console.error("Failed to load initial app data:", error);
    } finally {
        setLoading(false);
    }
  }, []);


  const addEnsayo = (ensayo: Ensayo) => {
    setEnsayos(prev => [ensayo, ...prev]);
  };

  const updateEnsayo = (updatedEnsayo: Ensayo) => {
    setEnsayos(prev => prev.map(ensayo => ensayo.id === updatedEnsayo.id ? updatedEnsayo : ensayo));
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
    sapProducts,
    productMatrix,
    loading,
    addEnsayo,
    updateEnsayo,
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
