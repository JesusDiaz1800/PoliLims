
// En un escenario real, este archivo se conectaría a la API de SAP
// para obtener los datos de productos. Por ahora, simularemos esa
// llamada con datos estáticos.

export interface SapProduct {
  code: string; // Código del producto en SAP
  name: string; // Descripción del producto en SAP
}

const mockSapProducts: SapProduct[] = [
  { code: "TPEAD-20-PN10", name: "Tuberia PEAD 20 mm PN10" },
  { code: "TPEAD-25-PN10", name: "Tuberia PEAD 25 mm PN10" },
  { code: "TPEAD-32-PN10", name: "Tuberia PEAD 32 mm PN10" },
  { code: "TPEAD-40-PN10", name: "Tuberia PEAD 40 mm PN10" },
  { code: "TPEAD-50-PN10", name: "Tuberia PEAD 50 mm PN10" },
  { code: "TPEAD-63-PN10", name: "Tuberia PEAD 63 mm PN10" },
  { code: "TPEAD-75-PN10", name: "Tuberia PEAD 75 mm PN10" },
  { code: "TPEAD-90-PN10", name: "Tuberia PEAD 90 mm PN10" },
  { code: "TPEAD-110-PN10", name: "Tuberia PEAD 110 mm PN10" },
  { code: "TPPR-20-PN20", name: "Tuberia PP-R 20 mm PN20" },
  { code: "TPPR-25-PN20", name: "Tuberia PP-R 25 mm PN20" },
  { code: "TPPR-32-PN20", name: "Tuberia PP-R 32 mm PN20" },
  { code: "TFBF-20-PN20", name: "Tuberia FASER BETA-FIBRA 20 mm PN20" },
  { code: "TFAF-20-PN20", name: "Tuberia FASER AQUA-FIBRA 20 mm PN20" },
  { code: "TFBF-25-PN20", name: "Tuberia FASER BETA-FIBRA 25 mm PN20" },
  { code: "TFAF-25-PN20", name: "Tuberia FASER AQUA-FIBRA 25 mm PN20" },
  { code: "TFBF-32-PN20", name: "Tuberia FASER BETA-FIBRA 32 mm PN20" },
  { code: "TFAF-32-PN20", name: "Tuberia FASER AQUA-FIBRA 32 mm PN20" },
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
