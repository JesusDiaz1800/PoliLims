
"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import * as dataService from '@/services/data-service';
import type { User } from '@/services/user-service';
import type { TipoProducto } from '@/lib/matriz-datos';

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
    id: string; // id_instrumento
    nombre: string; // nombre_instrumento
    marca?: string;
    modelo?: string;
    numero_serie?: string;
    ubicacion?: string;
    criticidad?: 'Alta' | 'Media' | 'Baja';
    estado: 'Activo' | 'En Mantenimiento' | 'Inactivo' | 'Requiere Calibración';
    fecha_puesta_marcha?: string; // fecha_adquisicion
    ultima_calibracion?: string; // timestamp
    proxima_calibracion: string; // timestamp
    observaciones?: string;
    fotoUrl?: string;
    manual_url?: string;
    procedimiento_url?: string;
    ensayos_asociados?: string[];
    historial_mantenimiento?: {
        fecha: string; // timestamp
        descripcion: string;
        tecnico_id: string;
        costo?: number;
    }[];
    documentos_calibracion?: string[]; // URLs a Cloud Storage
    autorizado_para_uso?: boolean;
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
    fecha_vencimiento?: string;
}

export interface Hallazgo {
    id: string;
    auditoriaId: string;
    tipo: 'No Conformidad Mayor' | 'No Conformidad Menor' | 'Observación' | 'Oportunidad de Mejora';
    descripcion: string;
    clausula_norma: string;
    responsable_accion: string;
    fecha_limite_accion: string; // ISO 8601 string
    estado: 'Abierto' | 'En Proceso' | 'Cerrado' | 'Verificado';
}

export interface Auditoria {
    id: string;
    tipo: 'Interna' | 'Externa - Proveedor' | 'Externa - Certificación';
    fecha_inicio: string; // ISO 8601 string
    fecha_fin: string; // ISO 8601 string
    auditor_lider: string;
    auditores?: string[];
    alcance: string;
    objetivos?: string;
    estado: 'Planificada' | 'En Curso' | 'Finalizada' | 'Cancelada';
    hallazgos?: Hallazgo[];
}

export interface EnsayoPHI {
  id: string;
  fechaIngresoManual: string; // 'dd/MM/yyyy'
  fechaInicio: string; // ISO string
  producto: string;
  raya: string;
  horas: number;
  estado: 'EN PROCESO' | 'FINALIZADO';
  resultado?: string;
}

export type InitialData = Omit<Awaited<ReturnType<typeof dataService.getInitialData>>, 'sapProducts'>;


interface DynamicDataContextType extends InitialData {
    isLoaded: boolean;
    user: User | null;
    setUser: (user: User | null) => void;
    addEnsayo: (ensayo: Omit<Ensayo, 'id'>) => Promise<Ensayo>;
    updateEnsayo: (id: string, updatedData: Partial<Ensayo>) => Promise<void>;
    deleteEnsayo: (id: string) => Promise<void>;
    addRegistro: (registro: Omit<Registro, 'id'>) => Promise<Registro>;
    deleteRegistro: (id: string) => Promise<void>;
    addEquipo: (equipo: Omit<Equipo, 'id'>) => Promise<Equipo>;
    updateEquipo: (id: string, updatedData: Partial<Equipo>) => Promise<void>;
    deleteEquipo: (id: string) => Promise<void>;
    addControlEvento: (evento: Omit<ControlEvento, 'id'>) => Promise<ControlEvento>;
    addIncidencia: (incidencia: Omit<NoConformidad, 'id'>) => Promise<NoConformidad>;
    updateIncidencia: (id: string, updatedData: Partial<NoConformidad>) => Promise<void>;
    deleteIncidencia: (id: string) => Promise<void>;
    addRecentActivity: (activity: Omit<RecentActivity, 'id' | 'timestamp'>) => Promise<RecentActivity>;
    addProveedor: (proveedor: Omit<Proveedor, 'id'>) => Promise<Proveedor>;
    updateProveedor: (id: string, updatedData: Partial<Proveedor>) => Promise<void>;
    deleteProveedor: (id: string) => Promise<void>;
    addAuditoria: (auditoria: Omit<Auditoria, 'id'>) => Promise<Auditoria>;
    updateAuditoria: (id: string, updatedData: Partial<Auditoria>) => Promise<void>;
    deleteAuditoria: (id: string) => Promise<void>;
    addFormacion: (formacion: Omit<Formacion, 'id'>) => Promise<Formacion>;
    updateFormacion: (id: string, updatedData: Partial<Formacion>) => Promise<void>;
    deleteFormacion: (id: string) => Promise<void>;
    addCondicionAmbiental: (condicion: Omit<CondicionAmbiental, 'id' | 'timestamp'>) => Promise<CondicionAmbiental>;
    addEnsayoPHI: (ensayo: Omit<EnsayoPHI, 'id'>) => Promise<void>;
    updateEnsayoPHI: (id: string, updatedData: Partial<EnsayoPHI>) => Promise<void>;
}

