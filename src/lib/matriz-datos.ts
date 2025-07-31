"use server"

import fs from 'fs';
import path from 'path';
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

let matrizProductos: TipoProducto[] = [];
let matrizLoaded = false;

const toNumberOrNull = (value: string): number | null => {
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
};

const toNullableString = (value: string): string | undefined => {
    return value && value.trim() !== '' ? value.trim() : undefined;
}

export async function loadMatrizProductos(): Promise<TipoProducto[]> {
    return new Promise((resolve, reject) => {
        if (matrizLoaded) {
            return resolve(matrizProductos);
        }

        const csvFilePath = path.join(process.cwd(), 'public', 'data', 'productos.csv');
        
        try {
            const csvFile = fs.readFileSync(csvFilePath, 'utf8');
            Papa.parse<any>(csvFile, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    if (results.errors.length) {
                        console.error("Errors parsing CSV:", results.errors);
                        return reject(new Error("Failed to parse product CSV."));
                    }

                    matrizProductos = results.data.map((row: any) => ({
                        producto: row.producto,
                        material: row.material,
                        diametro_nominal: parseFloat(row.diametro_nominal),
                        presion_nominal: row.presion_nominal,
                        sdr: row.sdr,
                        diametro_min: parseFloat(row.diametro_min),
                        diametro_max: parseFloat(row.diametro_max),
                        espesor_min_norma: parseFloat(row.espesor_min_norma),
                        espesor_max_norma: toNumberOrNull(row.espesor_max_norma),
                        ovalidad_norma: toNumberOrNull(row.ovalidad_norma),
                        peso_min_teorico: parseFloat(row.peso_min_teorico),
                        peso_max_teorico: parseFloat(row.peso_max_teorico),
                        presion_phi: toNumberOrNull(row.presion_phi),
                        temperatura_phi: toNumberOrNull(row.temperatura_phi),
                        tiempo_phi: toNumberOrNull(row.tiempo_phi),
                        color_tuberia: toNullableString(row.color_tuberia),
                        color_linea: toNullableString(row.color_linea),
                        code: row.producto.replace(/\s+/g, '-').toUpperCase(),
                    }));
                    matrizLoaded = true;
                    resolve(matrizProductos);
                },
                error: (error: any) => {
                    console.error("CSV parsing error:", error);
                    reject(error);
                }
            });
        } catch (error) {
            console.error("Error reading product CSV file:", error);
            reject(error);
        }
    });
};

/**
 * Gets the loaded product matrix.
 * Note: This assumes `loadMatrizProductos` has completed.
 */
export async function getMatrizProductos(): Promise<TipoProducto[]> {
    if (!matrizLoaded) {
        await loadMatrizProductos();
    }
    return matrizProductos;
};
