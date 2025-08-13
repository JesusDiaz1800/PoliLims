
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

export const matrizProductos: TipoProducto[] = [
    { producto: 'Tubería HDPE 63mm PN-10 SDR-17', material: 'PE100', diametro_nominal: 63, presion_nominal: 'PN-10', sdr: 'SDR-17', diametro_min: 63.0, diametro_max: 63.4, espesor_min_norma: 3.8, espesor_max_norma: 4.3, ovalidad_norma: 1.5, peso_min_teorico: 0.707, peso_max_teorico: null, presion_phi: 35, temperatura_phi: 80, tiempo_phi: 165, color_tuberia: 'Negro', color_linea: 'Azul', code: '110020631710' },
    { producto: 'Tubería HDPE 75mm PN-10 SDR-17', material: 'PE100', diametro_nominal: 75, presion_nominal: 'PN-10', sdr: 'SDR-17', diametro_min: 75.0, diametro_max: 75.5, espesor_min_norma: 4.5, espesor_max_norma: 5.1, ovalidad_norma: 1.5, peso_min_teorico: 1.000, peso_max_teorico: null, presion_phi: 35, temperatura_phi: 80, tiempo_phi: 165, color_tuberia: 'Negro', color_linea: 'Azul', code: '110020751710' },
    { producto: 'Tubería HDPE 90mm PN-16 SDR-11', material: 'PE100', diametro_nominal: 90, presion_nominal: 'PN-16', sdr: 'SDR-11', diametro_min: 90.0, diametro_max: 90.6, espesor_min_norma: 8.2, espesor_max_norma: 9.1, ovalidad_norma: 1.8, peso_min_teorico: 2.170, peso_max_teorico: null, presion_phi: 40, temperatura_phi: 80, tiempo_phi: 165, color_tuberia: 'Negro', color_linea: 'Azul', code: '110020901116' },
    { producto: 'Tubería PP-R 20mm PN-20', material: 'PP-R', diametro_nominal: 20, presion_nominal: 'PN-20', sdr: 'SDR-6', diametro_min: 20.0, diametro_max: 20.3, espesor_min_norma: 3.4, espesor_max_norma: 3.9, ovalidad_norma: null, peso_min_teorico: null, peso_max_teorico: null, presion_phi: 51.5, temperatura_phi: 95, tiempo_phi: 22, color_tuberia: 'Verde', color_linea: 'Roja', code: '110130200620' },
    { producto: 'Tubería PP-R 25mm PN-20', material: 'PP-R', diametro_nominal: 25, presion_nominal: 'PN-20', sdr: 'SDR-6', diametro_min: 25.0, diametro_max: 25.3, espesor_min_norma: 4.2, espesor_max_norma: 4.8, ovalidad_norma: null, peso_min_teorico: null, peso_max_teorico: null, presion_phi: 51.5, temperatura_phi: 95, tiempo_phi: 22, color_tuberia: 'Verde', color_linea: 'Roja', code: '110130250620' },
];

export async function getMatrizProductos(): Promise<TipoProducto[]> {
    return Promise.resolve(matrizProductos);
}
