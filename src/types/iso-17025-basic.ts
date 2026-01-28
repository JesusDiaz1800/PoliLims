// 🏛️ INTERFACES BÁSICAS PARA CUMPLIMIENTO ISO/IEC 17025
// PoliLims - Sistema de Gestión de Laboratorio

// ============================================================================
// CLÁUSULA 6.2 - PERSONAL
// ============================================================================

export interface Personal {
  id: string;
  codigo: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  departamento: string;
  puesto: string;
  fecha_contratacion: Date;
  estado: 'Activo' | 'Inactivo' | 'Vacaciones' | 'Licencia';
  
  // Competencias y autorizaciones
  competencias: Competencia[];
  autorizaciones: Autorizacion[];
  formacion: FormacionPersonal[];
  
  // Evaluación de desempeño
  evaluaciones: EvaluacionDesempeno[];
  fecha_ultima_evaluacion: Date;
  proxima_evaluacion: Date;
  
  // Documentos
  cv_url?: string;
  certificados_url?: string[];
  
  created_at: Date;
  updated_at: Date;
}

export interface Competencia {
  id: string;
  personal_id: string;
  area: string;
  nivel: 'Básico' | 'Intermedio' | 'Avanzado' | 'Experto';
  fecha_evaluacion: Date;
  evaluador_id: string;
  observaciones: string;
  estado: 'Aprobada' | 'Pendiente' | 'Rechazada';
}

export interface Autorizacion {
  id: string;
  personal_id: string;
  tipo: 'Muestreo' | 'Ensayo' | 'Calibracion' | 'Revision' | 'Aprobacion' | 'OperacionEquipo';
  equipos?: string[];
  metodos?: string[];
  fecha_autorizacion: Date;
  autorizado_por: string;
  fecha_vencimiento?: Date;
  estado: 'Activa' | 'Vencida' | 'Suspendida';
}

export interface FormacionPersonal {
  id: string;
  personal_id: string;
  tipo: 'Interna' | 'Externa' | 'Certificacion';
  titulo: string;
  institucion: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  horas: number;
  certificado_url?: string;
  evaluacion?: number;
  estado: 'Completada' | 'En Curso' | 'Pendiente';
}

export interface EvaluacionDesempeno {
  id: string;
  personal_id: string;
  evaluador_id: string;
  fecha_evaluacion: Date;
  periodo: string;
  criterios: CriterioEvaluacion[];
  puntuacion_total: number;
  observaciones: string;
  recomendaciones: string;
}

export interface CriterioEvaluacion {
  criterio: string;
  puntuacion: number;
  peso: number;
  observaciones: string;
}

// ============================================================================
// CLÁUSULA 6.4 - EQUIPOS
// ============================================================================

export interface Equipo {
  id: string;
  codigo: string;
  nombre: string;
  tipo: string;
  categoria: 'Medicion' | 'Ensayo' | 'Calibracion' | 'Auxiliar';
  
  // Información del fabricante
  fabricante: string;
  modelo: string;
  numero_serie: string;
  numero_inventario: string;
  
  // Especificaciones técnicas
  especificaciones: EspecificacionTecnica[];
  rango_medicion?: string;
  resolucion?: string;
  precision?: string;
  
  // Ubicación y responsabilidad
  ubicacion: string;
  responsable_id: string;
  estado: 'Activo' | 'Mantenimiento' | 'FueraServicio' | 'Calibracion';
  
  // Calibración
  programa_calibracion: ProgramaCalibracion;
  calibraciones: Calibracion[];
  verificaciones_intermedias: VerificacionIntermedia[];
  
  // Mantenimiento
  mantenimientos: Mantenimiento[];
  proximo_mantenimiento?: Date;
  
  // Documentación
  manual_url?: string;
  procedimiento_url?: string;
  certificado_url?: string;
  
  // Protección
  proteccion_ajustes: boolean;
  acceso_autorizado: string[];
  
  created_at: Date;
  updated_at: Date;
}

export interface EspecificacionTecnica {
  parametro: string;
  valor: string;
  unidad: string;
  tolerancia?: string;
}

export interface ProgramaCalibracion {
  id: string;
  equipo_id: string;
  frecuencia: string; // días, meses, años
  ultima_calibracion: Date;
  proxima_calibracion: Date;
  laboratorio_calibracion: string;
  criterios_aceptacion: string;
  procedimiento: string;
}

