
"use client";

import * as React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, PlusCircle, Calendar, Wrench, CheckSquare, FileText } from "lucide-react";

import { useDynamicData, type Equipo, type ControlEvento } from "@/context/data-context";
import { cn } from "@/lib/utils";
import { ControlEventoDialog } from "./control-evento-dialog";

interface EquipoDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  equipo: Equipo;
}

function getStatusVariant(status: Equipo["estado"]) {
  switch (status) {
    case "Activo":
      return "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30";
    case "En Mantenimiento":
      return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30";
    case "Inactivo":
      return "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30";
    case "Requiere Calibración":
        return "bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30";
    default:
      return "bg-secondary";
  }
}

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <h4 className="text-sm font-semibold text-muted-foreground">{label}</h4>
    <p className="text-base text-foreground">{value || "No especificado"}</p>
  </div>
);

const EventoIcon = ({ tipo }: { tipo: ControlEvento['tipo']}) => {
    switch (tipo) {
        case 'Calibración': return <Calendar className="h-4 w-4 text-blue-500" />;
        case 'Verificación': return <CheckSquare className="h-4 w-4 text-green-500" />;
        case 'Mantenimiento Preventivo': return <Wrench className="h-4 w-4 text-yellow-500" />;
        case 'Mantenimiento Correctivo': return <Wrench className="h-4 w-4 text-red-500" />;
        default: return <FileText className="h-4 w-4" />;
    }
}

export function EquipoDetailsDialog({ isOpen, onClose, onEdit, equipo }: EquipoDetailsDialogProps) {
  const { controles } = useDynamicData();
  const [isEventoDialogOpen, setIsEventoDialogOpen] = React.useState(false);

  if (!equipo) return null;

  const equipoControles = controles
    .filter(c => c.equipoId === equipo.id)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{equipo.nombre}</DialogTitle>
            <DialogDescription>
              Detalles completos para el equipo con ID de activo: <span className="font-mono">{equipo.id}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-grow overflow-y-auto pr-6 -mr-6 custom-scrollbar">
            <Tabs defaultValue="detalles" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="detalles">Detalles del Equipo</TabsTrigger>
                <TabsTrigger value="historial">Historial de Control</TabsTrigger>
              </TabsList>
              
              <TabsContent value="detalles" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                      <div className="md:col-span-1">
                          <div className="relative w-full h-64 rounded-lg bg-muted flex items-center justify-center overflow-hidden border">
                              {equipo.fotoUrl ? (
                              <Image src={equipo.fotoUrl} alt={equipo.nombre} layout="fill" objectFit="contain" />
                              ) : (
                              <span className="text-sm text-muted-foreground">Sin fotografía</span>
                              )}
                          </div>
                      </div>
                      <div className="md:col-span-2 grid grid-cols-2 gap-x-6 gap-y-4">
                          <DetailItem label="ID de Activo" value={<span className="font-mono">{equipo.id}</span>} />
                          <DetailItem label="Nombre del Equipo" value={equipo.nombre} />
                          <DetailItem label="Marca" value={equipo.marca} />
                          <DetailItem label="Modelo" value={equipo.modelo} />
                          <DetailItem label="Ubicación" value={equipo.ubicacion} />
                          <DetailItem label="Criticidad" value={equipo.criticidad} />
                          <DetailItem label="Próxima Calibración" value={format(new Date(equipo.proxima_calibracion), 'dd/MM/yyyy')} />
                          <div>
                              <h4 className="text-sm font-semibold text-muted-foreground">Estado</h4>
                              <Badge className={cn("mt-1 border-transparent font-normal text-base", getStatusVariant(equipo.estado))}>
                                  {equipo.estado}
                              </Badge>
                          </div>
                          <div className="col-span-2">
                              <DetailItem label="Observaciones" value={equipo.observaciones || "Sin observaciones."} />
                          </div>
                      </div>
                  </div>
              </TabsContent>

              <TabsContent value="historial" className="mt-4">
                  <div className="py-4">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">Historial de Mantenimiento y Calibración</h3>
                          <Button onClick={() => setIsEventoDialogOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4"/>
                            Registrar Evento
                          </Button>
                      </div>
                      {equipoControles.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Tipo</TableHead>
                              <TableHead>Fecha</TableHead>
                              <TableHead>Responsable</TableHead>
                              <TableHead>Observaciones</TableHead>
                              <TableHead>Certificado</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {equipoControles.map(control => (
                              <TableRow key={control.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                       <EventoIcon tipo={control.tipo} />
                                       <span>{control.tipo}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{format(new Date(control.fecha), 'dd/MM/yyyy')}</TableCell>
                                <TableCell>{control.responsable}</TableCell>
                                <TableCell className="max-w-xs truncate">{control.observaciones || "N/A"}</TableCell>
                                <TableCell>
                                  {control.certificadoUrl ? (
                                    <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                                      <a href={control.certificadoUrl} target="_blank" rel="noopener noreferrer">Ver</a>
                                    </Button>
                                  ) : "N/A"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                         <p className="text-sm text-muted-foreground text-center py-8 bg-muted rounded-md">
                            No hay eventos de control registrados para este equipo.
                         </p>
                      )}
                  </div>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={onClose}>Cerrar</Button>
            <Button onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Equipo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ControlEventoDialog 
        isOpen={isEventoDialogOpen}
        onClose={() => setIsEventoDialogOpen(false)}
        equipo={equipo}
      />
    </>
  );
}
