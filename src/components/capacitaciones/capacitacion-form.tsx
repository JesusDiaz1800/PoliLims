
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
import type { Capacitacion, User } from "@/context/data-context";
import { useDynamicData } from "@/context/data-context";
import { Textarea } from "@/components/ui/textarea";

interface CapacitacionFormProps {
  capacitacionToEdit: Capacitacion | null;
  onFormSubmit: () => void;
  users: User[];
}

const formSchema = z.object({
  nombre: z.string().nonempty("El nombre de la capacitación es requerido."),
  fecha: z.date({ required_error: "La fecha es requerida." }),
  instructor: z.string().nonempty("El instructor es requerido."),
  temario: z.string().nonempty("El temario es requerido."),
  estado: z.enum(['Planificada', 'Realizada', 'Cancelada']),
});

type FormValues = z.infer<typeof formSchema>;

export function CapacitacionForm({ capacitacionToEdit, onFormSubmit, users }: CapacitacionFormProps) {
  const { toast } = useToast();
  const { addCapacitacion, updateCapacitacion } = useDynamicData();
  const isEditing = !!capacitacionToEdit;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: capacitacionToEdit?.nombre || "",
      fecha: capacitacionToEdit?.fecha ? parseISO(capacitacionToEdit.fecha) : new Date(),
      instructor: capacitacionToEdit?.instructor || "",
      temario: capacitacionToEdit?.temario || "",
      estado: capacitacionToEdit?.estado || 'Planificada',
    },
  });

  React.useEffect(() => {
    if (capacitacionToEdit) {
      form.reset({
        ...capacitacionToEdit,
        fecha: parseISO(capacitacionToEdit.fecha),
      });
    } else {
        form.reset({
            nombre: "",
            fecha: new Date(),
            instructor: "",
            temario: "",
            estado: 'Planificada',
        });
    }
  }, [capacitacionToEdit, form]);

  const onSubmit = async (data: FormValues) => {
    const capacitacionData: Partial<Capacitacion> = { 
        ...data, 
        fecha: format(data.fecha, "yyyy-MM-dd"),
    };
    
    try {
      if (isEditing && capacitacionToEdit) {
        await updateCapacitacion(capacitacionToEdit.id, capacitacionData);
        toast({ title: "Capacitación Actualizada" });
      } else {
        const fullData = {
            ...capacitacionData,
            asistentes: [],
        }
        await addCapacitacion(fullData as Omit<Capacitacion, 'id'>);
        toast({ title: "Capacitación Creada" });
      }
      onFormSubmit();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo guardar la capacitación." });
    }
  };

  return (
    <Form form={form} onSubmit={onSubmit}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="nombre" render={({ field }) => (<FormItem><FormLabel>Nombre Capacitación</FormLabel><FormControl><Input placeholder="Ej: Uso seguro de equipos de laboratorio" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="fecha" render={({ field }) => (<FormItem><FormLabel>Fecha</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal",!field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "dd-MM-yyyy") : <span>Seleccione fecha</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="instructor" render={({ field }) => (<FormItem><FormLabel>Instructor / Institución</FormLabel><FormControl><Input placeholder="Nombre del instructor o empresa" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="estado" render={({ field }) => (<FormItem><FormLabel>Estado</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Planificada">Planificada</SelectItem><SelectItem value="Realizada">Realizada</SelectItem><SelectItem value="Cancelada">Cancelada</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="temario" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Temario / Descripción</FormLabel><FormControl><Textarea placeholder="Describa los temas a tratar..." {...field} rows={4} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        <div className="flex justify-end pt-4"><Button type="submit"><Save className="mr-2 h-4 w-4"/>{isEditing ? 'Guardar Cambios' : 'Crear Capacitación'}</Button></div>
      </div>
    </Form>
  );
}
