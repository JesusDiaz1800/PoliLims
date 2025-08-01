

import Papa from 'papaparse';

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

// Cache for the parsed product matrix to avoid reloading and re-parsing.
let matrizProductos: TipoProducto[] = [];

const toNumberOrNull = (value: unknown): number | null => {
    if (value === null || value === undefined) return null;
    const s = String(value).replace(',', '.').trim();
    if (s === '') return null;
    const num = parseFloat(s);
    return isNaN(num) ? null : num;
};

const toNullableString = (value: unknown): string | undefined => {
    const s = String(value).trim();
    return s && s !== '' ? s : undefined;
}


/**
 * Fetches and parses the product data from a remote CSV file.
 * Caches the result to prevent re-fetching on subsequent calls.
 * This function is intended to be called from the client-side.
 */
export async function getMatrizProductos(): Promise<TipoProducto[]> {
    if (matrizProductos.length > 0) {
        return matrizProductos;
    }

    try {
        const response = await fetch('/data/productos.csv');
        if (!response.ok) {
            throw new Error(`Failed to fetch CSV: ${response.statusText}`);
        }
        const csvText = await response.text();
        
        const results = Papa.parse<any>(csvText, {
            header: true,
            skipEmptyLines: 'greedy',
            transformHeader: (header) => header.trim(),
        });
        
        if (results.errors.length > 0) {
            console.error("Errors parsing CSV:", results.errors);
        }

        const loadedProducts = results.data.map((row: any): TipoProducto | null => {
            if (!row['Producto'] || String(row['Producto']).trim() === '') {
                return null;
            }
            return {
                producto: row.Producto,
                material: row.Material,
                linea: toNullableString(row['Línea']),
                diametro_nominal: toNumberOrNull(row['D nominal (mm)']),
                largo: toNumberOrNull(row['Largo (m)']),
                presion_nominal: row['PN - Serie'],
                sdr: row['PN - Serie'], 
                diametro_min: toNumberOrNull(row['D mínimo (mm)']),
                diametro_max: toNumberOrNull(row['D máximo (mm)']),
                espesor_min_norma: toNumberOrNull(row['Espesor mínimo (mm)']),
                espesor_max_norma: toNumberOrNull(row['Espesor máximo (mm)']),
                ovalidad_norma: toNumberOrNull(row['Ovalidad (mm)']),
                peso_min_teorico: toNumberOrNull(row['Desv. Peso debajo']),
                peso_max_teorico: toNumberOrNull(row['Desv. Peso arriba']),
                presion_phi: toNumberOrNull(row['PHI 20°C (bar)']),
                temperatura_phi: toNumberOrNull(row['T Horno (°C)']),
                tiempo_phi: toNumberOrNull(row['Tiempo acond. (h)']),
                color_tuberia: toNullableString(row['Color Tubería']),
                color_linea: toNullableString(row['Color Línea']),
                code: String(row.Producto).replace(/\s+/g, '-').toUpperCase(),
            };
        }).filter((p): p is TipoProducto => p !== null);
        
        matrizProductos = loadedProducts; // Cache the result
        return matrizProductos;
    } catch (error) {
        console.error("Error fetching or parsing product CSV file:", error);
        return []; // Return empty on error
    }
}
