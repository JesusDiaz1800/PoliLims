// 🏛️ INTERFACES PARA SISTEMA DE CALIDAD Y CERTIFICADOS
// PoliLims - Sistema de Gestión de Laboratorio

// ============================================================================
// CLÁUSULA 7.5 - REGISTROS TÉCNICOS (ALCOA+)
// ============================================================================

export interface RegistroTecnico {
  id: string;
  tipo: 'Ensayo' | 'Calibracion' | 'Muestreo' | 'Mantenimiento' | 'Auditoria';
  referencia: string;
  
  // Principios ALCOA+
  attributable: {
    creado_por: string;
    modificado_por?: string;
    fecha_creacion: Date;
    fecha_modificacion?: Date;
  };
  
  legible: {
    formato: 'PDF' | 'CSV' | 'JSON' | 'XML';
    encoding: 'UTF-8';
    permanente: boolean;
  };
  
  contemporaneous: {
    tiempo_real: boolean;
    max_delay: number; // segundos
  };
  
  original: {
    version: number;
    checksum: string;
    timestamp: Date;
  };
  
  accurate: {
    validado: boolean;
    verificado: boolean;
    checksum: string;
  };
  
  complete: {
    campos_requeridos: string[];
    campos_opcionales: string[];
    validado: boolean;
  };
  
  consistent: {
    formato: string;
    estandares: string[];
    validado: boolean;
  };
  
  durable: {
    backup: boolean;
    archivo: boolean;
    retencion: number; // años
  };
  
  available: {
    uptime: number; // porcentaje
    backup: boolean;
    disaster_recovery: boolean;
  };
  
  // Contenido del registro
  contenido: any;
  
  // Control de versiones
  versiones: VersionRegistro[];
  
  created_at: Date;
  updated_at: Date;
}

export interface VersionRegistro {
  version: number;
  fecha: Date;
  usuario: string;
  cambios: string;
  checksum: string;
}

// ============================================================================
// CLÁUSULA 7.6 - EVALUACIÓN DE INCERTIDUMBRE
// ============================================================================

export interface EvaluacionIncertidumbreMedicion {
  id: string;
  metodo_id: string;
  parametro: string;
  
  // Fuentes de incertidumbre
  fuentes: FuenteIncertidumbreMedicion[];
  
  // Cálculos
  incertidumbre_tipo_a: number;
  incertidumbre_tipo_b: number;
  incertidumbre_combinada: number;
  factor_cobertura: number;
  incertidumbre_expandida: number;
  
  // Documentación
  fecha_evaluacion: Date;
  evaluado_por: string;
  revisado_por: string;
  documento_url?: string;
  
  created_at: Date;
  updated_at: Date;
}

export interface FuenteIncertidumbreMedicion {
  id: string;
  fuente: string;
  tipo: 'A' | 'B';
  descripcion: string;
  valor: number;
  unidad: string;
  distribucion: 'Normal' | 'Rectangular' | 'Triangular' | 'U';
  factor_distribucion: number;
  contribucion: number;
  observaciones: string;
}

// ============================================================================
// CLÁUSULA 7.7 - GARANTIZAR VALIDEZ DE RESULTADOS
// ============================================================================

export interface ControlCalidad {
  id: string;
  tipo: 'Blanco' | 'Patron' | 'Duplicado' | 'Spike' | 'Control';
  fecha: Date;
  metodo_id: string;
  analista_id: string;
  
  // Resultados
  resultado: number;
  valor_esperado: number;
  limite_control: number;
  limite_advertencia: number;
  
  // Evaluación
  conforme: boolean;
  accion: 'Aceptar' | 'Rechazar' | 'Investigar';
  observaciones: string;
  
  created_at: Date;
}

export interface IncidenteControlCalidad {
  id: string;
  control_id: string;
  tipo: 'Fuera Control' | 'Tendencia' | 'Patron' | 'Otro';
  descripcion: string;
  fecha_deteccion: Date;
  investigacion: string;
  accion_correctiva: string;
  responsable: string;
  fecha_resolucion?: Date;
  estado: 'Abierto' | 'En Investigacion' | 'Resuelto' | 'Cerrado';
}

// ============================================================================
// CLÁUSULA 7.8 - DOCUMENTACIÓN DE RESULTADOS
// ============================================================================

export interface CertificadoAnalisis {
  id: string;
  numero: string;
  ensayo_id: string;
  cliente_id: string;
  
  // Información del ensayo
  muestra: string;
  metodo: string;
  fecha_ensayo: Date;
  fecha_emision: Date;
  
  // Resultados
  resultados: ResultadoCertificado[];
  incertidumbre: number;
  
  // Revisión y aprobación
  revisado_por: string;
  fecha_revision: Date;
  aprobado_por: string;
  fecha_aprobacion: Date;
  
  // Control de versiones
  version: number;
  versiones_anteriores: VersionCertificado[];
  
