
"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { getMatrizProductos, type TipoProducto } from "@/lib/matriz-datos";
import { getProductsFromSap, type SapProduct } from "@/services/sap-service";
import { initialEnsayos, initialRecentActivity, initialRegistros } from '@/services/data-service';

// --- STATIC DATA (loaded once from server) ---
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
  addEnsayo: (ensayo: Ensayo) => void;
  updateEnsayo: (ensayo: Ensayo) => void;
  addRegistro: (registro: Registro) => void;
  addRecentActivity: (activity: Omit<RecentActivity, 'id' | 'timestamp'>) => void;
}

const DynamicDataContext = createContext<DynamicDataContextType | undefined>(undefined);


// --- PROVIDER COMPONENT ---
interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [productMatrix, setProductMatrix] = useState<TipoProducto[]>([]);
  const [sapProducts, setSapProducts] = useState<SapProduct[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [ensayos, setEnsayos] = useState<Ensayo[]>(initialEnsayos);
  const [registros, setRegistros] = useState<Registro[]>(initialRegistros);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>(initialRecentActivity);

  useEffect(() => {
    const loadData = async () => {
      try {
        const matrix = await getMatrizProductos();
        setProductMatrix(matrix);
        const products = await getProductsFromSap();
        setSapProducts(products);
      } catch (error) {
        console.error("Failed to load initial data", error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
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
  };

  const dynamicContextValue = useMemo(() => ({
    ensayos,
    registros,
    recentActivity,
    addEnsayo,
    updateEnsayo,
    addRegistro,
    addRecentActivity
  }), [ensayos, registros, recentActivity]);

  const staticContextValue = useMemo(() => ({
    productMatrix,
    sapProducts,
    isLoaded
  }), [productMatrix, sapProducts, isLoaded]);

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
