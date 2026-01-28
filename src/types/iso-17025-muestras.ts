// 🏛️ INTERFACES PARA GESTIÓN DE MUESTRAS Y TRAZABILIDAD
// PoliLims - Sistema de Gestión de Laboratorio

// ============================================================================
// CLÁUSULA 7.3 - MUESTREO
// ============================================================================

export interface Muestreo {
  id: string;
  codigo: string;
  cliente_id: string;
  tipo_muestreo: 'Aleatorio' | 'Sistematico' | 'Estratificado' | 'Por Conveniencia';
  
  // Ubicación
  ubicacion: UbicacionMuestreo;
  
  // Personal
  muestreador_id: string;
  supervisor_id?: string;
  
  // Fechas
  fecha_solicitud: Date;
  fecha_programada: Date;
  fecha_realizacion?: Date;
  
  // Procedimiento
  procedimiento_id: string;
  desviaciones: DesviacionProcedimiento[];
  
  // Muestras
  muestras: Muestra[];
  
  // Equipos utilizados
  equipos_utilizados: EquipoMuestreo[];
  
  // Condiciones ambientales
  condiciones_ambientales: CondicionAmbiental;
  
  estado: 'Programado' | 'En Proceso' | 'Completado' | 'Cancelado';
  observaciones: string;
  
  created_at: Date;
  updated_at: Date;
}

export interface UbicacionMuestreo {
  direccion: string;
  coordenadas: {
    latitud: number;
    longitud: number;
  };
  zona: string;
  punto_muestreo: string;
  descripcion: string;
}

export interface DesviacionProcedimiento {
  id: string;
  muestreo_id: string;
  tipo: 'Adicion' | 'Exclusion' | 'Modificacion';
  descripcion: string;
  justificacion: string;
  autorizado_por: string;
  fecha_autorizacion: Date;
}

export interface Muestra {
  id: string;
  muestreo_id: string;
  codigo: string;
  tipo: string;
  cantidad: number;
  unidad: string;
  recipiente: string;
  preservacion: string;
  condiciones_almacenamiento: string;
  fecha_caducidad?: Date;
  observaciones: string;
}

export interface EquipoMuestreo {
  equipo_id: string;
  calibracion_vigente: boolean;
  fecha_ultima_calibracion: Date;
  proxima_calibracion: Date;
  estado: 'Conforme' | 'No Conforme';
}

export interface CondicionAmbiental {
  temperatura: number;
  humedad: number;
  presion: number;
  condiciones_especiales: string;
}

// ============================================================================
// CLÁUSULA 7.4 - MANEJO DE MUESTRAS
// ============================================================================

export interface ManejoMuestras {
  id: string;
  muestra_id: string;
  
  // Recepción
  recepcion: RecepcionMuestra;
  
  // Almacenamiento
  almacenamiento: AlmacenamientoMuestra[];
  
  // Transporte
  transportes: TransporteMuestra[];
  
  // Conservación
  conservacion: ConservacionMuestra;
  
  // Disposición final
  disposicion?: DisposicionMuestra;
  
  // Trazabilidad
  trazabilidad: TrazabilidadMuestra[];
  
  // Anomalías
  anomalias: AnomaliaMuestra[];
  
  created_at: Date;
  updated_at: Date;
}

export interface RecepcionMuestra {
  fecha_recepcion: Date;
  recibido_por: string;
  condiciones_recepcion: string;
  embalaje_conforme: boolean;
  etiquetado_conforme: boolean;
  documentacion_completa: boolean;
  observaciones: string;
}

export interface AlmacenamientoMuestra {
  id: string;
  ubicacion: string;
  fecha_ingreso: Date;
  fecha_salida?: Date;
  temperatura: number;
  humedad: number;
  condiciones_especiales: string;
  responsable: string;
}

export interface TransporteMuestra {
  id: string;
  origen: string;
  destino: string;
  fecha_transporte: Date;
  transportista: string;
  condiciones_transporte: string;
  tiempo_transporte: number; // horas
  temperatura_transporte?: number;
  observaciones: string;
}

export interface ConservacionMuestra {
  metodo: string;
  temperatura: number;
  humedad?: number;
  tiempo_maximo: number; // días
  condiciones_especiales: string;
}

export interface DisposicionMuestra {
  fecha_disposicion: Date;
  metodo: string;
  responsable: string;
  certificado_disposicion?: string;
  observaciones: string;
}

export interface TrazabilidadMuestra {
  id: string;
  fecha: Date;
  accion: string;
  ubicacion: string;
  responsable: string;
  observaciones: string;
}

export interface AnomaliaMuestra {
  id: string;
  fecha: Date;
  tipo: 'Contaminacion' | 'Pérdida' | 'Deterioro' | 'Etiquetado' | 'Otro';
  descripcion: string;
  accion_tomada: string;
  responsable: string;
}

// ============================================================================
// CLÁUSULA 6.5 - TRAZABILIDAD METROLÓGICA
// ============================================================================

