
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
  fecha: string; // fecha de ensayo
  estado: 'Aprobado' | 'En Progreso' | 'Rechazado' | 'Pendiente de Revisión' | 'En Análisis' | 'Recibida' | 'Archivada';
  producto: string;
  id_muestra?: string; // Optional, to link back to control rutinario if needed
  fecha_ingreso?: string; // fecha de inspeccion
  hora?: string; // hora de inspeccion
  inspector?: string;
  maquina?: string;
  fvTotalPorcentaje?: number;
  fvIntermediaPorcentaje?: number;
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
    marca?: string;
    modelo?: string;
    numero_serie?: string;
    ubicacion?: string;
    criticidad?: 'Alta' | 'Media' | 'Baja';
    estado: 'Activo' | 'En Mantenimiento' | 'Inactivo' | 'Requiere Calibración';
    fecha_puesta_marcha?: string;
    proxima_calibracion: string;
    observaciones?: string;
    fotoUrl?: string;
    manual_url?: string;
    procedimiento_url?: string;
    ensayos_asociados?: string[];
}

export interface ControlEvento {
    id: string;
    equipoId: string;
    fecha: string;
    tipo: 'Calibración' | 'Verificación' | 'Mantenimiento Preventivo' | 'Mantenimiento Correctivo';
    responsable: string;
    observaciones?: string;
    proximo_control?: string;
    certificadoUrl?: string;
}

export interface NoConformidad {
    id: string;
    tipo: 'Interna' | 'Reclamo de Cliente' | 'Auditoría';
    fecha_deteccion: string;
    descripcion: string;
    estado: 'Abierta' | 'En Investigación' | 'Resuelta' | 'Cerrada';
    severidad: 'Baja' | 'Media' | 'Alta' | 'Crítica';
    responsable: string;
    fecha_vencimiento?: string;
    accion_correctiva?: string;
    productos_afectados?: string[];
    equipos_implicados?: string[];
}

export interface Importacion {
    id: string;
    bl: string;
    fecha_embarque?: string;
    sca?: string;
    fecha_emision_cert?: string;
    di?: string;
    etiqueta_rango_inicio?: string;
    etiqueta_rango_fin?: string;
    operacion?: string;
    proveedor?: string;
    fecha_solicitada?: string;
    fecha_entrega_calidad?: string;
    cantidad_lote?: number;
    fecha_devolucion?: string;
    fecha_liberacion?: string;
    ingresado_siss?: boolean;
    fecha_caducidad_cert?: string;
    estado?: 'CADUCADO' | 'VIGENTE' | 'EN TRANSITO';
}

export type InitialData = Awaited<ReturnType<typeof dataService.getInitialData>>;

interface DynamicDataContextType extends InitialData {
  addEnsayo: (ensayo: Omit<Ensayo, 'id'>) => Promise<Ensayo>;
  updateEnsayo: (id: string, ensayo: Partial<Ensayo>) => Promise<void>;
  deleteEnsayo: (id: string) => Promise<void>;
  addRegistro: (registro: Omit<Registro, 'id'>) => Promise<Registro>;
  deleteRegistro: (registroId: string) => Promise<void>;
  addEquipo: (equipo: Omit<Equipo, 'id'>) => Promise<Equipo>;
  updateEquipo: (id: string, equipo: Partial<Equipo>) => Promise<void>;
  deleteEquipo: (id: string) => Promise<void>;
  addControlEvento: (evento: Omit<ControlEvento, 'id'>) => Promise<ControlEvento>;
  addIncidencia: (incidencia: Omit<NoConformidad, 'id'>) => Promise<NoConformidad>;
  updateIncidencia: (id: string, incidencia: Partial<NoConformidad>) => Promise<void>;
  deleteIncidencia: (id: string) => Promise<void>;
  addImportacion: (importacion: Omit<Importacion, 'id'>) => Promise<Importacion>;
  updateImportacion: (id: string, importacion: Partial<Importacion>) => Promise<void>;
  deleteImportacion: (id: string) => Promise<void>;
  addRecentActivity: (activity: Omit<RecentActivity, 'id' | 'timestamp'>) => Promise<void>;
  isLoading: boolean;
}

const DynamicDataContext = createContext<DynamicDataContextType | undefined>(undefined);


// --- PROVIDER COMPONENT ---
interface DataProviderProps {
  children: ReactNode;
  initialData: InitialData;
}

