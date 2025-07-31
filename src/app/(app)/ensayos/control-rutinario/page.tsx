
"use client";

import React, { useEffect, useState } from 'react';
import { ControlRutinarioClient } from "@/components/ensayos/control-rutinario-client";
import { useDataContext } from '@/context/data-context';
import Loading from '../../loading';

export default function ControlRutinarioPage() {
  const { sapProducts, productMatrix } = useDataContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !sapProducts.length || !productMatrix.length) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <ControlRutinarioClient 
        sapProducts={sapProducts}
        productMatrix={productMatrix}
      />
    </div>
  );
}
