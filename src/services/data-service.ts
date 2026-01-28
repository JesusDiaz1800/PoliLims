// Imports
import type { User } from '@/services/user-service';

// Demo data para usuarios
const demoUsuarios: User[] = [
  {
    username: "jdiaz",
    fullName: "Jesus Diaz",
    role: "Ing. Analista de Calidad",
    initials: "JD",
    avatarUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMuc29yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcng9IjIwIiBmaWxsPSIjM0I4MkY2Ii8+Cjx0ZXh0IHg9IjIwIiB5PSIyNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmb250LWZhbWlseT0iQXJpYWwiPkpEPC90ZXh0Pgo8L3N2Zz4K"
  },
  {
    username: "vlutz",
    fullName: "Victor Lutz",
    role: "Jefe de Calidad",
    initials: "VL",
    avatarUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMuc29yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcng9IjIwIiBmaWxsPSIjRkY2ODc1Ii8+Cjx0ZXh0IHg9IjIwIiB5PSIyNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmb250LWZhbWlseT0iQXJpYWwiPlZMPC90ZXh0Pgo8L3N2Zz4K"
  },
  {
    username: "afigueroa",
    fullName: "Antonia Figueroa",
    role: "Analista de Calidad",
    initials: "AF",
    avatarUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMuc29yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcng9IjIwIiBmaWxsPSIjRkYwOTgwIi8+Cjx0ZXh0IHg9IjIwIiB5PSIyNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmb250LWZhbWlseT0iQXJpYWwiPkFGPC90ZXh0Pgo8L3N2Zz4K"
  },
  {
    username: "rcordova",
    fullName: "Robinson Córdova",
    role: "Inspector de Calidad",
    initials: "RC",
    avatarUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMuc29yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcng9IjIwIiBmaWxsPSIjNEMxRjUiLz4KPHRleHQgeD0iMjAiIHk9IjI2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZvbnQtZmFtaWx5PSJBcmlhbCI+UkM8L3RleHQ+Cjwvc3ZnPgo="
  },
  {
    username: "mmiranda",
    fullName: "Maximiliano Miranda",
    role: "Ing. Analista de Calidad",
    initials: "MM",
    avatarUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMuc29yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcng9IjIwIiBmaWxsPSIjRkY1NzIyIi8+Cjx0ZXh0IHg9IjIwIiB5PSIyNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmb250LWZhbWlseT0iQXJpYWwiPk1NPC90ZXh0Pgo8L3N2Zz4K"
  }
];

import type { GeneratedReport } from '@/context/data-context';

// Delete a generated report
export async function deleteGeneratedReport(id: string): Promise<void> {
  // In a real app, this would delete from Firebase and storage
  console.log('Deleting report:', id);
  return Promise.resolve();
}

// Demo data para proveedores
const demoProveedores = [
  {
    id: 'PROV-001',
    nombre: 'BOREALIS CO.',
    tipo: 'Materia Prima',
    contacto_nombre: 'Peter Schmidt',
    contacto_email: 'peter.schmidt@borealis.com',
    contacto_telefono: '+43 1 22 400 0',
    estado: 'Activo',
    certificacionesISO: 'ISO 9001, ISO 14001',
    contratoUrl: '#',
    observaciones: 'Proveedor principal de HDPE y PP',
    evaluaciones: [
      { fecha: '15-01-2025', calidad: 5, cumplimiento: 5, puntualidad: 4, comentarios: 'Excelente calidad, retraso menor en última entrega.' }
    ]
  },
  {
    id: 'PROV-002',
    nombre: 'SABIC',
    tipo: 'Materia Prima',
    contacto_nombre: 'Ahmed Al-Rashid',
    contacto_email: 'ahmed.alrashid@sabic.com',
    contacto_telefono: '+966 11 225 8000',
    estado: 'Activo',
    certificacionesISO: 'ISO 9001, ISO 14001, ISO 45001',
    contratoUrl: '#',
    observaciones: 'Proveedor alternativo de PP',
    evaluaciones: [
      { fecha: '20-02-2025', calidad: 5, cumplimiento: 5, puntualidad: 5, comentarios: 'Servicio excepcional y puntual.' }
    ]
  },
  {
    id: 'PROV-003',
    nombre: 'Trescal',
    tipo: 'Calibración',
    contacto_nombre: 'María González',
    contacto_email: 'maria.gonzalez@trescal.com',
    contacto_telefono: '+56 2 2345 6789',
    estado: 'Activo',
    certificacionesISO: 'ISO 17025',
    contratoUrl: '#',
    observaciones: 'Servicio de calibración externa',
    evaluaciones: [
      { fecha: '10-03-2025', calidad: 5, cumplimiento: 5, puntualidad: 5, comentarios: 'Servicio profesional y certificaciones válidas.' }
    ]
  },
  {
    id: 'PROV-004',
    nombre: 'Sigma-Aldrich',
    tipo: 'Reactivos',
    contacto_nombre: 'Juan Pérez',
    contacto_email: 'juan.perez@sigma.com',
    contacto_telefono: '+56 2 3456 7890',
    estado: 'Activo',
    certificacionesISO: 'ISO 9001',
    contratoUrl: '#',
    observaciones: 'Proveedor de reactivos analíticos',
    evaluaciones: [
      { fecha: '05-04-2025', calidad: 5, cumplimiento: 4, puntualidad: 4, comentarios: 'Calidad excelente, ocasional retraso en entregas.' }
    ]
  }
];

// Demo data para auditorias
const demoAuditorias = [
  {
    id: 'AUD-INT-001',
    tipo: 'Interna',
    fecha_inicio: '2025-08-01',
    fecha_fin: '2025-08-02',
    auditor_lider: 'Victor Lutz',
    auditores: ['Jesus Diaz'],
    alcance: 'Procesos de ensayo de materias primas (Cláusulas 7.2 a 7.7 de ISO 17025)',
    objetivos: 'Verificar cumplimiento de procedimientos de ensayo',
    estado: 'Planificada',
    hallazgos: []
  },
  {
    id: 'AUD-EXT-001',
    tipo: 'Externa - Certificación',
    fecha_inicio: '2025-09-15',
    fecha_fin: '2025-09-17',
    auditor_lider: 'Juan Garcia (AENOR)',
    auditores: [],
    alcance: 'Auditoría de seguimiento para certificación ISO/IEC 17025',
    objetivos: 'Mantener certificación de acreditación',
    estado: 'Planificada',
    hallazgos: []
  },
  {
    id: 'AUD-PROV-001',
    tipo: 'Externa - Proveedor',
    fecha_inicio: '2025-07-20',
    fecha_fin: '2025-07-20',
    auditor_lider: 'Maximiliano Miranda',
    auditores: [],
    alcance: 'Auditoría al sistema de calidad del proveedor Sigma-Aldrich',
    objetivos: 'Evaluar capacidad del proveedor',
    estado: 'Finalizada',
    hallazgos: [
      { id: 'HAL-001', descripcion: 'Documentación de trazabilidad incompleta', severidad: 'Menor', accion_correctiva: 'Solicitar documentación adicional' }
    ]
  }
];

// Demo data para formacion
const demoFormacion = [
  {
    id: 'FORM-001',
    empleadoId: 'jdiaz',
    empleadoNombre: 'Jesus Diaz',
    tipo: 'Certificación',
    nombre_actividad: 'Auditor Interno ISO/IEC 17025:2017',
    fecha: '2023-11-15',
    evaluador: 'AENOR',
    resultado: 'Aprobado',
    observaciones: 'Certificación válida por 3 años',
    fecha_vencimiento: '2026-11-15'
  },
  {
    id: 'FORM-002',
    empleadoId: 'afigueroa',
    empleadoNombre: 'Antonia Figueroa',
    tipo: 'Curso',
    nombre_actividad: 'Cromatografía de Gases Avanzada',
    fecha: '2024-03-20',
    evaluador: 'Waters Corp.',
    resultado: 'Completado',
    observaciones: 'Curso de especialización técnica',
    fecha_vencimiento: null
  },
  {
    id: 'FORM-003',
    empleadoId: 'mmiranda',
    empleadoNombre: 'Maximiliano Miranda',
    tipo: 'Evaluación de Competencia',
    nombre_actividad: 'Análisis de Melt Index (ASTM D1238)',
    fecha: '2024-06-10',
    evaluador: 'Victor Lutz',
    resultado: 'Aprobado',
    observaciones: 'Competencia demostrada en ensayo crítico',
    fecha_vencimiento: '2027-06-10'
  }
];

