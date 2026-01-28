/**
 * Servicio para manejar operaciones de ensayos con el backend Django
 */

import { apiClient, validateResponse, buildQueryParams, formatDateForApi } from '@/lib/api-client';
import { API_CONFIG } from '@/lib/api-config';
import type { Ensayo, Muestra, ResultadoEnsayo, HistorialEnsayo } from '@/context/data-context';

// Interfaces específicas para la API
export interface EnsayoCreateData {
  tipo: string;
  analista: string;
  fecha_inicio: string;
  fecha_fin?: string;
  estado: string;
  muestra: number;
  observaciones?: string;
  parametros_especificos?: Record<string, any>;
}

export interface EnsayoUpdateData extends Partial<EnsayoCreateData> {
  id: number;
}

export interface MuestraCreateData {
  codigo: string;
  tipo_material: string;
  proveedor: string;
  fecha_recepcion: string;
  cantidad: number;
  unidad: string;
  estado: string;
  observaciones?: string;
}

export interface ResultadoEnsayoCreateData {
  ensayo: number;
  parametro: string;
  valor: number;
  unidad: string;
  metodo_ensayo: string;
  fecha_medicion: string;
  observaciones?: string;
}

// Servicio de Ensayos
export class EnsayosService {
  // Obtener lista de ensayos con paginación y filtros
  static async getEnsayos(params?: {
    page?: number;
    page_size?: number;
    tipo?: string;
    analista?: string;
    estado?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
    search?: string;
  }) {
    const queryParams = buildQueryParams(params || {});
    const endpoint = `${API_CONFIG.ENDPOINTS.ENSAYOS.LIST}${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.getPaginated<Ensayo>(endpoint);
  }

  // Obtener un ensayo específico
  static async getEnsayo(id: number): Promise<Ensayo> {
    const response = await apiClient.get<Ensayo>(API_CONFIG.ENDPOINTS.ENSAYOS.DETAIL(id.toString()));
    return validateResponse(response);
  }

  // Crear un nuevo ensayo
  static async createEnsayo(data: EnsayoCreateData): Promise<Ensayo> {
    const response = await apiClient.post<Ensayo>(API_CONFIG.ENDPOINTS.ENSAYOS.CREATE, data);
    return validateResponse(response);
  }

  // Actualizar un ensayo
  static async updateEnsayo(id: number, data: Partial<EnsayoCreateData>): Promise<Ensayo> {
    const response = await apiClient.patch<Ensayo>(API_CONFIG.ENDPOINTS.ENSAYOS.UPDATE(id.toString()), data);
    return validateResponse(response);
  }

  // Eliminar un ensayo
  static async deleteEnsayo(id: number): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.ENSAYOS.DELETE(id.toString()));
  }

  // Aprobar un ensayo
  static async aprobarEnsayo(id: number, observaciones?: string): Promise<Ensayo> {
    const data = {
      estado: 'Aprobado',
      fecha_fin: formatDateForApi(new Date()),
      observaciones: observaciones || 'Ensayo aprobado automáticamente'
    };
    
    const response = await apiClient.patch<Ensayo>(API_CONFIG.ENDPOINTS.ENSAYOS.APROBAR(id.toString()), data);
    return validateResponse(response);
  }

  // Obtener muestras
  static async getMuestras(params?: {
    page?: number;
    page_size?: number;
    tipo_material?: string;
    proveedor?: string;
    estado?: string;
    search?: string;
  }) {
    const queryParams = buildQueryParams(params || {});
    const endpoint = `${API_CONFIG.ENDPOINTS.ENSAYOS.MUESTRAS}${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.getPaginated<Muestra>(endpoint);
  }

  // Obtener una muestra específica
  static async getMuestra(id: number): Promise<Muestra> {
    const response = await apiClient.get<Muestra>(`${API_CONFIG.ENDPOINTS.ENSAYOS.MUESTRAS}${id}/`);
    return validateResponse(response);
  }

  // Crear una nueva muestra
  static async createMuestra(data: MuestraCreateData): Promise<Muestra> {
    const response = await apiClient.post<Muestra>(API_CONFIG.ENDPOINTS.ENSAYOS.MUESTRAS, data);
    return validateResponse(response);
  }

  // Actualizar una muestra
  static async updateMuestra(id: number, data: Partial<MuestraCreateData>): Promise<Muestra> {
    const response = await apiClient.patch<Muestra>(`${API_CONFIG.ENDPOINTS.ENSAYOS.MUESTRAS}${id}/`, data);
    return validateResponse(response);
  }

  // Eliminar una muestra
  static async deleteMuestra(id: number): Promise<void> {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.ENSAYOS.MUESTRAS}${id}/`);
  }

  // Obtener resultados de ensayo
  static async getResultadosEnsayo(ensayoId: number): Promise<ResultadoEnsayo[]> {
    const response = await apiClient.get<ResultadoEnsayo[]>(`${API_CONFIG.ENDPOINTS.ENSAYOS.RESULTADOS}?ensayo=${ensayoId}`);
    return validateResponse(response);
  }

  // Crear resultado de ensayo
  static async createResultadoEnsayo(data: ResultadoEnsayoCreateData): Promise<ResultadoEnsayo> {
    const response = await apiClient.post<ResultadoEnsayo>(API_CONFIG.ENDPOINTS.ENSAYOS.RESULTADOS, data);
    return validateResponse(response);
  }

  // Actualizar resultado de ensayo
  static async updateResultadoEnsayo(id: number, data: Partial<ResultadoEnsayoCreateData>): Promise<ResultadoEnsayo> {
    const response = await apiClient.patch<ResultadoEnsayo>(`${API_CONFIG.ENDPOINTS.ENSAYOS.RESULTADOS}${id}/`, data);
    return validateResponse(response);
  }

  // Eliminar resultado de ensayo
  static async deleteResultadoEnsayo(id: number): Promise<void> {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.ENSAYOS.RESULTADOS}${id}/`);
  }

  // Obtener historial de ensayo
  static async getHistorialEnsayo(ensayoId: number): Promise<HistorialEnsayo[]> {
    const response = await apiClient.get<HistorialEnsayo[]>(API_CONFIG.ENDPOINTS.ENSAYOS.HISTORIAL(ensayoId.toString()));
    return validateResponse(response);
  }

  // Obtener estadísticas de ensayos
  static async getEstadisticasEnsayos(fechaInicio?: string, fechaFin?: string) {
    const params: Record<string, any> = {};
    if (fechaInicio) params.fecha_inicio = fechaInicio;
    if (fechaFin) params.fecha_fin = fechaFin;
    
    const queryParams = buildQueryParams(params);
    const endpoint = `${API_CONFIG.ENDPOINTS.ENSAYOS.LIST}estadisticas/${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.get(endpoint);
  }

  // Obtener ensayos por tipo
  static async getEnsayosPorTipo(tipo: string, params?: {
    page?: number;
    page_size?: number;
    fecha_inicio?: string;
    fecha_fin?: string;
  }) {
    const queryParams = buildQueryParams({ tipo, ...params });
    const endpoint = `${API_CONFIG.ENDPOINTS.ENSAYOS.LIST}${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.getPaginated<Ensayo>(endpoint);
  }

  // Obtener ensayos por analista
  static async getEnsayosPorAnalista(analista: string, params?: {
    page?: number;
    page_size?: number;
    fecha_inicio?: string;
    fecha_fin?: string;
  }) {
    const queryParams = buildQueryParams({ analista, ...params });
    const endpoint = `${API_CONFIG.ENDPOINTS.ENSAYOS.LIST}${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.getPaginated<Ensayo>(endpoint);
  }

  // Obtener ensayos pendientes
  static async getEnsayosPendientes(params?: {
    page?: number;
    page_size?: number;
    analista?: string;
  }) {
    const queryParams = buildQueryParams({ estado: 'En Progreso', ...params });
    const endpoint = `${API_CONFIG.ENDPOINTS.ENSAYOS.LIST}${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.getPaginated<Ensayo>(endpoint);
  }

  // Obtener ensayos completados
  static async getEnsayosCompletados(params?: {
    page?: number;
    page_size?: number;
    fecha_inicio?: string;
    fecha_fin?: string;
    analista?: string;
  }) {
    const queryParams = buildQueryParams({ estado: 'Aprobado', ...params });
    const endpoint = `${API_CONFIG.ENDPOINTS.ENSAYOS.LIST}${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.getPaginated<Ensayo>(endpoint);
  }

  // Buscar ensayos
  static async buscarEnsayos(query: string, params?: {
    page?: number;
    page_size?: number;
    tipo?: string;
    analista?: string;
  }) {
    const queryParams = buildQueryParams({ search: query, ...params });
    const endpoint = `${API_CONFIG.ENDPOINTS.ENSAYOS.LIST}${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.getPaginated<Ensayo>(endpoint);
  }

  // Exportar ensayos
  static async exportarEnsayos(format: 'excel' | 'pdf' | 'csv', params?: {
    tipo?: string;
    analista?: string;
    estado?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
  }) {
    const queryParams = buildQueryParams({ formato: format, ...params });
    const endpoint = `${API_CONFIG.ENDPOINTS.ENSAYOS.LIST}exportar/${queryParams ? `?${queryParams}` : ''}`;
    
    const filename = `ensayos_${new Date().toISOString().split('T')[0]}.${format}`;
    await apiClient.downloadFile(endpoint, filename);
  }

  // Obtener métricas de rendimiento
  static async getMetricasRendimiento(fechaInicio?: string, fechaFin?: string) {
    const params: Record<string, any> = {};
    if (fechaInicio) params.fecha_inicio = fechaInicio;
    if (fechaFin) params.fecha_fin = fechaFin;
    
    const queryParams = buildQueryParams(params);
    const endpoint = `${API_CONFIG.ENDPOINTS.ENSAYOS.LIST}metricas/${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.get(endpoint);
  }

  // Obtener tendencias de ensayos
  static async getTendenciasEnsayos(periodo: 'diario' | 'semanal' | 'mensual' | 'anual', fechaInicio?: string, fechaFin?: string) {
    const params: Record<string, any> = { periodo };
    if (fechaInicio) params.fecha_inicio = fechaInicio;
    if (fechaFin) params.fecha_fin = fechaFin;
    
    const queryParams = buildQueryParams(params);
    const endpoint = `${API_CONFIG.ENDPOINTS.ENSAYOS.LIST}tendencias/${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.get(endpoint);
  }

  // Obtener análisis de calidad
  static async getAnalisisCalidad(fechaInicio?: string, fechaFin?: string) {
    const params: Record<string, any> = {};
    if (fechaInicio) params.fecha_inicio = fechaInicio;
    if (fechaFin) params.fecha_fin = fechaFin;
    
    const queryParams = buildQueryParams(params);
    const endpoint = `${API_CONFIG.ENDPOINTS.ENSAYOS.LIST}calidad/${queryParams ? `?${queryParams}` : ''}`;
    
    return await apiClient.get(endpoint);
  }
}

// Exportar instancia del servicio
export const ensayosService = new EnsayosService();
