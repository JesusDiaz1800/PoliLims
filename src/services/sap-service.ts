
import { getMatrizProductos } from "@/lib/matriz-datos";

/**
 * @interface SapProduct
 * @description Represents the structure of a product as it would be retrieved from an SAP system.
 * This is used for simulation purposes.
 */
export interface SapProduct {
  code: string; // Unique product code in SAP
  name: string; // Product description in SAP
  label: string; // User-friendly label for UI components
  value: string; // Value used in select/combobox components
}

// In-memory cache for the products to simulate a faster API response on subsequent calls.
let products: SapProduct[] = [];

/**
 * @function getProductsFromSap
 * @description Simulates a call to an SAP API to fetch a list of all products.
 * In this prototype, it reads the data from the local product matrix (`matriz-datos.ts`).
 * The function caches the result to improve performance on repeated calls.
 * @returns {Promise<SapProduct[]>} A promise that resolves to a list of products.
 */
export async function getProductsFromSap(): Promise<SapProduct[]> {
  // Return from cache if already populated
  if (products.length > 0) {
    return products;
  }
  
  try {
    const matriz = await getMatrizProductos();
    const allProducts = matriz.map(p => ({
        code: p.code || p.producto.replace(/\s+/g, '-').toUpperCase(),
        name: p.producto,
        value: p.code || p.producto.replace(/\s+/g, '-').toUpperCase(),
        label: p.producto,
    }));

    // Filter out duplicates based on the 'code' property to ensure a unique list
    const uniqueProductsMap = new Map<string, SapProduct>();
    allProducts.forEach(p => {
        if (!uniqueProductsMap.has(p.code)) {
            uniqueProductsMap.set(p.code, p);
        }
    });

    products = Array.from(uniqueProductsMap.values()); // Cache the unique list
    
    return products;
  } catch (error) {
    console.error("Failed to get products from matrix for SAP service:", error);
    return []; // Return an empty array on failure
  }
}

/**
 * @function findProductByCode
 * @description Simulates a call to an SAP API to find a specific product by its code.
 * @param {string} code - The product code to search for.
 * @returns {Promise<SapProduct | null>} A promise that resolves to the found product or null if it doesn't exist.
 */
export async function findProductByCode(code: string): Promise<SapProduct | null> {
    // Ensure the product list is loaded before searching
    if (products.length === 0) {
      await getProductsFromSap();
    }
    const product = products.find(p => p.code === code) || null;
    return product;
}
