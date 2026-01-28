/**
 * Firebase data service for PoliLims
 * 
 * This service provides methods to interact with Firebase Firestore
 * for all data operations in the application.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentReference,
  CollectionReference,
} from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase';
import { startMeasure, endMeasure } from '@/lib/performance-monitor';
import type {
  Ensayo,
  Registro,
  RecentActivity,
  Equipo,
  ControlEvento,
  NoConformidad,
  Importacion,
  GeneratedReport,
  CalculoIncertidumbre,
  Proveedor,
  CondicionAmbiental,
  Formacion,
  Auditoria,
  Capacitacion,
  EnsayoPHI,
} from '@/context/data-context';

// Collection names
const COLLECTIONS = {
  ENSAYOS: 'ensayos',
  REGISTROS: 'registros',
  EQUIPOS: 'equipos',
  CONTROL_EVENTOS: 'control_eventos',
  NO_CONFORMIDADES: 'no_conformidades',
  IMPORTACIONES: 'importaciones',
  REPORTES: 'reportes',
  INCERTIDUMBRE: 'incertidumbre',
  PROVEEDORES: 'proveedores',
  CONDICIONES_AMBIENTALES: 'condiciones_ambientales',
  FORMACION: 'formacion',
  AUDITORIAS: 'auditorias',
  CAPACITACIONES: 'capacitaciones',
  ACTIVIDAD: 'actividad',
  ENSAYOS_PHI: 'ensayos_phi',
  USUARIOS: 'usuarios',
};

/**
 * Convert Firestore timestamp to ISO string
 */
function convertTimestampToISOString(timestamp: Timestamp | undefined): string | undefined {
  return timestamp ? new Date(timestamp.seconds * 1000).toISOString() : undefined;
}

/**
 * Convert Firestore document to application model
 */
function convertDoc<T>(doc: QueryDocumentSnapshot<DocumentData>): T {
  const data = doc.data();
  const result: any = { id: doc.id, ...data };
  
  // Convert Firestore timestamps to ISO strings
  for (const key in result) {
    if (result[key] instanceof Timestamp) {
      result[key] = convertTimestampToISOString(result[key]);
    }
  }
  
  return result as T;
}

/**
 * Get all documents from a collection
 */
async function getAll<T>(collectionName: string): Promise<T[]> {
  const operationName = `getAll-${collectionName}`;
  startMeasure(operationName);
  
  try {
    const db = getFirestoreDb();
    const querySnapshot = await getDocs(collection(db, collectionName));
    const results = querySnapshot.docs.map(doc => convertDoc<T>(doc));
    
    return results;
  } finally {
    endMeasure(operationName);
  }
}

/**
 * Get a document by ID
 */
async function getById<T>(collectionName: string, id: string): Promise<T | null> {
  const operationName = `getById-${collectionName}-${id}`;
  startMeasure(operationName);
  
  try {
    const db = getFirestoreDb();
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    
    return null;
  } finally {
    endMeasure(operationName);
  }
}

/**
 * Add a new document to a collection
 */
async function add<T extends { id?: string }>(collectionName: string, data: Omit<T, 'id'>): Promise<T> {
  const operationName = `add-${collectionName}`;
  startMeasure(operationName);
  
  try {
    const db = getFirestoreDb();
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return { id: docRef.id, ...data } as T;
  } finally {
    endMeasure(operationName);
  }
}

/**
 * Update a document
 */
async function update<T extends { id: string }>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
  const operationName = `update-${collectionName}-${id}`;
  startMeasure(operationName);
  
  try {
    const db = getFirestoreDb();
    const docRef = doc(db, collectionName, id);
    
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } finally {
    endMeasure(operationName);
  }
}

/**
 * Delete a document
 */
async function remove(collectionName: string, id: string): Promise<void> {
  const operationName = `remove-${collectionName}-${id}`;
  startMeasure(operationName);
  
  try {
    const db = getFirestoreDb();
    const docRef = doc(db, collectionName, id);
    
    await deleteDoc(docRef);
  } finally {
    endMeasure(operationName);
  }
}

// Ensayos
export async function getEnsayos(): Promise<Ensayo[]> {
  return getAll<Ensayo>(COLLECTIONS.ENSAYOS);
}

export async function getEnsayoById(id: string): Promise<Ensayo | null> {
  return getById<Ensayo>(COLLECTIONS.ENSAYOS, id);
}

export async function addEnsayo(ensayo: Omit<Ensayo, 'id'>): Promise<Ensayo> {
  return add<Ensayo>(COLLECTIONS.ENSAYOS, ensayo);
}

export async function updateEnsayo(id: string, data: Partial<Ensayo>): Promise<void> {
  return update<Ensayo>(COLLECTIONS.ENSAYOS, id, data);
}

export async function deleteEnsayo(id: string): Promise<void> {
  return remove(COLLECTIONS.ENSAYOS, id);
}

// Registros
export async function getRegistros(): Promise<Registro[]> {
  return getAll<Registro>(COLLECTIONS.REGISTROS);
}