// Demo data para condicionesAmbientales
const demoCondicionesAmbientales = [
  {
    id: 'CA-001',
    timestamp: '2025-07-23T10:00:00Z',
    zona: 'Laboratorio Principal',
    temperatura: 22.5,
    humedad: 45,
    presion: 1012,
    usuario: 'Maximiliano Miranda'
  },
  {
    id: 'CA-002',
    timestamp: '2025-07-23T09:00:00Z',
    zona: 'Sala de Muestras',
    temperatura: 21.8,
    humedad: 48,
    presion: 1011,
    usuario: 'Antonia Figueroa'
  },
  {
    id: 'CA-003',
    timestamp: '2025-07-23T08:00:00Z',
    zona: 'Área de Ensayos Mecánicos',
    temperatura: 23.2,
    humedad: 42,
    presion: 1013,
    usuario: 'Robinson Córdova'
  }
];

// Demo data para capacitaciones
const demoCapacitaciones = [
  {
    id: 'CAP-001',
    nombre: 'Capacitación Procedimiento de Ensayo Melt Index',
    fecha: '2025-06-15',
    instructor: 'Victor Lutz',
    temario: 'Norma ASTM D1238, preparación de muestras, operación del equipo MFI, cálculo de resultados y registro en LIMS.',
    estado: 'Realizada',
    asistentes: [
      { empleadoId: 'jdiaz', asistio: true },
      { empleadoId: 'afigueroa', asistio: true }
    ],
    evaluacion: {
      id: 'EVAL-001',
      preguntas: [
        { pregunta: 'Describa brevemente cómo se prepara una muestra para el ensayo.' },
        { pregunta: '¿Qué valores se deben registrar en el sistema LIMS para el ensayo de Melt Index?' }
      ],
      resultados: [
        { empleadoId: 'afigueroa', resultado: 'Aprobado', respuestas: ['Se corta el material en trozos pequeños y se seca en la estufa según procedimiento.', 'Los pesos de cada masa extruida'], fecha_completado: '2025-06-16T10:00:00Z' }
      ]
    }
  },
  {
    id: 'CAP-002',
    nombre: 'Auditoría Interna ISO/IEC 17025:2017',
    fecha: '2025-08-20',
    instructor: 'AENOR Chile',
    temario: 'Cláusulas de la norma, técnicas de auditoría, redacción de hallazgos.',
    estado: 'Planificada',
    asistentes: [
      { empleadoId: 'vlutz', asistio: false },
      { empleadoId: 'mmiranda', asistio: false }
    ],
    evaluacion: {
      id: 'EVAL-002',
      preguntas: [],
      resultados: []
    }
  },
  {
    id: 'CAP-003',
    nombre: 'Capacitación Ensayos de Presión Hidrostática',
    fecha: '2025-07-20',
    instructor: 'Antonia Figueroa',
    temario: 'Procedimientos de ensayos de presión hidrostática según norma ISO 1167',
    estado: 'Realizada',
    asistentes: [
      { empleadoId: 'rcordova', asistio: true },
      { empleadoId: 'mmiranda', asistio: true }
    ],
    evaluacion: {
      id: 'EVAL-003',
      preguntas: [
        { pregunta: '¿Cuál es la presión de ensayo para tuberías PN-16?' },
        { pregunta: '¿Cuánto tiempo debe durar el ensayo de presión hidrostática?' }
      ],
      resultados: [
        { empleadoId: 'rcordova', resultado: 'Aprobado', respuestas: ['24 bar', '100 horas'], fecha_completado: '2025-07-21T14:00:00Z' },
        { empleadoId: 'mmiranda', resultado: 'Aprobado', respuestas: ['24 bar', '100 horas'], fecha_completado: '2025-07-21T15:30:00Z' }
      ]
    }
  }
];

// Demo data para ensayosPHI
const demoEnsayosPHI = [
  {
    id: 'PHI-001',
    fechaIngresoManual: '20-07-2025',
    fechaInicio: '2025-07-20T10:30:00Z',
    producto: '90mm x 12m SMARTCOLORS PN-16 SDR-11',
    raya: 'Azul',
    horas: 100,
    estado: 'EN PROCESO',
    resultado: 'Pendiente'
  },
  {
    id: 'PHI-002',
    fechaIngresoManual: '21-07-2025',
    fechaInicio: '2025-07-21T14:00:00Z',
    producto: '75mm x 6m SMART PIPE/PP-RCT PN-16 S-3,2',
    raya: 'Azul',
    horas: 100,
    estado: 'FINALIZADO',
    resultado: 'APROBADO',
    fechaTerminacion: '2025-07-25T18:00:00Z',
    presionFinal: '16 bar',
    observaciones: 'Ensayo completado exitosamente sin fallas'
  },
  {
    id: 'PHI-003',
    fechaIngresoManual: '22-07-2025',
    fechaInicio: '2025-07-22T09:00:00Z',
    producto: '110mm x 6m SMART PIPE/PP-RCT PN-20 S-4',
    raya: 'Verde',
    horas: 100,
    estado: 'FINALIZADO',
    resultado: 'RECHAZADO',
    fechaTerminacion: '2025-07-26T12:00:00Z',
    presionFinal: '18 bar',
    observaciones: 'Falla en la unión a las 18 horas de ensayo'
  }
];
/**
 * Data service for PoliLims
 *
 * This service provides methods to interact with the backend
 * for all data operations in the application.
 *
 * It uses Firebase as the backend, but could be replaced with
 * any other backend implementation.
 */

// Firebase desactivado - usando localStorage para máxima velocidad
// import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore';
// import { getFirestoreDb } from '@/lib/firebase';

// Servicio de cache ultra-rápido para presentación - SIN localStorage para evitar errores SSR
class LocalCacheService {
  private cache = new Map<string, any>();
  private storagePrefix = 'polilims_';

  // Obtener datos del cache (solo memoria para máxima velocidad)
  get<T>(key: string): T | null {
    // Solo buscar en memoria (más rápido y sin errores SSR)
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    return null;
  }

  // Guardar datos en cache (solo memoria para máxima velocidad)
  set<T>(key: string, data: T): void {
    // Solo guardar en memoria (acceso instantáneo)
    this.cache.set(key, data);
  }

  // Eliminar del cache
  delete(key: string): void {
    this.cache.delete(key);
  }

  // Limpiar todo el cache
  clear(): void {
    this.cache.clear();
  }
}

const cacheService = new LocalCacheService();

// Import types from data-context
import type { 
  Ensayo,
  Registro,
  Equipo,
  NoConformidad,
  Proveedor,
  Auditoria,
  Formacion,
  CondicionAmbiental,
  EnsayoPHI,
  Capacitacion,
  RecentActivity,
  ControlEvento,
  Importacion,
  CalculoIncertidumbre
} from '@/context/data-context';



// Funciones ultra-rápidas para Importaciones (usando cache local)
export async function addImportacion(importacion: Importacion) {
  const importaciones = cacheService.get<Importacion[]>('importaciones') || [];
  const newId = `IMP-${Date.now()}`;
  const newImportacion = { ...importacion, id: newId };
  
  importaciones.push(newImportacion);
  cacheService.set('importaciones', importaciones);
  
  return newId;
}

export async function updateImportacion(id: string, importacion: Partial<Importacion>) {
  const importaciones = cacheService.get<Importacion[]>('importaciones') || [];
  const index = importaciones.findIndex(item => item.id === id);
  
  if (index !== -1) {
    importaciones[index] = { ...importaciones[index], ...importacion };
    cacheService.set('importaciones', importaciones);
  }
}

export async function deleteImportacion(id: string) {
  const importaciones = cacheService.get<Importacion[]>('importaciones') || [];
  const filtered = importaciones.filter(item => item.id !== id);
  cacheService.set('importaciones', filtered);
}

