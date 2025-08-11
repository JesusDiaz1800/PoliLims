
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
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Search, CheckCircle, AlertCircle, TestTube, FilePlus, Trash2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { EnsayosMecanicosDialog } from "@/components/ensayos/ensayos-mecanicos-dialog";
import { TipoProducto } from "@/lib/matriz-datos";
import type { Ensayo, Registro } from "@/context/data-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast";
import { deleteRegistroAction } from "@/app/(app)/ensayos/control-rutinario/actions";


export type EnrichedRegistro = Registro & { productoInfo?: TipoProducto };

interface ControlRutinarioTableProps {
  registros: Registro[];
  ensayos: Ensayo[];
  onAddRecordClick: () => void;
  matrizProductos: TipoProducto[];
}

const ControlRutinarioTableInternal = ({ registros, ensayos, onAddRecordClick, matrizProductos }: ControlRutinarioTableProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedRegistro, setSelectedRegistro] = React.useState<EnrichedRegistro | null>(null);
  const [isMecanicosDialogOpen, setIsMecanicosDialogOpen] = React.useState(false);

  const filteredRegistros = React.useMemo(() => {
    return registros.filter(registro => 
      registro.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registro.inspector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registro.producto.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [registros, searchTerm]);

  const handleOpenMecanicosDialog = (registro: Registro) => {
    const productoInfo = matrizProductos.find(p => p.producto === registro.producto);
    setSelectedRegistro({ ...registro, productoInfo });
    setIsMecanicosDialogOpen(true);
  }

  const handleMecanicosDialogClose = () => {
    setIsMecanicosDialogOpen(false);
    setSelectedRegistro(null);
  }

  const handleDelete = async (registroId: string) => {
      const result = await deleteRegistroAction(registroId);
      if (result.success) {
          toast({
              title: "Registro Eliminado",
              description: result.message,
          });
      } else {
          toast({
              variant: "destructive",
              title: "Error al Eliminar",
              description: result.message,
          });
      }
  };

  const formatValue = (value: any, decimals: number = 2) => {
    if (value === null || value === undefined || isNaN(Number(value)) || String(value).trim() === '') return 'N/A';
    return Number(value).toFixed(decimals);
  }
  
  const findLabResults = React.useCallback((registroId: string): Ensayo | undefined => {
    return ensayos.find(e => e.id_muestra === registroId);
  }, [ensayos])


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Historial de Controles Rutinarios</CardTitle>
          <CardDescription>Visualice y filtre los últimos registros de control de calidad ingresados, incluyendo resultados de laboratorio.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-start gap-2 w-full mb-4">
              <div className="relative w-full sm:w-auto flex-1 md:flex-initial max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                      placeholder="Buscar por ID, inspector o producto..."
                      className="pl-9 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <Button onClick={onAddRecordClick} className="w-full sm:w-auto">
                  <FilePlus className="mr-2 h-4 w-4" />
                  Ingresar Producto
              </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Acciones</TableHead>
                <TableHead>Fecha ingreso</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Inspector</TableHead>
                <TableHead>Maquinista</TableHead>
                <TableHead>Máquina</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Diámetro [mm]</TableHead>
                <TableHead>Espesor Mín. [mm]</TableHead>
                <TableHead>Espesor Máx. [mm]</TableHead>
                <TableHead>Largo [mm]</TableHead>
                <TableHead>Peso muestra [g]</TableHead>
                <TableHead>Peso [kg/m]</TableHead>
                <TableHead>Ovalidad [mm]</TableHead>
                <TableHead>Observaciones</TableHead>
                <TableHead>Color Tubería</TableHead>
                <TableHead>Color Línea</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>Enviado a Lab</TableHead>
                <TableHead>Ensayos Mecánicos</TableHead>
                <TableHead className="text-right">M.I. [g/10min]</TableHead>
                <TableHead className="text-right">Var. M.I. [%]</TableHead>
                <TableHead className="text-right">Densidad [g/cm³]</TableHead>
                <TableHead className="text-right">% Negro Humo</TableHead>
                <TableHead className="text-right">% Fibra Vidrio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistros.map((registro) => {
                const labResults = findLabResults(registro.id);
                return (
                <TableRow key={registro.id}>
                  <TableCell>
                    <AlertDialog>
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
                          <DropdownMenuItem disabled>Editar</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenMecanicosDialog(registro)}>
                            <TestTube className="mr-2 h-4 w-4" />
                            Ingresar Ensayos Mecánicos
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
                                Esta acción no se puede deshacer. Esto eliminará permanentemente el registro de control
                                <span className="font-bold"> {registro.id}</span> de los servidores.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(registro.id)} className={cn(buttonVariants({variant: "destructive"}))}>
                                Sí, eliminar registro
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                  <TableCell>{registro.fecha}</TableCell>
                  <TableCell>{registro.hora}</TableCell>
                  <TableCell>{registro.inspector}</TableCell>
                  <TableCell>{registro.maquinista}</TableCell>
                  <TableCell>{registro.maquina}</TableCell>
                  <TableCell className="font-medium max-w-xs truncate">{registro.producto}</TableCell>
                  <TableCell>{registro.marca || 'N/A'}</TableCell>
                  <TableCell>{formatValue(registro.diametro)}</TableCell>
                  <TableCell>{formatValue(registro.espesor_min)}</TableCell>
                  <TableCell>{formatValue(registro.espesor_max)}</TableCell>
                  <TableCell>{formatValue(registro.largo,0)}</TableCell>
                  <TableCell>{formatValue(registro.peso_muestra,0)}</TableCell>
                  <TableCell>{formatValue(registro.peso_kg_m, 4)}</TableCell>
                  <TableCell>{formatValue(registro.ovalidad)}</TableCell>
                  <TableCell className="max-w-xs truncate">{registro.observaciones_visuales || 'N/A'}</TableCell>
                  <TableCell>{registro.color_tuberia || 'N/A'}</TableCell>
                  <TableCell>{registro.color_linea || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={registro.resultado === 'Conforme' ? 'default' : 'destructive'} className={cn(
                      "font-normal border-transparent",
                       registro.resultado === 'Conforme' 
                        ? 'bg-green-500/20 text-green-700 dark:text-green-300' 
                        : 'bg-orange-500/20 text-orange-700 dark:text-orange-300'
                    )}>
                      {registro.resultado === 'Conforme' ? <CheckCircle className="mr-1.5 h-3.5 w-3.5"/> : <AlertCircle className="mr-1.5 h-3.5 w-3.5"/>}
                      {registro.resultado}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {registro.enviado_lab ? (
                      <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30 border-transparent font-normal">
                        Sí
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-dashed font-normal">
                        No
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                      <Badge variant="outline" className="border-dashed font-normal">
                          Pendiente
                      </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">{formatValue(labResults?.meltIndexCalculado, 4)}</TableCell>
                  <TableCell className="text-right font-mono">{formatValue(labResults?.meltIndexVariacion, 2)}%</TableCell>
                  <TableCell className="text-right font-mono">{formatValue(labResults?.densidadCalculada, 4)}</TableCell>
                  <TableCell className="text-right font-mono">{formatValue(labResults?.negroHumoCalculado, 2)}%</TableCell>
                  <TableCell className="text-right font-mono">{formatValue(labResults?.fvTotalPorcentaje, 2)}%</TableCell>
                </TableRow>
              )})}
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
              ensayo={{
                id: selectedRegistro.id,
                producto: selectedRegistro.producto,
                productoInfo: selectedRegistro.productoInfo,
              }}
              isOpen={isMecanicosDialogOpen}
              onClose={handleMecanicosDialogClose}
          />
      )}
    </>
  );
};
export const ControlRutinarioTable = React.memo(ControlRutinarioTableInternal);