export interface Calibracion {
  id: string;
  equipo_id: string;
  fecha_calibracion: Date;
  laboratorio: string;
  certificado_numero: string;
  certificado_url?: string;
  resultados: ResultadoCalibracion[];
  incertidumbre: number;
  factor_cobertura: number;
  estado: 'Aprobada' | 'Rechazada' | 'Pendiente';
  observaciones: string;
  proxima_calibracion: Date;
}

export interface ResultadoCalibracion {
  punto_medicion: number;
  valor_nominal: number;
  valor_medido: number;
  correccion: number;
  incertidumbre: number;
}

export interface VerificacionIntermedia {
  id: string;
  equipo_id: string;
  fecha: Date;
  tipo: 'Diaria' | 'Semanal' | 'Mensual';
  responsable_id: string;
  resultados: ResultadoVerificacion[];
  estado: 'Conforme' | 'No Conforme';
  observaciones: string;
}

export interface ResultadoVerificacion {
  parametro: string;
  valor_esperado: number;
  valor_medido: number;
  tolerancia: number;
  conforme: boolean;
}

export interface Mantenimiento {
  id: string;
  equipo_id: string;
  tipo: 'Preventivo' | 'Correctivo' | 'Predictivo';
  fecha: Date;
  descripcion: string;
  responsable_id: string;
  costo: number;
  repuestos: string[];
  estado: 'Completado' | 'En Proceso' | 'Pendiente';
  proximo_mantenimiento?: Date;
}

// ============================================================================
// CLÁUSULA 7.2 - MÉTODOS DE ENSAYO
// ============================================================================

export interface MetodoEnsayo {
  id: string;
  codigo: string;
  nombre: string;
  version: string;
  norma: string; // ASTM, ISO, etc.
  fecha_publicacion: Date;
  
  // Alcance y aplicación
  alcance: string;
  aplicacion: string;
  limitaciones: string[];
  
  // Validación
  validacion: ValidacionMetodo;
  verificacion: VerificacionMetodo;
  
  // Procedimiento
  procedimiento: string;
  pasos: PasoProcedimiento[];
  equipos_requeridos: string[];
  reactivos_requeridos: string[];
  
  // Criterios de aceptación
  criterios_aceptacion: CriterioAceptacion[];
  
  // Incertidumbre
  incertidumbre: EvaluacionIncertidumbre;
  
  estado: 'Activo' | 'Inactivo' | 'En Revision';
  created_at: Date;
  updated_at: Date;
}

export interface ValidacionMetodo {
  id: string;
  metodo_id: string;
  fecha_validacion: Date;
  validado_por: string;
  parametros_validacion: ParametroValidacion[];
  conclusion: string;
  documento_url?: string;
}

export interface ParametroValidacion {
  parametro: string;
  valor_obtenido: number;
  valor_esperado: number;
  tolerancia: number;
  conforme: boolean;
}

export interface VerificacionMetodo {
  id: string;
  metodo_id: string;
  fecha_verificacion: Date;
  verificador_id: string;
  resultados: ResultadoVerificacionMetodo[];
  conclusion: string;
}

export interface ResultadoVerificacionMetodo {
  muestra: string;
  resultado: number;
  incertidumbre: number;
  conforme: boolean;
}

export interface PasoProcedimiento {
  orden: number;
  descripcion: string;
  duracion: number; // minutos
  equipos: string[];
  reactivos: string[];
  observaciones: string;
}

export interface CriterioAceptacion {
  parametro: string;
  valor_minimo?: number;
  valor_maximo?: number;
  unidad: string;
  tolerancia: number;
}

export interface EvaluacionIncertidumbre {
  id: string;
  metodo_id: string;
  fuentes_incertidumbre: FuenteIncertidumbre[];
  incertidumbre_combinada: number;
  factor_cobertura: number;
  incertidumbre_expandida: number;
  fecha_evaluacion: Date;
  evaluado_por: string;
}

export interface FuenteIncertidumbre {
  fuente: string;
  tipo: 'A' | 'B';
  valor: number;
  distribucion: 'Normal' | 'Rectangular' | 'Triangular';
  contribucion: number;
}
