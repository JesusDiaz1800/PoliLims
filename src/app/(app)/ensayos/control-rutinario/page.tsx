
"use client";

import React, { useState, useEffect } from 'react';
import { ControlRutinarioTable } from "@/components/ensayos/control-rutinario-table";
import { ControlRutinarioDialog } from "@/components/ensayos/control-rutinario-dialog";
import Loading from '../../loading';
import * as dataService from "@/services/data-service";
import { getProductsFromSap, type SapProduct } from '@/services/sap-service';
import { getMatrizProductos, type TipoProducto } from '@/lib/matriz-datos';
import type { Ensayo, Registro } from '@/context/data-context';

export default function ControlRutinarioPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [ensayos, setEnsayos] = useState<Ensayo[]>([]);
  const [productMatrix, setProductMatrix] = useState<TipoProducto[]>([]);
  const [sapProducts, setSapProducts] = useState<SapProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [
          initialData,
          matrix,
          products,
        ] = await Promise.all([
          dataService.getInitialData(),
          getMatrizProductos(),
          getProductsFromSap(),
        ]);
        
        setRegistros(initialData.registros);
        setEnsayos(initialData.ensayos);
        setProductMatrix(matrix);
        setSapProducts(products);

      } catch (error) {
          console.error("Failed to load data for Control Rutinario", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddRecordClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  if (isLoading) {
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
