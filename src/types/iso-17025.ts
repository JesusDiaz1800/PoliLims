// 🏛️ INTERFACES PRINCIPALES PARA CUMPLIMIENTO ISO/IEC 17025
// PoliLims - Sistema de Gestión de Laboratorio

// Exportar todas las interfaces desde los archivos específicos
export * from './iso-17025-basic';
export * from './iso-17025-muestras';
export * from './iso-17025-calidad';

// ============================================================================
// INTERFACES ADICIONALES PARA FUNCIONALIDADES AVANZADAS
// ============================================================================

// Reactivos y Existencias
export interface Reactivo {
  id: string;
  codigo: string;
  nombre: string;
  formula_quimica: string;
  pureza: number;
  unidad_pureza: string;
  fabricante: string;
  lote: string;
  fecha_fabricacion: Date;
  fecha_vencimiento: Date;
  cantidad_disponible: number;
  unidad: string;
  ubicacion: string;
  condiciones_almacenamiento: string;
  estado: 'Activo' | 'Vencido' | 'Agotado' | 'Retirado';
  especificaciones_tecnicas: string;
  certificado_analisis_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface InventarioReactivos {
  id: string;
  reactivo_id: string;
  tipo_movimiento: 'Entrada' | 'Salida' | 'Ajuste' | 'Vencimiento';
  cantidad: number;
  unidad: string;
  fecha_movimiento: Date;
  responsable: string;
  motivo: string;
  documento_referencia?: string;
  observaciones: string;
}

// Automatización de Laboratorio
export interface FlujoTrabajo {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: 'Ensayo' | 'Calibracion' | 'Muestreo' | 'Mantenimiento';
  pasos: PasoFlujo[];
  condiciones: CondicionFlujo[];
  automatizado: boolean;
  instrumentos_conectados: string[];
  estado: 'Activo' | 'Inactivo' | 'En Desarrollo';
  created_at: Date;
  updated_at: Date;
}

export interface PasoFlujo {
  orden: number;
  nombre: string;
  descripcion: string;
  tipo: 'Manual' | 'Automatico' | 'Decision';
  duracion_estimada: number; // minutos
  equipos_requeridos: string[];
  reactivos_requeridos: string[];
  condiciones: string[];
  resultado_esperado: string;
  validaciones: string[];
}

export interface CondicionFlujo {
  tipo: 'Temperatura' | 'Humedad' | 'Presion' | 'Tiempo' | 'Otro';
  valor_minimo: number;
  valor_maximo: number;
  unidad: string;
  critica: boolean;
}

// Portal de Cliente
export interface PortalCliente {
  id: string;
  cliente_id: string;
  usuario: string;
  password_hash: string;
  email: string;
  telefono: string;
  rol: 'Cliente' | 'Representante' | 'Administrador';
  permisos: string[];
  ultimo_acceso: Date;
  estado: 'Activo' | 'Inactivo' | 'Bloqueado';
  created_at: Date;
  updated_at: Date;
}

export interface SolicitudMuestra {
  id: string;
  cliente_id: string;
  numero_solicitud: string;
  fecha_solicitud: Date;
  tipo_muestra: string;
  cantidad: number;
  unidad: string;
  especificaciones: string;
  fecha_requerida: Date;
  ubicacion_muestreo: string;
  contacto: string;
  telefono: string;
  email: string;
  observaciones: string;
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'En Proceso' | 'Completada';
  created_at: Date;
  updated_at: Date;
}

export interface SeguimientoEnsayo {
  id: string;
  ensayo_id: string;
  cliente_id: string;
  fecha_actualizacion: Date;
  estado: string;
  progreso: number; // porcentaje
  observaciones: string;
  proxima_actualizacion?: Date;
}

// Integración con Sistemas Externos
export interface IntegracionSistema {
  id: string;
  nombre: string;
  tipo: 'ERP' | 'CRM' | 'Office365' | 'Dropbox' | 'OneDrive' | 'Instrumento';
  descripcion: string;
  endpoint: string;
  credenciales: CredencialesIntegracion;
  configuracion: ConfiguracionIntegracion;
  estado: 'Activo' | 'Inactivo' | 'Error';
  ultima_sincronizacion: Date;
  proxima_sincronizacion: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CredencialesIntegracion {
  tipo: 'API Key' | 'OAuth' | 'Basic Auth' | 'Certificate';
  api_key?: string;
  client_id?: string;
  client_secret?: string;
  username?: string;
  password?: string;
  certificate_url?: string;
}

export interface ConfiguracionIntegracion {
  frecuencia_sincronizacion: string;
  datos_sincronizar: string[];
  mapeo_campos: Record<string, string>;
  transformaciones: string[];
  validaciones: string[];
}

// Seguridad y Auditoría
export interface AuditoriaSistema {
  id: string;
  usuario_id: string;
  accion: string;
  modulo: string;
  tabla: string;
  registro_id: string;
  valores_anteriores?: any;
  valores_nuevos?: any;
  ip_address: string;
  user_agent: string;
  timestamp: Date;
  session_id: string;
  resultado: 'Exitoso' | 'Fallido' | 'Pendiente';
  observaciones: string;
}

export interface SesionUsuario {
  id: string;
  usuario_id: string;
  session_token: string;
  ip_address: string;
  user_agent: string;
  fecha_inicio: Date;
  fecha_fin?: Date;
  ultima_actividad: Date;
  estado: 'Activa' | 'Cerrada' | 'Expirada';
  datos_sesion: any;
}

export interface PoliticaSeguridad {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: 'Password' | 'Session' | 'Access' | 'Data' | 'Network';
  configuracion: ConfiguracionPolitica;
  activa: boolean;
  fecha_implementacion: Date;
  fecha_revision?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ConfiguracionPolitica {
  longitud_minima_password?: number;
  complejidad_password?: string[];
  expiracion_password?: number; // días
  max_intentos_login?: number;
  tiempo_bloqueo?: number; // minutos
  expiracion_sesion?: number; // minutos
  mfa_requerido?: boolean;
  ip_restricciones?: string[];
}

// Monitoreo y Métricas
export interface MetricaSistema {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: 'Performance' | 'Calidad' | 'Seguridad' | 'Negocio';
  unidad: string;
  valor: number;
  fecha_medicion: Date;
  contexto: any;
  alerta: boolean;
  created_at: Date;
}

export interface AlertaSistema {
  id: string;
  tipo: 'Critica' | 'Advertencia' | 'Informativa';
  titulo: string;
  descripcion: string;
  modulo: string;
  fecha_generacion: Date;
  fecha_resolucion?: Date;
  usuario_asignado?: string;
  estado: 'Activa' | 'En Proceso' | 'Resuelta' | 'Cerrada';
  prioridad: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  accion_requerida: string;
  created_at: Date;
  updated_at: Date;
}

// Reportes y Análisis
export interface ReportePersonalizado {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: 'Tabular' | 'Grafico' | 'Dashboard' | 'Certificado';
  configuracion: ConfiguracionReporte;
  programacion?: ProgramacionReporte;
  permisos: string[];
  estado: 'Activo' | 'Inactivo' | 'Borrador';
  created_at: Date;
  updated_at: Date;
}

export interface ConfiguracionReporte {
  fuentes_datos: string[];
  filtros: FiltroReporte[];
  campos: CampoReporte[];
  ordenamiento: OrdenamientoReporte[];
  agrupacion?: AgrupacionReporte[];
  formato_salida: 'PDF' | 'Excel' | 'CSV' | 'JSON';
  plantilla?: string;
}

export interface FiltroReporte {
  campo: string;
  operador: 'igual' | 'diferente' | 'mayor' | 'menor' | 'contiene' | 'entre';
  valor: any;
  valor2?: any;
}

export interface CampoReporte {
  nombre: string;
  alias: string;
  tipo: 'texto' | 'numero' | 'fecha' | 'booleano';
  formato?: string;
  calculado?: boolean;
  formula?: string;
}

export interface OrdenamientoReporte {
  campo: string;
  direccion: 'ascendente' | 'descendente';
}

export interface AgrupacionReporte {
  campo: string;
  funcion: 'suma' | 'promedio' | 'conteo' | 'maximo' | 'minimo';
}

export interface ProgramacionReporte {
  frecuencia: 'Diaria' | 'Semanal' | 'Mensual' | 'Personalizada';
  hora: string;
  dias_semana?: number[];
  dia_mes?: number;
  destinatarios: string[];
  formato_envio: 'Email' | 'FTP' | 'API';
}

// ============================================================================
// EXPORTACIÓN DE TIPOS ADICIONALES
// ============================================================================

export type {
  Reactivo,
  InventarioReactivos,
  FlujoTrabajo,
  PasoFlujo,
  CondicionFlujo,
  PortalCliente,
  SolicitudMuestra,
  SeguimientoEnsayo,
  IntegracionSistema,
  CredencialesIntegracion,
  ConfiguracionIntegracion,
  AuditoriaSistema,
  SesionUsuario,
  PoliticaSeguridad,
  ConfiguracionPolitica,
  MetricaSistema,
  AlertaSistema,
  ReportePersonalizado,
  ConfiguracionReporte,
  FiltroReporte,
  CampoReporte,
  OrdenamientoReporte,
  AgrupacionReporte,
  ProgramacionReporte
};