export interface TrazabilidadMetrologica {
  id: string;
  equipo_id: string;
  cadena_trazabilidad: CadenaTrazabilidad[];
  referencia_si: ReferenciaSI;
  incertidumbre_total: number;
  factor_cobertura: number;
  fecha_evaluacion: Date;
  evaluado_por: string;
  estado: 'Vigente' | 'Vencida' | 'Pendiente';
}

export interface CadenaTrazabilidad {
  eslabon: number;
  laboratorio: string;
  certificado: string;
  fecha: Date;
  incertidumbre: number;
  factor_cobertura: number;
}

export interface ReferenciaSI {
  unidad: string;
  definicion: string;
  realizacion: string;
  laboratorio_nacional: string;
  fecha_realizacion: Date;
}

// ============================================================================
// GESTIÓN DE MUESTRAS AVANZADA
// ============================================================================

export interface InventarioMuestras {
  id: string;
  ubicacion: string;
  muestras: MuestraInventario[];
  capacidad_maxima: number;
  capacidad_utilizada: number;
  temperatura_controlada: boolean;
  humedad_controlada: boolean;
  responsable: string;
  ultima_verificacion: Date;
  proxima_verificacion: Date;
}

export interface MuestraInventario {
  muestra_id: string;
  codigo: string;
  tipo: string;
  fecha_ingreso: Date;
  fecha_vencimiento: Date;
  estado: 'Activa' | 'Vencida' | 'Disponible' | 'En Uso';
  ubicacion_especifica: string;
  observaciones: string;
}

export interface CodigoBarras {
  id: string;
  codigo: string;
  tipo: 'QR' | 'Code128' | 'DataMatrix';
  contenido: string;
  muestra_id?: string;
  equipo_id?: string;
  generado_por: string;
  fecha_generacion: Date;
  fecha_vencimiento?: Date;
  estado: 'Activo' | 'Inactivo' | 'Vencido';
}

export interface ProgramadorMuestras {
  id: string;
  nombre: string;
  descripcion: string;
  tipo_muestra: string;
  frecuencia: 'Diaria' | 'Semanal' | 'Mensual' | 'Personalizada';
  reglas: ReglaMuestreo[];
  activo: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ReglaMuestreo {
  id: string;
  programador_id: string;
  condicion: string;
  accion: string;
  parametros: Record<string, any>;
  prioridad: number;
}

// ============================================================================
// SISTEMA DE IDENTIFICACIÓN
// ============================================================================

export interface SistemaIdentificacion {
  id: string;
  tipo: 'Muestra' | 'Equipo' | 'Reactivo' | 'Documento';
  codigo: string;
  etiqueta_fisica: boolean;
  etiqueta_digital: boolean;
  ubicacion_fisica: string;
  ubicacion_digital: string;
  responsable: string;
  fecha_creacion: Date;
  fecha_vencimiento?: Date;
  estado: 'Activo' | 'Inactivo' | 'Vencido';
}

export interface Etiqueta {
  id: string;
  sistema_id: string;
  tipo: 'QR' | 'Barcode' | 'RFID' | 'NFC';
  contenido: string;
  formato: string;
  tamano: string;
  material: string;
  resistencia: string;
  fecha_impresion: Date;
  impreso_por: string;
  estado: 'Activo' | 'Dañado' | 'Perdido';
}

// ============================================================================
// MONITOREO DE CONDICIONES AMBIENTALES
// ============================================================================

export interface MonitoreoAmbiental {
  id: string;
  ubicacion: string;
  parametros: ParametroAmbiental[];
  fecha_medicion: Date;
  responsable: string;
  equipos_utilizados: string[];
  observaciones: string;
}

export interface ParametroAmbiental {
  tipo: 'Temperatura' | 'Humedad' | 'Presion' | 'Iluminacion' | 'Ruido' | 'Vibracion';
  valor: number;
  unidad: string;
  limite_minimo: number;
  limite_maximo: number;
  conforme: boolean;
  observaciones: string;
}

// ============================================================================
// EXPORTACIÓN DE TIPOS
// ============================================================================

export type {
  Muestreo,
  UbicacionMuestreo,
  DesviacionProcedimiento,
  Muestra,
  EquipoMuestreo,
  CondicionAmbiental,
  ManejoMuestras,
  RecepcionMuestra,
  AlmacenamientoMuestra,
  TransporteMuestra,
  ConservacionMuestra,
  DisposicionMuestra,
  TrazabilidadMuestra,
  AnomaliaMuestra,
  TrazabilidadMetrologica,
  CadenaTrazabilidad,
  ReferenciaSI,
  InventarioMuestras,
  MuestraInventario,
  CodigoBarras,
  ProgramadorMuestras,
  ReglaMuestreo,
  SistemaIdentificacion,
  Etiqueta,
  MonitoreoAmbiental,
  ParametroAmbiental
};
