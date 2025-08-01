
"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect, useCallback } from 'react';
import { getMatrizProductos, type TipoProducto } from "@/lib/matriz-datos";
import { getProductsFromSap, type SapProduct } from "@/services/sap-service";
import * as dataService from '@/services/data-service';

// --- DEMO DATA ---
const demoRegistros = [
  { id: 'CTRL-001', fecha: '2024-05-20', hora: '10:30', inspector: 'Elias Ibañez', maquina: 'PE1', producto: 'Tubería HDPE 90mm PN-16 SDR-11', resultado: 'Conforme' as const, enviado_lab: true },
  { id: 'CTRL-002', fecha: '2024-05-20', hora: '11:15', inspector: 'Cristian Montellano', maquina: 'PE2', producto: 'Tubería HDPE 110mm PN-10 SDR-17', resultado: 'Conforme' as const, enviado_lab: true },
  { id: 'CTRL-003', fecha: '2024-05-19', hora: '14:00', inspector: 'Daniel Palma', maquina: 'PP3', producto: 'Tubería PP-R 25mm PN-20', resultado: 'No Conforme' as const, enviado_lab: false },
  { id: 'CTRL-004', fecha: '2024-05-19', hora: '09:05', inspector: 'Luis Parada', maquina: 'PE3', producto: 'Tubería HDPE 63mm PN-16 SDR-11', resultado: 'Conforme' as const, enviado_lab: true },
];

const demoEnsayos = [
    { id: 'LAB-001', id_muestra: 'CTRL-001', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '2024-05-20', estado: 'Pendiente de Revisión' as const, producto: 'Tubería HDPE 90mm PN-16 SDR-11', lote: 'Lote-240520-PE1' },
    { id: 'LAB-002', id_muestra: 'CTRL-002', tipo: 'Tubería HDPE', analista: 'Antonia Figueroa', fecha: '2024-05-20', estado: 'En Progreso' as const, producto: 'Tubería HDPE 110mm PN-10 SDR-17', lote: 'Lote-240520-PE2' },
    { id: 'LAB-003', id_muestra: 'CTRL-004', tipo: 'Tubería PP', analista: 'Maximiliano Miranda', fecha: '2024-05-19', estado: 'Aprobado' as const, producto: 'Tubería HDPE 63mm PN-16 SDR-11', lote: 'Lote-240519-PE3' },
    { id: 'LAB-004', tipo: 'Materia Prima', producto: 'EL-Lene H1000PC', analista: 'Jesus Diaz', fecha: '2024-05-18', estado: 'Aprobado' as const, lote: 'MP-2024-54321' },
    { id: 'LAB-005', tipo: 'Reprocesado', producto: 'Reprocesado Lote RP-0518-A', analista: 'Robinson Córdova', fecha: '2024-05-18', estado: 'Pendiente de Revisión' as const, lote: 'RP-0518-A' }
];

const demoRecentActivity = [
    { id: 'ACT-1', user: 'Jesus Diaz', action: 'actualizó el ensayo LAB-004', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 'ACT-2', user: 'Elias Ibañez', action: 'registró un nuevo control para Tubería HDPE 90mm', timestamp: new Date(Date.now() - 7200000).toISOString() },
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
  fecha: string;
  estado: 'Aprobado' | 'En Progreso' | 'Rechazado' | 'Pendiente de Revisión';
  producto: string;
  id_muestra?: string; // Optional, to link back to control rutinario if needed
  [key: string]: any; 
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

interface DynamicDataContextType {
  ensayos: Ensayo[];
  registros: Registro[];
  recentActivity: RecentActivity[];
  addEnsayo: (ensayo: Omit<Ensayo, 'id'>) => Promise<Ensayo>;
  updateEnsayo: (id: string, ensayo: Partial<Ensayo>) => Promise<void>;
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
    addEnsayo,
    updateEnsayo,
    addRegistro,
    deleteRegistro,
    addRecentActivity,
    isLoading,
  }), [ensayos, registros, recentActivity, isLoading, addEnsayo, updateEnsayo, addRegistro, deleteRegistro, addRecentActivity]);

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
