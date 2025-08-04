
"use client";

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Edit, MoreHorizontal, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Ensayo } from '@/context/data-context';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EnsayosProductoTerminadoTableProps {
  ensayos: Ensayo[];
  tipoEnsayo: 'HDPE' | 'PP';
  onOpenDialog: (ensayo: Ensayo) => void;
}

function getStatusVariant(status: Ensayo['estado']) {
  switch (status) {
    case 'Aprobado':
      return 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30';
    case 'En Progreso':
    case 'En Análisis':
      return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30';
    case 'Rechazado':
      return 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30';
    case 'Pendiente de Revisión':
      return 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30';
    default:
      return 'bg-secondary';
  }
}

const formatValue = (value: any, decimals: number = 2) => {
    if (value === null || value === undefined || value === '' || isNaN(Number(value))) return 'N/A';
    return Number(value).toFixed(decimals);
};


export function EnsayosProductoTerminadoTable({ ensayos, tipoEnsayo, onOpenDialog }: EnsayosProductoTerminadoTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState('all');

  const filteredEnsayos = ensayos.filter(ensayo =>
    (ensayo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ensayo.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ensayo.lote?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const ensayoFiltersHdpe = [
    { value: 'all', label: 'Vista General' },
    { value: 'melt_index', label: 'Melt Index' },
    { value: 'densidad', label: 'Densidad' },
    { value: 'traccion', label: 'Tracción' },
    { value: 'negro_humo', label: '% Negro de Humo' },
    { value: 'dispersion_nh', label: 'Dispersión NH' },
    { value: 'tio', label: 'TIO' },
  ];

  const ensayoFiltersPp = [
    { value: 'all', label: 'Vista General' },
    { value: 'melt_index', label: 'Melt Index' },
    { value: 'densidad', label: 'Densidad' },
    { value: 'fibra_vidrio', label: 'Fibra de Vidrio' },
  ];

  const activeFilters = tipoEnsayo === 'HDPE' ? ensayoFiltersHdpe : ensayoFiltersPp;

  const renderHeaders = () => {
    switch (filterType) {
        case 'melt_index':
            return (<>
                <TableHead>Fecha</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead className="text-right">M.I. Materia Prima</TableHead>
                <TableHead className="text-right">M.I. Prod. Terminado</TableHead>
                <TableHead className="text-right">% Variación</TableHead>
                <TableHead>Estado</TableHead>
            </>);
        case 'densidad':
            return (<>
                <TableHead>Fecha</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead className="text-right">Densidad Calculada</TableHead>
                <TableHead>Estado</TableHead>
            </>);
        case 'traccion': // HDPE only
            return (<>
                <TableHead>Fecha</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead className="text-right">Resistencia Tracción</TableHead>
                <TableHead className="text-right">Elongación Ruptura</TableHead>
                <TableHead>Estado</TableHead>
            </>);
        case 'negro_humo': // HDPE only
            return (<>
                <TableHead>Fecha</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead className="text-right">% Negro Humo</TableHead>
                <TableHead>Estado</TableHead>
            </>);
        case 'dispersion_nh': // HDPE only
            return (<>
                <TableHead>Fecha</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead>Grado Dispersión</TableHead>
                <TableHead>Estado</TableHead>
            </>);
        case 'tio': // HDPE only
            return (<>
                <TableHead>Fecha</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead className="text-right">Tiempo Inducción</TableHead>
                <TableHead>Estado</TableHead>
            </>);
        case 'fibra_vidrio': // PP only
            return (<>
                <TableHead>Fecha</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead className="text-right">% FV Total</TableHead>
                <TableHead className="text-right">% FV Capa Intermedia</TableHead>
                <TableHead>Estado</TableHead>
            </>);
        default: // 'all'
            return (<>
                <TableHead>ID Muestra</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Analista</TableHead>
                <TableHead>Estado</TableHead>
            </>);
    }
  };

  const renderRow = (ensayo: Ensayo) => {
    switch (filterType) {
        case 'melt_index':
            return (<>
                <TableCell>{ensayo.fecha}</TableCell>
                <TableCell className="font-medium">{ensayo.producto}</TableCell>
                <TableCell>{ensayo.lote}</TableCell>
                <TableCell className="text-right font-mono">{formatValue(ensayo.melt_index_materia_prima, 4)}</TableCell>
                <TableCell className="text-right font-mono">{formatValue(ensayo.meltIndexCalculado, 4)}</TableCell>
                <TableCell className="text-right font-mono">{formatValue(ensayo.meltIndexVariacion, 2)}%</TableCell>
                <TableCell><Badge className={cn("border-transparent font-normal", getStatusVariant(ensayo.estado))}>{ensayo.estado}</Badge></TableCell>
            </>);
        case 'densidad':
            return (<>
                <TableCell>{ensayo.fecha}</TableCell>
                <TableCell className="font-medium">{ensayo.producto}</TableCell>
                <TableCell>{ensayo.lote}</TableCell>
                <TableCell className="text-right font-mono">{formatValue(ensayo.densidadCalculada, 4)}</TableCell>
                <TableCell><Badge className={cn("border-transparent font-normal", getStatusVariant(ensayo.estado))}>{ensayo.estado}</Badge></TableCell>
            </>);
        case 'traccion':
            return (<>
                <TableCell>{ensayo.fecha}</TableCell>
                <TableCell className="font-medium">{ensayo.producto}</TableCell>
                <TableCell>{ensayo.lote}</TableCell>
                <TableCell className="text-right font-mono">{formatValue(ensayo.resistencia_traccion, 2)} MPa</TableCell>
                <TableCell className="text-right font-mono">{formatValue(ensayo.elongacion_rotura, 2)} %</TableCell>
                <TableCell><Badge className={cn("border-transparent font-normal", getStatusVariant(ensayo.estado))}>{ensayo.estado}</Badge></TableCell>
            </>);
        case 'negro_humo':
            return (<>
                <TableCell>{ensayo.fecha}</TableCell>
                <TableCell className="font-medium">{ensayo.producto}</TableCell>
                <TableCell>{ensayo.lote}</TableCell>
                <TableCell className="text-right font-mono">{formatValue(ensayo.negroHumoCalculado, 2)} %</TableCell>
                <TableCell><Badge className={cn("border-transparent font-normal", getStatusVariant(ensayo.estado))}>{ensayo.estado}</Badge></TableCell>
            </>);
        case 'dispersion_nh':
            return (<>
                <TableCell>{ensayo.fecha}</TableCell>
                <TableCell className="font-medium">{ensayo.producto}</TableCell>
                <TableCell>{ensayo.lote}</TableCell>
                <TableCell>{ensayo.dispersion_nh || 'N/A'}</TableCell>
                <TableCell><Badge className={cn("border-transparent font-normal", getStatusVariant(ensayo.estado))}>{ensayo.estado}</Badge></TableCell>
            </>);
        case 'tio':
            return (<>
                <TableCell>{ensayo.fecha}</TableCell>
                <TableCell className="font-medium">{ensayo.producto}</TableCell>
                <TableCell>{ensayo.lote}</TableCell>
                <TableCell className="text-right font-mono">{formatValue(ensayo.tio_tiempo, 2)} min</TableCell>
                <TableCell><Badge className={cn("border-transparent font-normal", getStatusVariant(ensayo.estado))}>{ensayo.estado}</Badge></TableCell>
            </>);
        case 'fibra_vidrio':
            return (<>
                <TableCell>{ensayo.fecha}</TableCell>
                <TableCell className="font-medium">{ensayo.producto}</TableCell>
                <TableCell>{ensayo.lote}</TableCell>
                <TableCell className="text-right font-mono">{formatValue(ensayo.fvTotalPorcentaje, 2)} %</TableCell>
                <TableCell className="text-right font-mono">{formatValue(ensayo.fvIntermediaPorcentaje, 2)} %</TableCell>
                <TableCell><Badge className={cn("border-transparent font-normal", getStatusVariant(ensayo.estado))}>{ensayo.estado}</Badge></TableCell>
            </>);
        default: // 'all'
            return (<>
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
            </>);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 space-y-1.5">
            <CardTitle>Ensayos de Laboratorio: Tuberías {tipoEnsayo}</CardTitle>
            <CardDescription>
              Gestione y filtre los ensayos de producto terminado.
            </CardDescription>
          </div>
          <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID, producto o lote..."
                className="pl-9 w-full sm:w-64"
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
                    {activeFilters.map(filter => (
                        <SelectItem key={filter.value} value={filter.value}>{filter.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Acciones</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => onOpenDialog(ensayo)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar / Ingresar Datos
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
        {filteredEnsayos.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold">No se encontraron ensayos</h3>
            <p>Intente ajustar su búsqueda o filtros.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
