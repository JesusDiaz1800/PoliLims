
"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect, useCallback } from 'react';
import { getMatrizProductos, type TipoProducto } from "@/lib/matriz-datos";
import { getProductsFromSap, type SapProduct } from "@/services/sap-service";
import * as dataService from '@/services/data-service';

// --- DEMO DATA ---
const demoRegistros = [
    { id: 'CTRL-001', fecha: '2025-07-20', hora: '10:30', inspector: 'Elias Ibañez', maquina: 'PE1', producto: 'Tubería HDPE 90mm PN-16 SDR-11', resultado: 'Conforme' as const, enviado_lab: true },
    { id: 'CTRL-002', fecha: '2025-07-20', hora: '11:15', inspector: 'Cristian Montellano', maquina: 'PE2', producto: 'Tubería HDPE 110mm PN-10 SDR-17', resultado: 'Conforme' as const, enviado_lab: true },
    { id: 'CTRL-003', fecha: '2025-07-19', hora: '14:00', inspector: 'Daniel Palma', maquina: 'PP3', producto: 'Tubería PP-R 25mm PN-20', resultado: 'No Conforme' as const, enviado_lab: false },
    { id: 'CTRL-004', fecha: '2025-07-19', hora: '09:05', inspector: 'Luis Parada', maquina: 'PE3', producto: 'Tubería HDPE 63mm PN-16 SDR-11', resultado: 'Conforme' as const, enviado_lab: true },
    { id: 'CTRL-005', fecha: '2025-07-21', hora: '08:45', inspector: 'Elias Ibañez', maquina: 'PP1', producto: 'Tubería PP-R 32mm PN-16', resultado: 'Conforme' as const, enviado_lab: true },
    { id: 'CTRL-006', fecha: '2025-07-21', hora: '10:00', inspector: 'Daniel Palma', maquina: 'PE4', producto: 'Tubería HDPE 200mm PN-6 SDR-26', resultado: 'No Conforme' as const, enviado_lab: false },
    { id: 'CTRL-007', fecha: '2025-07-22', hora: '13:20', inspector: 'Cristian Montellano', maquina: 'PP2', producto: 'Tubería PP-R 50mm PN-20', resultado: 'Conforme' as const, enviado_lab: false },
    { id: 'CTRL-008', fecha: '2025-07-22', hora: '15:00', inspector: 'Luis Parada', maquina: 'PE1', producto: 'Tubería HDPE 90mm PN-10 SDR-17', resultado: 'Conforme' as const, enviado_lab: true },
    { id: 'CTRL-009', fecha: '2025-06-15', hora: '09:30', inspector: 'Elias Ibañez', maquina: 'PE1', producto: 'Tubería HDPE 90mm PN-16 SDR-11', resultado: 'Conforme' as const, enviado_lab: true },
    { id: 'CTRL-010', fecha: '2025-06-15', hora: '11:00', inspector: 'Cristian Montellano', maquina: 'PE2', producto: 'Tubería HDPE 110mm PN-10 SDR-17', resultado: 'Conforme' as const, enviado_lab: true },
    { id: 'CTRL-011', fecha: '2025-06-16', hora: '14:30', inspector: 'Daniel Palma', maquina: 'PP3', producto: 'Tubería PP-R 25mm PN-20', resultado: 'Conforme' as const, enviado_lab: true },
    { id: 'CTRL-012', fecha: '2025-05-10', hora: '09:00', inspector: 'Luis Parada', maquina: 'PE3', producto: 'Tubería HDPE 63mm PN-16 SDR-11', resultado: 'Conforme' as const, enviado_lab: true },
    { id: 'CTRL-013', fecha: '2025-05-11', hora: '08:30', inspector: 'Elias Ibañez', maquina: 'PP1', producto: 'Tubería PP-R 32mm PN-16', resultado: 'No Conforme' as const, enviado_lab: false },
    { id: 'CTRL-014', fecha: '2025-04-20', hora: '10:15', inspector: 'Daniel Palma', maquina: 'PE4', producto: 'Tubería HDPE 200mm PN-6 SDR-26', resultado: 'Conforme' as const, enviado_lab: true },
    { id: 'CTRL-015', fecha: '2025-04-21', hora: '13:00', inspector: 'Cristian Montellano', maquina: 'PP2', producto: 'Tubería PP-R 50mm PN-20', resultado: 'Conforme' as const, enviado_lab: true },
    { id: 'CTRL-016', fecha: '2025-03-25', hora: '15:30', inspector: 'Luis Parada', maquina: 'PE1', producto: 'Tubería HDPE 90mm PN-10 SDR-17', resultado: 'Conforme' as const, enviado_lab: true },
];

