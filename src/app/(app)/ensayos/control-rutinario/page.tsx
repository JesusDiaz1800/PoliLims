
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ControlRutinarioTable } from "@/components/ensayos/control-rutinario-table";
import { ControlRutinarioDialog } from "@/components/ensayos/control-rutinario-dialog";
import Loading from '../../loading';
import { getMatrizProductos, type TipoProducto } from '@/lib/matriz-datos';
import { getProductsFromSap, type SapProduct } from '@/services/sap-service';
import { useDynamicData } from '@/context/data-context';

export default function ControlRutinarioPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [productMatrix, setProductMatrix] = useState<TipoProducto[]>([]);
  const [sapProducts, setSapProducts] = useState<SapProduct[]>([]);
  const [isLoadingStatic, setIsLoadingStatic] = useState(true);
  
  const { registros, ensayos, isLoaded: isDataLoaded } = useDynamicData();

  useEffect(() => {
    async function loadStaticData() {
      setIsLoadingStatic(true);
      try {
        const [matrix, products] = await Promise.all([
          getMatrizProductos(),
          getProductsFromSap(),
        ]);
        setProductMatrix(matrix);
        setSapProducts(products);
      } catch (error) {
          console.error("Failed to load static data for Control Rutinario", error);
      } finally {
        setIsLoadingStatic(false);
      }
    }
    loadStaticData();
  }, []);

  const handleAddRecordClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  if (isLoadingStatic || !isDataLoaded) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <ControlRutinarioTable 
        registros={registros}
        ensayos={ensayos}
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
