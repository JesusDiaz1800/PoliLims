// En un escenario real, este archivo se conectaría a la API de SAP
// para obtener los datos de productos. Por ahora, simularemos esa
// llamada con datos estáticos.

export interface SapProduct {
  code: string; // Código del producto en SAP
  name: string; // Descripción del producto en SAP
}

const mockSapProducts: SapProduct[] = [
    { code: "TPEAD-20-PN4", name: "Tuberia PEAD 20 mm PN4" },
    { code: "TPEAD-25-PN4", name: "Tuberia PEAD 25 mm PN4" },
    { code: "TPEAD-32-PN4", name: "Tuberia PEAD 32 mm PN4" },
    { code: "TPEAD-40-PN4", name: "Tuberia PEAD 40 mm PN4" },
    { code: "TPEAD-50-PN4", name: "Tuberia PEAD 50 mm PN4" },
    { code: "TPEAD-63-PN4", name: "Tuberia PEAD 63 mm PN4" },
    { code: "TPEAD-75-PN4", name: "Tuberia PEAD 75 mm PN4" },
    { code: "TPEAD-90-PN4", name: "Tuberia PEAD 90 mm PN4" },
    { code: "TPEAD-110-PN4", name: "Tuberia PEAD 110 mm PN4" },
    { code: "TPEAD-125-PN4", name: "Tuberia PEAD 125 mm PN4" },
    { code: "TPEAD-140-PN4", name: "Tuberia PEAD 140 mm PN4" },
    { code: "TPEAD-160-PN4", name: "Tuberia PEAD 160 mm PN4" },
    { code: "TPEAD-180-PN4", name: "Tuberia PEAD 180 mm PN4" },
    { code: "TPEAD-200-PN4", name: "Tuberia PEAD 200 mm PN4" },
    { code: "TPEAD-225-PN4", name: "Tuberia PEAD 225 mm PN4" },
    { code: "TPEAD-250-PN4", name: "Tuberia PEAD 250 mm PN4" },
    { code: "TPEAD-280-PN4", name: "Tuberia PEAD 280 mm PN4" },
    { code: "TPEAD-315-PN4", name: "Tuberia PEAD 315 mm PN4" },
    { code: "TPEAD-355-PN4", name: "Tuberia PEAD 355 mm PN4" },
    { code: "TPEAD-400-PN4", name: "Tuberia PEAD 400 mm PN4" },
    { code: "TPEAD-450-PN4", name: "Tuberia PEAD 450 mm PN4" },
    { code: "TPEAD-500-PN4", name: "Tuberia PEAD 500 mm PN4" },
    { code: "TPEAD-20-PN6", name: "Tuberia PEAD 20 mm PN6" },
    { code: "TPEAD-25-PN6", name: "Tuberia PEAD 25 mm PN6" },
    { code: "TPEAD-32-PN6", name: "Tuberia PEAD 32 mm PN6" },
    { code: "TPEAD-40-PN6", name: "Tuberia PEAD 40 mm PN6" },
    { code: "TPEAD-50-PN6", name: "Tuberia PEAD 50 mm PN6" },
    { code: "TPEAD-63-PN6", name: "Tuberia PEAD 63 mm PN6" },
    { code: "TPEAD-75-PN6", name: "Tuberia PEAD 75 mm PN6" },
    { code: "TPEAD-90-PN6", name: "Tuberia PEAD 90 mm PN6" },
    { code: "TPEAD-110-PN6", name: "Tuberia PEAD 110 mm PN6" },
    { code: "TPEAD-125-PN6", name: "Tuberia PEAD 125 mm PN6" },
    { code: "TPEAD-140-PN6", name: "Tuberia PEAD 140 mm PN6" },
    { code: "TPEAD-160-PN6", name: "Tuberia PEAD 160 mm PN6" },
    { code: "TPEAD-180-PN6", name: "Tuberia PEAD 180 mm PN6" },
    { code: "TPEAD-200-PN6", name: "Tuberia PEAD 200 mm PN6" },
    { code: "TPEAD-225-PN6", name: "Tuberia PEAD 225 mm PN6" },
    { code: "TPEAD-250-PN6", name: "Tuberia PEAD 250 mm PN6" },
    { code: "TPEAD-280-PN6", name: "Tuberia PEAD 280 mm PN6" },
    { code: "TPEAD-315-PN6", name: "Tuberia PEAD 315 mm PN6" },
    { code: "TPEAD-355-PN6", name: "Tuberia PEAD 355 mm PN6" },
    { code: "TPEAD-400-PN6", name: "Tuberia PEAD 400 mm PN6" },
    { code: "TPEAD-450-PN6", name: "Tuberia PEAD 450 mm PN6" },
    { code: "TPEAD-500-PN6", name: "Tuberia PEAD 500 mm PN6" },
    { code: "TPEAD-20-PN10", name: "Tuberia PEAD 20 mm PN10" },
    { code: "TPEAD-25-PN10", name: "Tuberia PEAD 25 mm PN10" },
    { code: "TPEAD-32-PN10", name: "Tuberia PEAD 32 mm PN10" },
    { code: "TPEAD-40-PN10", name: "Tuberia PEAD 40 mm PN10" },
    { code: "TPEAD-50-PN10", name: "Tuberia PEAD 50 mm PN10" },
    { code: "TPEAD-63-PN10", name: "Tuberia PEAD 63 mm PN10" },
    { code: "TPEAD-75-PN10", name: "Tuberia PEAD 75 mm PN10" },
    { code: "TPEAD-90-PN10", name: "Tuberia PEAD 90 mm PN10" },
    { code: "TPEAD-110-PN10", name: "Tuberia PEAD 110 mm PN10" },
    { code: "TPEAD-125-PN10", name: "Tuberia PEAD 125 mm PN10" },
    { code: "TPEAD-140-PN10", name: "Tuberia PEAD 140 mm PN10" },
    { code: "TPEAD-160-PN10", name: "Tuberia PEAD 160 mm PN10" },
    { code: "TPEAD-180-PN10", name: "Tuberia PEAD 180 mm PN10" },
    { code: "TPEAD-200-PN10", name: "Tuberia PEAD 200 mm PN10" },
    { code: "TPEAD-225-PN10", name: "Tuberia PEAD 225 mm PN10" },
    { code: "TPEAD-250-PN10", name: "Tuberia PEAD 250 mm PN10" },
    { code: "TPEAD-280-PN10", name: "Tuberia PEAD 280 mm PN10" },
    { code: "TPEAD-315-PN10", name: "Tuberia PEAD 315 mm PN10" },
    { code: "TPEAD-355-PN10", name: "Tuberia PEAD 355 mm PN10" },
    { code: "TPEAD-400-PN10", name: "Tuberia PEAD 400 mm PN10" },
    { code: "TPEAD-450-PN10", name: "Tuberia PEAD 450 mm PN10" },
    { code: "TPEAD-500-PN10", name: "Tuberia PEAD 500 mm PN10" },
    { code: "TPEAD-20-PN16", name: "Tuberia PEAD 20 mm PN16" },
    { code: "TPEAD-25-PN16", name: "Tuberia PEAD 25 mm PN16" },
    { code: "TPEAD-32-PN16", name: "Tuberia PEAD 32 mm PN16" },
    { code: "TPEAD-40-PN16", name: "Tuberia PEAD 40 mm PN16" },
    { code: "TPEAD-50-PN16", name: "Tuberia PEAD 50 mm PN16" },
    { code: "TPEAD-63-PN16", name: "Tuberia PEAD 63 mm PN16" },
    { code: "TPEAD-75-PN16", name: "Tuberia PEAD 75 mm PN16" },
    { code: "TPEAD-90-PN16", name: "Tuberia PEAD 90 mm PN16" },
    { code: "TPEAD-110-PN16", name: "Tuberia PEAD 110 mm PN16" },
    { code: "TPEAD-125-PN16", name: "Tuberia PEAD 125 mm PN16" },
    { code: "TPEAD-140-PN16", name: "Tuberia PEAD 140 mm PN16" },
    { code: "TPEAD-160-PN16", name: "Tuberia PEAD 160 mm PN16" },
    { code: "TPEAD-180-PN16", name: "Tuberia PEAD 180 mm PN16" },
    { code: "TPEAD-200-PN16", name: "Tuberia PEAD 200 mm PN16" },
    { code: "TPEAD-225-PN16", name: "Tuberia PEAD 225 mm PN16" },
    { code: "TPEAD-250-PN16", name: "Tuberia PEAD 250 mm PN16" },
    { code: "TPEAD-280-PN16", name: "Tuberia PEAD 280 mm PN16" },
    { code: "TPEAD-315-PN16", name: "Tuberia PEAD 315 mm PN16" },
    { code: "TPEAD-355-PN16", name: "Tuberia PEAD 355 mm PN16" },
    { code: "TPEAD-400-PN16", name: "Tuberia PEAD 400 mm PN16" },
    { code: "TPEAD-450-PN16", name: "Tuberia PEAD 450 mm PN16" },
    { code: "TPEAD-500-PN16", name: "Tuberia PEAD 500 mm PN16" },
    { code: "TPEAD-20-PN21", name: "Tuberia PEAD 20 mm PN21" },
    { code: "TPEAD-25-PN21", name: "Tuberia PEAD 25 mm PN21" },
    { code: "TPEAD-32-PN21", name: "Tuberia PEAD 32 mm PN21" },
    { code: "TPEAD-40-PN21", name: "Tuberia PEAD 40 mm PN21" },
    { code: "TPEAD-50-PN21", name: "Tuberia PEAD 50 mm PN21" },
    { code: "TPEAD-63-PN21", name: "Tuberia PEAD 63 mm PN21" },
    { code: "TPEAD-75-PN21", name: "Tuberia PEAD 75 mm PN21" },
    { code: "TPEAD-90-PN21", name: "Tuberia PEAD 90 mm PN21" },
    { code: "TPEAD-110-PN21", name: "Tuberia PEAD 110 mm PN21" },
    { code: "TPEAD-125-PN21", name: "Tuberia PEAD 125 mm PN21" },
    { code: "TPEAD-140-PN21", name: "Tuberia PEAD 140 mm PN21" },
    { code: "TPEAD-160-PN21", name: "Tuberia PEAD 160 mm PN21" },
    { code: "TPEAD-180-PN21", name: "Tuberia PEAD 180 mm PN21" },
    { code: "TPEAD-200-PN21", name: "Tuberia PEAD 200 mm PN21" },
    { code: "TPEAD-225-PN21", name: "Tuberia PEAD 225 mm PN21" },
    { code: "TPEAD-250-PN21", name: "Tuberia PEAD 250 mm PN21" },
    { code: "TPEAD-280-PN21", name: "Tuberia PEAD 280 mm PN21" },
    { code: "TPEAD-315-PN21", name: "Tuberia PEAD 315 mm PN21" },
    { code: "TPEAD-355-PN21", name: "Tuberia PEAD 355 mm PN21" },
    { code: "TPEAD-400-PN21", name: "Tuberia PEAD 400 mm PN21" },
    { code: "TPEAD-450-PN21", name: "Tuberia PEAD 450 mm PN21" },
    { code: "TPEAD-500-PN21", name: "Tuberia PEAD 500 mm PN21" }
];

/**
 * Simula una llamada a la API de SAP para obtener la lista de productos.
 * @returns Una promesa que resuelve a una lista de productos.
 */
export async function getProductsFromSap(): Promise<SapProduct[]> {
  // Simula un retraso de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockSapProducts;
}

/**
 * Simula una llamada a la API de SAP para buscar un producto por su código.
 * @param code - El código del producto a buscar.
 * @returns Una promesa que resuelve al producto encontrado o null si no existe.
 */
export async function findProductByCode(code: string): Promise<SapProduct | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const product = mockSapProducts.find(p => p.code === code) || null;
    return product;
}