export const DataProvider = ({ children, initialData }: DataProviderProps) => {
  // Static data state
  const [productMatrix, setProductMatrix] = useState<TipoProducto[]>([]);
  const [sapProducts, setSapProducts] = useState<SapProduct[]>([]);
  const [isStaticLoaded, setIsStaticLoaded] = useState(false);

  // Dynamic data state (initialized with server-side data)
  const [ensayos, setEnsayos] = useState<Ensayo[]>(initialData.ensayos);
  const [registros, setRegistros] = useState<Registro[]>(initialData.registros);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>(initialData.recentActivity);
  const [equipos, setEquipos] = useState<Equipo[]>(initialData.equipos);
  const [controles, setControles] = useState<ControlEvento[]>(initialData.controles);
  const [noConformidades, setNoConformidades] = useState<NoConformidad[]>(initialData.noConformidades);
  const [importaciones, setImportaciones] = useState<Importacion[]>(initialData.importaciones);
  const [isLoading, setIsLoading] = useState(false);

  // Load static data once on the client
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

  const addEnsayo = useCallback(async (ensayoData: Omit<Ensayo, 'id'>) => {
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
  
  const addEquipo = useCallback(async (equipoData: Omit<Equipo, 'id'>) => {
    const newEquipo = { ...equipoData, id: equipoData.id };
    setEquipos(prev => [newEquipo, ...prev].sort((a, b) => a.nombre.localeCompare(b.nombre)));
    console.log("Demo Mode: Added Equipo", newEquipo);
    return newEquipo;
  }, []);

  const updateEquipo = useCallback(async (id: string, updatedEquipoData: Partial<Equipo>) => {
      setEquipos(prev => prev.map(e => e.id === id ? { ...e, ...updatedEquipoData } : e).sort((a, b) => a.nombre.localeCompare(b.nombre)));
      console.log("Demo Mode: Updated Equipo", id, updatedEquipoData);
  }, []);
  
  const deleteEquipo = useCallback(async (id: string) => {
      setEquipos(prev => prev.filter(e => e.id !== id));
      console.log("Demo Mode: Deleted Equipo", id);
  }, []);

  const addControlEvento = useCallback(async (eventoData: Omit<ControlEvento, 'id'>) => {
    const newId = `CE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const newEvento = { ...eventoData, id: newId };
    setControles(prev => [newEvento, ...prev]);
    console.log("Demo Mode: Added Control Evento", newEvento);
    return newEvento;
  }, []);

  const addIncidencia = useCallback(async (incidenciaData: Omit<NoConformidad, 'id'>) => {
    const newId = `NC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const newIncidencia = { ...incidenciaData, id: newId };
    setNoConformidades(prev => [newIncidencia, ...prev]);
    console.log("Demo Mode: Added Incidencia", newIncidencia);
    return newIncidencia;
  }, []);

  const updateIncidencia = useCallback(async (id: string, updatedIncidenciaData: Partial<NoConformidad>) => {
      setNoConformidades(prev => prev.map(nc => nc.id === id ? { ...nc, ...updatedIncidenciaData } : nc));
      console.log("Demo Mode: Updated Incidencia", id, updatedIncidenciaData);
  }, []);

  const deleteIncidencia = useCallback(async (id: string) => {
      setNoConformidades(prev => prev.filter(nc => nc.id !== id));
      console.log("Demo Mode: Deleted Incidencia", id);
  }, []);

  const addImportacion = useCallback(async (importacionData: Omit<Importacion, 'id'>) => {
    const newId = `IMP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const newImportacion = { ...importacionData, id: newId };
    setImportaciones(prev => [newImportacion, ...prev]);
    return newImportacion;
  }, []);

  const updateImportacion = useCallback(async (id: string, updatedImportacionData: Partial<Importacion>) => {
      setImportaciones(prev => prev.map(imp => imp.id === id ? { ...imp, ...updatedImportacionData } : imp));
  }, []);

  const deleteImportacion = useCallback(async (id: string) => {
      setImportaciones(prev => prev.filter(imp => imp.id !== id));
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
    controles,
    noConformidades,
    importaciones,
    addEnsayo,
    updateEnsayo,
    deleteEnsayo,
    addRegistro,
    deleteRegistro,
    addEquipo,
    updateEquipo,
    deleteEquipo,
    addControlEvento,
    addIncidencia,
    updateIncidencia,
    deleteIncidencia,
    addImportacion,
    updateImportacion,
    deleteImportacion,
    addRecentActivity,
    isLoading,
  }), [
    ensayos, registros, recentActivity, equipos, controles, noConformidades, importaciones, isLoading, 
    addEnsayo, updateEnsayo, deleteEnsayo, addRegistro, deleteRegistro, addEquipo, updateEquipo, deleteEquipo, 
    addControlEvento, addIncidencia, updateIncidencia, deleteIncidencia, addImportacion, updateImportacion, deleteImportacion, 
    addRecentActivity
  ]);

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
