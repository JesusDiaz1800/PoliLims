

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
  comentarios_aprobacion?: string;
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
  timestamp: string; // ISO 8601 string
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

export interface GeneratedReport {
    id: string;
    nombre: string;
    tipo: string;
    fecha_creacion: string;
    path: string;
    ensayoIds: string[];
}

export interface CalculoIncertidumbre {
    id: string;
    nombre: string;
    fecha: string;
    usuario: string;
    resultado: {
        incertidumbreCombinada: number;
        incertidumbreExpandida: number;
        factorCobertura: number;
    };
    componentes: {
        descripcion: string;
        valor: number;
        tipo: 'A' | 'B';
        distribucion: 'normal' | 'rectangular' | 'triangular';
        desviacion_estandar?: number;
        unidades?: string;
    }[];
}

export interface Proveedor {
    id: string;
    nombre: string;
    tipo: string;
    contacto_nombre?: string;
    contacto_email?: string;
    contacto_telefono?: string;
    estado: 'Activo' | 'En evaluación' | 'Inactivo';
    certificacionesISO?: string;
    contratoUrl?: string;
    observaciones?: string;
    evaluaciones?: {
        fecha: string;
        calidad: number; // score 1-5
        cumplimiento: number; // score 1-5
        puntualidad: number; // score 1-5
        comentarios: string;
    }[];
}

export interface CondicionAmbiental {
    id: string;
    timestamp: string; // ISO 8601 string
    zona: string;
    temperatura: number;
    humedad: number;
    presion?: number;
    usuario: string;
}

export interface Formacion {
    id: string;
    empleadoId: string;
    empleadoNombre: string;
    tipo: 'Curso' | 'Certificación' | 'Evaluación de Competencia' | 'Inducción';
    nombre_actividad: string;
    fecha: string; // ISO 8601 string
    evaluador?: string;
    resultado: 'Aprobado' | 'Reprobado' | 'Pendiente' | 'Completado';
    observaciones?: string;
}


export type InitialData = Awaited<ReturnType<typeof dataService.getInitialData>>;

// --- API Client ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  },
  post: async <T, U>(endpoint: string, body: U): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  },
  put: async <T, U>(endpoint: string, body: U): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  },
  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  },
};


interface DynamicDataContextType {
  ensayos: Ensayo[];
  registros: Registro[];
  recentActivity: RecentActivity[];
  equipos: Equipo[];
  controles: ControlEvento[];
  noConformidades: NoConformidad[];
  importaciones: Importacion[];
  generatedReports: GeneratedReport[];
  calculosIncertidumbre: CalculoIncertidumbre[];
  proveedores: Proveedor[];
  condicionesAmbientales: CondicionAmbiental[];
  formacion: Formacion[];
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
  addGeneratedReport: (report: Omit<GeneratedReport, 'id'>) => Promise<GeneratedReport>;
  deleteGeneratedReport: (id: string) => Promise<void>;
  addCalculoIncertidumbre: (calculo: Omit<CalculoIncertidumbre, 'id'>) => Promise<CalculoIncertidumbre>;
  addCondicionAmbiental: (registro: Omit<CondicionAmbiental, 'id' | 'timestamp'>) => Promise<CondicionAmbiental>;
  addProveedor: (proveedor: Omit<Proveedor, 'id'>) => Promise<Proveedor>;
  updateProveedor: (id: string, proveedor: Partial<Proveedor>) => Promise<void>;
  deleteProveedor: (id: string) => Promise<void>;
  addFormacion: (record: Omit<Formacion, 'id' | 'fecha_vencimiento'>) => Promise<Formacion>;
  updateFormacion: (id: string, record: Partial<Formacion>) => Promise<void>;
  deleteFormacion: (id: string) => Promise<void>;
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
  
