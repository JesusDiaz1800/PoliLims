/**
 * Servicio para manejar operaciones de equipos con el backend Django
 */

import { apiClient, validateResponse, buildQueryParams, formatDateForApi } from '@/lib/api-client';
import { API_CONFIG } from '@/lib/api-config';
import type { Equipo, Calibracion, Mantenimiento, ControlEvento } from '@/context/data-context';

// Interfaces específicas para la API
export interface EquipoCreateData {
  codigo: string;
  nombre: string;
  tipo: string;
  marca: string;
  modelo: string;
  serie: string;
  ubicacion: string;
  estado: string;
  fecha_adquisicion: string;
  fecha_ultima_calibracion?: string;
  fecha_proxima_calibracion?: string;
  responsable: string;
  observaciones?: string;
  especificaciones_tecnicas?: Record<string, any>;
}

export interface CalibracionCreateData {
  equipo: number;
  fecha_calibracion: string;
  fecha_vencimiento: string;
  tipo_calibracion: string;
  laboratorio: string;
  certificado: string;
  resultado: string;
  observaciones?: string;
  costo?: number;
}

export interface MantenimientoCreateData {
  equipo: number;
  tipo: string;
  fecha_programada: string;
  fecha_realizacion?: string;
  descripcion: string;
  responsable: string;
  estado: string;
  costo?: number;
  observaciones?: string;
}

export interface ControlEventoCreateData {
  equipo: number;
  tipo_evento: string;
  fecha_evento: string;
  descripcion: string;
  severidad: string;
  accion_tomada?: string;
  responsable: string;
  estado: string;
}

