
"use client";

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FilePlus2, Edit, Filter, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Ensayo } from '@/context/data-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useDynamicData } from '@/context/data-context';

interface MateriaPrimaTableProps {
  ensayos: Ensayo[];
  onAddNew: () => void;
  onEdit: (ensayo: Ensayo) => void;
}

function getStatusVariant(status: string) {
    switch (status) {
        case "Aprobado": return "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30";
        case "En Progreso": return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30";
        case "Rechazado": return "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30";
        case "Pendiente de Revisión": return "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30";
        default: return "bg-secondary";
    }
}

const formatValue = (value: any, decimals: number = 2) => {
    if (value === null || value === undefined || value === '' || isNaN(value)) return 'N/A';
    return Number(value).toFixed(decimals);
};


export function MateriaPrimaTable({ ensayos, onAddNew, onEdit }: MateriaPrimaTableProps) {
  const { deleteEnsayo } = useDynamicData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState('all');

  const filteredEnsayos = ensayos.filter(ensayo =>
    (ensayo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ensayo.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ensayo.lote?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (ensayoId: string) => {
    try {
        await deleteEnsayo(ensayoId);
        toast({
            title: "Ensayo Eliminado",
            description: "El ensayo ha sido eliminado correctamente.",
        });
    } catch (error) {
         toast({
            variant: "destructive",
            title: "Error al Eliminar",
            description: "No se pudo eliminar el ensayo. Intente de nuevo.",
        });
        console.error("Failed to delete ensayo", error);
    }
  };


  const ensayoFilters = [
    { value: 'all', label: 'Vista General' },
    { value: 'melt_index', label: 'Melt Index' },
    { value: 'densidad', label: 'Densidad' },
    { value: 'negro_humo', label: '% Negro de Humo' },
  ];

  const renderHeaders = () => {
    switch (filterType) {
        case 'melt_index':
            return (
                <>
                    <TableHead>Producto</TableHead>
                    <TableHead>Lote</TableHead>
                    <TableHead className="text-right">M.I. Reportado</TableHead>
                    <TableHead className="text-right">M.I. Ensayado</TableHead>
                    <TableHead className="text-right">% Variación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </>
            );
        case 'densidad':
            return (
                <>
                    <TableHead>Producto</TableHead>
                    <TableHead>Lote</TableHead>
                    <TableHead className="text-right">Densidad Líquido</TableHead>
                    <TableHead className="text-right">Densidad Calculada</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </>
            );
        case 'negro_humo':
             return (
                <>
                    <TableHead>Producto</TableHead>
                    <TableHead>Lote</TableHead>
                    <TableHead className="text-right">% Negro Humo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </>
            );
        default: // 'all'
            return (
                <>
                    <TableHead>ID Ensayo</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Lote</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Analista</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </>
            );
    }
  };
  
  const renderRow = (ensayo: Ensayo) => {
     switch (filterType) {
        case 'melt_index':
            return (
                <>
                    <TableCell className="font-medium">{ensayo.producto}</TableCell>
                    <TableCell>{ensayo.lote}</TableCell>
                    <TableCell className="text-right font-mono">{formatValue(ensayo.melt_index_reportado, 4)}</TableCell>
                    <TableCell className="text-right font-mono">{formatValue(ensayo.meltIndexCalculado, 4)}</TableCell>
                    <TableCell className="text-right font-mono">{formatValue(ensayo.meltIndexVariacion, 2)}%</TableCell>
                    <TableCell><Badge className={cn("border-transparent font-normal", getStatusVariant(ensayo.estado))}>{ensayo.estado}</Badge></TableCell>
                </>
            );
        case 'densidad':
            return (
                 <>
                    <TableCell className="font-medium">{ensayo.producto}</TableCell>
                    <TableCell>{ensayo.lote}</TableCell>
                    <TableCell className="text-right font-mono">{formatValue(ensayo.densidad_liquido, 4)}</TableCell>
                    <TableCell className="text-right font-mono">{formatValue(ensayo.densidadCalculada, 4)}</TableCell>
                    <TableCell><Badge className={cn("border-transparent font-normal", getStatusVariant(ensayo.estado))}>{ensayo.estado}</Badge></TableCell>
                 </>
            );
        case 'negro_humo':
            return (
                 <>
                    <TableCell className="font-medium">{ensayo.producto}</TableCell>
                    <TableCell>{ensayo.lote}</TableCell>
                    <TableCell className="text-right font-mono">{formatValue(ensayo.negroHumoCalculado, 2)}%</TableCell>
                    <TableCell><Badge className={cn("border-transparent font-normal", getStatusVariant(ensayo.estado))}>{ensayo.estado}</Badge></TableCell>
                 </>
            );
        default: // 'all'
            return (
                <>
                    <TableCell className="font-mono">{ensayo.id}</TableCell>
                    <TableCell className="font-medium">{ensayo.producto}</TableCell>
                    <TableCell>{ensayo.lote}</TableCell>
                    <TableCell>{ensayo.fecha}</TableCell>
                    <TableCell>{ensayo.analista}</TableCell>
                    <TableCell>
                        <Badge className={cn("border-transparent font-normal", getStatusVariant(ensayo.estado))}>
                        {ensayo.estado}
                        </Badge>
                    </TableCell>
                </>
            );
     }
  };


  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 space-y-1.5">
            <CardTitle>Ensayos de Materia Prima</CardTitle>
            <CardDescription>
              Gestione y registre los análisis realizados a la materia prima. Filtre por ensayo para ver resultados específicos.
            </CardDescription>
          </div>
          <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                placeholder="Buscar por ID, producto o lote..."
                className="pl-9 w-full sm:w-48"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-auto">
                    <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Filtrar por ensayo" />
                </SelectTrigger>
                <SelectContent>
                    {ensayoFilters.map(filter => (
                        <SelectItem key={filter.value} value={filter.value}>{filter.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button onClick={onAddNew} className="w-full sm:w-auto">
                <FilePlus2 className="mr-2 h-4 w-4" />
                Registrar Ensayo
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {renderHeaders()}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEnsayos.map((ensayo) => (
                <TableRow key={ensayo.id}>
                  {renderRow(ensayo)}
                  <TableCell className="text-right">
                    <AlertDialog>
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Acciones</span>
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem onSelect={() => onEdit(ensayo)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialogTrigger asChild>
                                  <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Eliminar
                                  </DropdownMenuItem>
                              </AlertDialogTrigger>
                          </DropdownMenuContent>
                      </DropdownMenu>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                              <AlertDialogTitle>¿Está absolutamente seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente el ensayo
                                  <span className="font-bold"> {ensayo.id}</span> de los servidores.
                              </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(ensayo.id)} className={cn(buttonVariants({variant: "destructive"}))}>
                                  Sí, eliminar ensayo
                              </AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {filteredEnsayos.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold">No se encontraron ensayos</h3>
            <p>Intente ajustar su búsqueda o registre un nuevo ensayo.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