const demoEnsayos = [
    { id: 'LAB-001', id_muestra: 'CTRL-001', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '2025-07-20', estado: 'Aprobado' as const, producto: 'Tubería HDPE 90mm PN-16 SDR-11', lote: 'Lote-250720-PE1' },
    { id: 'LAB-002', id_muestra: 'CTRL-002', tipo: 'Tubería HDPE', analista: 'Antonia Figueroa', fecha: '2025-07-20', estado: 'En Progreso' as const, producto: 'Tubería HDPE 110mm PN-10 SDR-17', lote: 'Lote-250720-PE2' },
    { id: 'LAB-003', id_muestra: 'CTRL-004', tipo: 'Tubería PP', analista: 'Maximiliano Miranda', fecha: '2025-07-19', estado: 'Aprobado' as const, producto: 'Tubería HDPE 63mm PN-16 SDR-11', lote: 'Lote-250719-PE3' },
    { id: 'LAB-004', tipo: 'Materia Prima', producto: 'EL-Lene H1000PC', analista: 'Jesus Diaz', fecha: '2025-07-18', estado: 'Aprobado' as const, lote: 'MP-2025-54321' },
    { id: 'LAB-005', tipo: 'Reprocesado', producto: 'Reprocesado Lote RP-0718-A', analista: 'Robinson Córdova', fecha: '2025-07-18', estado: 'Rechazado' as const, lote: 'RP-0718-A' },
    { id: 'LAB-006', tipo: 'Tubería HDPE', producto: 'Tubería de Prueba sin Analista', analista: '', fecha: '2025-07-21', estado: 'Pendiente de Revisión' as const, lote: 'Lote-Test-1' },
    { id: 'LAB-007', id_muestra: 'CTRL-005', tipo: 'Tubería PP', analista: 'Bryan Vásquez', fecha: '2025-07-21', estado: 'En Progreso' as const, producto: 'Tubería PP-R 32mm PN-16', lote: 'Lote-250721-PP1' },
    { id: 'LAB-008', id_muestra: 'CTRL-008', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '2025-07-22', estado: 'Pendiente de Revisión' as const, producto: 'Tubería HDPE 90mm PN-10 SDR-17', lote: 'Lote-250722-PE1' },
    { id: 'LAB-009', tipo: 'Materia Prima', producto: 'Hostalen CRP 100', analista: 'Antonia Figueroa', fecha: '2025-07-22', estado: 'En Progreso' as const, lote: 'MP-2025-54322' },
    { id: 'LAB-010', tipo: 'Reprocesado', producto: 'Reprocesado Lote RP-0722-B', analista: 'Robinson Córdova', fecha: '2025-07-22', estado: 'Pendiente de Revisión' as const, lote: 'RP-0722-B' },
    { id: 'LAB-011', id_muestra: 'CTRL-009', tipo: 'Tubería HDPE', analista: 'Maximiliano Miranda', fecha: '2025-06-15', estado: 'Aprobado' as const, producto: 'Tubería HDPE 90mm PN-16 SDR-11', lote: 'Lote-250615-PE1' },
    { id: 'LAB-012', id_muestra: 'CTRL-010', tipo: 'Tubería HDPE', analista: 'Antonia Figueroa', fecha: '2025-06-16', estado: 'Aprobado' as const, producto: 'Tubería HDPE 110mm PN-10 SDR-17', lote: 'Lote-250615-PE2' },
    { id: 'LAB-013', id_muestra: 'CTRL-011', tipo: 'Tubería PP', analista: 'Bryan Vásquez', fecha: '2025-06-17', estado: 'Aprobado' as const, producto: 'Tubería PP-R 25mm PN-20', lote: 'Lote-250616-PP3' },
    { id: 'LAB-014', id_muestra: 'CTRL-012', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '2025-05-12', estado: 'Aprobado' as const, producto: 'Tubería HDPE 63mm PN-16 SDR-11', lote: 'Lote-250510-PE3' },
    { id: 'LAB-015', tipo: 'Materia Prima', producto: 'BorSafe HE3490-LS', analista: 'Antonia Figueroa', fecha: '2025-05-15', estado: 'Aprobado' as const, lote: 'MP-2025-54323' },
    { id: 'LAB-016', id_muestra: 'CTRL-014', tipo: 'Tubería HDPE', analista: 'Maximiliano Miranda', fecha: '2025-04-22', estado: 'Aprobado' as const, producto: 'Tubería HDPE 200mm PN-6 SDR-26', lote: 'Lote-250420-PE4' },
    { id: 'LAB-017', id_muestra: 'CTRL-015', tipo: 'Tubería PP', analista: 'Robinson Córdova', fecha: '2025-04-23', estado: 'Rechazado' as const, producto: 'Tubería PP-R 50mm PN-20', lote: 'Lote-250421-PP2' },
    { id: 'LAB-018', id_muestra: 'CTRL-016', tipo: 'Tubería HDPE', analista: 'Bryan Vásquez', fecha: '2025-03-26', estado: 'Aprobado' as const, producto: 'Tubería HDPE 90mm PN-10 SDR-17', lote: 'Lote-250325-PE1' },
    { id: 'LAB-019', tipo: 'Materia Prima', producto: 'PPR-CT/FV', analista: 'Jesus Diaz', fecha: '2025-02-15', estado: 'Aprobado' as const, lote: 'MP-2025-54324' },
    { id: 'LAB-020', tipo: 'Reprocesado', producto: 'Reprocesado Lote RP-0215-A', analista: 'Robinson Córdova', fecha: '2025-01-15', estado: 'Aprobado' as const, lote: 'RP-0115-A' },
];


