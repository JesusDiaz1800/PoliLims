/**
 * Servicio para manejar operaciones del dashboard con el backend Django
 */

import { apiClient, validateResponse, buildQueryParams } from '@/lib/api-client';
import { API_CONFIG } from '@/lib/api-config';

// Interfaces para las respuestas del dashboard
export interface DashboardStats {
  total_ensayos: number;
  ensayos_pendientes: number;
  ensayos_completados: number;
  ensayos_rechazados: number;
  total_equipos: number;
  equipos_activos: number;
  equipos_mantenimiento: number;
  total_proveedores: number;
  proveedores_activos: number;
  no_conformidades_abiertas: number;
  no_conformidades_cerradas: number;
  porcentaje_aprobacion: number;
  tiempo_promedio_ensayos: number;
}

export interface DashboardMetrics {
  ensayos_por_mes: Array<{
    mes: string;
    cantidad: number;
    tipo: string;
  }>;
  ensayos_por_tipo: Array<{
    tipo: string;
    cantidad: number;
    porcentaje: number;
  }>;
  ensayos_por_analista: Array<{
    analista: string;
    cantidad: number;
    porcentaje: number;
  }>;
  equipos_por_estado: Array<{
    estado: string;
    cantidad: number;
    porcentaje: number;
  }>;
  calibraciones_proximas: Array<{
    equipo: string;
    fecha_vencimiento: string;
    dias_restantes: number;
  }>;
  mantenimientos_pendientes: Array<{
    equipo: string;
    tipo: string;
    fecha_programada: string;
    responsable: string;
  }>;
  no_conformidades_por_tipo: Array<{
    tipo: string;
    cantidad: number;
    porcentaje: number;
  }>;
  tendencias_rendimiento: Array<{
    fecha: string;
    ensayos_recibidos: number;
    ensayos_completados: number;
    tiempo_promedio: number;
  }>;
}

export interface RecentActivity {
  id: number;
  tipo: 'ensayo' | 'equipo' | 'proveedor' | 'no_conformidad' | 'calibracion' | 'mantenimiento';
  accion: 'creado' | 'actualizado' | 'eliminado' | 'aprobado' | 'rechazado' | 'completado';
  descripcion: string;
  usuario: string;
  fecha: string;
  entidad_id: number;
  entidad_nombre: string;
  detalles?: Record<string, any>;
}

export interface DashboardFilters {
  fecha_inicio?: string;
  fecha_fin?: string;
  analista?: string;
  tipo_ensayo?: string;
  estado_ensayo?: string;
  tipo_equipo?: string;
  estado_equipo?: string;
  proveedor?: string;
  severidad_no_conformidad?: string;
}

// Servicio del Dashboard
export class DashboardService {
  // Obtener estadísticas generales del dashboard
  static async getStats(filters?: DashboardFilters): Promise<DashboardStats> {
    const queryParams = buildQueryParams(filters || {});
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.STATS}${queryParams ? `?${queryParams}` : ''}`;
    
    const response = await apiClient.get<DashboardStats>(endpoint);
    return validateResponse(response);
  }

  // Obtener métricas detalladas del dashboard
  static async getMetrics(filters?: DashboardFilters): Promise<DashboardMetrics> {
    const queryParams = buildQueryParams(filters || {});
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.METRICS}${queryParams ? `?${queryParams}` : ''}`;
    
