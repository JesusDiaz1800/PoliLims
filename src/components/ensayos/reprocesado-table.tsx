

"use client";

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FilePlus2, Edit, Trash2, MoreHorizontal, Filter, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Ensayo } from '@/context/data-context';
import { useDynamicData } from '@/context/data-context';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import type { User } from '@/services/user-service';

interface ReprocesadoTableProps {
  ensayos: Ensayo[];
  onAddNew: () => void;
  onEdit: (ensayo: Ensayo, filterType: string) => void;
  user: User | null;
}

function getStatusVariant(status: string) {
    switch (status) {
        case "Aprobado": return "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30";
        case "En Progreso":
        case "En Análisis":
            return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30";
        case "Rechazado": return "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30";
        case "Pendiente de Revisión": return "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30";
        default: return "bg-secondary";
    }
}

const formatValue = (value: any, decimals: number = 2) => {
    if (value === null || value === undefined || value === '' || isNaN(Number(value))) return 'N/A';
    return Number(value).toFixed(decimals);
};

const ReprocesadoTableInternal = ({ ensayos, onAddNew, onEdit, user }: ReprocesadoTableProps) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState('all');
  const { deleteEnsayo } = useDynamicData();
  const { toast } = useToast();
  const canApprove = user?.role === 'Jefe de Calidad' || user?.role === 'Ing. Analista de Calidad';

  const filteredEnsayos = React.useMemo(() => 
    ensayos.filter(ensayo =>
        (ensayo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ensayo.lote && ensayo.lote.toLowerCase().includes(searchTerm.toLowerCase())))
    ), [ensayos, searchTerm]);
  
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
    { value: 'cenizas', label: '% Cenizas' },
    { value: 'tio', label: 'TIO' },
  ];

  const renderHeaders = () => {
    switch (filterType) {
        case 'melt_index':
            return (
                <>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Lote</TableHead>
                    <TableHead className="text-right">M.I. Reportado</TableHead>
                    <TableHead className="text-right">M.I. Ensayado</TableHead>
                    <TableHead className="text-right">% Variación</TableHead>
                    <TableHead>Estado</TableHead>
                </>
            );
        case 'densidad':
            return (
                <>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Lote</TableHead>
                    <TableHead className="text-right">Densidad Líquido</TableHead>
                    <TableHead className="text-right">Densidad Calculada</TableHead>
                    <TableHead>Estado</TableHead>
                </>
            );
        case 'porcentaje_negro_humo':
             return (
                <>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Lote</TableHead>
                    <TableHead className="text-right">% Negro Humo</TableHead>
                    <TableHead>Estado</TableHead>
                </>
            );
        case 'cenizas':
             return (
                <>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Lote</TableHead>
                    <TableHead className="text-right">% Cenizas</TableHead>
                    <TableHead className="text-right">% Cenizas Corregido</TableHead>
                    <TableHead>Estado</TableHead>
                </>
            );
        case 'tio':
            return (
                <>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Lote</TableHead>
                    <TableHead className="text-right">Tiempo de Inducción</TableHead>
                    <TableHead>Estado</TableHead>
                </>
            );
        default: // 'all'
            return (
                <>
                    <TableHead>Lote</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Analista</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">M.I. Ensayado</TableHead>
                    <TableHead className="text-right">% Var. MI</TableHead>
                    <TableHead className="text-right">Densidad</TableHead>
                    <TableHead className="text-right">% Negro Humo</TableHead>
                    <TableHead className="text-right">% Cenizas</TableHead>
                    <TableHead className="text-right">TIO [min]</TableHead>
                </>
            );
    }
  };

  const renderRow = (ensayo: Ensayo) => {
     switch (filterType) {
        case 'melt_index':
            return (
                <>
                    <TableCell>{ensayo.fecha}</TableCell>
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
                    <TableCell>{ensayo.fecha}</TableCell>
                    <TableCell>{ensayo.lote}</TableCell>
                    <TableCell className="text-right font-mono">{formatValue(ensayo.densidad_liquido, 4)}</TableCell>
                    <TableCell className="text-right font-mono">{formatValue(ensayo.densidadCalculada, 4)}</TableCell>
                    <TableCell><Badge className={cn("border-transparent font-normal", getStatusVariant(ensayo.estado))}>{ensayo.estado}</Badge></TableCell>
                 </>
            );
        case 'porcentaje_negro_humo':
            return (
                 <>
                    <TableCell>{ensayo.fecha}</TableCell>
                    <TableCell>{ensayo.lote}</TableCell>
                    <TableCell className="text-right font-mono">{formatValue(ensayo.negroHumoCalculado, 2)}%</TableCell>
                    <TableCell><Badge className={cn("border-transparent font-normal", getStatusVariant(ensayo.estado))}>{ensayo.estado}</Badge></TableCell>
                 </>
            );
        case 'cenizas':
             return (
                 <>
                    <TableCell>{ensayo.fecha}</TableCell>
                    <TableCell>{ensayo.lote}</TableCell>
                    <TableCell className="text-right font-mono">{formatValue(ensayo.cenizasCalculado, 2)}%</TableCell>
                    <TableCell className="text-right font-mono">{formatValue(ensayo.cenizasCorregido, 2)}%</TableCell>
                    <TableCell><Badge className={cn("border-transparent font-normal", getStatusVariant(ensayo.estado))}>{ensayo.estado}</Badge></TableCell>
                 </>
            );
        case 'tio':
            return (
                <>
                    <TableCell>{ensayo.fecha}</TableCell>
                    <TableCell>{ensayo.lote}</TableCell>
                    <TableCell className="text-right font-mono">{formatValue(ensayo.tio_tiempo, 2)} min</TableCell>
                    <TableCell><Badge className={cn("border-transparent font-normal", getStatusVariant(ensayo.estado))}>{ensayo.estado}</Badge></TableCell>
                </>
            );
        default: // 'all'
            return (
                <>
                    <TableCell className="font-medium">{ensayo.lote}</TableCell>
                    <TableCell>{ensayo.fecha}</TableCell>
                    <TableCell>{ensayo.analista}</TableCell>
                    <TableCell>
                        <Badge className={cn("border-transparent font-normal", getStatusVariant(ensayo.estado))}>
                        {ensayo.estado}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">{formatValue(ensayo.meltIndexCalculado, 4)}</TableCell>
                    <TableCell className="text-right font-mono">{formatValue(ensayo.meltIndexVariacion, 2)}%</TableCell>
                    <TableCell className="text-right font-mono">{formatValue(ensayo.densidadCalculada, 4)}</TableCell>
                    <TableCell className="text-right font-mono">{formatValue(ensayo.negroHumoCalculado, 2)}%</TableCell>
                    <TableCell className="text-right font-mono">{formatValue(ensayo.cenizasCalculado, 2)}%</TableCell>
                    <TableCell className="text-right font-mono">{formatValue(ensayo.tio_tiempo, 2)}</TableCell>
                </>
            );
     }
  };


  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 space-y-1.5">
            <CardTitle>Ensayos de Reprocesado</CardTitle>
            <CardDescription>
              Gestione y registre los análisis realizados al material reprocesado.
            </CardDescription>
          </div>
          <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                placeholder="Buscar por ID o lote..."
                className="pl-9 w-full"
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
                Registrar Nuevo Ensayo
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          <Table>
            <TableHeader>
              <TableRow>
                {renderHeaders()}
                <TableHead className="text-right">Acciones</TableHead>
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
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Acciones</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuItem onSelect={() => onEdit(ensayo, filterType)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar / Ingresar Datos
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
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
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

export const ReprocesadoTable = React.memo(ReprocesadoTableInternal);
