

"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Save } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useDynamicData, type Importacion } from "@/context/data-context";
import { Checkbox } from "../ui/checkbox";

interface ImportacionFormProps {
  importacionToEdit: Importacion | null;
  onFormSubmit: () => void;
}

const formSchema = z.object({
  bl: z.string().nonempty("El N° de BL es requerido."),
  proveedor: z.string().optional(),
  fecha_embarque: z.date().optional(),
  sca: z.string().optional(),
  fecha_emision_cert: z.date().optional(),
  di: z.string().optional(),
  etiqueta_rango_inicio: z.string().optional(),
  etiqueta_rango_fin: z.string().optional(),
  operacion: z.string().optional(),
  fecha_solicitada: z.date().optional(),
  fecha_entrega_calidad: z.date().optional(),
  cantidad_lote: z.number().optional(),
  fecha_devolucion: z.date().optional(),
  fecha_liberacion: z.date().optional(),
  ingresado_siss: z.boolean().optional(),
  fecha_caducidad_cert: z.date().optional(),
  estado: z.enum(['CADUCADO', 'VIGENTE', 'EN TRANSITO']).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ImportacionForm({ importacionToEdit, onFormSubmit }: ImportacionFormProps) {
  const { toast } = useToast();
  const { addImportacion, updateImportacion, addRecentActivity } = useDynamicData();
  const isEditing = !!importacionToEdit;

  const parseDate = (dateString: string | undefined) => {
    if (!dateString) return undefined;
    const date = parseISO(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  }

  const defaultValues = React.useMemo(() => ({
      bl: importacionToEdit?.bl || "",
      proveedor: importacionToEdit?.proveedor || "",
      fecha_embarque: parseDate(importacionToEdit?.fecha_embarque),
      sca: importacionToEdit?.sca || "",
      fecha_emision_cert: parseDate(importacionToEdit?.fecha_emision_cert),
      di: importacionToEdit?.di || "",
      etiqueta_rango_inicio: importacionToEdit?.etiqueta_rango_inicio || "",
      etiqueta_rango_fin: importacionToEdit?.etiqueta_rango_fin || "",
      operacion: importacionToEdit?.operacion || "",
      fecha_solicitada: parseDate(importacionToEdit?.fecha_solicitada),
      fecha_entrega_calidad: parseDate(importacionToEdit?.fecha_entrega_calidad),
      cantidad_lote: importacionToEdit?.cantidad_lote,
      fecha_devolucion: parseDate(importacionToEdit?.fecha_devolucion),
      fecha_liberacion: parseDate(importacionToEdit?.fecha_liberacion),
      ingresado_siss: importacionToEdit?.ingresado_siss || false,
      fecha_caducidad_cert: parseDate(importacionToEdit?.fecha_caducidad_cert),
      estado: importacionToEdit?.estado || 'EN TRANSITO',
    }), [importacionToEdit]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [importacionToEdit, defaultValues, form]);

  const onSubmit = async (data: FormValues) => {
    const importacionData = {
      ...data,
      cantidad_lote: data.cantidad_lote ? Number(data.cantidad_lote) : undefined,
      fecha_embarque: data.fecha_embarque ? format(data.fecha_embarque, "dd-MM-yyyy") : undefined,
      fecha_emision_cert: data.fecha_emision_cert ? format(data.fecha_emision_cert, "dd-MM-yyyy") : undefined,
      fecha_solicitada: data.fecha_solicitada ? format(data.fecha_solicitada, "dd-MM-yyyy") : undefined,
      fecha_entrega_calidad: data.fecha_entrega_calidad ? format(data.fecha_entrega_calidad, "dd-MM-yyyy") : undefined,
      fecha_devolucion: data.fecha_devolucion ? format(data.fecha_devolucion, "dd-MM-yyyy") : undefined,
      fecha_liberacion: data.fecha_liberacion ? format(data.fecha_liberacion, "dd-MM-yyyy") : undefined,
      fecha_caducidad_cert: data.fecha_caducidad_cert ? format(data.fecha_caducidad_cert, "dd-MM-yyyy") : undefined,
    };

    try {
      if (isEditing && importacionToEdit) {
        await updateImportacion(importacionToEdit.id, importacionData);
        await addRecentActivity({
          user: "Usuario del Sistema",
          action: `actualizó la importación con BL ${data.bl}`,
        });
        toast({
          title: "Importación Actualizada",
          description: `El registro para el BL ${data.bl} ha sido actualizado.`,
        });
      } else {
        await addImportacion(importacionData);
        await addRecentActivity({
          user: "Usuario del Sistema",
          action: `registró una nueva importación con BL ${data.bl}`,
        });
        toast({
          title: "Importación Registrada",
          description: `La importación con BL ${data.bl} ha sido añadida.`,
        });
      }
      onFormSubmit();
    } catch (error) {
      console.error("Error guardando importación:", error);
      toast({
        variant: "destructive",
        title: "Error al Guardar",
        description: "No se pudo guardar el registro. Por favor, intente de nuevo.",
      });
    }
  };
  
  const DateField = ({ name, label }: { name: keyof FormValues, label: string }) => (
    <FormField
      control={form.control}
      name={name as any}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? format(field.value, "dd-MM-yyyy") : <span>Seleccione fecha</span>}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );


  return (
    <Form form={form} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField control={form.control} name="bl" render={({ field }) => (<FormItem><FormLabel>BL N°</FormLabel><FormControl><Input placeholder="Número de Bill of Lading" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="proveedor" render={({ field }) => (<FormItem><FormLabel>Proveedor</FormLabel><FormControl><Input placeholder="Nombre del proveedor" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <DateField name="fecha_embarque" label="Fecha de Embarque" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <FormField control={form.control} name="sca" render={({ field }) => (<FormItem><FormLabel>SCA</FormLabel><FormControl><Input placeholder="Número SCA" {...field} /></FormControl><FormMessage /></FormItem>)} />
             <DateField name="fecha_emision_cert" label="Fecha Emisión Cert." />
             <FormField control={form.control} name="di" render={({ field }) => (<FormItem><FormLabel>DI</FormLabel><FormControl><Input placeholder="Número DI" {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="etiqueta_rango_inicio" render={({ field }) => (<FormItem><FormLabel>Etiqueta Correlativo (Inicio)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="etiqueta_rango_fin" render={({ field }) => (<FormItem><FormLabel>Etiqueta Correlativo (Fin)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField control={form.control} name="operacion" render={({ field }) => (<FormItem><FormLabel>N° Operación</FormLabel><FormControl><Input placeholder="Número de operación" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <DateField name="fecha_solicitada" label="Fecha Solicitada" />
            <DateField name="fecha_entrega_calidad" label="Fecha Entrega a Calidad" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField control={form.control} name="cantidad_lote" render={({ field }) => (<FormItem><FormLabel>Cantidad de Lote</FormLabel><FormControl><Input type="number" {...field} onChange={event => field.onChange(+event.target.value)} /></FormControl><FormMessage /></FormItem>)} />
            <DateField name="fecha_devolucion" label="Fecha de Devolución" />
            <DateField name="fecha_liberacion" label="Fecha de Liberación" />
        </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField control={form.control} name="estado" render={({ field }) => (
                <FormItem><FormLabel>Estado Actual</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="EN TRANSITO">En Tránsito</SelectItem>
                        <SelectItem value="VIGENTE">Vigente</SelectItem>
                        <SelectItem value="CADUCADO">Caducado</SelectItem>
                    </SelectContent>
                    </Select><FormMessage />
                </FormItem>
            )} />
            <DateField name="fecha_caducidad_cert" label="Fecha Caducidad Cert." />
            <FormField control={form.control} name="ingresado_siss" render={({ field }) => (
                <FormItem className="flex flex-row items-end space-x-3 space-y-0 rounded-md border p-4 h-fit">
                    <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>Ingresado a la SISS</FormLabel>
                    </div>
                </FormItem>
            )} />
        </div>
        <div className="flex justify-end pt-6">
            <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? 'Guardar Cambios' : 'Registrar Importación'}
            </Button>
        </div>
    </Form>
  );
}