    const response = await apiClient.get<DashboardMetrics>(endpoint);
    return validateResponse(response);
  }

  // Obtener actividad reciente
  static async getRecentActivity(params?: {
    page?: number;
    page_size?: number;
    tipo?: string;
    usuario?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
  }): Promise<{
    count: number;
    next: string | null;
    previous: string | null;
    results: RecentActivity[];
  }> {
    const queryParams = buildQueryParams(params || {});
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.RECENT_ACTIVITY}${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.getPaginated<RecentActivity>(endpoint);
  }

  // Obtener resumen ejecutivo
  static async getResumenEjecutivo(fechaInicio?: string, fechaFin?: string) {
    const params: Record<string, any> = {};
    if (fechaInicio) params.fecha_inicio = fechaInicio;
    if (fechaFin) params.fecha_fin = fechaFin;
    
    const queryParams = buildQueryParams(params);
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.STATS}resumen-ejecutivo/${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.get(endpoint);
  }

  // Obtener alertas y notificaciones
  static async getAlertas(params?: {
    tipo?: 'equipo' | 'ensayo' | 'proveedor' | 'calibracion' | 'mantenimiento';
    severidad?: 'baja' | 'media' | 'alta' | 'critica';
    fecha_inicio?: string;
    fecha_fin?: string;
  }) {
    const queryParams = buildQueryParams(params || {});
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.STATS}alertas/${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.get(endpoint);
  }

  // Obtener KPIs principales
  static async getKPIs(fechaInicio?: string, fechaFin?: string) {
    const params: Record<string, any> = {};
    if (fechaInicio) params.fecha_inicio = fechaInicio;
    if (fechaFin) params.fecha_fin = fechaFin;
    
    const queryParams = buildQueryParams(params);
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.STATS}kpis/${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.get(endpoint);
  }

  // Obtener tendencias de rendimiento
  static async getTendenciasRendimiento(periodo: 'diario' | 'semanal' | 'mensual' | 'anual', fechaInicio?: string, fechaFin?: string) {
    const params: Record<string, any> = { periodo };
    if (fechaInicio) params.fecha_inicio = fechaInicio;
    if (fechaFin) params.fecha_fin = fechaFin;
    
    const queryParams = buildQueryParams(params);
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.METRICS}tendencias/${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.get(endpoint);
  }

  // Obtener análisis de calidad
  static async getAnalisisCalidad(fechaInicio?: string, fechaFin?: string) {
    const params: Record<string, any> = {};
    if (fechaInicio) params.fecha_inicio = fechaInicio;
    if (fechaFin) params.fecha_fin = fechaFin;
    
    const queryParams = buildQueryParams(params);
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.METRICS}calidad/${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.get(endpoint);
  }

  // Obtener métricas de equipos
  static async getMetricasEquipos(fechaInicio?: string, fechaFin?: string) {
    const params: Record<string, any> = {};
    if (fechaInicio) params.fecha_inicio = fechaInicio;
    if (fechaFin) params.fecha_fin = fechaFin;
    
    const queryParams = buildQueryParams(params);
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.METRICS}equipos/${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.get(endpoint);
  }

  // Obtener métricas de proveedores
  static async getMetricasProveedores(fechaInicio?: string, fechaFin?: string) {
    const params: Record<string, any> = {};
    if (fechaInicio) params.fecha_inicio = fechaInicio;
    if (fechaFin) params.fecha_fin = fechaFin;
    
    const queryParams = buildQueryParams(params);
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.METRICS}proveedores/${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.get(endpoint);
  }

  // Obtener distribución de carga de trabajo
  static async getDistribucionCargaTrabajo(fechaInicio?: string, fechaFin?: string) {
    const params: Record<string, any> = {};
    if (fechaInicio) params.fecha_inicio = fechaInicio;
    if (fechaFin) params.fecha_fin = fechaFin;
    
    const queryParams = buildQueryParams(params);
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.METRICS}carga-trabajo/${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.get(endpoint);
  }

  // Obtener eficiencia operacional
  static async getEficienciaOperacional(fechaInicio?: string, fechaFin?: string) {
    const params: Record<string, any> = {};
    if (fechaInicio) params.fecha_inicio = fechaInicio;
    if (fechaFin) params.fecha_fin = fechaFin;
    
    const queryParams = buildQueryParams(params);
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.METRICS}eficiencia/${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.get(endpoint);
  }

  // Obtener indicadores de calidad
  static async getIndicadoresCalidad(fechaInicio?: string, fechaFin?: string) {
    const params: Record<string, any> = {};
    if (fechaInicio) params.fecha_inicio = fechaInicio;
    if (fechaFin) params.fecha_fin = fechaFin;
    
    const queryParams = buildQueryParams(params);
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.METRICS}indicadores-calidad/${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.get(endpoint);
  }

  // Obtener análisis de costos
  static async getAnalisisCostos(fechaInicio?: string, fechaFin?: string) {
    const params: Record<string, any> = {};
    if (fechaInicio) params.fecha_inicio = fechaInicio;
    if (fechaFin) params.fecha_fin = fechaFin;
    
    const queryParams = buildQueryParams(params);
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.METRICS}costos/${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.get(endpoint);
  }

  // Obtener comparativas temporales
  static async getComparativasTemporales(periodo: 'diario' | 'semanal' | 'mensual' | 'anual', fechaInicio?: string, fechaFin?: string) {
    const params: Record<string, any> = { periodo };
    if (fechaInicio) params.fecha_inicio = fechaInicio;
    if (fechaFin) params.fecha_fin = fechaFin;
    
    const queryParams = buildQueryParams(params);
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.METRICS}comparativas/${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.get(endpoint);
  }

  // Obtener predicciones y forecasting
  static async getPredicciones(horizonte: number = 30, tipo: 'ensayos' | 'equipos' | 'costos' = 'ensayos') {
    const params = { horizonte, tipo };
    const queryParams = buildQueryParams(params);
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.METRICS}predicciones/${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.get(endpoint);
  }

  // Obtener reporte de cumplimiento
  static async getReporteCumplimiento(fechaInicio?: string, fechaFin?: string) {
    const params: Record<string, any> = {};
    if (fechaInicio) params.fecha_inicio = fechaInicio;
    if (fechaFin) params.fecha_fin = fechaFin;
    
    const queryParams = buildQueryParams(params);
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.METRICS}cumplimiento/${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.get(endpoint);
  }

  // Obtener métricas de satisfacción
  static async getMetricasSatisfaccion(fechaInicio?: string, fechaFin?: string) {
    const params: Record<string, any> = {};
    if (fechaInicio) params.fecha_inicio = fechaInicio;
    if (fechaFin) params.fecha_fin = fechaFin;
    
    const queryParams = buildQueryParams(params);
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.METRICS}satisfaccion/${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.get(endpoint);
  }

  // Exportar dashboard
  static async exportarDashboard(format: 'excel' | 'pdf' | 'csv', tipo: 'completo' | 'resumen' | 'kpis' = 'completo', filters?: DashboardFilters) {
    const params = { formato: format, tipo, ...filters };
    const queryParams = buildQueryParams(params);
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.STATS}exportar/${queryParams ? `?${queryParams}` : ''}`;
    
    const filename = `dashboard_${tipo}_${new Date().toISOString().split('T')[0]}.${format}`;
    await apiClient.downloadFile(endpoint, filename);
  }

  // Obtener configuración del dashboard
  static async getConfiguracionDashboard() {
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.STATS}configuracion/`;
    return await apiClient.get(endpoint);
  }

  // Actualizar configuración del dashboard
  static async updateConfiguracionDashboard(config: {
    widgets_visibles: string[];
    orden_widgets: string[];
    filtros_por_defecto: DashboardFilters;
    actualizacion_automatica: boolean;
    intervalo_actualizacion: number;
  }) {
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.STATS}configuracion/`;
    const response = await apiClient.patch(endpoint, config);
    return validateResponse(response);
  }

  // Obtener widgets personalizados
  static async getWidgetsPersonalizados() {
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.METRICS}widgets-personalizados/`;
    return await apiClient.get(endpoint);
  }

  // Crear widget personalizado
  static async createWidgetPersonalizado(data: {
    nombre: string;
    tipo: string;
    configuracion: Record<string, any>;
    filtros: DashboardFilters;
  }) {
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.METRICS}widgets-personalizados/`;
    const response = await apiClient.post(endpoint, data);
    return validateResponse(response);
  }

  // Actualizar widget personalizado
  static async updateWidgetPersonalizado(id: number, data: {
    nombre?: string;
    configuracion?: Record<string, any>;
    filtros?: DashboardFilters;
  }) {
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.METRICS}widgets-personalizados/${id}/`;
    const response = await apiClient.patch(endpoint, data);
    return validateResponse(response);
  }

  // Eliminar widget personalizado
  static async deleteWidgetPersonalizado(id: number) {
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.METRICS}widgets-personalizados/${id}/`;
    await apiClient.delete(endpoint);
  }

  // Obtener datos en tiempo real
  static async getDatosTiempoReal() {
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.STATS}tiempo-real/`;
    return await apiClient.get(endpoint);
  }

  // Suscribirse a actualizaciones en tiempo real
  static async suscribirseActualizacionesTiempoReal(callback: (data: any) => void) {
    // Implementación de WebSocket o Server-Sent Events
    const endpoint = `${API_CONFIG.ENDPOINTS.DASHBOARD.STATS}stream/`;
    
    // Por ahora, usamos polling
    const pollData = async () => {
      try {
        const data = await this.getDatosTiempoReal();
        callback(data);
      } catch (error) {
        console.error('Error en actualización en tiempo real:', error);
      }
    };

    // Polling cada 30 segundos
    const interval = setInterval(pollData, 30000);
    
    // Retornar función para cancelar suscripción
    return () => clearInterval(interval);
  }
}

// Exportar instancia del servicio
export const dashboardService = new DashboardService();