  // Estado
  estado: 'Borrador' | 'Revisado' | 'Aprobado' | 'Emitido';
  
  // Archivos
  pdf_url?: string;
  xml_url?: string;
  
  created_at: Date;
  updated_at: Date;
}

export interface ResultadoCertificado {
  parametro: string;
  resultado: number;
  unidad: string;
  limite_deteccion: number;
  limite_cuantificacion: number;
  incertidumbre: number;
  criterio_aceptacion: string;
  conforme: boolean;
}

export interface VersionCertificado {
  version: number;
  fecha: Date;
  usuario: string;
  cambios: string;
  pdf_url: string;
}

// ============================================================================
// CLÁUSULA 7.9 - RECLAMACIONES
// ============================================================================

export interface Reclamacion {
  id: string;
  numero: string;
  cliente_id: string;
  fecha_reclamacion: Date;
  
  // Detalles de la reclamación
  tipo: 'Resultado' | 'Tiempo' | 'Servicio' | 'Otro';
  descripcion: string;
  ensayo_id?: string;
  certificado_id?: string;
  
  // Investigación
  investigacion: string;
  conclusion: string;
  accion_correctiva: string;
  
  // Responsables
  recibido_por: string;
  investigado_por: string;
  resuelto_por?: string;
  
  // Fechas
  fecha_investigacion?: Date;
  fecha_resolucion?: Date;
  
  // Estado
  estado: 'Recibida' | 'En Investigacion' | 'Resuelta' | 'Cerrada';
  
  // Documentación
  documentos: string[];
  
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// CLÁUSULA 7.10 - TRABAJOS NO CONFORMES
// ============================================================================

export interface TrabajoNoConforme {
  id: string;
  numero: string;
  tipo: 'Ensayo' | 'Calibracion' | 'Muestreo' | 'Otro';
  
  // Detalles
  descripcion: string;
  fecha_deteccion: Date;
  detectado_por: string;
  
  // Análisis
  causa_raiz: string;
  impacto: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
  
  // Acciones
  accion_inmediata: string;
  accion_correctiva: string;
  accion_preventiva: string;
  
  // Responsables
  responsable_accion: string;
  supervisor: string;
  
  // Fechas
  fecha_accion_inmediata?: Date;
  fecha_accion_correctiva?: Date;
  fecha_verificacion?: Date;
  
  // Estado
  estado: 'Detectado' | 'En Accion' | 'Verificado' | 'Cerrado';
  
  // Documentación
  documentos: string[];
  
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// CLÁUSULA 7.11 - CONTROL DE DATOS Y GESTIÓN DE INFORMACIÓN
// ============================================================================

export interface ControlDatos {
  id: string;
  tipo: 'Acceso' | 'Modificacion' | 'Eliminacion' | 'Exportacion';
  
  // Usuario y acción
  usuario_id: string;
  accion: string;
  fecha: Date;
  ip_address: string;
  user_agent: string;
  
  // Datos afectados
  tabla: string;
  registro_id: string;
  valores_anteriores?: any;
  valores_nuevos?: any;
  
  // Seguridad
  autenticacion: boolean;
  autorizacion: boolean;
  cifrado: boolean;
  
  // Auditoría
  checksum: string;
  timestamp: Date;
}

export interface BackupSistema {
  id: string;
  tipo: 'Completo' | 'Incremental' | 'Diferencial';
  fecha: Date;
  tamano: number; // bytes
  ubicacion: string;
  checksum: string;
  estado: 'En Proceso' | 'Completado' | 'Fallido';
  observaciones: string;
}

export interface RecuperacionDesastres {
  id: string;
  fecha: Date;
  tipo: 'Prueba' | 'Real';
  descripcion: string;
  tiempo_recuperacion: number; // minutos
  datos_recuperados: number; // porcentaje
  estado: 'Exitoso' | 'Fallido' | 'Parcial';
  observaciones: string;
}

// ============================================================================
// SISTEMA DE GESTIÓN DE CALIDAD (QMS)
// ============================================================================

export interface SistemaGestionCalidad {
  id: string;
  nombre: string;
  version: string;
  fecha_implementacion: Date;
  
  // Política de calidad
  politica_calidad: string;
  objetivos_calidad: ObjetivoCalidad[];
  
  // Documentación
  manual_calidad: string;
  procedimientos: ProcedimientoCalidad[];
  instrucciones_trabajo: InstruccionTrabajo[];
  
  // Gestión de cambios
  cambios: CambioSistema[];
  
  // Mejora continua
  mejoras: MejoraContinua[];
  
