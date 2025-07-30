
"use client"

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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Search, CheckCircle, AlertCircle, TestTube, FilePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { EnsayosMecanicosDialog } from "@/components/ensayos/ensayos-mecanicos-dialog";
import { TipoProducto, matrizProductos } from "@/lib/matriz-datos";

const initialRegistros = [
  {
    id: "REG-001",
    fecha: "2024-07-25",
    hora: "10:30",
    inspector: "Elias Ibañez",
    maquina: "Máquina 5",
    producto: "Tuberia PEAD 90 mm PN10",
    resultado: "Conforme",
    enviado_lab: true,
  },
  {
    id: "REG-002",
    fecha: "2024-07-25",
    hora: "11:15",
    inspector: "Cristian Montellano",
    maquina: "Máquina 2",
    producto: "Tuberia FASER BETA-FIBRA 25 mm PN20",
    resultado: "No Conforme",
    enviado_lab: true,
  },
  {
    id: "REG-003",
    fecha: "2024-07-24",
    hora: "14:00",
    inspector: "Daniel Palma",
    maquina: "PE1",
    producto: "Tuberia PEAD 20 mm PN10",
    resultado: "Conforme",
    enviado_lab: false,
  },
  {
    id: "REG-004",
    fecha: "2024-07-24",
    hora: "16:45",
    inspector: "Luis Parada",
    maquina: "Máquina 9",
    producto: "Tuberia PP-R 20 mm PN20",
    resultado: "Conforme",
    enviado_lab: true,
  },
];

export type Registro = typeof initialRegistros[0] & { productoInfo?: TipoProducto };

interface ControlRutinarioTableProps {
  onAddRecordClick: () => void;
}

export function ControlRutinarioTable({ onAddRecordClick }: ControlRutinarioTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedRegistro, setSelectedRegistro] = React.useState<Registro | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const filteredRegistros = initialRegistros
    .filter(registro => 
      registro.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registro.inspector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registro.producto.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleOpenDialog = (registro: Registro) => {
    const productoInfo = matrizProductos.find(p => p.producto === registro.producto);
    setSelectedRegistro({ ...registro, productoInfo });
    setIsDialogOpen(true);
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedRegistro(null);
  }


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                  <CardTitle>Historial de Controles Rutinarios</CardTitle>
                  <CardDescription>Visualice y filtre los últimos registros de control de calidad ingresados.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                          placeholder="Buscar por ID, inspector o producto..."
                          className="pl-9 w-64"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                      />
                  </div>
                  <Button onClick={onAddRecordClick}>
                    <FilePlus className="mr-2 h-4 w-4" />
                    Añadir Nuevo Control
                  </Button>
              </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha / Hora</TableHead>
                <TableHead>Inspector</TableHead>
                <TableHead>Máquina</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead className="text-center">Enviado a Lab</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistros.map((registro) => (
                <TableRow key={registro.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{registro.fecha}</span>
                      <span className="text-muted-foreground text-xs">{registro.hora}</span>
                    </div>
                  </TableCell>
                  <TableCell>{registro.inspector}</TableCell>
                  <TableCell>{registro.maquina}</TableCell>
                  <TableCell className="font-medium">{registro.producto}</TableCell>
                  <TableCell>
                    <Badge variant={registro.resultado === 'Conforme' ? 'default' : 'destructive'} className={cn(
                      registro.resultado === 'Conforme' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30', "border-transparent"
                    )}>
                      {registro.resultado === 'Conforme' ? <CheckCircle className="mr-1.5 h-3.5 w-3.5"/> : <AlertCircle className="mr-1.5 h-3.5 w-3.5"/>}
                      {registro.resultado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {registro.enviado_lab ? (
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 border-transparent">
                        Sí
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-dashed">
                        No
                      </Badge>
                    )}
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
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Imprimir Registro</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleOpenDialog(registro)}>
                          <TestTube className="mr-2 h-4 w-4" />
                          Ingresar Ensayos Mecánicos
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {filteredRegistros.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                  <Search className="mx-auto h-12 w-12 mb-4" />
                  <h3 className="text-xl font-semibold">No se encontraron registros</h3>
                  <p>Intente ajustar su búsqueda o ingrese un nuevo control.</p>
              </div>
          )}
        </CardContent>
      </Card>
      {selectedRegistro && (
          <EnsayosMecanicosDialog
              // Cast selectedRegistro to the type expected by the dialog
              // This is a temporary solution until the data models are unified
              ensayo={{
                id: selectedRegistro.id,
                tipo: 'Control Rutinario',
                analista: selectedRegistro.inspector,
                fecha: selectedRegistro.fecha,
                estado: selectedRegistro.resultado,
                producto: selectedRegistro.producto,
                productoInfo: selectedRegistro.productoInfo,
              }}
              isOpen={isDialogOpen}
              onClose={handleDialogClose}
          />
      )}
    </>
  );
}