// Funciones ultra-rápidas para Ensayos (usando cache local)
export async function addEnsayo(ensayo: Ensayo) {
  const ensayos = cacheService.get<Ensayo[]>('ensayos') || [];
  const newId = `ENS-${Date.now()}`;
  const newEnsayo = { ...ensayo, id: newId };
  
  ensayos.push(newEnsayo);
  cacheService.set('ensayos', ensayos);
  
  return newId;
}

export async function updateEnsayo(id: string, ensayo: Partial<Ensayo>) {
  const ensayos = cacheService.get<Ensayo[]>('ensayos') || [];
  const index = ensayos.findIndex(item => item.id === id);
  
  if (index !== -1) {
    ensayos[index] = { ...ensayos[index], ...ensayo };
    cacheService.set('ensayos', ensayos);
  }
}

export async function deleteEnsayo(id: string) {
  const ensayos = cacheService.get<Ensayo[]>('ensayos') || [];
  const filtered = ensayos.filter(item => item.id !== id);
  cacheService.set('ensayos', filtered);
}

// Funciones ultra-rápidas para Registros (usando cache local)
export async function addRegistro(registro: Registro) {
  const registros = cacheService.get<Registro[]>('registros') || [];
  const newId = `REG-${Date.now()}`;
  
  // Limpiar valores undefined y propiedades que no existen en el tipo Registro
  const { observaciones_visuales, ...cleanRegistro } = Object.fromEntries(
    Object.entries(registro).filter(([_, value]) => value !== undefined)
  ) as any;
  
  const newRegistro = { ...cleanRegistro, id: newId };
  registros.push(newRegistro);
  cacheService.set('registros', registros);
  
  return newId;
}

export async function deleteRegistro(id: string) {
  const registros = cacheService.get<Registro[]>('registros') || [];
  const filtered = registros.filter(item => item.id !== id);
  cacheService.set('registros', filtered);
}

// Funciones ultra-rápidas para Equipos (usando cache local)
export async function addEquipo(equipo: Equipo) {
  const equipos = cacheService.get<Equipo[]>('equipos') || [];
  const newId = `EQ-${Date.now()}`;
  const newEquipo = { ...equipo, id: newId };
  
  equipos.push(newEquipo);
  cacheService.set('equipos', equipos);
  
  return newId;
}

export async function updateEquipo(id: string, equipo: Partial<Equipo>) {
  const equipos = cacheService.get<Equipo[]>('equipos') || [];
  const index = equipos.findIndex(item => item.id === id);
  
  if (index !== -1) {
    equipos[index] = { ...equipos[index], ...equipo };
    cacheService.set('equipos', equipos);
  }
}

export async function deleteEquipo(id: string) {
  const equipos = cacheService.get<Equipo[]>('equipos') || [];
  const filtered = equipos.filter(item => item.id !== id);
  cacheService.set('equipos', filtered);
}

// Funciones ultra-rápidas para Control de Eventos (usando cache local)
export async function addControlEvento(evento: any) {
  const controles = cacheService.get<any[]>('controles') || [];
  const newId = `CE-${Date.now()}`;
  const newEvento = { ...evento, id: newId };
  
  controles.push(newEvento);
  cacheService.set('controles', controles);
  
  return newId;
}

// Funciones ultra-rápidas para Incidencias (usando cache local)
export async function addIncidencia(incidencia: NoConformidad) {
  const incidencias = cacheService.get<NoConformidad[]>('incidencias') || [];
  const newId = `INC-${Date.now()}`;
  const newIncidencia = { ...incidencia, id: newId };
  
  incidencias.push(newIncidencia);
  cacheService.set('incidencias', incidencias);
  
  return newId;
}

export async function updateIncidencia(id: string, incidencia: Partial<NoConformidad>) {
  const incidencias = cacheService.get<NoConformidad[]>('incidencias') || [];
  const index = incidencias.findIndex(item => item.id === id);
  
  if (index !== -1) {
    incidencias[index] = { ...incidencias[index], ...incidencia };
    cacheService.set('incidencias', incidencias);
  }
}

export async function deleteIncidencia(id: string) {
  const incidencias = cacheService.get<NoConformidad[]>('incidencias') || [];
  const filtered = incidencias.filter(item => item.id !== id);
  cacheService.set('incidencias', filtered);
}

// TODAS LAS FUNCIONES ULTRA-RÁPIDAS USANDO CACHE LOCAL - SIN FIREBASE

// Funciones para Proveedores
export async function addProveedor(proveedor: Proveedor) {
  const proveedores = cacheService.get<Proveedor[]>('proveedores') || [];
  const newId = `PROV-${Date.now()}`;
  const newProveedor = { ...proveedor, id: newId };
  proveedores.push(newProveedor);
  cacheService.set('proveedores', proveedores);
  return newId;
}

export async function updateProveedor(id: string, proveedor: Partial<Proveedor>) {
  const proveedores = cacheService.get<Proveedor[]>('proveedores') || [];
  const index = proveedores.findIndex(item => item.id === id);
  if (index !== -1) {
    proveedores[index] = { ...proveedores[index], ...proveedor };
    cacheService.set('proveedores', proveedores);
  }
}

export async function deleteProveedor(id: string) {
  const proveedores = cacheService.get<Proveedor[]>('proveedores') || [];
  const filtered = proveedores.filter(item => item.id !== id);
  cacheService.set('proveedores', filtered);
}

// Funciones para Auditorías
export async function addAuditoria(auditoria: Auditoria) {
  const auditorias = cacheService.get<Auditoria[]>('auditorias') || [];
  const newId = `AUD-${Date.now()}`;
  const newAuditoria = { ...auditoria, id: newId };
  auditorias.push(newAuditoria);
  cacheService.set('auditorias', auditorias);
  return newId;
}

export async function updateAuditoria(id: string, auditoria: Partial<Auditoria>) {
  const auditorias = cacheService.get<Auditoria[]>('auditorias') || [];
  const index = auditorias.findIndex(item => item.id === id);
  if (index !== -1) {
    auditorias[index] = { ...auditorias[index], ...auditoria };
    cacheService.set('auditorias', auditorias);
  }
}

export async function deleteAuditoria(id: string) {
  const auditorias = cacheService.get<Auditoria[]>('auditorias') || [];
  const filtered = auditorias.filter(item => item.id !== id);
  cacheService.set('auditorias', filtered);
}

// Funciones para Formación
export async function addFormacion(formacion: Formacion) {
  const formaciones = cacheService.get<Formacion[]>('formacion') || [];
  const newId = `FORM-${Date.now()}`;
  const newFormacion = { ...formacion, id: newId };
  formaciones.push(newFormacion);
  cacheService.set('formacion', formaciones);
  return newId;
}

export async function updateFormacion(id: string, formacion: Partial<Formacion>) {
  const formaciones = cacheService.get<Formacion[]>('formacion') || [];
  const index = formaciones.findIndex(item => item.id === id);
  if (index !== -1) {
    formaciones[index] = { ...formaciones[index], ...formacion };
    cacheService.set('formacion', formaciones);
  }
}

export async function deleteFormacion(id: string) {
  const formaciones = cacheService.get<Formacion[]>('formacion') || [];
  const filtered = formaciones.filter(item => item.id !== id);
  cacheService.set('formacion', filtered);
}

// Funciones para Condiciones Ambientales
export async function addCondicionAmbiental(condicion: CondicionAmbiental) {
  const condiciones = cacheService.get<CondicionAmbiental[]>('condicionesAmbientales') || [];
  const newId = `CA-${Date.now()}`;
  const newCondicion = { ...condicion, id: newId };
  condiciones.push(newCondicion);
  cacheService.set('condicionesAmbientales', condiciones);
  return newId;
}

// Funciones para Ensayos PHI
export async function addEnsayoPHI(ensayo: EnsayoPHI) {
  const ensayos = cacheService.get<EnsayoPHI[]>('ensayosPHI') || [];
  const newId = `PHI-${Date.now()}`;
  const newEnsayo = { ...ensayo, id: newId };
  ensayos.push(newEnsayo);
  cacheService.set('ensayosPHI', ensayos);
  return newId;
}

