import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';


export interface SapProduct {
  code: string; // Código del producto en SAP
  name: string; // Descripción del producto en SAP
}

// Cache for the products
let products: SapProduct[] = [];

/**
 * Simula una llamada a la API de SAP para obtener la lista de productos.
 * En esta versión, lee los datos desde un archivo CSV local.
 * @returns Una promesa que resuelve a una lista de productos.
 */
export async function getProductsFromSap(): Promise<SapProduct[]> {
  if (products.length > 0) {
    return Promise.resolve(products);
  }

  return new Promise((resolve, reject) => {
    const csvFilePath = path.join(process.cwd(), 'public', 'data', 'productos.csv');
    
    try {
      const csvFile = fs.readFileSync(csvFilePath, 'utf8');

      Papa.parse<any>(csvFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length) {
              console.error("Errors parsing product CSV for SAP service:", results.errors);
              return reject(new Error("Failed to parse product CSV."));
          }
          // Assuming 'producto' is the name and a new 'code' field needs to be derived or exists
          // For now, let's create a code from the name for uniqueness if no code column exists
          products = results.data.map(row => ({
            code: row.code || row.producto.replace(/\s+/g, '-').toUpperCase(),
            name: row.producto
          }));
          resolve(products);
        },
        error: (error: any) => {
          console.error("CSV parsing error in SAP service:", error);
          reject(error);
        }
      });
    } catch(error) {
       console.error("Error reading product CSV file:", error);
       reject(error);
    }
  });
}

/**
 * Simula una llamada a la API de SAP para buscar un producto por su código.
 * @param code - El código del producto a buscar.
 * @returns Una promesa que resuelve al producto encontrado o null si no existe.
 */
export async function findProductByCode(code: string): Promise<SapProduct | null> {
    if (products.length === 0) {
      await getProductsFromSap();
    }
    const product = products.find(p => p.code === code) || null;
    return product;
}