export async function addRegistro(registro: Omit<Registro, 'id'>): Promise<Registro> {
  return add<Registro>(COLLECTIONS.REGISTROS, registro);
}

export async function deleteRegistro(id: string): Promise<void> {
  return remove(COLLECTIONS.REGISTROS, id);
}

// Equipos
export async function getEquipos(): Promise<Equipo[]> {
  return getAll<Equipo>(COLLECTIONS.EQUIPOS);
}

export async function addEquipo(equipo: Omit<Equipo, 'id'>): Promise<Equipo> {
  return add<Equipo>(COLLECTIONS.EQUIPOS, equipo);
}

export async function updateEquipo(id: string, data: Partial<Equipo>): Promise<void> {
  return update<Equipo>(COLLECTIONS.EQUIPOS, id, data);
}

export async function deleteEquipo(id: string): Promise<void> {
  return remove(COLLECTIONS.EQUIPOS, id);
}

// Control Eventos
export async function getControlEventos(): Promise<ControlEvento[]> {
  return getAll<ControlEvento>(COLLECTIONS.CONTROL_EVENTOS);
}

export async function addControlEvento(evento: Omit<ControlEvento, 'id'>): Promise<ControlEvento> {
  return add<ControlEvento>(COLLECTIONS.CONTROL_EVENTOS, evento);
}

// No Conformidades
export async function getNoConformidades(): Promise<NoConformidad[]> {
  return getAll<NoConformidad>(COLLECTIONS.NO_CONFORMIDADES);
}

export async function addIncidencia(incidencia: Omit<NoConformidad, 'id'>): Promise<NoConformidad> {
  return add<NoConformidad>(COLLECTIONS.NO_CONFORMIDADES, incidencia);
}

export async function updateIncidencia(id: string, data: Partial<NoConformidad>): Promise<void> {
  return update<NoConformidad>(COLLECTIONS.NO_CONFORMIDADES, id, data);
}

export async function deleteIncidencia(id: string): Promise<void> {
  return remove(COLLECTIONS.NO_CONFORMIDADES, id);
}

// Recent Activity
export async function getRecentActivity(): Promise<RecentActivity[]> {
  const db = getFirestoreDb();
  const q = query(
    collection(db, COLLECTIONS.ACTIVIDAD),
    orderBy('timestamp', 'desc'),
    limit(50)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => convertDoc<RecentActivity>(doc));
}

export async function addRecentActivity(activity: Omit<RecentActivity, 'id' | 'timestamp'>): Promise<RecentActivity> {
  const db = getFirestoreDb();
  const docRef = await addDoc(collection(db, COLLECTIONS.ACTIVIDAD), {
    ...activity,
    timestamp: serverTimestamp(),
  });
  
  return {
    id: docRef.id,
    ...activity,
    timestamp: new Date().toISOString(),
  };
}

// Proveedores
export async function getProveedores(): Promise<Proveedor[]> {
  return getAll<Proveedor>(COLLECTIONS.PROVEEDORES);
}

export async function addProveedor(proveedor: Omit<Proveedor, 'id'>): Promise<Proveedor> {
  return add<Proveedor>(COLLECTIONS.PROVEEDORES, proveedor);
}

export async function updateProveedor(id: string, data: Partial<Proveedor>): Promise<void> {
  return update<Proveedor>(COLLECTIONS.PROVEEDORES, id, data);
}

export async function deleteProveedor(id: string): Promise<void> {
  return remove(COLLECTIONS.PROVEEDORES, id);
}

// Auditorias
export async function getAuditorias(): Promise<Auditoria[]> {
  return getAll<Auditoria>(COLLECTIONS.AUDITORIAS);
}

export async function addAuditoria(auditoria: Omit<Auditoria, 'id'>): Promise<Auditoria> {
  return add<Auditoria>(COLLECTIONS.AUDITORIAS, auditoria);
}

export async function updateAuditoria(id: string, data: Partial<Auditoria>): Promise<void> {
  return update<Auditoria>(COLLECTIONS.AUDITORIAS, id, data);
}

export async function deleteAuditoria(id: string): Promise<void> {
  return remove(COLLECTIONS.AUDITORIAS, id);
}

// Formacion
export async function getFormacion(): Promise<Formacion[]> {
  return getAll<Formacion>(COLLECTIONS.FORMACION);
}

export async function addFormacion(formacion: Omit<Formacion, 'id'>): Promise<Formacion> {
  return add<Formacion>(COLLECTIONS.FORMACION, formacion);
}

export async function updateFormacion(id: string, data: Partial<Formacion>): Promise<void> {
  return update<Formacion>(COLLECTIONS.FORMACION, id, data);
}

export async function deleteFormacion(id: string): Promise<void> {
  return remove(COLLECTIONS.FORMACION, id);
}

// Condiciones Ambientales
export async function getCondicionesAmbientales(): Promise<CondicionAmbiental[]> {
  return getAll<CondicionAmbiental>(COLLECTIONS.CONDICIONES_AMBIENTALES);
}

