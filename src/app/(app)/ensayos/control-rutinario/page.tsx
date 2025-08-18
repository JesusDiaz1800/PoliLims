
"use client";

import React, { useState, useEffect } from 'react';
import { ControlRutinarioTable } from "@/components/ensayos/control-rutinario-table";
import { ControlRutinarioDialog } from "@/components/ensayos/control-rutinario-dialog";
import { useDynamicData } from '@/context/data-context';
import { getMatrizProductos } from '@/lib/matriz-datos';
import type { TipoProducto } from '@/lib/matriz-datos';
import dynamic from 'next/dynamic';
import Loading from '../../loading';

const DynamicControlRutinario = dynamic(() => import('@/components/ensayos/control-rutinario-page').then(mod => mod.default), {
  loading: () => <Loading />,
  ssr: false
});

export default function ControlRutinarioPage() {
  return <DynamicControlRutinario />;
}
