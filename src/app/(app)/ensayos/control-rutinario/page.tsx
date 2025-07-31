

"use client";

import { ControlRutinarioTable } from "@/components/ensayos/control-rutinario-table";
import * as React from 'react';
import { ControlRutinarioDialog } from "@/components/ensayos/control-rutinario-dialog";
import Loading from "../../loading";
import { getProductsFromSap, SapProduct } from "@/services/sap-service";
import { getMatrizProductos, TipoProducto } from "@/lib/matriz-datos";

export default function ControlRutinarioPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [sapProducts, setSapProducts] = React.useState<SapProduct[]>([]);
  const [productMatrix, setProductMatrix] = React.useState<TipoProducto[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Data is already cached on the server, so these are quick sync calls.
    // We run them in useEffect to ensure they run on the client-side
    // after initial render, preventing any potential hydration mismatches.
    const products = getProductsFromSap();
    const matrix = getMatrizProductos();
    setSapProducts(products);
    setProductMatrix(matrix);
    setLoading(false);
  }, []);

  const handleAddRecordClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <ControlRutinarioTable onAddRecordClick={handleAddRecordClick} matrizProductos={productMatrix} />
      <ControlRutinarioDialog 
        isOpen={isDialogOpen} 
        onClose={handleDialogClose} 
        productos={sapProducts}
        matrizProductos={productMatrix}
      />
    </div>
  );
}