export async function addCondicionAmbiental(condicion: Omit<CondicionAmbiental, 'id' | 'timestamp'>): Promise<CondicionAmbiental> {
  const db = getFirestoreDb();
  const docRef = await addDoc(collection(db, COLLECTIONS.CONDICIONES_AMBIENTALES), {
    ...condicion,
    timestamp: serverTimestamp(),
  });
  
  return {
    id: docRef.id,
    ...condicion,
  };
}

// Ensayos PHI
export async function getEnsayosPHI(): Promise<EnsayoPHI[]> {
  return getAll<EnsayoPHI>(COLLECTIONS.ENSAYOS_PHI);
}

export async function addEnsayoPHI(ensayo: Omit<EnsayoPHI, 'id'>): Promise<EnsayoPHI> {
  return add<EnsayoPHI>(COLLECTIONS.ENSAYOS_PHI, ensayo);
}

export async function updateEnsayoPHI(id: string, data: Partial<EnsayoPHI>): Promise<void> {
  return update<EnsayoPHI>(COLLECTIONS.ENSAYOS_PHI, id, data);
}

// Capacitaciones
export async function getCapacitaciones(): Promise<Capacitacion[]> {
  return getAll<Capacitacion>(COLLECTIONS.CAPACITACIONES);
}

export async function addCapacitacion(capacitacion: Omit<Capacitacion, 'id'>): Promise<Capacitacion> {
  return add<Capacitacion>(COLLECTIONS.CAPACITACIONES, capacitacion);
}

export async function updateCapacitacion(id: string, data: Partial<Capacitacion>): Promise<void> {
  return update<Capacitacion>(COLLECTIONS.CAPACITACIONES, id, data);
}

export async function deleteCapacitacion(id: string): Promise<void> {
  return remove(COLLECTIONS.CAPACITACIONES, id);
}

/**
 * Get all initial data for the application
 */
export async function getInitialData() {
  startMeasure('getInitialData');
  
  try {
    const [
      ensayos,
      registros,
      equipos,
      controles,
      noConformidades,
      importaciones,
      reportes,
      calculosIncertidumbre,
      proveedores,
      condicionesAmbientales,
      formacion,
      auditorias,
      ensayosPHI,
      capacitaciones,
      recentActivity,
    ] = await Promise.all([
      getEnsayos(),
      getRegistros(),
      getEquipos(),
      getControlEventos(),
      getNoConformidades(),
      getAll<Importacion>(COLLECTIONS.IMPORTACIONES),
      getAll<GeneratedReport>(COLLECTIONS.REPORTES),
      getAll<CalculoIncertidumbre>(COLLECTIONS.INCERTIDUMBRE),
      getProveedores(),
      getCondicionesAmbientales(),
      getFormacion(),
      getAuditorias(),
      getEnsayosPHI(),
      getCapacitaciones(),
      getRecentActivity(),
    ]);
    
    return {
      ensayos,
      registros,
      equipos,
      controles,
      noConformidades,
      importaciones,
      generatedReports: reportes,
      calculosIncertidumbre,
      proveedores,
      condicionesAmbientales,
      formacion,
      auditorias,
      ensayosPHI,
      capacitaciones,
      recentActivity,
    };
  } finally {
    endMeasure('getInitialData');
  }
}

// Generated Reports
export async function getGeneratedReports(): Promise<GeneratedReport[]> {
  return getAll<GeneratedReport>(COLLECTIONS.REPORTES);
}

export async function addGeneratedReport(report: Omit<GeneratedReport, 'id'>): Promise<GeneratedReport> {
  return add<GeneratedReport>(COLLECTIONS.REPORTES, report);
}

export async function deleteGeneratedReport(id: string): Promise<void> {
  return remove(COLLECTIONS.REPORTES, id);
}

// Calculos de Incertidumbre
export async function getCalculosIncertidumbre(): Promise<CalculoIncertidumbre[]> {
  return getAll<CalculoIncertidumbre>(COLLECTIONS.INCERTIDUMBRE);
}

export async function addCalculoIncertidumbre(calculo: Omit<CalculoIncertidumbre, 'id'>): Promise<CalculoIncertidumbre> {
  return add<CalculoIncertidumbre>(COLLECTIONS.INCERTIDUMBRE, calculo);
}

// Importaciones
export async function getImportaciones(): Promise<Importacion[]> {
  return getAll<Importacion>(COLLECTIONS.IMPORTACIONES);
}

export async function addImportacion(importacion: Omit<Importacion, 'id'>): Promise<Importacion> {
  return add<Importacion>(COLLECTIONS.IMPORTACIONES, importacion);
}

export async function updateImportacion(id: string, data: Partial<Importacion>): Promise<void> {
  return update<Importacion>(COLLECTIONS.IMPORTACIONES, id, data);
}

export async function deleteImportacion(id: string): Promise<void> {
  return remove(COLLECTIONS.IMPORTACIONES, id);
}