const demoRecentActivity = [
    { id: 'ACT-1', user: 'Jesus Diaz', action: 'actualizó el ensayo LAB-001', timestamp: new Date('2025-07-22T10:00:00Z').toISOString() },
    { id: 'ACT-2', user: 'Elias Ibañez', action: 'registró un nuevo control para Tubería HDPE 90mm', timestamp: new Date('2025-07-22T09:00:00Z').toISOString() },
    { id: 'ACT-3', user: 'Victor Lutz', action: 'ha iniciado sesión', timestamp: new Date('2025-07-22T08:30:00Z').toISOString() },
    { id: 'ACT-4', user: 'Antonia Figueroa', action: 'comenzó a procesar el ensayo LAB-002', timestamp: new Date('2025-07-21T16:00:00Z').toISOString() },
    { id: 'ACT-5', user: 'Cristian Montellano', action: 'registró un control no conforme para Tubería HDPE 200mm', timestamp: new Date('2025-07-21T14:30:00Z').toISOString() },
    { id: 'ACT-6', user: 'Maximiliano Miranda', action: 'aprobó el informe para el ensayo LAB-003', timestamp: new Date('2025-07-20T11:00:00Z').toISOString() },
    { id: 'ACT-7', user: 'Robinson Córdova', action: 'registró un nuevo ensayo de reprocesado', timestamp: new Date('2025-07-19T17:00:00Z').toISOString() },
    { id: 'ACT-8', user: 'Bryan Vásquez', action: 'actualizó el ensayo LAB-007', timestamp: new Date('2025-07-19T10:00:00Z').toISOString() },
    { id: 'ACT-9', user: 'Daniel Palma', action: 'registró un control para Tubería PP-R 25mm', timestamp: new Date('2025-07-18T15:00:00Z').toISOString() },
    { id: 'ACT-10', user: 'Luis Parada', action: 'ha iniciado sesión', timestamp: new Date('2025-07-18T09:00:00Z').toISOString() },
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
