
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
  addEnsayo: (ensayo: Omit<Ensayo, 'id'>) => Promise<void>;
  updateEnsayo: (ensayo: Ensayo) => Promise<void>;
  addRegistro: (registro: Omit<Registro, 'id'>) => Promise<void>;
  addRecentActivity: (activity: Omit<RecentActivity, 'id' | 'timestamp'>) => Promise<void>;
  forceRefresh: () => void;
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
  const [isDynamicLoading, setIsDynamicLoading] = useState(true);

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
  
  const loadDynamicData = useCallback(async () => {
      setIsDynamicLoading(true);
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
          setIsDynamicLoading(false);
      }
  }, []);

  // Load dynamic data on mount and when forced
  useEffect(() => {
    loadDynamicData();
  }, [loadDynamicData]);


  const addEnsayo = async (ensayo: Omit<Ensayo, 'id'>) => {
    await dataService.addEnsayo(ensayo);
    await loadDynamicData();
  };

  const updateEnsayo = async (updatedEnsayo: Ensayo) => {
    await dataService.updateEnsayo(updatedEnsayo.id, updatedEnsayo);
    await loadDynamicData();
  };

  const addRegistro = async (registro: Omit<Registro, 'id'>) => {
    await dataService.addRegistro(registro);
    await loadDynamicData();
  };

  const addRecentActivity = async (activity: Omit<RecentActivity, 'id' | 'timestamp'>) => {
    await dataService.addRecentActivity(activity);
    const newActivityData = await dataService.getRecentActivity(); // Refresh activity separately
    setRecentActivity(newActivityData);
  };

  const dynamicContextValue = useMemo(() => ({
    ensayos,
    registros,
    recentActivity,
    addEnsayo,
    updateEnsayo,
    addRegistro,
    addRecentActivity,
    forceRefresh: loadDynamicData,
    isLoading: isDynamicLoading,
  }), [ensayos, registros, recentActivity, loadDynamicData, isDynamicLoading]);

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
