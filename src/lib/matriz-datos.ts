
/**
 * @interface TipoProducto
 * @description Defines the structure for a product type, including its properties and specifications
 * as defined in the product matrix. This is a central interface for product data across the app.
 */
export interface TipoProducto {
  producto: string;
  material: 'PE100' | 'PP' | 'PP-RCT/FV' | 'PEAD' | 'PPR' | 'PP-R' | 'PPR-CT' | 'PPR-CT/FV' | 'PP-RCT' | 'PP-R(R3)' | 'PP-H' | 'PVDF' | 'PE-RT' | 'PP-RCT/FV/BOX' | 'PP-R100/CACO3';
  diametro_nominal: number | null;
  presion_nominal: string;
  sdr: string;
  diametro_min: number | null;
  diametro_max: number | null;
  espesor_min_norma: number | null;
  espesor_max_norma: number | null;
  ovalidad_norma: number | null;
  peso_min_teorico: number | null;
  peso_max_teorico: number | null;
  presion_phi: number | null;
  temperatura_phi: number | null;
  tiempo_phi: number | null;
  color_tuberia?: string;
  color_linea?: string;
  code?: string;
  linea?: string;
  largo?: number | null;
}
