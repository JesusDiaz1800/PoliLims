
'use server';

import * as fs from 'fs/promises';
import * as path from 'path';
import Papa from 'papaparse';
import type { TipoProducto } from '@/lib/matriz-datos';

export interface KnowledgeBaseFile {
  name: string;
  size: number;
  version: number;
  status: 'Aprobado' | 'En Revisión';
  approvedBy?: string;
  approvedAt?: string;
}


// --- Files ---

export async function getKnowledgeBaseFiles(): Promise<KnowledgeBaseFile[]> {
    const dataDirectory = path.join(process.cwd(), 'public', 'data');
    try {
        const files = await fs.readdir(dataDirectory);
        const fileDetails = await Promise.all(
            files
                // Omitimos archivos que no son de texto para la IA, pero se podrían incluir todos si se quisiera
                .filter(file => file.endsWith('.txt') || file.endsWith('.md'))
                .map(async (file, index) => {
                    const filePath = path.join(dataDirectory, file);
                    const stats = await fs.stat(filePath);
                    // Mock data para el ejemplo
                    const isApproved = index % 2 === 0;
                    return { 
                        name: file, 
                        size: stats.size,
                        version: isApproved ? 2 : 1,
                        status: isApproved ? 'Aprobado' : 'En Revisión',
                        approvedBy: isApproved ? 'Victor Lutz' : undefined,
                        approvedAt: isApproved ? '15-07-2024' : undefined,
                    };
                })
        );
        return fileDetails;
    } catch (error) {
        // If the directory doesn't exist, create it and return an empty array.
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
            await fs.mkdir(dataDirectory, { recursive: true });
            return [];
        }
        console.error('Failed to read knowledge base directory:', error);
        return [];
    }
}


// Cache for the parsed product matrix to avoid reloading and re-parsing on every call.
let matrizProductos: TipoProducto[] = [];

/**
 * @function toNumberOrNull
 * @description Safely converts a value to a number or null. It handles commas as decimal separators.
 * @param {unknown} value - The value to convert.
 * @returns {number | null} The converted number or null if conversion is not possible.
 */
const toNumberOrNull = (value: unknown): number | null => {
    if (value === null || value === undefined) return null;
    const s = String(value).replace(',', '.').trim();
    if (s === '') return null;
    const num = parseFloat(s);
    return isNaN(num) ? null : num;
};

/**
 * @function toNullableString
 * @description Converts a value to a string or undefined if it's empty.
 * @param {unknown} value - The value to convert.
 * @returns {string | undefined} The trimmed string or undefined.
 */
const toNullableString = (value: unknown): string | undefined => {
    const s = String(value).trim();
    return s && s !== '' ? s : undefined;
}


/**
 * @function getMatrizProductos
 * @description Fetches and parses the product data from a remote CSV file ('/data/productos.csv').
 * It caches the result to prevent re-fetching and re-parsing on subsequent calls.
 * This function is intended to be called from the server-side.
 * It uses PapaParse to handle CSV parsing and transforms raw data into the `TipoProducto` interface.
 * @returns {Promise<TipoProducto[]>} A promise that resolves to an array of product data.
 */
export async function getMatrizProductos(): Promise<TipoProducto[]> {
    // Return cached data if available
    if (matrizProductos.length > 0) {
        return matrizProductos;
    }

    try {
        const filePath = path.join(process.cwd(), 'public', 'data', 'productos.csv');
        const csvText = await fs.readFile(filePath, 'utf-8');
        
        const results = Papa.parse<any>(csvText, {
            header: true,
            skipEmptyLines: 'greedy',
            transformHeader: (header) => header.trim(),
            delimiter: '\t',
        });
        
        if (results.errors.length > 0) {
            console.error("Errors parsing CSV:", results.errors);
        }

        const loadedProducts = results.data.map((row: any, index: number): TipoProducto | null => {
             if (!row['Producto'] || String(row['Producto']).trim() === '') {
                return null;
            }
            const producto = row.Producto;
            const uniqueCode = `${producto.replace(/\s+/g, '-')}-${index}`.toUpperCase();

            return {
                producto: producto,
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
                code: uniqueCode,
            };
        }).filter((p): p is TipoProducto => p !== null);
        
        matrizProductos = loadedProducts; // Cache the result
        return matrizProductos;
    } catch (error) {
        console.error("Error fetching or parsing product CSV file:", error);
        return []; // Return empty on error
    }
}