export async function updateEnsayoPHI(id: string, ensayo: Partial<EnsayoPHI>) {
  const ensayos = cacheService.get<EnsayoPHI[]>('ensayosPHI') || [];
  const index = ensayos.findIndex(item => item.id === id);
  if (index !== -1) {
    ensayos[index] = { ...ensayos[index], ...ensayo };
    cacheService.set('ensayosPHI', ensayos);
  }
}

// Funciones para Capacitaciones
export async function addCapacitacion(capacitacion: Capacitacion) {
  const capacitaciones = cacheService.get<Capacitacion[]>('capacitaciones') || [];
  const newId = `CAP-${Date.now()}`;
  const newCapacitacion = { ...capacitacion, id: newId };
  capacitaciones.push(newCapacitacion);
  cacheService.set('capacitaciones', capacitaciones);
  return newId;
}

export async function updateCapacitacion(id: string, capacitacion: Partial<Capacitacion>) {
  const capacitaciones = cacheService.get<Capacitacion[]>('capacitaciones') || [];
  const index = capacitaciones.findIndex(item => item.id === id);
  if (index !== -1) {
    capacitaciones[index] = { ...capacitaciones[index], ...capacitacion };
    cacheService.set('capacitaciones', capacitaciones);
  }
}

export async function deleteCapacitacion(id: string) {
  const capacitaciones = cacheService.get<Capacitacion[]>('capacitaciones') || [];
  const filtered = capacitaciones.filter(item => item.id !== id);
  cacheService.set('capacitaciones', filtered);
}

// Función ultra-rápida para actividades recientes (usando cache local)
export async function addRecentActivity(activity: RecentActivity) {
  const activities = cacheService.get<RecentActivity[]>('recentActivity') || [];
  const newId = `ACT-${Date.now()}`;
  const newActivity = { ...activity, id: newId, timestamp: new Date().toISOString() };
  
  // Mantener solo las últimas 100 actividades
  activities.unshift(newActivity);
  if (activities.length > 100) {
    activities.splice(100);
  }
  
  cacheService.set('recentActivity', activities);
  
  return newId;
}

// Función ultra-rápida para obtener datos iniciales (solo demo data para presentación)
export async function getInitialData() {
  console.log('🚀 Cargando datos demo expandidos para prototipo 100% funcional...');

  // Cargar matriz de productos
  let matrizProductos: any[] = [];
  try {
    const mod = await import('@/lib/matriz-datos');
    if (mod.matrizProductos) {
      matrizProductos = mod.matrizProductos;
    } else if (mod.getMatrizProductos) {
      matrizProductos = await mod.getMatrizProductos();
    }
  } catch {
    matrizProductos = [];
  }

  // Cargar datos expandidos
  let expandedData: any = {};
  try {
    const expandedMod = await import('./expanded-demo-data');
    expandedData = expandedMod.getExpandedDemoData();
  } catch {
    expandedData = {};
  }

  console.log('✅ Datos demo expandidos cargados instantáneamente');

  return {
    usuarios: expandedData.usuarios || demoUsuarios,
    generatedReports: demoGeneratedReports,
    ensayos: expandedData.ensayos || demoEnsayos,
    registros: expandedData.registros || demoRegistros,
    equipos: demoEquipos,
    incidencias: demoNoConformidades,
    proveedores: expandedData.proveedores || demoProveedores,
    auditorias: demoAuditorias,
    formacion: demoFormacion,
    condicionesAmbientales: demoCondicionesAmbientales,
    recentActivity: expandedData.recentActivity || recentActivityData,
    controles: demoControles,
    noConformidades: demoNoConformidades,
    capacitaciones: demoCapacitaciones,
    ensayosPHI: demoEnsayosPHI,
    calculosIncertidumbre: [],
    importaciones: demoImportaciones,
    matrizProductos,
  };
}

import { getMatrizProductos } from "@/lib/matriz-datos";
import * as firebaseService from './firebase-service';
import { startMeasure, endMeasure } from '@/lib/performance-monitor';

// --- DEMO DATA FOR NOTIFICATIONS ---
export interface AlertaConfig {
    id: string;
    nombre: string;
    descripcion: string;
    email: { activa: boolean };
    sms: { activa: boolean };
    roles: string[];
}

export interface Notificacion {
    id: string;
    fecha: string; // ISO String
    canal: 'Email' | 'SMS';
    destinatario: string;
    asunto: string;
    estado: 'Enviado' | 'Fallido' | 'Pendiente';
}

export interface PlantillaNotificacion {
    id: string;
    nombre: string;
    descripcion: string;
    asunto: string;
    cuerpo: string;
}

// Helper function to subtract days from a date (replacing date-fns subDays)
function subDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
}

// Helper function to check if a date is in the past (replacing date-fns isPast)
function isPast(date: Date): boolean {
    return date < new Date();
}

// Helper function to parse a date string (replacing date-fns parse)
function parse(dateStr: string, format: string, baseDate: Date): Date {
    // Simple implementation for dd-MM-yyyy format
    if (format === 'dd-MM-yyyy') {
        const [day, month, year] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    }
    return new Date(dateStr);
}

export const mockAlertConfigs: AlertaConfig[] = [
    { id: 'alerta-calibracion', nombre: 'Alerta de Calibración Próxima', descripcion: 'Notificar 30 días antes de que la calibración de un equipo expire.', email: { activa: true }, sms: { activa: false }, roles: ['Jefe de Calidad', 'Ing. Analista de Calidad'] },
    { id: 'alerta-nc-vencida', nombre: 'No Conformidad Vencida', descripcion: 'Notificar cuando una No Conformidad ha pasado su fecha de vencimiento.', email: { activa: true }, sms: { activa: true }, roles: ['Jefe de Calidad'] },
    { id: 'alerta-ensayo-pendiente', nombre: 'Ensayo Pendiente de Revisión', descripcion: 'Notificar cuando un ensayo ha sido completado y requiere aprobación.', email: { activa: true }, sms: { activa: false }, roles: ['Jefe de Calidad', 'Ing. Analista de Calidad'] },
];

export const mockNotificationHistory: Notificacion[] = [
    { id: 'notif-1', fecha: subDays(new Date(), 1).toISOString(), canal: 'Email', destinatario: 'vlutz@polifusion.cl', asunto: 'Alerta de Calibración: Prensa de Impacto (EQ-02)', estado: 'Enviado' },
    { id: 'notif-2', fecha: subDays(new Date(), 2).toISOString(), canal: 'SMS', destinatario: '+56912345678', asunto: 'NC Vencida: NC-001', estado: 'Enviado' },
    { id: 'notif-3', fecha: subDays(new Date(), 3).toISOString(), canal: 'Email', destinatario: 'jdiaz@polifusion.cl', asunto: 'Ensayo Pendiente: LAB-06-04', estado: 'Fallido' },
];

export const mockAlertTemplates: PlantillaNotificacion[] = [
    { id: 'plantilla-calibracion', nombre: 'Aviso de Calibración Próxima', descripcion: 'Email que se envía cuando la calibración de un equipo está por vencer.', asunto: 'Alerta de Calibración: {{equipo.nombre}}', cuerpo: 'Estimado/a,\n\nLe informamos que el equipo {{equipo.nombre}} (ID: {{equipo.id}}) requiere calibración.\n\nFecha de vencimiento: {{equipo.proxima_calibracion}} (en {{dias_restantes}} días).\n\nPor favor, coordine las acciones necesarias.\n\nSaludos,\nSistema PoliLIMS' },
    { id: 'plantilla-nc', nombre: 'Aviso de No Conformidad Vencida', descripcion: 'Email que se envía cuando una NC ha sobrepasado su fecha de cierre.', asunto: 'Alerta de NC Vencida: {{nc.id}}', cuerpo: 'Estimado/a {{usuario.nombre}},\n\nLe informamos que la No Conformidad {{nc.id}} ("{{nc.descripcion}}") ha superado su fecha de vencimiento programada para el {{nc.fecha_vencimiento}}.\n\nPor favor, tome las acciones correctivas necesarias a la brevedad.\n\nSaludos,\nSistema PoliLIMS' },
];

