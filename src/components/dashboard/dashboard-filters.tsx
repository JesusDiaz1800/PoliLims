
"use client";

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FilterOption {
  value: string;
  label: string;
}

interface DashboardFiltersProps {
  analysts: FilterOption[];
  assayTypes: FilterOption[];
  suppliers: FilterOption[];
  individualAssays: FilterOption[];
}

export function DashboardFilters({ 
  analysts, 
  assayTypes, 
  suppliers, 
  individualAssays 
}: DashboardFiltersProps) {
  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="analyst-filter" className="text-xs font-medium">
          Analista
        </Label>
        <Select defaultValue="all">
          <SelectTrigger id="analyst-filter" className="h-8 text-xs">
            <SelectValue placeholder="Seleccionar analista" />
          </SelectTrigger>
          <SelectContent>
            {analysts.map((analyst) => (
              <SelectItem key={analyst.value} value={analyst.value} className="text-xs">
                {analyst.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type-filter" className="text-xs font-medium">
          Tipo de Ensayo
        </Label>
        <Select defaultValue="all">
          <SelectTrigger id="type-filter" className="h-8 text-xs">
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
          <SelectContent>
            {assayTypes.map((type) => (
              <SelectItem key={type.value} value={type.value} className="text-xs">
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="supplier-filter" className="text-xs font-medium">
          Proveedor
        </Label>
        <Select defaultValue="all">
          <SelectTrigger id="supplier-filter" className="h-8 text-xs">
            <SelectValue placeholder="Seleccionar proveedor" />
          </SelectTrigger>
          <SelectContent>
            {suppliers.map((supplier) => (
              <SelectItem key={supplier.value} value={supplier.value} className="text-xs">
                {supplier.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="assay-filter" className="text-xs font-medium">
          Ensayo Específico
        </Label>
        <Select defaultValue="all">
          <SelectTrigger id="assay-filter" className="h-8 text-xs">
            <SelectValue placeholder="Seleccionar ensayo" />
          </SelectTrigger>
          <SelectContent>
            {individualAssays.map((assay) => (
              <SelectItem key={assay.value} value={assay.value} className="text-xs">
                {assay.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
