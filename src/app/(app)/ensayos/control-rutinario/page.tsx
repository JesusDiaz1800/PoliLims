

"use client";

import { ControlRutinarioTable } from "@/components/ensayos/control-rutinario-table";
import * as React from 'react';
import { ControlRutinarioDialog } from "@/components/ensayos/control-rutinario-dialog";
import { getProductsFromSap } from "@/services/sap-service";
import type { SapProduct } from "@/services/sap-service";
import { getMatrizProductos, TipoProducto } from "@/lib/matriz-datos";


export default function ControlRutinarioPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [productos, setProductos] = React.useState<SapProduct[]>([]);
  const [matriz, setMatriz] = React.useState<TipoProducto[]>([]);
  const [loading, setLoading] = React.useState(true);


  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [sapProducts, matrizProductos] = await Promise.all([
          getProductsFromSap(),
          getMatrizProductos()
        ]);
        setProductos(sapProducts);
        setMatriz(matrizProductos);
      } catch (error) {
        console.error("Failed to load initial data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddRecordClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <ControlRutinarioTable onAddRecordClick={handleAddRecordClick} />
      { !loading && (
          <ControlRutinarioDialog 
            isOpen={isDialogOpen} 
            onClose={handleDialogClose} 
            productos={productos.map(p => ({ value: p.code, label: p.name }))}
            matrizProductos={matriz}
            />
      )}
    </div>
  );
}
