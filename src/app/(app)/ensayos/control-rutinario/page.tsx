
"use client";

import React, { useState, useEffect } from 'react';
import { ControlRutinarioTable } from "@/components/ensayos/control-rutinario-table";
import { ControlRutinarioDialog } from "@/components/ensayos/control-rutinario-dialog";
import { useStaticData } from '@/context/data-context';
import Loading from '../../loading';
import { getProductsFromSap, type SapProduct } from '@/services/sap-service';

export default function ControlRutinarioPage() {
  const { productMatrix, isLoaded: isStaticDataLoaded } = useStaticData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sapProducts, setSapProducts] = useState<SapProduct[]>([]);
  const [isSapLoaded, setIsSapLoaded] = useState(false);

  useEffect(() => {
    async function loadSapProducts() {
      const products = await getProductsFromSap();
      setSapProducts(products);
      setIsSapLoaded(true);
    }
    loadSapProducts();
  }, []);

  const handleAddRecordClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  if (!isStaticDataLoaded || !isSapLoaded) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <ControlRutinarioTable 
        onAddRecordClick={handleAddRecordClick} 
        matrizProductos={productMatrix} 
      />
      <ControlRutinarioDialog 
        isOpen={isDialogOpen} 
        onClose={handleDialogClose} 
        productos={sapProducts}
        matrizProductos={productMatrix}
      />
    </div>
  );
}
