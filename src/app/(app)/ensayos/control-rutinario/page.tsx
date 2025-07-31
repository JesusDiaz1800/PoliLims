

"use client";

import { ControlRutinarioTable } from "@/components/ensayos/control-rutinario-table";
import * as React from 'react';
import { ControlRutinarioDialog } from "@/components/ensayos/control-rutinario-dialog";
import { useDataContext } from "@/context/data-context";
import Loading from "../../loading";
import { getProductsFromSap, SapProduct } from "@/services/sap-service";
import { getMatrizProductos, TipoProducto } from "@/lib/matriz-datos";

export default function ControlRutinarioPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [sapProducts, setSapProducts] = React.useState<SapProduct[]>([]);
  const [productMatrix, setProductMatrix] = React.useState<TipoProducto[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Since getProductsFromSap and getMatrizProductos now return cached data on the server,
    // we can call them in a client component inside useEffect without causing issues.
    // In a real-world scenario with a database, these would be API calls.
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
      <ControlRutinarioTable onAddRecordClick={handleAddRecordClick} />
      <ControlRutinarioDialog 
        isOpen={isDialogOpen} 
        onClose={handleDialogClose} 
        productos={sapProducts}
        matrizProductos={productMatrix}
      />
    </div>
  );
}