// Servicio de Equipos
export class EquiposService {
  // Obtener lista de equipos con paginación y filtros
  static async getEquipos(params?: {
    page?: number;
    page_size?: number;
    tipo?: string;
    estado?: string;
    ubicacion?: string;
    responsable?: string;
    search?: string;
  }) {
    const queryParams = buildQueryParams(params || {});
    const endpoint = `${API_CONFIG.ENDPOINTS.EQUIPOS.LIST}${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.getPaginated<Equipo>(endpoint);
  }

  // Obtener un equipo específico
  static async getEquipo(id: number): Promise<Equipo> {
    const response = await apiClient.get<Equipo>(API_CONFIG.ENDPOINTS.EQUIPOS.DETAIL(id.toString()));
    return validateResponse(response);
  }

  // Crear un nuevo equipo
  static async createEquipo(data: EquipoCreateData): Promise<Equipo> {
    const response = await apiClient.post<Equipo>(API_CONFIG.ENDPOINTS.EQUIPOS.CREATE, data);
    return validateResponse(response);
  }

  // Actualizar un equipo
  static async updateEquipo(id: number, data: Partial<EquipoCreateData>): Promise<Equipo> {
    const response = await apiClient.patch<Equipo>(API_CONFIG.ENDPOINTS.EQUIPOS.UPDATE(id.toString()), data);
    return validateResponse(response);
  }

  // Eliminar un equipo
  static async deleteEquipo(id: number): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.EQUIPOS.DELETE(id.toString()));
  }

  // Obtener calibraciones
  static async getCalibraciones(params?: {
    page?: number;
    page_size?: number;
    equipo?: number;
    tipo_calibracion?: string;
    resultado?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
  }) {
    const queryParams = buildQueryParams(params || {});
    const endpoint = `${API_CONFIG.ENDPOINTS.EQUIPOS.CALIBRACIONES}${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.getPaginated<Calibracion>(endpoint);
  }

  // Obtener una calibración específica
  static async getCalibracion(id: number): Promise<Calibracion> {
    const response = await apiClient.get<Calibracion>(`${API_CONFIG.ENDPOINTS.EQUIPOS.CALIBRACIONES}${id}/`);
    return validateResponse(response);
  }

  // Crear una nueva calibración
  static async createCalibracion(data: CalibracionCreateData): Promise<Calibracion> {
    const response = await apiClient.post<Calibracion>(API_CONFIG.ENDPOINTS.EQUIPOS.CALIBRACIONES, data);
    return validateResponse(response);
  }

  // Actualizar una calibración
  static async updateCalibracion(id: number, data: Partial<CalibracionCreateData>): Promise<Calibracion> {
    const response = await apiClient.patch<Calibracion>(`${API_CONFIG.ENDPOINTS.EQUIPOS.CALIBRACIONES}${id}/`, data);
    return validateResponse(response);
  }

  // Eliminar una calibración
  static async deleteCalibracion(id: number): Promise<void> {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.EQUIPOS.CALIBRACIONES}${id}/`);
  }

  // Obtener mantenimientos
  static async getMantenimientos(params?: {
    page?: number;
    page_size?: number;
    equipo?: number;
    tipo?: string;
    estado?: string;
    responsable?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
  }) {
    const queryParams = buildQueryParams(params || {});
    const endpoint = `${API_CONFIG.ENDPOINTS.EQUIPOS.MANTENIMIENTOS}${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.getPaginated<Mantenimiento>(endpoint);
  }

  // Obtener un mantenimiento específico
  static async getMantenimiento(id: number): Promise<Mantenimiento> {
    const response = await apiClient.get<Mantenimiento>(`${API_CONFIG.ENDPOINTS.EQUIPOS.MANTENIMIENTOS}${id}/`);
    return validateResponse(response);
  }

  // Crear un nuevo mantenimiento
  static async createMantenimiento(data: MantenimientoCreateData): Promise<Mantenimiento> {
    const response = await apiClient.post<Mantenimiento>(API_CONFIG.ENDPOINTS.EQUIPOS.MANTENIMIENTOS, data);
    return validateResponse(response);
  }

  // Actualizar un mantenimiento
  static async updateMantenimiento(id: number, data: Partial<MantenimientoCreateData>): Promise<Mantenimiento> {
    const response = await apiClient.patch<Mantenimiento>(`${API_CONFIG.ENDPOINTS.EQUIPOS.MANTENIMIENTOS}${id}/`, data);
    return validateResponse(response);
  }

  // Eliminar un mantenimiento
  static async deleteMantenimiento(id: number): Promise<void> {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.EQUIPOS.MANTENIMIENTOS}${id}/`);
  }

  // Obtener eventos de control
  static async getControlEventos(params?: {
    page?: number;
    page_size?: number;
    equipo?: number;
    tipo_evento?: string;
    severidad?: string;
    estado?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
  }) {
    const queryParams = buildQueryParams(params || {});
    const endpoint = `${API_CONFIG.ENDPOINTS.EQUIPOS.EVENTOS}${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.getPaginated<ControlEvento>(endpoint);
  }

  // Obtener un evento de control específico
  static async getControlEvento(id: number): Promise<ControlEvento> {
    const response = await apiClient.get<ControlEvento>(`${API_CONFIG.ENDPOINTS.EQUIPOS.EVENTOS}${id}/`);
    return validateResponse(response);
  }

  // Crear un nuevo evento de control
  static async createControlEvento(data: ControlEventoCreateData): Promise<ControlEvento> {
    const response = await apiClient.post<ControlEvento>(API_CONFIG.ENDPOINTS.EQUIPOS.EVENTOS, data);
    return validateResponse(response);
  }

  // Actualizar un evento de control
  static async updateControlEvento(id: number, data: Partial<ControlEventoCreateData>): Promise<ControlEvento> {
    const response = await apiClient.patch<ControlEvento>(`${API_CONFIG.ENDPOINTS.EQUIPOS.EVENTOS}${id}/`, data);
    return validateResponse(response);
  }

  // Eliminar un evento de control
  static async deleteControlEvento(id: number): Promise<void> {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.EQUIPOS.EVENTOS}${id}/`);
  }

  // Obtener equipos por tipo
  static async getEquiposPorTipo(tipo: string, params?: {
    page?: number;
    page_size?: number;
    estado?: string;
  }) {
    const queryParams = buildQueryParams({ tipo, ...params });
    const endpoint = `${API_CONFIG.ENDPOINTS.EQUIPOS.LIST}${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.getPaginated<Equipo>(endpoint);
  }

  // Obtener equipos por estado
  static async getEquiposPorEstado(estado: string, params?: {
    page?: number;
    page_size?: number;
    tipo?: string;
  }) {
    const queryParams = buildQueryParams({ estado, ...params });
    const endpoint = `${API_CONFIG.ENDPOINTS.EQUIPOS.LIST}${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.getPaginated<Equipo>(endpoint);
  }

  // Obtener equipos activos
  static async getEquiposActivos(params?: {
    page?: number;
    page_size?: number;
    tipo?: string;
  }) {
    return this.getEquiposPorEstado('Activo', params);
  }

  // Obtener equipos inactivos
  static async getEquiposInactivos(params?: {
    page?: number;
    page_size?: number;
    tipo?: string;
  }) {
    return this.getEquiposPorEstado('Inactivo', params);
  }

  // Obtener equipos en mantenimiento
  static async getEquiposEnMantenimiento(params?: {
    page?: number;
    page_size?: number;
    tipo?: string;
  }) {
    return this.getEquiposPorEstado('En Mantenimiento', params);
  }

  // Obtener calibraciones vencidas
  static async getCalibracionesVencidas(params?: {
    page?: number;
    page_size?: number;
    equipo?: number;
  }) {
    const queryParams = buildQueryParams({ 
      fecha_vencimiento__lt: formatDateForApi(new Date()),
      ...params 
    });
    const endpoint = `${API_CONFIG.ENDPOINTS.EQUIPOS.CALIBRACIONES}${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.getPaginated<Calibracion>(endpoint);
  }

  // Obtener calibraciones próximas a vencer
  static async getCalibracionesProximasAVencer(dias: number = 30, params?: {
    page?: number;
    page_size?: number;
    equipo?: number;
  }) {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + dias);
    
    const queryParams = buildQueryParams({ 
      fecha_vencimiento__lte: formatDateForApi(fechaLimite),
      fecha_vencimiento__gte: formatDateForApi(new Date()),
      ...params 
    });
    const endpoint = `${API_CONFIG.ENDPOINTS.EQUIPOS.CALIBRACIONES}${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.getPaginated<Calibracion>(endpoint);
  }

  // Obtener mantenimientos pendientes
  static async getMantenimientosPendientes(params?: {
    page?: number;
    page_size?: number;
    equipo?: number;
    tipo?: string;
  }) {
    const queryParams = buildQueryParams({ 
      estado: 'Pendiente',
      fecha_programada__gte: formatDateForApi(new Date()),
      ...params 
    });
    const endpoint = `${API_CONFIG.ENDPOINTS.EQUIPOS.MANTENIMIENTOS}${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.getPaginated<Mantenimiento>(endpoint);
  }

  // Obtener mantenimientos vencidos
  static async getMantenimientosVencidos(params?: {
    page?: number;
    page_size?: number;
    equipo?: number;
    tipo?: string;
  }) {
    const queryParams = buildQueryParams({ 
      estado: 'Pendiente',
      fecha_programada__lt: formatDateForApi(new Date()),
      ...params 
    });
    const endpoint = `${API_CONFIG.ENDPOINTS.EQUIPOS.MANTENIMIENTOS}${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.getPaginated<Mantenimiento>(endpoint);
  }

  // Obtener eventos críticos
  static async getEventosCriticos(params?: {
    page?: number;
    page_size?: number;
    equipo?: number;
    fecha_inicio?: string;
    fecha_fin?: string;
  }) {
    const queryParams = buildQueryParams({ 
      severidad: 'Crítico',
      ...params 
    });
    const endpoint = `${API_CONFIG.ENDPOINTS.EQUIPOS.EVENTOS}${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.getPaginated<ControlEvento>(endpoint);
  }

  // Buscar equipos
  static async buscarEquipos(query: string, params?: {
    page?: number;
    page_size?: number;
    tipo?: string;
    estado?: string;
  }) {
    const queryParams = buildQueryParams({ search: query, ...params });
    const endpoint = `${API_CONFIG.ENDPOINTS.EQUIPOS.LIST}${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.getPaginated<Equipo>(endpoint);
  }

  // Obtener estadísticas de equipos
  static async getEstadisticasEquipos() {
    const endpoint = `${API_CONFIG.ENDPOINTS.EQUIPOS.LIST}estadisticas/`;
    return await apiClient.get(endpoint);
  }

  // Obtener programa de calibración
  static async getProgramaCalibracion(fechaInicio?: string, fechaFin?: string) {
    const params: Record<string, any> = {};
    if (fechaInicio) params.fecha_inicio = fechaInicio;
    if (fechaFin) params.fecha_fin = fechaFin;
    
    const queryParams = buildQueryParams(params);
    const endpoint = `${API_CONFIG.ENDPOINTS.EQUIPOS.CALIBRACIONES}programa/${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.get(endpoint);
  }

  // Obtener programa de mantenimiento
  static async getProgramaMantenimiento(fechaInicio?: string, fechaFin?: string) {
    const params: Record<string, any> = {};
    if (fechaInicio) params.fecha_inicio = fechaInicio;
    if (fechaFin) params.fecha_fin = fechaFin;
    
    const queryParams = buildQueryParams(params);
    const endpoint = `${API_CONFIG.ENDPOINTS.EQUIPOS.MANTENIMIENTOS}programa/${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.get(endpoint);
  }

  // Obtener historial de un equipo
  static async getHistorialEquipo(equipoId: number, params?: {
    page?: number;
    page_size?: number;
    tipo_actividad?: 'calibracion' | 'mantenimiento' | 'evento';
    fecha_inicio?: string;
    fecha_fin?: string;
  }) {
    const queryParams = buildQueryParams(params || {});
    const endpoint = `${API_CONFIG.ENDPOINTS.EQUIPOS.DETAIL(equipoId.toString())}historial/${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.get(endpoint);
  }

  // Exportar equipos
  static async exportarEquipos(format: 'excel' | 'pdf' | 'csv', params?: {
    tipo?: string;
    estado?: string;
    ubicacion?: string;
  }) {
    const queryParams = buildQueryParams({ formato: format, ...params });
    const endpoint = `${API_CONFIG.ENDPOINTS.EQUIPOS.LIST}exportar/${queryParams ? `?${queryParams}` : ''}`;
    
    const filename = `equipos_${new Date().toISOString().split('T')[0]}.${format}`;
    await apiClient.downloadFile(endpoint, filename);
  }

  // Exportar calibraciones
  static async exportarCalibraciones(format: 'excel' | 'pdf' | 'csv', params?: {
    equipo?: number;
    tipo_calibracion?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
  }) {
    const queryParams = buildQueryParams({ formato: format, ...params });
    const endpoint = `${API_CONFIG.ENDPOINTS.EQUIPOS.CALIBRACIONES}exportar/${queryParams ? `?${queryParams}` : ''}`;
    
    const filename = `calibraciones_${new Date().toISOString().split('T')[0]}.${format}`;
    await apiClient.downloadFile(endpoint, filename);
  }

  // Exportar mantenimientos
  static async exportarMantenimientos(format: 'excel' | 'pdf' | 'csv', params?: {
    equipo?: number;
    tipo?: string;
    estado?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
  }) {
    const queryParams = buildQueryParams({ formato: format, ...params });
    const endpoint = `${API_CONFIG.ENDPOINTS.EQUIPOS.MANTENIMIENTOS}exportar/${queryParams ? `?${queryParams}` : ''}`;
    
    const filename = `mantenimientos_${new Date().toISOString().split('T')[0]}.${format}`;
    await apiClient.downloadFile(endpoint, filename);
  }

  // Obtener métricas de disponibilidad
  static async getMetricasDisponibilidad(fechaInicio?: string, fechaFin?: string) {
    const params: Record<string, any> = {};
    if (fechaInicio) params.fecha_inicio = fechaInicio;
    if (fechaFin) params.fecha_fin = fechaFin;
    
    const queryParams = buildQueryParams(params);
    const endpoint = `${API_CONFIG.ENDPOINTS.EQUIPOS.LIST}disponibilidad/${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.get(endpoint);
  }

  // Obtener costos de mantenimiento
  static async getCostosMantenimiento(fechaInicio?: string, fechaFin?: string) {
    const params: Record<string, any> = {};
    if (fechaInicio) params.fecha_inicio = fechaInicio;
    if (fechaFin) params.fecha_fin = fechaFin;
    
    const queryParams = buildQueryParams(params);
    const endpoint = `${API_CONFIG.ENDPOINTS.EQUIPOS.MANTENIMIENTOS}costos/${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.get(endpoint);
  }
}

// Exportar instancia del servicio
export const equiposService = new EquiposService();