// --- DEMO DATA ---
const demoRegistros: Registro[] = [
    { id: 'CTRL-001', tipo: 'Control Rutinario', fecha: '20-07-2025', hora: '10:30', responsable: 'Elias Ibañez', estado: 'Completado', inspector: 'Elias Ibañez', maquinista: 'ANDRÉS REYES', maquina: 'PE1', producto: 'Tubería HDPE 90mm PN-16 SDR-11', marca: 'POLIFUSIÓN S.A.', diametro: 90.1, espesor_min: 8.2, espesor_max: 8.3, largo: 1000, peso_muestra: 2200, peso_kg_m: 2.2, ovalidad: 0.5, observaciones_visuales: 'Sin observaciones', color_tuberia: 'Negro', color_linea: 'Azul', resultado: 'Conforme', enviado_lab: true },
    { id: 'CTRL-002', tipo: 'Control Rutinario', fecha: '20-07-2025', hora: '11:15', responsable: 'Cristian Montellano', estado: 'Completado', inspector: 'Cristian Montellano', maquinista: 'ALEXIS SANDOVAL', maquina: 'PE2', producto: 'Tubería HDPE 110mm PN-10 SDR-17', marca: 'POLIFUSIÓN S.A.', diametro: 110.2, espesor_min: 6.5, espesor_max: 6.6, largo: 1000, peso_muestra: 2100, peso_kg_m: 2.1, ovalidad: 0.6, observaciones_visuales: '', color_tuberia: 'Negro', color_linea: 'Azul', resultado: 'Conforme', enviado_lab: true },
    { id: 'CTRL-003', tipo: 'Control Rutinario', fecha: '19-07-2025', hora: '14:00', responsable: 'Daniel Palma', estado: 'Completado', inspector: 'Daniel Palma', maquinista: 'CARLOS DOMÍNGUEZ', maquina: 'PP3', producto: 'Tubería PP-R 25mm PN-20', marca: 'SMART PIPES SpA', diametro: 25.3, espesor_min: 4.2, espesor_max: 4.3, largo: 1000, peso_muestra: 300, peso_kg_m: 0.3, ovalidad: 0.2, observaciones_visuales: 'Superficie ligeramente rugosa', color_tuberia: 'Verde', color_linea: 'Roja', resultado: 'No Conforme', enviado_lab: false },
    { id: 'CTRL-004', tipo: 'Control Rutinario', fecha: '19-07-2025', hora: '09:05', responsable: 'Luis Parada', estado: 'Completado', inspector: 'Luis Parada', maquinista: 'CRISTIAN DUQUE', maquina: 'PE3', producto: 'Tubería HDPE 63mm PN-16 SDR-11', marca: 'POLIFUSIÓN S.A.', diametro: 63.1, espesor_min: 5.8, espesor_max: 5.9, largo: 1000, peso_muestra: 1100, peso_kg_m: 1.1, ovalidad: 0.4, observaciones_visuales: '', color_tuberia: 'Negro', color_linea: 'Azul', resultado: 'Conforme', enviado_lab: true },
];

