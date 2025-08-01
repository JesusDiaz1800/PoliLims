
"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, PlusCircle, Search, Filter, Pencil, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDynamicData } from "@/context/data-context";
import { useRouter } from "next/navigation";


export type Ensayo = ReturnType<typeof useDynamicData>["ensayos"][0];

function getStatusVariant(status: string) {
    switch (status) {
        case "Aprobado": return "bg-green-500/20 text-green-300 border-green-500/30";
        case "En Progreso": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
        case "Rechazado": return "bg-red-500/20 text-red-300 border-red-500/30";
        case "Pendiente de Revisión": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
        default: return "bg-secondary";
    }
}

const specificAssayFilters = [
    { value: "all", label: "Todos los Ensayos" },
    { value: "melt_index", label: "Melt Index" },
    { value: "densidad", label: "Densidad" },
    { value: "negro_humo", label: "Negro de Humo" },
];

export default function SeguimientoEnsayosPage() {
  const router = useRouter();
  const { ensayos } = useDynamicData();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterType, setFilterType] = React.useState("Todos");
  const [specificAssay, setSpecificAssay] = React.useState("all");
  
  const ensayoTypes = ["Todos", ...Array.from(new Set(ensayos.map(e => e.tipo)))];

  const filteredEnsayos = ensayos
    .filter(ensayo => filterType === "Todos" || ensayo.tipo === filterType)
    .filter(ensayo => 
      ensayo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ensayo.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ensayo.analista.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(ensayo => {
        if (specificAssay === 'all') return true;
        if (specificAssay === 'melt_index') return ensayo.meltIndexCalculado !== undefined;
        if (specificAssay === 'densidad') return ensayo.densidadCalculada !== undefined;
        if (specificAssay === 'negro_humo') return ensayo.negroHumoCalculado !== undefined;
        return true;
    });
  
  const handleRedirectToRegister = () => {
    router.push('/ensayos/control-rutinario');
  }

  const handleEditClick = (ensayo: Ensayo) => {
    let path = '';
    switch (ensayo.tipo) {
      case 'Tubería HDPE':
        path = '/ensayos/tuberias/hdpe';
        break;
      case 'Tubería PP':
        path = '/ensayos/tuberias/pp';
        break;
      case 'Materia Prima':
        path = '/ensayos/materia-prima';
        break;
      case 'Reprocesado':
        path = '/ensayos/reprocesado';
        break;
      default:
        path = `/ensayos/seguimiento`; 
        break;
    }
    router.push(`${path}?id=${ensayo.id}`);
  };

  const renderTableHeaders = () => {
      const baseHeaders = (
        <>
            <TableHead>ID Muestra</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Lote</TableHead>
            <TableHead>Analista</TableHead>
        </>
      );

      switch(specificAssay) {
        case 'melt_index':
            return (
                <>
                    {baseHeaders}
                    <TableHead>Resultado [g/10min]</TableHead>
                    <TableHead>% Variación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead><span className="sr-only">Acciones</span></TableHead>
                </>
            );
        case 'densidad':
            return (
                <>
                    {baseHeaders}
                    <TableHead>Resultado [g/cm³]</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead><span className="sr-only">Acciones</span></TableHead>
                </>
            );
        case 'negro_humo':
            return (
                <>
                    {baseHeaders}
                    <TableHead>Resultado [%]</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead><span className="sr-only">Acciones</span></TableHead>
                </>
            );
        default:
             return (
                <>
                    <TableHead>ID Muestra</TableHead>
                    <TableHead>Tipo de Ensayo</TableHead>
                    <TableHead>Analista Asignado</TableHead>
                    <TableHead>Fecha de Registro</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                    <TableHead><span className="sr-only">Acciones</span></TableHead>
                </>
            );
      }
  };

  const renderTableRow = (ensayo: Ensayo) => {
       const baseCells = (
        <>
            <TableCell className="font-mono">{ensayo.id}</TableCell>
            <TableCell className="font-medium">{ensayo.producto}</TableCell>
            <TableCell>{ensayo.lote || 'N/A'}</TableCell>
            <TableCell>{ensayo.analista}</TableCell>
        </>
       );

       const actionsCell = (
        <TableCell>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditClick(ensayo)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                </DropdownMenuItem>
                <DropdownMenuItem>Imprimir Certificado</DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </TableCell>
       );

       switch(specificAssay) {
         case 'melt_index':
            return (
                <TableRow key={ensayo.id}>
                    {baseCells}
                    <TableCell>{ensayo.meltIndexCalculado?.toFixed(4)}</TableCell>
                    <TableCell>{ensayo.meltIndexVariacion?.toFixed(2)}%</TableCell>
                    <TableCell><Badge className={cn("border-transparent", getStatusVariant(ensayo.estado))}>{ensayo.estado}</Badge></TableCell>
                    {actionsCell}
                </TableRow>
            );
        case 'densidad':
            return (
                <TableRow key={ensayo.id}>
                    {baseCells}
                    <TableCell>{ensayo.densidadCalculada?.toFixed(4)}</TableCell>
                    <TableCell><Badge className={cn("border-transparent", getStatusVariant(ensayo.estado))}>{ensayo.estado}</Badge></TableCell>
                    {actionsCell}
                </TableRow>
            );
        case 'negro_humo':
            return (
                <TableRow key={ensayo.id}>
                    {baseCells}
                    <TableCell>{ensayo.negroHumoCalculado?.toFixed(2)}%</TableCell>
                    <TableCell><Badge className={cn("border-transparent", getStatusVariant(ensayo.estado))}>{ensayo.estado}</Badge></TableCell>
                    {actionsCell}
                </TableRow>
            );
        default:
            return (
              <TableRow key={ensayo.id}>
                <TableCell className="font-mono">{ensayo.id}</TableCell>
                <TableCell className="font-medium">{ensayo.tipo}</TableCell>
                <TableCell>{ensayo.analista}</TableCell>
                <TableCell>{ensayo.fecha}</TableCell>
                <TableCell className="text-center">
                  <Badge className={cn("border-transparent", getStatusVariant(ensayo.estado))}>
                    {ensayo.estado}
                  </Badge>
                </TableCell>
                {actionsCell}
              </TableRow>
            );
       }
  };


  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
                <CardTitle>Seguimiento de Ensayos</CardTitle>
                <CardDescription>Visualice y filtre todos los ensayos registrados en el sistema.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                 <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar por ID, producto o analista..."
                        className="pl-9 w-full sm:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                 <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                      <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                      {ensayoTypes.map(type => (
                         <SelectItem key={type} value={type}>{type === "Todos" ? "Todos los tipos" : type}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                 <Select value={specificAssay} onValueChange={setSpecificAssay}>
                  <SelectTrigger className="w-full sm:w-[220px]">
                      <FlaskConical className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Filtrar por ensayo" />
                  </SelectTrigger>
                  <SelectContent>
                      {specificAssayFilters.map(filter => (
                         <SelectItem key={filter.value} value={filter.value}>{filter.label}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                 <Button onClick={handleRedirectToRegister} className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Registrar Nuevo Ensayo
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {renderTableHeaders()}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEnsayos.map((ensayo) => renderTableRow(ensayo))}
          </TableBody>
        </Table>
         {filteredEnsayos.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
                <Search className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-xl font-semibold">No se encontraron resultados</h3>
                <p>Intente ajustar su búsqueda o filtros.</p>
            </div>
        )}
      </CardContent>
    </Card>
    </>
  );
}

