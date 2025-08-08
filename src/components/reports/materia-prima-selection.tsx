
"use client";

import * as React from 'react';
import type { Ensayo } from '@/context/data-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';

interface MateriaPrimaSelectionTableProps {
  ensayos: Ensayo[];
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
}

export function MateriaPrimaSelectionTable({ ensayos, selectedIds, onSelectionChange }: MateriaPrimaSelectionTableProps) {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(new Set(ensayos.map(e => e.id)));
    } else {
      onSelectionChange(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelectedIds = new Set(selectedIds);
    if (checked) {
      newSelectedIds.add(id);
    } else {
      newSelectedIds.delete(id);
    }
    onSelectionChange(newSelectedIds);
  };
  
  const allSelected = selectedIds.size === ensayos.length && ensayos.length > 0;
  const someSelected = selectedIds.size > 0 && !allSelected;

  return (
    <ScrollArea className="h-72 w-full rounded-md border">
        <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                    <TableHead className="w-12">
                       <Checkbox
                            checked={allSelected || someSelected}
                            aria-label="Seleccionar todo"
                            onCheckedChange={handleSelectAll}
                            data-state={someSelected ? "indeterminate" : (allSelected ? "checked" : "unchecked")}
                        />
                    </TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Lote</TableHead>
                    <TableHead>Analista</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {ensayos.map(ensayo => (
                    <TableRow key={ensayo.id} data-state={selectedIds.has(ensayo.id) && "selected"}>
                        <TableCell>
                            <Checkbox
                                checked={selectedIds.has(ensayo.id)}
                                onCheckedChange={(checked) => handleSelectRow(ensayo.id, !!checked)}
                                aria-label={`Seleccionar ensayo ${ensayo.id}`}
                            />
                        </TableCell>
                        <TableCell>{ensayo.fecha}</TableCell>
                        <TableCell className="font-medium">{ensayo.producto}</TableCell>
                        <TableCell>{ensayo.lote}</TableCell>
                        <TableCell>{ensayo.analista}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </ScrollArea>
  );
}
