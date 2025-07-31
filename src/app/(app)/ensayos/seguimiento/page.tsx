
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
import { TipoProducto, matrizProductos } from "@/lib/matriz-datos";
import { useDataContext } from "@/context/data-context";
import { useRouter } from "next/navigation";


export type Ensayo = ReturnType<typeof useDataContext>["ensayos"][0] & { productoInfo?: TipoProducto };

function getStatusVariant(status: string) {
    switch (status) {
        case "Aprobado": return "bg-green-500/20 text-green-300 border-green-500/30";
        case "En Progreso": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
        case "Rechazado": return "bg-red-500/20 text-red-300 border-red-500/30";
        case "Pendiente de Revisión": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
        default: return "bg-secondary";
    }
}

export default function SeguimientoEnsayosPage() {
  const router = useRouter();
  const { ensayos } = useDataContext();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterType, setFilterType] = React.useState("Todos");
  
  const ensayoTypes = ["Todos", ...Array.from(new Set(ensayos.map(e => e.tipo)))];

  const filteredEnsayos = ensayos
    .filter(ensayo => filterType === "Todos" || ensayo.tipo === filterType)
    .filter(ensayo => 
      ensayo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ensayo.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ensayo.analista.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  const handleRedirectToRegister = () => {
    // A simple redirect logic, could be a dropdown in a real app
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
        // Redirect to a generic view page or show a toast
        path = `/ensayos/seguimiento`; 
        break;
    }
    // Append assay ID as a query parameter
    router.push(`${path}?id=${ensayo.id}`);
  };


  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
            <div className="space-y-1.5">
                <CardTitle>Seguimiento de Ensayos</CardTitle>
                <CardDescription>Visualice y filtre todos los ensayos registrados en el sistema.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar por ID, tipo o analista..."
                        className="pl-9 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[200px]">
                      <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                      {ensayoTypes.map(type => (
                         <SelectItem key={type} value={type}>{type === "Todos" ? "Todos los tipos" : type}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                 <Button onClick={handleRedirectToRegister}>
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
              <TableHead>ID Muestra</TableHead>
              <TableHead>Tipo de Ensayo</TableHead>
              <TableHead>Analista Asignado</TableHead>
              <TableHead>Fecha de Registro</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEnsayos.map((ensayo) => (
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