let demoEnsayos: Ensayo[] = [
    // --- Julio 2025 Data (Más reciente) ---
    { id: 'LAB-07-01', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '23-07-2025', estado: 'Pendiente de Revisión', producto: 'Tubería HDPE 90mm PN-16 SDR-11', cliente: 'Constructora San Pedro Ltda.', resultado: 'Pendiente', observaciones: 'Ensayo en proceso de revisión final', tipo_ensayo: 'Caracterización Completa', fecha_ingreso: '22-07-2025' },
    { id: 'LAB-07-02', tipo: 'Tubería PP', analista: 'Antonia Figueroa', fecha: '23-07-2025', estado: 'En Análisis', producto: 'Tubería PP-R 50mm PN-20 con fibra de vidrio', cliente: 'Hidrotec S.A.', resultado: 'En proceso', observaciones: 'Análisis de fibra de vidrio en curso', tipo_ensayo: 'Contenido de Fibra de Vidrio', fecha_ingreso: '22-07-2025' },
    { id: 'LAB-07-03', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '23-07-2025', estado: 'Aprobado', producto: 'HE3490LS Borealis', cliente: 'BOREALIS CO.', resultado: 'Aprobado', observaciones: 'Material cumple especificaciones según ficha técnica', tipo_ensayo: 'Melt Index y Densidad', fecha_ingreso: '20-07-2025' },
    { id: 'LAB-07-04', tipo: 'Reprocesado', analista: 'Robinson Córdova', fecha: '22-07-2025', estado: 'En Progreso', producto: 'Reprocesado Lote RP-0720-PE1', cliente: 'Control Interno', resultado: 'En proceso', observaciones: 'Análisis de contaminación y viabilidad', tipo_ensayo: 'Caracterización para Reproceso', fecha_ingreso: '21-07-2025' },
    { id: 'LAB-07-05', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '24-07-2025', estado: 'Aprobado', producto: 'Tubería HDPE 110mm PN-10 SDR-17', cliente: 'Obras Sanitarias del Norte', resultado: 'Aprobado', observaciones: 'Cumple especificaciones NCh 399 y ASTM F714', tipo_ensayo: 'Presión Hidrostática', fecha_ingreso: '23-07-2025' },
    { id: 'LAB-07-06', tipo: 'Tubería PP', analista: 'Maximiliano Miranda', fecha: '24-07-2025', estado: 'Aprobado', producto: 'Tubería PP-R 32mm PN-20', cliente: 'Instalaciones Técnicas SpA', resultado: 'Aprobado', observaciones: 'Ensayo de presión hidrostática exitoso - 1000 horas', tipo_ensayo: 'Presión Hidrostática', fecha_ingreso: '20-07-2025' },
    { id: 'LAB-07-07', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '25-07-2025', estado: 'Rechazado', producto: 'PPR-Y40 Genérico', cliente: 'Proveedor Secundario', resultado: 'Rechazado', observaciones: 'Melt Index fuera de especificación (12.5 vs 10±2)', tipo_ensayo: 'Melt Index', fecha_ingreso: '24-07-2025' },
    { id: 'LAB-07-08', tipo: 'Tubería HDPE', analista: 'Robinson Córdova', fecha: '25-07-2025', estado: 'Aprobado', producto: 'Tubería HDPE 63mm PN-16 SDR-11', cliente: 'Ductos y Accesorios Ltda.', resultado: 'Aprobado', observaciones: 'Cumple todos los parámetros NCh 399', tipo_ensayo: 'Caracterización Completa', fecha_ingreso: '24-07-2025' },
    { id: 'LAB-07-09', tipo: 'Tubería HDPE', analista: 'Maximiliano Miranda', fecha: '26-07-2025', estado: 'Aprobado', producto: 'Tubería HDPE 160mm PN-10 SDR-17', cliente: 'Aguas del Valle S.A.', resultado: 'Aprobado', observaciones: 'Ensayo de tracción y elongación aprobado', tipo_ensayo: 'Propiedades Mecánicas', fecha_ingreso: '25-07-2025' },
    { id: 'LAB-07-10', tipo: 'Conexiones', analista: 'Robinson Córdova', fecha: '26-07-2025', estado: 'En Análisis', producto: 'Fitting PP-R 25mm Codo 90°', cliente: 'Conexiones del Sur', resultado: 'En proceso', observaciones: 'Ensayo de resistencia en curso', tipo_ensayo: 'Resistencia Mecánica', fecha_ingreso: '25-07-2025' },
    { id: 'LAB-07-11', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '27-07-2025', estado: 'Aprobado', producto: 'Masterbatch Negro MB-001', cliente: 'Clariant Chile', resultado: 'Aprobado', observaciones: 'Dispersión y concentración dentro de especificación', tipo_ensayo: 'Caracterización de Aditivos', fecha_ingreso: '26-07-2025' },
    { id: 'LAB-07-12', tipo: 'Tubería PP', analista: 'Jesus Diaz', fecha: '27-07-2025', estado: 'Pendiente de Revisión', producto: 'Tubería PP-R 75mm PN-16', cliente: 'Termofusión Chile', resultado: 'Pendiente', observaciones: 'Esperando segunda opinión en resistencia al impacto', tipo_ensayo: 'Resistencia al Impacto', fecha_ingreso: '26-07-2025' },
    
    // --- Junio 2025 Data ---
    { id: 'LAB-06-01', tipo: 'Tubería HDPE', analista: 'Antonia Figueroa', fecha: '18-06-2025', estado: 'Aprobado', producto: 'Tubería HDPE 90mm PN-16 SDR-11', cliente: 'Cliente F', resultado: 'Aprobado', observaciones: 'Ensayo de tracción satisfactorio' },
    { id: 'LAB-06-02', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '19-06-2025', estado: 'Aprobado', producto: 'Tubería HDPE 90mm PN-16 SDR-11', cliente: 'Cliente G', resultado: 'Aprobado', observaciones: 'Densidad dentro de especificaciones' },
    { id: 'LAB-06-03', tipo: 'Materia Prima', analista: 'Robinson Córdova', fecha: '12-06-2025', estado: 'Rechazado', producto: 'PPR-Y40', cliente: 'GENERICO', resultado: 'Rechazado', observaciones: 'Variación de Melt Index excesiva' },
    { id: 'LAB-06-04', tipo: 'Tubería PP', analista: 'Antonia Figueroa', fecha: '25-06-2025', estado: 'Aprobado', producto: 'Tubería PP-R 50mm PN-20', cliente: 'Cliente H', resultado: 'Aprobado', observaciones: 'Contenido de fibra de vidrio correcto' },
    { id: 'LAB-06-05', tipo: 'Tubería HDPE', analista: 'Maximiliano Miranda', fecha: '26-06-2025', estado: 'Aprobado', producto: 'Tubería HDPE 75mm PN-16 SDR-11', cliente: 'Cliente I', resultado: 'Aprobado', observaciones: 'Ensayo de impacto satisfactorio' },
    { id: 'LAB-06-06', tipo: 'Reprocesado', analista: 'Jesus Diaz', fecha: '27-06-2025', estado: 'Aprobado', producto: 'Reprocesado Lote RP-0620', cliente: 'Interno', resultado: 'Aprobado', observaciones: 'Material apto para reprocesamiento' },

    // --- Mayo 2025 Data ---
    { id: 'LAB-05-01', tipo: 'Tubería PP', analista: 'Jesus Diaz', fecha: '25-05-2025', estado: 'Aprobado', producto: 'Tubería PP-R 25mm PN-20', cliente: 'Cliente J', resultado: 'Aprobado', observaciones: 'Ensayo de presión exitoso' },
    { id: 'LAB-05-02', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '15-05-2025', estado: 'Aprobado', producto: 'HE3490LS', cliente: 'BOREALIS CO.', resultado: 'Aprobado', observaciones: 'Calidad superior confirmada' },
    { id: 'LAB-05-03', tipo: 'Tubería HDPE', analista: 'Robinson Córdova', fecha: '20-05-2025', estado: 'Aprobado', producto: 'Tubería HDPE 50mm PN-16 SDR-11', cliente: 'Cliente K', resultado: 'Aprobado', observaciones: 'Cumple especificaciones técnicas' },
    { id: 'LAB-05-04', tipo: 'Tubería PP', analista: 'Maximiliano Miranda', fecha: '22-05-2025', estado: 'Aprobado', producto: 'Tubería PP-R 40mm PN-20', cliente: 'Cliente L', resultado: 'Aprobado', observaciones: 'Ensayo de resistencia satisfactorio' },
    
    // --- Abril 2025 Data ---
    { id: 'LAB-04-01', tipo: 'Tubería HDPE', analista: 'Robinson Córdova', fecha: '28-04-2025', estado: 'Aprobado', producto: 'Tubería HDPE 63mm PN-16 SDR-11', cliente: 'Cliente M', resultado: 'Aprobado', observaciones: 'Densidad y tracción correctas' },
    { id: 'LAB-04-02', tipo: 'Reprocesado', analista: 'Jesus Diaz', fecha: '20-04-2025', estado: 'Pendiente de Revisión', producto: 'Reprocesado Lote RP-0420', cliente: 'Interno', resultado: 'Pendiente', observaciones: 'Requiere análisis adicional' },
    { id: 'LAB-04-03', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '15-04-2025', estado: 'Aprobado', producto: 'PPR-Y40', cliente: 'SABIC', resultado: 'Aprobado', observaciones: 'Cumple especificaciones técnicas' },
    { id: 'LAB-04-04', tipo: 'Tubería HDPE', analista: 'Maximiliano Miranda', fecha: '10-04-2025', estado: 'Aprobado', producto: 'Tubería HDPE 110mm PN-10 SDR-17', cliente: 'Cliente N', resultado: 'Aprobado', observaciones: 'Ensayo de presión hidrostática exitoso' },
    
    // --- Marzo 2025 Data ---
    { id: 'LAB-03-01', tipo: 'Tubería PP', analista: 'Jesus Diaz', fecha: '28-03-2025', estado: 'Aprobado', producto: 'Tubería PP-R 32mm PN-20', cliente: 'Cliente O', resultado: 'Aprobado', observaciones: 'Cumple especificaciones' },
    { id: 'LAB-03-02', tipo: 'Materia Prima', analista: 'Robinson Córdova', fecha: '25-03-2025', estado: 'Aprobado', producto: 'HE3490LS', cliente: 'BOREALIS CO.', resultado: 'Aprobado', observaciones: 'Calidad superior' },
    { id: 'LAB-03-03', tipo: 'Tubería HDPE', analista: 'Antonia Figueroa', fecha: '20-03-2025', estado: 'Aprobado', producto: 'Tubería HDPE 90mm PN-16 SDR-11', cliente: 'Cliente P', resultado: 'Aprobado', observaciones: 'Ensayo de tracción satisfactorio' },
    { id: 'LAB-03-04', tipo: 'Reprocesado', analista: 'Maximiliano Miranda', fecha: '15-03-2025', estado: 'Aprobado', producto: 'Reprocesado Lote RP-0320', cliente: 'Interno', resultado: 'Aprobado', observaciones: 'Material apto para uso' },
    
    // --- Febrero 2025 Data ---
    { id: 'LAB-02-01', tipo: 'Tubería PP', analista: 'Jesus Diaz', fecha: '28-02-2025', estado: 'Aprobado', producto: 'Tubería PP-R 50mm PN-20', cliente: 'Cliente Q', resultado: 'Aprobado', observaciones: 'Cumple especificaciones técnicas' },
    { id: 'LAB-02-02', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '25-02-2025', estado: 'Aprobado', producto: 'PPR-Y40', cliente: 'SABIC', resultado: 'Aprobado', observaciones: 'Calidad confirmada' },
    { id: 'LAB-02-03', tipo: 'Tubería HDPE', analista: 'Robinson Córdova', fecha: '20-02-2025', estado: 'Aprobado', producto: 'Tubería HDPE 75mm PN-16 SDR-11', cliente: 'Cliente R', resultado: 'Aprobado', observaciones: 'Ensayo de impacto exitoso' },
    { id: 'LAB-02-04', tipo: 'Tubería PP', analista: 'Maximiliano Miranda', fecha: '15-02-2025', estado: 'Aprobado', producto: 'Tubería PP-R 25mm PN-20', cliente: 'Cliente S', resultado: 'Aprobado', observaciones: 'Presión hidrostática correcta' },
    
    // --- Enero 2025 Data ---
    { id: 'LAB-01-01', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '30-01-2025', estado: 'Aprobado', producto: 'Tubería HDPE 110mm PN-10 SDR-17', cliente: 'Cliente T', resultado: 'Aprobado', observaciones: 'Cumple especificaciones' },
    { id: 'LAB-01-02', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '25-01-2025', estado: 'Aprobado', producto: 'HE3490LS', cliente: 'BOREALIS CO.', resultado: 'Aprobado', observaciones: 'Calidad superior confirmada' },
    { id: 'LAB-01-03', tipo: 'Tubería PP', analista: 'Robinson Córdova', fecha: '20-01-2025', estado: 'Aprobado', producto: 'Tubería PP-R 40mm PN-20', cliente: 'Cliente U', resultado: 'Aprobado', observaciones: 'Ensayo de resistencia satisfactorio' },
    { id: 'LAB-01-04', tipo: 'Reprocesado', analista: 'Maximiliano Miranda', fecha: '15-01-2025', estado: 'Aprobado', producto: 'Reprocesado Lote RP-0120', cliente: 'Interno', resultado: 'Aprobado', observaciones: 'Material apto para reprocesamiento' }
];


