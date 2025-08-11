
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