  estado: 'Activo' | 'En Revision' | 'Suspendido';
  created_at: Date;
  updated_at: Date;
}

export interface ObjetivoCalidad {
  id: string;
  descripcion: string;
  indicador: string;
  meta: number;
  unidad: string;
  frecuencia_medicion: string;
  responsable: string;
  fecha_establecimiento: Date;
  fecha_revision?: Date;
}

export interface ProcedimientoCalidad {
  id: string;
  codigo: string;
  titulo: string;
  version: string;
  alcance: string;
  responsabilidades: string[];
  procedimiento: string;
  registros: string[];
  fecha_aprobacion: Date;
  aprobado_por: string;
  estado: 'Activo' | 'En Revision' | 'Obsoleto';
}

export interface InstruccionTrabajo {
  id: string;
  codigo: string;
  titulo: string;
  version: string;
  procedimiento_id: string;
  pasos: PasoInstruccion[];
  equipos_requeridos: string[];
  reactivos_requeridos: string[];
  precauciones: string[];
  fecha_aprobacion: Date;
  aprobado_por: string;
  estado: 'Activo' | 'En Revision' | 'Obsoleto';
}

export interface PasoInstruccion {
  orden: number;
  descripcion: string;
  duracion: number; // minutos
  equipos: string[];
  reactivos: string[];
  observaciones: string;
}

export interface CambioSistema {
  id: string;
  tipo: 'Procedimiento' | 'Equipo' | 'Software' | 'Personal' | 'Otro';
  descripcion: string;
  justificacion: string;
  impacto: 'Bajo' | 'Medio' | 'Alto';
  fecha_solicitud: Date;
  solicitado_por: string;
  fecha_aprobacion?: Date;
  aprobado_por?: string;
  fecha_implementacion?: Date;
  estado: 'Solicitado' | 'En Revision' | 'Aprobado' | 'Implementado' | 'Rechazado';
}

export interface MejoraContinua {
  id: string;
  tipo: 'Correctiva' | 'Preventiva' | 'Mejora';
  descripcion: string;
  causa_raiz?: string;
  accion: string;
  responsable: string;
  fecha_identificacion: Date;
  fecha_implementacion?: Date;
  fecha_verificacion?: Date;
  efectividad: 'Alta' | 'Media' | 'Baja';
  estado: 'Identificada' | 'En Proceso' | 'Implementada' | 'Verificada' | 'Cerrada';
}

// ============================================================================
// VALIDACIÓN DE SOFTWARE (IQ/OQ/PQ)
// ============================================================================

export interface ValidacionSoftware {
  id: string;
  fase: 'IQ' | 'OQ' | 'PQ';
  fecha: Date;
  
  // Cualificación de Instalación (IQ)
  iq?: {
    instalacion_conforme: boolean;
    configuracion_conforme: boolean;
    documentacion_completa: boolean;
    observaciones: string;
  };
  
  // Cualificación Operacional (OQ)
  oq?: {
    funcionalidades_probad: string[];
    rendimiento_conforme: boolean;
    errores_detectados: string[];
    observaciones: string;
  };
  
  // Cualificación de Rendimiento (PQ)
  pq?: {
    procesos_probad: string[];
    resultados_conformes: boolean;
    tiempo_respuesta: number;
    observaciones: string;
  };
  
  // Documentación
  documento_url: string;
  aprobado_por: string;
  fecha_aprobacion: Date;
  
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// CICLO PHVA (PLANIFICAR-HACER-VERIFICAR-ACTUAR)
// ============================================================================

export interface CicloPHVA {
  id: string;
  nombre: string;
  descripcion: string;
  
  // Planificar
  planificar: {
    objetivos: string[];
    metas: string[];
    recursos: string[];
    cronograma: string;
  };
  
  // Hacer
  hacer: {
    acciones: string[];
    responsables: string[];
    fechas: Date[];
    recursos_utilizados: string[];
  };
  
  // Verificar
  verificar: {
    indicadores: string[];
    resultados: any[];
    conformidad: boolean;
    desviaciones: string[];
  };
  
  // Actuar
  actuar: {
    mejoras: string[];
    acciones_correctivas: string[];
    lecciones_aprendidas: string[];
    proximo_ciclo: string;
  };
  
  // Estado
  estado: 'Planificacion' | 'Ejecucion' | 'Verificacion' | 'Actuacion' | 'Completado';
  
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// EXPORTACIÓN DE TIPOS
// ============================================================================

export type {
  RegistroTecnico,
  VersionRegistro,
  EvaluacionIncertidumbreMedicion,
  FuenteIncertidumbreMedicion,
  ControlCalidad,
  IncidenteControlCalidad,
  CertificadoAnalisis,
  ResultadoCertificado,
  VersionCertificado,
  Reclamacion,
  TrabajoNoConforme,
  ControlDatos,
  BackupSistema,
  RecuperacionDesastres,
  SistemaGestionCalidad,
  ObjetivoCalidad,
  ProcedimientoCalidad,
  InstruccionTrabajo,
  PasoInstruccion,
  CambioSistema,
  MejoraContinua,
  ValidacionSoftware,
  CicloPHVA
};