let recentActivityData: RecentActivity[] = [
    { id: 'ACT-1', user: 'Jesus Diaz', action: 'actualizó el ensayo LAB-07-01', timestamp: new Date(new Date('2025-07-23T11:00:00Z').getTime() - 5 * 60 * 1000).toISOString() },
    { id: 'ACT-2', user: 'Victor Lutz', action: 'aprobó el ensayo de materia prima LAB-07-03', timestamp: new Date(new Date('2025-07-23T16:00:00Z')).toISOString() },
    { id: 'ACT-3', user: 'Robinson Córdova', action: 'registró un nuevo ensayo para el lote RP-0720', timestamp: new Date(new Date('2025-07-22T08:00:00Z')).toISOString() },
    { id: 'ACT-4', user: 'Antonia Figueroa', action: 'comenzó a procesar el ensayo LAB-07-02', timestamp: new Date(new Date('2025-07-23T09:00:00Z')).toISOString() },
    { id: 'ACT-5', user: 'Maximiliano Miranda', action: 'registró un control para Tubería HDPE 110mm', timestamp: new Date(new Date('2025-07-20T11:15:00Z')).toISOString() },
    { id: 'ACT-6', user: 'Antonia Figueroa', action: 'completó el ensayo LAB-07-06', timestamp: new Date(new Date('2025-07-24T14:30:00Z')).toISOString() },
    { id: 'ACT-7', user: 'Robinson Córdova', action: 'inició ensayo de presión hidrostática PHI-001', timestamp: new Date(new Date('2025-07-20T10:30:00Z')).toISOString() },
    { id: 'ACT-8', user: 'Jesus Diaz', action: 'revisó resultados del ensayo LAB-07-05', timestamp: new Date(new Date('2025-07-24T16:45:00Z')).toISOString() },
    { id: 'ACT-9', user: 'Maximiliano Miranda', action: 'actualizó calibración del equipo EQ-05', timestamp: new Date(new Date('2025-07-19T13:20:00Z')).toISOString() },
    { id: 'ACT-10', user: 'Antonia Figueroa', action: 'registró nueva no conformidad NC-004', timestamp: new Date(new Date('2025-07-20T09:15:00Z')).toISOString() },
    { id: 'ACT-11', user: 'Victor Lutz', action: 'aprobó capacitación CAP-003', timestamp: new Date(new Date('2025-07-21T15:30:00Z')).toISOString() },
    { id: 'ACT-12', user: 'Robinson Córdova', action: 'finalizó ensayo de presión hidrostática PHI-002', timestamp: new Date(new Date('2025-07-25T18:00:00Z')).toISOString() },
    { id: 'ACT-13', user: 'Jesus Diaz', action: 'revisó condiciones ambientales del laboratorio', timestamp: new Date(new Date('2025-07-23T10:00:00Z')).toISOString() },
    { id: 'ACT-14', user: 'Maximiliano Miranda', action: 'programó mantenimiento preventivo EQ-02', timestamp: new Date(new Date('2025-07-18T11:45:00Z')).toISOString() },
    { id: 'ACT-15', user: 'Antonia Figueroa', action: 'generó informe de ensayos Q2 2025', timestamp: new Date(new Date('2025-07-01T16:20:00Z')).toISOString() }
];


