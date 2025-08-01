
"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect, useCallback } from 'react';
import { getMatrizProductos, type TipoProducto } from "@/lib/matriz-datos";
import { getProductsFromSap, type SapProduct } from "@/services/sap-service";
import * as dataService from '@/services/data-service';

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

  // Dynamic data state
  const [ensayos, setEnsayos] = useState<Ensayo[]>([]);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load static data once
  useEffect(() => {
    const loadStaticData = async () => {
      try {
        const matrix = await getMatrizProductos();
        setProductMatrix(matrix);
        const products = await getProductsFromSap();
        setSapProducts(products);
      } catch (error) {
        console.error("Failed to load initial static data", error);
      } finally {
        setIsStaticLoaded(true);
      }
    };
    loadStaticData();
  }, []);
  
  // Load initial dynamic data once
  useEffect(() => {
    const loadInitialData = async () => {
        setIsLoading(true);
        try {
            const [ensayosData, registrosData, activityData] = await Promise.all([
                dataService.getEnsayos(),
                dataService.getRegistros(),
                dataService.getRecentActivity()
            ]);
            setEnsayos(ensayosData);
            setRegistros(registrosData);
            setRecentActivity(activityData);
        } catch (error) {
            console.error("Failed to load dynamic data from Firestore", error);
        } finally {
            setIsLoading(false);
        }
    };
    loadInitialData();
  }, []);


  const addEnsayo = useCallback(async (ensayoData: Omit<Ensayo, 'id'>) => {
    const newEnsayoId = await dataService.addEnsayo(ensayoData);
    const newEnsayo = { ...ensayoData, id: newEnsayoId };
    setEnsayos(prev => [newEnsayo, ...prev]);
    return newEnsayo;
  }, []);

  const updateEnsayo = useCallback(async (id: string, updatedEnsayoData: Partial<Ensayo>) => {
    await dataService.updateEnsayo(id, updatedEnsayoData);
    setEnsayos(prev => prev.map(e => e.id === id ? { ...e, ...updatedEnsayoData } : e));
  }, []);

  const addRegistro = useCallback(async (registroData: Omit<Registro, 'id'>) => {
    const newRegistroId = await dataService.addRegistro(registroData);
    const newRegistro = { ...registroData, id: newRegistroId };
    setRegistros(prev => [newRegistro, ...prev]);
    return newRegistro;
  }, []);

  const deleteRegistro = useCallback(async (registroId: string) => {
    await dataService.deleteRegistro(registroId);
    setRegistros(prev => prev.filter(r => r.id !== registroId));
  }, []);

  const addRecentActivity = useCallback(async (activity: Omit<RecentActivity, 'id' | 'timestamp'>) => {
    const newActivity = await dataService.addRecentActivity(activity);
    setRecentActivity(prev => [newActivity, ...prev]);
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
