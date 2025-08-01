
import Papa from 'papaparse';

export interface TipoProducto {
  producto: string;
  material: 'PE100' | 'PP' | 'PP-RCT/FV' | 'PEAD' | 'PPR' | 'PP-R' | 'PPR-CT' | 'PPR-CT/FV' | 'PP-RCT' | 'PP-R(R3)' | 'PP-H';
  diametro_nominal: number;
  presion_nominal: string;
  sdr: string;
  diametro_min: number;
  diametro_max: number;
  espesor_min_norma: number;
  espesor_max_norma: number | null;
  ovalidad_norma: number | null;
  peso_min_teorico: number;
  peso_max_teorico: number;
  presion_phi: number | null;
  temperatura_phi: number | null;
  tiempo_phi: number | null;
  color_tuberia?: string;
  color_linea?: string;
  code?: string;
}

// Cache for the parsed product matrix to avoid reloading and re-parsing.
let matrizProductos: TipoProducto[] = [];

const toNumberOrNull = (value: string | number): number | null => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const cleanedValue = value.replace(',', '.').trim();
        if (cleanedValue === '') return null;
        const num = parseFloat(cleanedValue);
        return isNaN(num) ? null : num;
    }
    return null;
};

const toNullableString = (value: unknown): string | undefined => {
    if (typeof value !== 'string') {
        return undefined;
    }
    return value && value.trim() !== '' ? value.trim() : undefined;
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
            transform: (value, header) => {
                 // Replace comma with dot for decimal conversion in numeric columns
                const numericHeaders = [
                    'diametro_nominal', 'diametro_min', 'diametro_max', 
                    'espesor_min_norma', 'espesor_max_norma', 'ovalidad_norma',
                    'peso_min_teorico', 'peso_max_teorico', 'presion_phi',
                    'temperatura_phi', 'tiempo_phi'
                ];
                if (numericHeaders.includes(header as string)) {
                    return value.replace(',', '.');
                }
                return value;
            }
        });
        
        if (results.errors.length > 0) {
            console.error("Errors parsing CSV:", results.errors);
        }

        const loadedProducts = results.data.map((row: any): TipoProducto | null => {
            if (!row.Producto || row.Producto.trim() === '') {
                return null;
            }
            return {
                producto: row.Producto,
                material: row.Material,
                diametro_nominal: toNumberOrNull(row['D nominal (mm)']),
                presion_nominal: row['PN - Serie'],
                sdr: row['PN - Serie'], // Assuming SDR is part of PN
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
                code: row.producto, // Use product name as code for now
            };
        }).filter((p): p is TipoProducto => p !== null);
        
        matrizProductos = loadedProducts; // Cache the result
        return matrizProductos;
    } catch (error) {
        console.error("Error fetching or parsing product CSV file:", error);
        return []; // Return empty on error
    }
}
