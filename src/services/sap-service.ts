import { getMatrizProductos } from "@/lib/matriz-datos";

export interface SapProduct {
  code: string; // Código del producto en SAP
  name: string; // Descripción del producto en SAP
  label: string;
  value: string;
}

// Cache for the products
let products: SapProduct[] = [];

/**
 * Simula una llamada a la API de SAP para obtener la lista de productos.
 * En esta versión, lee los datos desde el servicio de matriz de datos.
 * @returns Una promesa que resuelve a una lista de productos.
 */
export function getProductsFromSap(): SapProduct[] {
  if (products.length > 0) {
    return products;
  }
  
  try {
    const matriz = getMatrizProductos();
    products = matriz.map(p => ({
        code: p.code || p.producto.replace(/\s+/g, '-').toUpperCase(),
        name: p.producto,
        value: p.code || p.producto.replace(/\s+/g, '-').toUpperCase(),
        label: p.producto,
    }));
    return products;
  } catch (error) {
    console.error("Failed to get products from matrix for SAP service:", error);
    return []; // Return empty on failure
  }
}

/**
 * Simula una llamada a la API de SAP para buscar un producto por su código.
 * @param code - El código del producto a buscar.
 * @returns Una promesa que resuelve al producto encontrado o null si no existe.
 */
export function findProductByCode(code: string): SapProduct | null {
    if (products.length === 0) {
      getProductsFromSap();
    }
    const product = products.find(p => p.code === code) || null;
    return product;
}

// Initial load
getProductsFromSap();
