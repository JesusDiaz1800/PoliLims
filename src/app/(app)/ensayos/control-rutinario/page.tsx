
"use client";

import { ControlRutinarioTable } from "@/components/ensayos/control-rutinario-table";
import * as React from 'react';
import { ControlRutinarioDialog } from "@/components/ensayos/control-rutinario-dialog";
import { getProductsFromSap } from "@/services/sap-service";
import type { SapProduct } from "@/services/sap-service";


export default function ControlRutinarioPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [productos, setProductos] = React.useState<SapProduct[]>([]);

  React.useEffect(() => {
    // En una aplicación real, esto podría estar en un layout superior
    // o tener un estado global si se usa en más sitios.
    const fetchProducts = async () => {
      const products = await getProductsFromSap();
      setProductos(products);
    }
    fetchProducts();
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
      {productos.length > 0 && (
          <ControlRutinarioDialog 
            isOpen={isDialogOpen} 
            onClose={handleDialogClose} 
            productos={productos.map(p => ({ value: p.code, label: p.name }))}
            />
      )}
    </div>
  );
}
