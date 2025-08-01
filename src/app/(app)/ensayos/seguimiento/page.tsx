
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
import { MoreHorizontal, PlusCircle, Search, Filter, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDynamicData } from "@/context/data-context";
import { useRouter } from "next/navigation";


export type Ensayo = ReturnType<typeof useDynamicData>["ensayos"][0];

function getStatusVariant(status: string) {
    switch (status) {
        case "Aprobado": return "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30";
        case "En Progreso": return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30";
        case "En Análisis": return "bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30";
        case "Rechazado": return "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30";
        case "Pendiente de Revisión": return "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30";
        default: return "bg-secondary";
    }
}

export default function SeguimientoEnsayosPage() {
  const router = useRouter();
  const { ensayos } = useDynamicData();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterType, setFilterType] = React.useState("Todos");
  
  const ensayoTypes = ["Todos", ...Array.from(new Set(ensayos.map(e => e.tipo)))];

  const filteredEnsayos = ensayos
    .filter(ensayo => filterType === "Todos" || ensayo.tipo === filterType)
    .filter(ensayo => 
      ensayo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ensayo.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ensayo.analista.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ensayo.lote && ensayo.lote.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  
  const handleRedirectToRegister = () => {
    router.push('/ensayos/control-rutinario');
  }

  const handleEditClick = (ensayo: Ensayo) => {
    let path = '';
    let queryParams = `?id=${ensayo.id}`;

    // Pass the full user query string to maintain filters
    if (typeof window !== 'undefined') {
        const currentQuery = new URLSearchParams(window.location.search);
        currentQuery.set('id', ensayo.id);
        queryParams = `?${currentQuery.toString()}`;
    }


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
    router.push(`${path}${queryParams}`);
  };

  const formatValue = (value: any, decimals: number = 2) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    return Number(value).toFixed(decimals);
  }

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
                <CardTitle>Seguimiento General de Ensayos</CardTitle>
                <CardDescription>Visualice y filtre todos los ensayos registrados y sus principales resultados.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                 <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar por ID, producto, lote..."
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
              <TableHead>Producto</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead>Analista</TableHead>
              <TableHead className="text-right">Melt Index</TableHead>
              <TableHead className="text-right">Densidad</TableHead>
              <TableHead className="text-right">% Negro Humo</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead><span className="sr-only">Acciones</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEnsayos.map((ensayo) => (
                <TableRow key={ensayo.id}>
                    <TableCell>
                        <div className="flex flex-col">
                            <span className="font-medium">{ensayo.producto}</span>
                            <span className="text-xs text-muted-foreground font-mono">{ensayo.id}</span>
                        </div>
                    </TableCell>
                    <TableCell>{ensayo.lote || 'N/A'}</TableCell>
                    <TableCell>{ensayo.analista}</TableCell>
                    <TableCell className="text-right font-mono">{formatValue(ensayo.meltIndexCalculado, 4)}</TableCell>
                    <TableCell className="text-right font-mono">{formatValue(ensayo.densidadCalculada, 4)}</TableCell>
                    <TableCell className="text-right font-mono">{formatValue(ensayo.negroHumoCalculado, 2)}</TableCell>
                    <TableCell className="text-center">
                        <Badge className={cn("border-transparent", getStatusVariant(ensayo.estado))}>
                            {ensayo.estado}
                        </Badge>
                    </TableCell>
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
                                Editar / Ingresar Datos
                            </DropdownMenuItem>
                            <DropdownMenuItem>Imprimir Certificado</DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
              </TableRow>
            ))}
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