const DynamicDataContext = createContext<DynamicDataContextType | undefined>(undefined);

export function DynamicDataProvider({ children, initialData }: { children: ReactNode, initialData: InitialData }) {
    const [data, setData] = useState<InitialData>(initialData);
    const [user, setUser] = useState<User | null>(null);
    
    const addEnsayo = useCallback(async (ensayo: Omit<Ensayo, 'id'>) => {
        const newEnsayo = await dataService.addEnsayo(ensayo);
        setData(prev => ({...prev, ensayos: [newEnsayo, ...prev.ensayos]}));
        return newEnsayo;
    }, []);
    
    const updateEnsayo = useCallback(async (id: string, updatedData: Partial<Ensayo>) => {
        await dataService.updateEnsayo(id, updatedData);
        setData(prev => ({ ...prev, ensayos: prev.ensayos.map(e => e.id === id ? { ...e, ...updatedData } : e)}));
    }, []);
    
    const deleteEnsayo = useCallback(async (id: string) => {
        await dataService.deleteEnsayo(id);
        setData(prev => ({...prev, ensayos: prev.ensayos.filter(e => e.id !== id)}));
    }, []);

    const addRegistro = useCallback(async (registro: Omit<Registro, 'id'>) => {
        const newRegistro = await dataService.addRegistro(registro);
        setData(prev => ({ ...prev, registros: [newRegistro, ...prev.registros] }));
        return newRegistro;
    }, []);

    const deleteRegistro = useCallback(async (id: string) => {
        await dataService.deleteRegistro(id);
        setData(prev => ({ ...prev, registros: prev.registros.filter(r => r.id !== id) }));
    }, []);
    
    const addEquipo = useCallback(async (equipo: Omit<Equipo, 'id'>) => {
        const newEquipo = await dataService.addEquipo(equipo);
        setData(prev => ({ ...prev, equipos: [newEquipo, ...prev.equipos] }));
        return newEquipo;
    }, []);

    const updateEquipo = useCallback(async (id: string, updatedData: Partial<Equipo>) => {
        await dataService.updateEquipo(id, updatedData);
        setData(prev => ({ ...prev, equipos: prev.equipos.map(e => e.id === id ? { ...e, ...updatedData } : e) }));
    }, []);
    
    const deleteEquipo = useCallback(async (id: string) => {
        await dataService.deleteEquipo(id);
        setData(prev => ({ ...prev, equipos: prev.equipos.filter(e => e.id !== id) }));
    }, []);

     const addControlEvento = useCallback(async (evento: Omit<ControlEvento, 'id'>) => {
        const newEvento = await dataService.addControlEvento(evento);
        setData(prev => ({ ...prev, controles: [newEvento, ...prev.controles] }));
        return newEvento;
    }, []);

    const addIncidencia = useCallback(async (incidencia: Omit<NoConformidad, 'id'>) => {
        const newIncidencia = await dataService.addIncidencia(incidencia);
        setData(prev => ({ ...prev, noConformidades: [newIncidencia, ...prev.noConformidades] }));
        return newIncidencia;
    }, []);

    const updateIncidencia = useCallback(async (id: string, updatedData: Partial<NoConformidad>) => {
        await dataService.updateIncidencia(id, updatedData);
        setData(prev => ({ ...prev, noConformidades: prev.noConformidades.map(i => i.id === id ? { ...i, ...updatedData } : i) }));
    }, []);
    
    const deleteIncidencia = useCallback(async (id: string) => {
        await dataService.deleteIncidencia(id);
        setData(prev => ({...prev, noConformidades: prev.noConformidades.filter(i => i.id !== id)}));
    }, []);
    
    const addRecentActivity = useCallback(async (activity: Omit<RecentActivity, 'id' | 'timestamp'>) => {
        const newActivity = await dataService.addRecentActivity(activity);
        setData(prev => ({...prev, recentActivity: [newActivity, ...prev.recentActivity].slice(0, 50)}));
        return newActivity;
    }, []);

    const addProveedor = useCallback(async (proveedor: Omit<Proveedor, 'id'>) => {
        const newProveedor = await dataService.addProveedor(proveedor);
        setData(prev => ({ ...prev, proveedores: [newProveedor, ...prev.proveedores] }));
        return newProveedor;
    }, []);

    const updateProveedor = useCallback(async (id: string, updatedData: Partial<Proveedor>) => {
        await dataService.updateProveedor(id, updatedData);
        setData(prev => ({ ...prev, proveedores: prev.proveedores.map(p => p.id === id ? { ...p, ...updatedData } as Proveedor : p) }));
    }, []);

    const deleteProveedor = useCallback(async (id: string) => {
        await dataService.deleteProveedor(id);
        setData(prev => ({ ...prev, proveedores: prev.proveedores.filter(p => p.id !== id) }));
    }, []);

    const addAuditoria = useCallback(async (auditoria: Omit<Auditoria, 'id'>) => {
        const newAuditoria = await dataService.addAuditoria(auditoria);
        setData(prev => ({ ...prev, auditorias: [newAuditoria, ...prev.auditorias] }));
        return newAuditoria;
    }, []);

    const updateAuditoria = useCallback(async (id: string, updatedData: Partial<Auditoria>) => {
        await dataService.updateAuditoria(id, updatedData);
        setData(prev => ({...prev, auditorias: prev.auditorias.map(a => a.id === id ? { ...a, ...updatedData } : a) }));
    }, []);

    const deleteAuditoria = useCallback(async (id: string) => {
        await dataService.deleteAuditoria(id);
        setData(prev => ({ ...prev, auditorias: prev.auditorias.filter(a => a.id !== id) }));
    }, []);
    
    const addFormacion = useCallback(async (formacion: Omit<Formacion, 'id'>) => {
        const newFormacion = await dataService.addFormacion(formacion);
        setData(prev => ({ ...prev, formacion: [newFormacion, ...prev.formacion] }));
        return newFormacion;
    }, []);

    const updateFormacion = useCallback(async (id: string, updatedData: Partial<Formacion>) => {
        await dataService.updateFormacion(id, updatedData);
        setData(prev => ({ ...prev, formacion: prev.formacion.map(f => f.id === id ? { ...f, ...updatedData } : f) }));
    }, []);

    const deleteFormacion = useCallback(async (id: string) => {
        await dataService.deleteFormacion(id);
        setData(prev => ({ ...prev, formacion: prev.formacion.filter(f => f.id !== id) }));
    }, []);

    const addCondicionAmbiental = useCallback(async (condicion: Omit<CondicionAmbiental, 'id'|'timestamp'>) => {
        const newCondicion = await dataService.addCondicionAmbiental(condicion);
        setData(prev => ({ ...prev, condicionesAmbientales: [newCondicion, ...prev.condicionesAmbientales] }));
        return newCondicion;
    }, []);

    const addEnsayoPHI = useCallback(async (ensayo: Omit<EnsayoPHI, 'id'>) => {
        const newEnsayo = await dataService.addEnsayoPHI(ensayo);
        setData(prev => ({ ...prev, ensayosPHI: [newEnsayo, ...prev.ensayosPHI] }));
    }, []);

    const updateEnsayoPHI = useCallback(async (id: string, updatedData: Partial<EnsayoPHI>) => {
        await dataService.updateEnsayoPHI(id, updatedData);
        setData(prev => ({ ...prev, ensayosPHI: prev.ensayosPHI.map(e => e.id === id ? { ...e, ...updatedData } : e) }));
    }, []);


    const value = useMemo(() => ({
        ...data,
        isLoaded: true, // Data is always available from the root layout
        user,
        setUser,
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
        addRecentActivity,
        addProveedor,
        updateProveedor,
        deleteProveedor,
        addAuditoria,
        updateAuditoria,
        deleteAuditoria,
        addFormacion,
        updateFormacion,
        deleteFormacion,
        addCondicionAmbiental,
        addEnsayoPHI,
        updateEnsayoPHI,
    }), [data, user, addEnsayo, updateEnsayo, deleteEnsayo, addRegistro, deleteRegistro, addEquipo, updateEquipo, deleteEquipo, addControlEvento, addIncidencia, updateIncidencia, deleteIncidencia, addRecentActivity, addProveedor, updateProveedor, deleteProveedor, addAuditoria, updateAuditoria, deleteAuditoria, addFormacion, updateFormacion, deleteFormacion, addCondicionAmbiental, addEnsayoPHI, updateEnsayoPHI]);

    return (
        <DynamicDataContext.Provider value={value}>
            {children}
        </DynamicDataContext.Provider>
    );
}

export const useDynamicData = (): DynamicDataContextType => {
    const context = useContext(DynamicDataContext);
    if (!context) {
        throw new Error('useDynamicData must be used within a DynamicDataProvider');
    }
    return context;
};
