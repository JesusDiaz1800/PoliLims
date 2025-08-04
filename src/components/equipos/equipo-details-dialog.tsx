

"use client";

import * as React from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, PlusCircle } from "lucide-react";

import { useDynamicData, type Equipo, type ControlEvento } from "@/context/data-context";
import { cn } from "@/lib/utils";
import { ControlEventoDialog } from "./control-evento-dialog";
import { ControlEventosTable } from "./control-eventos-table";

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

const ensayosDisponibles = [
  { id: 'melt_index', label: 'Melt Index' },
  { id: 'densidad', label: 'Densidad' },
  { id: 'traccion', label: 'Tracción y Elongación' },
  { id: 'negro_humo', label: 'Porcentaje de Negro de Humo' },
  { id: 'dispersion_nh', label: 'Dispersión de Negro de Humo' },
  { id: 'tio', label: 'Tiempo de Inducción a la Oxidación (TIO)' },
  { id: 'fibra_vidrio', label: 'Porcentaje de Fibra de Vidrio' },
  { id: 'dsc', label: 'DSC (Calorimetría Diferencial de Barrido)' },
  { id: 'humedad', label: 'Porcentaje de Humedad' },
];


const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <h4 className="text-sm font-semibold text-muted-foreground">{label}</h4>
    <p className="text-base text-foreground">{value || "No especificado"}</p>
  </div>
);


export function EquipoDetailsDialog({ isOpen, onClose, onEdit, equipo }: EquipoDetailsDialogProps) {
  const { controles } = useDynamicData();
  const [isEventoDialogOpen, setIsEventoDialogOpen] = React.useState(false);

  if (!equipo) return null;

  const equipoControles = controles
    .filter(c => c.equipoId === equipo.id)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    
  const ensayosAsociadosLabels = (equipo.ensayos_asociados || [])
    .map(id => ensayosDisponibles.find(e => e.id === id)?.label)
    .filter(Boolean);

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
                          <DetailItem label="N° Serie" value={equipo.numero_serie || "N/A"} />
                          <DetailItem label="Ubicación" value={equipo.ubicacion} />
                          <DetailItem label="Puesta en Marcha" value={equipo.fecha_puesta_marcha || "N/A"} />
                          <DetailItem label="Próxima Calibración" value={equipo.proxima_calibracion} />
                           <DetailItem label="Criticidad" value={equipo.criticidad} />
                          <div>
                              <h4 className="text-sm font-semibold text-muted-foreground">Estado</h4>
                              <Badge className={cn("mt-1 border-transparent font-normal text-base", getStatusVariant(equipo.estado))}>
                                  {equipo.estado}
                              </Badge>
                          </div>
                      </div>
                      <div className="md:col-span-3">
                          <Separator className="my-2"/>
                          <DetailItem label="Ensayos Asociados" value={
                              ensayosAsociadosLabels.length > 0 
                                  ? <div className="flex flex-wrap gap-2 mt-1">{ensayosAsociadosLabels.map(label => <Badge key={label} variant="secondary">{label}</Badge>)}</div>
                                  : "Ninguno"
                          } />
                          <Separator className="my-4"/>
                          <DetailItem label="Observaciones" value={equipo.observaciones || "Sin observaciones."} />
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
                      <ControlEventosTable controles={equipoControles} equipos={[equipo]} isDialogView />
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
