export interface TipoProducto {
  producto: string;
  material: 'PE100' | 'PP' | 'PP-RCT/FV';
  diametro_nominal: number;
  presion_nominal: string;
  sdr: string;
  diametro_min: number;
  diametro_max: number;
  espesor_min_norma: number;
  espesor_max_norma: number;
  ovalidad_norma: number | null;
  peso_min_teorico: number;
  peso_max_teorico: number;
  presion_phi: number | null;
  temperatura_phi: number | null;
  tiempo_phi: number | null;
}

export const matrizProductos: TipoProducto[] = [
  // Ejemplo de datos basados en las imágenes - expandir con todos los productos
  {
    producto: "Tuberia PEAD 20 mm PN10",
    material: "PE100",
    diametro_nominal: 20,
    presion_nominal: "PN10",
    sdr: "SDR 17",
    diametro_min: 20.0,
    diametro_max: 20.3,
    espesor_min_norma: 2.0,
    espesor_max_norma: 2.4,
    ovalidad_norma: 1.2,
    peso_min_teorico: 0.101,
    peso_max_teorico: 0.129,
    presion_phi: 35,
    temperatura_phi: 80,
    tiempo_phi: 165
  },
  {
    producto: "Tuberia PEAD 25 mm PN10",
    material: "PE100",
    diametro_nominal: 25,
    presion_nominal: "PN10",
    sdr: "SDR 17",
    diametro_min: 25.0,
    diametro_max: 25.3,
    espesor_min_norma: 2.0,
    espesor_max_norma: 2.4,
    ovalidad_norma: 1.2,
    peso_min_teorico: 0.128,
    peso_max_teorico: 0.163,
    presion_phi: 35,
    temperatura_phi: 80,
    tiempo_phi: 165
  },
   {
    producto: "Tuberia PEAD 32 mm PN10",
    material: "PE100",
    diametro_nominal: 32,
    presion_nominal: "PN10",
    sdr: "SDR 17",
    diametro_min: 32.0,
    diametro_max: 32.3,
    espesor_min_norma: 2.0,
    espesor_max_norma: 2.4,
    ovalidad_norma: 1.3,
    peso_min_teorico: 0.167,
    peso_max_teorico: 0.212,
    presion_phi: 35,
    temperatura_phi: 80,
    tiempo_phi: 165
  },
   {
    producto: "Tuberia FASER BETA-FIBRA 20 mm PN20",
    material: "PP-RCT/FV",
    diametro_nominal: 20,
    presion_nominal: "PN20",
    sdr: "SDR 7,4",
    diametro_min: 20.0,
    diametro_max: 20.3,
    espesor_min_norma: 2.8,
    espesor_max_norma: 3.2,
    ovalidad_norma: null,
    peso_min_teorico: 0.155,
    peso_max_teorico: 0.180,
    presion_phi: 53,
    temperatura_phi: 95,
    tiempo_phi: 22
  },
  {
    producto: "Tuberia FASER AQUA-FIBRA 20 mm PN20",
    material: "PP-RCT/FV",
    diametro_nominal: 20,
    presion_nominal: "PN20",
    sdr: "SDR 7,4",
    diametro_min: 20.0,
    diametro_max: 20.3,
    espesor_min_norma: 2.8,
    espesor_max_norma: 3.2,
    ovalidad_norma: null,
    peso_min_teorico: 0.155,
    peso_max_teorico: 0.180,
    presion_phi: 53,
    temperatura_phi: 95,
    tiempo_phi: 22
  },
  // ... Añadir todos los demás productos de la tabla matriz aquí
];
