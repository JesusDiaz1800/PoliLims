

"use client";

import * as React from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useDynamicData, type Equipo } from "@/context/data-context";

interface ControlEventoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  equipo: Equipo;
}

const formSchema = z.object({
  tipo: z.enum(['Calibración', 'Verificación', 'Mantenimiento Preventivo', 'Mantenimiento Correctivo']),
  fecha: z.date({ required_error: "La fecha del evento es requerida." }),
  responsable: z.string().nonempty("El responsable es requerido."),
  proximo_control: z.date().optional(),
  observaciones: z.string().optional(),
  certificadoUrl: z.string().url().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export function ControlEventoDialog({ isOpen, onClose, equipo }: ControlEventoDialogProps) {
  const { toast } = useToast();
  const { addControlEvento, updateEquipo, addRecentActivity } = useDynamicData();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: 'Calibración',
      fecha: new Date(),
      responsable: '',
      observaciones: '',
      certificadoUrl: '',
    },
  });
  
  const watchedTipo = form.watch("tipo");

  const onSubmit = async (data: FormValues) => {
    try {
        await addControlEvento({
            equipoId: equipo.id,
            ...data,
            fecha: format(data.fecha, "dd-MM-yyyy"),
        });

        const updates: Partial<Equipo> = {};
        if (data.proximo_control) {
            updates.proxima_calibracion = format(data.proximo_control, "dd-MM-yyyy");
        }
        
        if (data.tipo === 'Mantenimiento Correctivo') {
            updates.estado = 'En Mantenimiento';
        } else if (equipo.estado === 'En Mantenimiento') {
            updates.estado = 'Activo';
        }

        if (Object.keys(updates).length > 0) {
            await updateEquipo(equipo.id, updates);
        }
        
        await addRecentActivity({
            user: data.responsable,
            action: `registró un evento de '${data.tipo}' para el equipo ${equipo.nombre}`,
        });

        toast({
            title: "Evento Registrado",
            description: `Se ha añadido un nuevo evento de control para ${equipo.nombre}.`,
        });

        form.reset();
        onClose();
    } catch (error) {
        console.error("Error al guardar evento de control:", error);
        toast({
            variant: "destructive",
            title: "Error al Guardar",
            description: "No se pudo registrar el evento. Por favor, intente de nuevo.",
        });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Evento de Control</DialogTitle>
          <DialogDescription>
            Añada un nuevo registro de calibración, verificación o mantenimiento para el equipo <span className="font-bold">{equipo.nombre}</span>.
          </DialogDescription>
        </DialogHeader>
        <Form {...form} form={form} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Evento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el tipo de evento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Calibración">Calibración</SelectItem>
                      <SelectItem value="Verificación">Verificación</SelectItem>
                      <SelectItem value="Mantenimiento Preventivo">Mantenimiento Preventivo</SelectItem>
                      <SelectItem value="Mantenimiento Correctivo">Mantenimiento Correctivo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="fecha"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Fecha del Evento</FormLabel>
                        <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button
                                variant={"outline"}
                                className={cn("w-full justify-start text-left font-normal",!field.value && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "dd-MM-yyyy") : <span>Seleccione fecha</span>}
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/></PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 { (watchedTipo === "Calibración" || watchedTipo === "Mantenimiento Preventivo") &&
                     <FormField
                        control={form.control}
                        name="proximo_control"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Fecha Próximo Control</FormLabel>
                            <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn("w-full justify-start text-left font-normal",!field.value && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? format(field.value, "dd-MM-yyyy") : <span>Seleccione fecha</span>}
                                </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/></PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                 }
            </div>
             <FormField
                control={form.control}
                name="responsable"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Responsable</FormLabel>
                    <FormControl>
                        <Input placeholder="Nombre del analista o servicio externo" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="observaciones"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Observaciones</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Describa el trabajo realizado, resultados, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
             { watchedTipo === "Calibración" &&
                <FormField
                    control={form.control}
                    name="certificadoUrl"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>URL del Certificado (Opcional)</FormLabel>
                        <FormControl>
                            <Input placeholder="https://ejemplo.com/certificado.pdf" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
             }
            <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Evento
                </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