  // Dynamic data state (initialized with empty arrays)
  const [ensayos, setEnsayos] = useState<Ensayo[]>([]);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [controles, setControles] = useState<ControlEvento[]>([]);
  const [noConformidades, setNoConformidades] = useState<NoConformidad[]>([]);
  const [importaciones, setImportaciones] = useState<Importacion[]>([]);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [calculosIncertidumbre, setCalculosIncertidumbre] = useState<CalculoIncertidumbre[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [condicionesAmbientales, setCondicionesAmbientales] = useState<CondicionAmbiental[]>([]);
  const [formacion, setFormacion] = useState<Formacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load all data once on the client
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        if (API_BASE_URL) {
           console.log(`Connecting to backend at: ${API_BASE_URL}`);
           // Placeholder for API calls if a backend is connected
        } else {
            console.log("Using local demo data. Set NEXT_PUBLIC_API_URL to connect to a backend.");
            const [matrix, products, initialData] = await Promise.all([
                getMatrizProductos(),
                getProductsFromSap(),
                dataService.getInitialData()
            ]);
            setProductMatrix(matrix);
            setSapProducts(products);
            setEnsayos(initialData.ensayos);
            setRegistros(initialData.registros);
            setRecentActivity(initialData.recentActivity.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
            setEquipos(initialData.equipos);
            setControles(initialData.controles);
            setNoConformidades(initialData.noConformidades);
            setImportaciones(initialData.importaciones);
            setGeneratedReports(initialData.generatedReports);
            setCalculosIncertidumbre(initialData.calculosIncertidumbre);
            setProveedores(initialData.proveedores);
            setCondicionesAmbientales(initialData.condicionesAmbientales);
            setFormacion(initialData.formacion);
        }
        
      } catch (error) {
        console.error("Failed to load initial data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAllData();
  }, []);

  const addEnsayo = useCallback(async (ensayoData: Omit<Ensayo, 'id'>) => {
    const newEnsayo = await dataService.addEnsayo(ensayoData);
    setEnsayos(prev => [newEnsayo, ...prev]);
    return newEnsayo;
  }, []);

  const updateEnsayo = useCallback(async (id: string, updatedEnsayoData: Partial<Ensayo>) => {
    await dataService.updateEnsayo(id, updatedEnsayoData);
    setEnsayos(prev => prev.map(e => e.id === id ? { ...e, ...updatedEnsayoData } : e));
  }, []);

  const deleteEnsayo = useCallback(async (id: string) => {
    await dataService.deleteEnsayo(id);
    setEnsayos(prev => prev.filter(e => e.id !== id));
  }, []);

  const addRegistro = useCallback(async (registroData: Omit<Registro, 'id'>) => {
    const newRegistro = await dataService.addRegistro(registroData);
    setRegistros(prev => [newRegistro, ...prev]);
    return newRegistro;
  }, []);

  const deleteRegistro = useCallback(async (registroId: string) => {
    await dataService.deleteRegistro(registroId);
    setRegistros(prev => prev.filter(r => r.id !== registroId));
  }, []);
  
  const addEquipo = useCallback(async (equipoData: Omit<Equipo, 'id'>) => {
    const newEquipo = await dataService.addEquipo(equipoData);
    setEquipos(prev => [newEquipo, ...prev].sort((a, b) => a.nombre.localeCompare(b.nombre)));
    return newEquipo;
  }, []);

  const updateEquipo = useCallback(async (id: string, updatedEquipoData: Partial<Equipo>) => {
      await dataService.updateEquipo(id, updatedEquipoData);
      setEquipos(prev => prev.map(e => e.id === id ? { ...e, ...updatedEquipoData } : e).sort((a, b) => a.nombre.localeCompare(b.nombre)));
  }, []);
  
  const deleteEquipo = useCallback(async (id: string) => {
      await dataService.deleteEquipo(id);
      setEquipos(prev => prev.filter(e => e.id !== id));
  }, []);

  const addControlEvento = useCallback(async (eventoData: Omit<ControlEvento, 'id'>) => {
    const newEvento = await dataService.addControlEvento(eventoData);
    setControles(prev => [newEvento, ...prev]);
    return newEvento;
  }, []);

  const addIncidencia = useCallback(async (incidenciaData: Omit<NoConformidad, 'id'>) => {
    const newIncidencia = await dataService.addIncidencia(incidenciaData);
    setNoConformidades(prev => [newIncidencia, ...prev]);
    return newIncidencia;
  }, []);

  const updateIncidencia = useCallback(async (id: string, updatedIncidenciaData: Partial<NoConformidad>) => {
      await dataService.updateIncidencia(id, updatedIncidenciaData);
      setNoConformidades(prev => prev.map(nc => nc.id === id ? { ...nc, ...updatedIncidenciaData } : nc));
  }, []);

  const deleteIncidencia = useCallback(async (id: string) => {
      await dataService.deleteIncidencia(id);
      setNoConformidades(prev => prev.filter(nc => nc.id !== id));
  }, []);

  const addImportacion = useCallback(async (importacionData: Omit<Importacion, 'id'>) => {
    const newImportacion = await dataService.addImportacion(importacionData);
    setImportaciones(prev => [newImportacion, ...prev]);
    return newImportacion;
  }, []);

  const updateImportacion = useCallback(async (id: string, updatedImportacionData: Partial<Importacion>) => {
      await dataService.updateImportacion(id, updatedImportacionData);
      setImportaciones(prev => prev.map(imp => imp.id === id ? { ...imp, ...updatedImportacionData } : imp));
  }, []);

  const deleteImportacion = useCallback(async (id: string) => {
      await dataService.deleteImportacion(id);
      setImportaciones(prev => prev.filter(imp => imp.id !== id));
  }, []);
  
  const addGeneratedReport = useCallback(async (reportData: Omit<GeneratedReport, 'id'>) => {
    const newReport = await dataService.addGeneratedReport(reportData);
    setGeneratedReports(prev => [newReport, ...prev]);
    return newReport;
  }, []);

  const deleteGeneratedReport = useCallback(async (id: string) => {
    await dataService.deleteGeneratedReport(id);
    setGeneratedReports(prev => prev.filter(r => r.id !== id));
  }, []);

  const addCalculoIncertidumbre = useCallback(async (calculoData: Omit<CalculoIncertidumbre, 'id'>) => {
      const newCalculo = await dataService.addCalculoIncertidumbre(calculoData);
      setCalculosIncertidumbre(prev => [newCalculo, ...prev]);
      return newCalculo;
  }, []);
  
  const addCondicionAmbiental = useCallback(async (registroData: Omit<CondicionAmbiental, 'id' | 'timestamp'>) => {
      const newRegistro = await dataService.addCondicionAmbiental(registroData);
      setCondicionesAmbientales(prev => [newRegistro, ...prev].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      return newRegistro;
  }, []);

  const addProveedor = useCallback(async (proveedorData: Omit<Proveedor, 'id'>) => {
    const newProveedor = await dataService.addProveedor(proveedorData);
    setProveedores(prev => [newProveedor, ...prev].sort((a,b) => a.nombre.localeCompare(b.nombre)));
    return newProveedor;
  }, []);

  const updateProveedor = useCallback(async (id: string, updatedProveedorData: Partial<Proveedor>) => {
    await dataService.updateProveedor(id, updatedProveedorData);
    setProveedores(prev => prev.map(p => p.id === id ? { ...p, ...updatedProveedorData } : p).sort((a,b) => a.nombre.localeCompare(b.nombre)));
  }, []);

  const deleteProveedor = useCallback(async (id: string) => {
    await dataService.deleteProveedor(id);
    setProveedores(prev => prev.filter(p => p.id !== id));
  }, []);

  const addFormacion = useCallback(async (record: Omit<Formacion, 'id' | 'fecha_vencimiento'>) => {
    const newRecord = await dataService.addFormacion(record as Omit<Formacion, 'id'>);
    setFormacion(prev => [newRecord, ...prev].sort((a,b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()));
    return newRecord;
  }, []);

  const updateFormacion = useCallback(async (id: string, record: Partial<Formacion>) => {
    await dataService.updateFormacion(id, record);
    setFormacion(prev => prev.map(f => f.id === id ? { ...f, ...record } : f).sort((a,b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()));
  }, []);

  const deleteFormacion = useCallback(async (id: string) => {
    await dataService.deleteFormacion(id);
    setFormacion(prev => prev.filter(f => f.id !== id));
  }, []);


  const addRecentActivity = useCallback(async (activity: Omit<RecentActivity, 'id' | 'timestamp'>) => {
     const fullActivity = await dataService.addRecentActivity(activity);
     setRecentActivity(prev => [fullActivity, ...prev].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  }, []);

  const dynamicContextValue = useMemo(() => ({
    ensayos,
    registros,
    recentActivity,
    equipos,
    controles,
    noConformidades,
    importaciones,
    generatedReports,
    calculosIncertidumbre,
    proveedores,
    condicionesAmbientales,
    formacion,
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
    addGeneratedReport,
    deleteGeneratedReport,
    addCalculoIncertidumbre,
    addCondicionAmbiental,
    addProveedor,
    updateProveedor,
    deleteProveedor,
    addFormacion,
    updateFormacion,
    deleteFormacion,
    addRecentActivity,
    isLoading: isLoading,
  }), [
    ensayos, registros, recentActivity, equipos, controles, noConformidades, importaciones, generatedReports, calculosIncertidumbre, proveedores, condicionesAmbientales, formacion, isLoading,
    addEnsayo, updateEnsayo, deleteEnsayo, addRegistro, deleteRegistro, addEquipo, updateEquipo, deleteEquipo, 
    addControlEvento, addIncidencia, updateIncidencia, deleteIncidencia, addImportacion, updateImportacion, deleteImportacion, 
    addGeneratedReport, deleteGeneratedReport, addCalculoIncertidumbre, addCondicionAmbiental, addProveedor, updateProveedor, deleteProveedor, addFormacion, updateFormacion, deleteFormacion, addRecentActivity
  ]);

  const staticContextValue = useMemo(() => ({
    productMatrix,
    sapProducts,
    isLoaded: !isLoading
  }), [productMatrix, sapProducts, isLoading]);

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