const demoEquipos: Equipo[] = [
    { id: 'EQ-01', nombre: 'Espectrómetro FTIR', estado: 'Activo', proxima_calibracion: '15-01-2026', ubicacion: 'Mesón Central, Lab. Principal', responsable: 'Jesus Diaz', fotoUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IiM2QjcyODAiLz4KPHN2ZyB4PSIxNjAiIHk9IjE2MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IndoaXRlIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDkuNzRMMTIgMTZMMTAuOTEgOS43NEw0IDlMMTAuOTEgOC4yNkwxMiAyWiIvPgo8L3N2Zz4KPC9zdmc+Cg==' },
    { id: 'EQ-02', nombre: 'Prensa de Impacto', estado: 'En Mantenimiento', proxima_calibracion: '20-12-2025', ubicacion: 'Área de Ensayos Mecánicos', responsable: 'Maximiliano Miranda', fotoUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IiM0Q0Y1OTAiLz4KPHN2ZyB4PSIxNjAiIHk9IjE2MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IndoaXRlIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDkuNzRMMTIgMTZMMTAuOTEgOS43NEw0IDlMMTAuOTEgOC4yNkwxMiAyWiIvPgo8L3N2Zz4KPC9zdmc+Cg==' },
    { id: 'EQ-03', nombre: 'Máquina de Tracción', estado: 'Requiere Calibración', proxima_calibracion: '01-08-2025', ubicacion: 'Área de Ensayos Mecánicos', responsable: 'Antonia Figueroa', fotoUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IiNGRjU3MjIiLz4KPHN2ZyB4PSIxNjAiIHk9IjE2MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IndoaXRlIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDkuNzRMMTIgMTZMMTAuOTEgOS43NEw0IDlMMTAuOTEgOC4yNkwxMiAyWiIvPgo8L3N2Zz4KPC9zdmc+Cg==' },
    { id: 'EQ-04', nombre: 'Plastómetro MFI', estado: 'Activo', proxima_calibracion: '01-03-2026', ubicacion: 'Mesón Central, Lab. Principal', responsable: 'Robinson Córdova', fotoUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IiNGRjY4NzUiLz4KPHN2ZyB4PSIxNjAiIHk9IjE2MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IndoaXRlIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDkuNzRMMTIgMTZMMTAuOTEgOS43NEw0IDlMMTAuOTEgOC4yNkwxMiAyWiIvPgo8L3N2Zz4KPC9zdmc+Cg==' },
    { id: 'EQ-05', nombre: 'Balanza Analítica', estado: 'Activo', proxima_calibracion: '10-08-2025', ubicacion: 'Sala de Pesaje', responsable: 'Antonia Figueroa', fotoUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IiNGRjA5ODAiLz4KPHN2ZyB4PSIxNjAiIHk9IjE2MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IndoaXRlIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDkuNzRMMTIgMTZMMTAuOTEgOS43NEw0IDlMMTAuOTEgOC4yNkwxMiAyWiIvPgo8L3N2Zz4KPC9zdmc+Cg==' },
    { id: 'EQ-06', nombre: 'Mufla', estado: 'Activo', proxima_calibracion: 'N/A', ubicacion: 'Área de Hornos', responsable: 'Robinson Córdova', fotoUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IiM5QzI3QjAiLz4KPHN2ZyB4PSIxNjAiIHk9IjE2MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IndoaXRlIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDkuNzRMMTIgMTZMMTAuOTEgOS43NEw0IDlMMTAuOTEgOC4yNkwxMiAyWiIvPgo8L3N2Zz4KPC9zdmc+Cg==' },
    { id: 'EQ-07', nombre: 'Termómetro Ambiental', estado: 'Inactivo', proxima_calibracion: '30-11-2025', ubicacion: 'Sala de Muestras', responsable: 'Maximiliano Miranda', fotoUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IiM2OTM5QjMiLz4KPHN2ZyB4PSIxNjAiIHk9IjE2MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IndoaXRlIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDkuNzRMMTIgMTZMMTAuOTEgOS43NEw0IDlMMTAuOTEgOC4yNkwxMiAyWiIvPgo8L3N2Zz4KPC9zdmc+Cg==' },
    { id: 'EQ-08', nombre: 'Sistema de Presión Hidrostática', estado: 'Activo', proxima_calibracion: '15-09-2025', ubicacion: 'Área de Ensayos Especiales', responsable: 'Robinson Córdova', fotoUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IiM2QjcyODAiLz4KPHN2ZyB4PSIxNjAiIHk9IjE2MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IndoaXRlIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDkuNzRMMTIgMTZMMTAuOTEgOS43NEw0IDlMMTAuOTEgOC4yNkwxMiAyWiIvPgo8L3N2Zz4KPC9zdmc+Cg==' },
    { id: 'EQ-09', nombre: 'Cromatógrafo de Gases', estado: 'Activo', proxima_calibracion: '01-12-2025', ubicacion: 'Mesón Central, Lab. Principal', responsable: 'Antonia Figueroa', fotoUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IiM0Q0Y1OTAiLz4KPHN2ZyB4PSIxNjAiIHk9IjE2MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IndoaXRlIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDkuNzRMMTIgMTZMMTAuOTEgOS43NEw0IDlMMTAuOTEgOC4yNkwxMiAyWiIvPgo8L3N2Zz4KPC9zdmc+Cg==' },
    { id: 'EQ-10', nombre: 'Microscopio Óptico', estado: 'Activo', proxima_calibracion: '20-10-2025', ubicacion: 'Área de Análisis Visual', responsable: 'Maximiliano Miranda', fotoUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IiNGRjA5ODAiLz4KPHN2ZyB4PSIxNjAiIHk9IjE2MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IndoaXRlIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDkuNzRMMTIgMTZMMTAuOTEgOS43NEw0IDlMMTAuOTEgOC4yNkwxMiAyWiIvPgo8L3N2Zz4KPC9zdmc+Cg==' }
];

const demoControles: ControlEvento[] = [
    { id: 'CE-001', equipo: 'EQ-01', equipoId: 'EQ-01', fecha: '15-01-2025', tipo: 'Calibración', resultado: 'Aprobado', responsable: 'Servicio Externo Trescal', observaciones: 'Calibración anual completa según procedimiento XYZ.', certificadoUrl: '#', proximo_control: '15-01-2026' },
    { id: 'CE-002', equipo: 'EQ-01', equipoId: 'EQ-01', fecha: '15-04-2025', tipo: 'Verificación', resultado: 'Aprobado', responsable: 'Jesus Diaz', observaciones: 'Verificación interna con patrón de referencia. Todo OK.' },
    { id: 'CE-003', equipo: 'EQ-05', equipoId: 'EQ-05', fecha: '10-07-2025', tipo: 'Mantenimiento Correctivo', resultado: 'En Proceso', responsable: 'Servicio Técnico Mettler', observaciones: 'Reemplazo de celda de carga. Requiere recalibración.' },
    { id: 'CE-004', equipo: 'EQ-02', equipoId: 'EQ-02', fecha: '20-12-2024', tipo: 'Calibración', resultado: 'Aprobado', responsable: 'Servicio Externo Instron', certificadoUrl: '#', proximo_control: '20-12-2025'},
    { id: 'CE-005', equipo: 'EQ-04', equipoId: 'EQ-04', fecha: '01-03-2025', tipo: 'Calibración', resultado: 'Aprobado', responsable: 'Introtec', observaciones: 'Calibración de temperatura y dado de extrusión.', certificadoUrl: '#', proximo_control: '01-03-2026' },
    { id: 'CE-006', equipo: 'EQ-05', equipoId: 'EQ-05', fecha: '10-08-2024', tipo: 'Calibración', resultado: 'Aprobado', responsable: 'Servicio Externo Mettler', observaciones: 'Calibración anual completa.', certificadoUrl: '#', proximo_control: '10-08-2025' },
    { id: 'CE-007', equipo: 'EQ-02', equipoId: 'EQ-02', fecha: '18-07-2025', tipo: 'Mantenimiento Preventivo', resultado: 'Completado', responsable: 'Maximiliano Miranda', observaciones: 'Limpieza y lubricación de componentes móviles según plan de mantenimiento.' },
    { id: 'CE-008', equipo: 'EQ-03', equipoId: 'EQ-03', fecha: '01-08-2024', tipo: 'Calibración', resultado: 'Aprobado', responsable: 'Servicio Externo Instron', observaciones: 'Calibración de celda de carga y extensómetro.', certificadoUrl: '#', proximo_control: '01-08-2025' },
];

const demoGeneratedReports: GeneratedReport[] = [
    { 
        id: 'REP-001',
        titulo: 'Informe de Ensayos Q2 2025',
        fecha: '2025-07-01',
        tipo: 'Reporte Trimestral',
        fecha_generacion: '2025-07-01',
        usuario: 'Jesus Diaz',
        contenido: 'Informe trimestral de ensayos realizados',
        formato: 'PDF',
        url_descarga: '/reports/Q2-2025-ensayos.pdf',
        parametros: ['Melt Index', 'Densidad', 'Resistencia']
    },
    {
        id: 'REP-002',
        titulo: 'Reporte de Control de Calidad Junio 2025',
        fecha: '2025-06-30',
        tipo: 'Control de Calidad',
        fecha_generacion: '2025-06-30',
        usuario: 'Antonia Figueroa',
        contenido: 'Reporte mensual de control de calidad',
        formato: 'Excel',
        url_descarga: '/reports/control-calidad-jun-2025.xlsx',
        parametros: ['Control Visual', 'Mediciones', 'Peso']
    }
];

let demoNoConformidades: NoConformidad[] = [
    { id: `NC-001`, tipo: 'Interna', fecha_deteccion: `11-06-2025`, descripcion: 'Resultados de Melt Index fuera de especificación para lote RP-0610.', estado: 'En Investigación', severidad: 'Alta', responsable: 'Jesus Diaz', fecha_vencimiento: '25-06-2025' },
    { id: `NC-002`, tipo: 'Reclamo de Cliente', fecha_deteccion: `05-07-2025`, descripcion: 'Cliente A reporta problemas de fragilidad en tubería de lote Lote-250618-PE1.', estado: 'Abierta', severidad: 'Crítica', responsable: 'Victor Lutz', fecha_vencimiento: '15-07-2025' },
    { id: `NC-003`, tipo: 'Auditoría', fecha_deteccion: `15-05-2025`, descripcion: 'No se encontró registro de calibración para termómetro de ambiente de sala de muestras.', estado: 'Cerrada', severidad: 'Baja', responsable: 'Maximiliano Miranda', accion_correctiva: 'Termómetro enviado a calibrar y se actualizó programa de calibración.' },
    { id: `NC-004`, tipo: 'Interna', fecha_deteccion: `20-07-2025`, descripcion: 'Material reprocesado presenta contaminación visual.', estado: 'Abierta', severidad: 'Media', responsable: 'Robinson Córdova', fecha_vencimiento: '30-07-2025' }
];

const demoImportaciones: Importacion[] = [
    { id: 'IMP-001', producto: 'HDPE', cantidad: '15821 kg', fecha: '2025-02-03', bl: 'YMLUC236092186', fecha_embarque: '11-12-2024', sca: '65344', fecha_emision_cert: '07-03-2025', di: '2400301661-3', etiqueta_rango_inicio: '7820106', etiqueta_rango_fin: '7820606', operacion: '170389', proveedor: 'RYNO', fecha_solicitada: '03-02-2025', fecha_entrega_calidad: '21-02-2025', cantidad_lote: 15821, fecha_liberacion: '05-04-2025', ingresado_siss: true, estado: 'VIGENTE' },
    { id: 'IMP-002', producto: 'PP', cantidad: '16593 kg', fecha: '2025-02-16', bl: '(M)MEDUIG157023', fecha_embarque: '02-12-2024', sca: '65792', fecha_emision_cert: '21-03-2025', di: '2400301371-1', etiqueta_rango_inicio: '7820907', etiqueta_rango_fin: '7821907', operacion: '170374', proveedor: 'UNIDELTA', fecha_solicitada: '16-02-2025', fecha_entrega_calidad: '02-03-2025', cantidad_lote: 16593, fecha_liberacion: '25-03-2025', ingresado_siss: true, estado: 'VIGENTE' },
    { id: 'IMP-003', producto: 'HDPE', cantidad: '15000 kg', fecha: '2025-02-28', bl: 'NBO210082100', fecha_embarque: '24-12-2024', sca: '65793', fecha_emision_cert: '21-03-2025', di: '2400301372-2', etiqueta_rango_inicio: '7822008', etiqueta_rango_fin: '7823008', operacion: '170375', proveedor: 'SABIC', fecha_solicitada: '28-02-2025', fecha_entrega_calidad: '15-03-2025', cantidad_lote: 15000, fecha_liberacion: '28-03-2025', ingresado_siss: true, estado: 'VIGENTE' }
];
