
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
import type { Formacion, User } from "@/context/data-context";
import { Textarea } from "@/components/ui/textarea";
import * as dataService from "@/services/data-service";


interface FormacionFormProps {
  recordToEdit: Formacion | null;
  onFormSubmit: () => void;
  users: User[];
}

const formSchema = z.object({
  empleadoId: z.string().nonempty("Debe seleccionar un empleado."),
  tipo: z.enum(['Curso', 'Certificación', 'Evaluación de Competencia', 'Inducción']),
  nombre_actividad: z.string().nonempty("El nombre de la actividad es requerido."),
  fecha: z.date({ required_error: "La fecha de la actividad es requerida." }),
  evaluador: z.string().optional(),
  resultado: z.enum(['Aprobado', 'Reprobado', 'Pendiente', 'Completado']),
  observaciones: z.string().optional(),
  fecha_vencimiento: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function FormacionForm({ recordToEdit, onFormSubmit, users }: FormacionFormProps) {
  const { toast } = useToast();
  const isEditing = !!recordToEdit;

  const defaultValues = React.useMemo(() => ({
      empleadoId: recordToEdit?.empleadoId || "",
      tipo: recordToEdit?.tipo || 'Curso',
      nombre_actividad: recordToEdit?.nombre_actividad || "",
      fecha: recordToEdit?.fecha ? parseISO(recordToEdit.fecha) : new Date(),
      evaluador: recordToEdit?.evaluador || "",
      resultado: recordToEdit?.resultado || 'Pendiente',
      observaciones: recordToEdit?.observaciones || "",
      fecha_vencimiento: recordToEdit?.fecha_vencimiento ? parseISO(recordToEdit.fecha_vencimiento) : undefined,
    }), [recordToEdit]);
    
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  React.useEffect(() => {
      form.reset(defaultValues);
  }, [recordToEdit, defaultValues, form]);

  const onSubmit = async (data: FormValues) => {
    const empleado = users.find(u => u.username === data.empleadoId);
    if (!empleado) {
        toast({ variant: "destructive", title: "Error", description: "Empleado no encontrado."});
        return;
    }

    const formacionData = {
      ...data,
      empleadoNombre: empleado.fullName,
      fecha: format(data.fecha, "yyyy-MM-dd"),
      fecha_vencimiento: data.fecha_vencimiento ? format(data.fecha_vencimiento, "yyyy-MM-dd") : undefined,
    };
    
    try {
      if (isEditing && recordToEdit) {
        await dataService.updateFormacion(recordToEdit.id, formacionData as any);
        await dataService.addRecentActivity({
          user: "Usuario del Sistema", // This should be dynamic in a real app
          action: `actualizó el registro de formación de ${empleado.fullName}`,
        });
        toast({
          title: "Registro Actualizado",
          description: `La actividad de formación para ${empleado.fullName} ha sido actualizada.`,
        });
      } else {
        await dataService.addFormacion(formacionData as Omit<Formacion, 'id'>);
        await dataService.addRecentActivity({
          user: "Usuario del Sistema",
          action: `registró una nueva actividad de formación para ${empleado.fullName}`,
        });
        toast({
          title: "Registro Creado",
          description: `La nueva actividad de formación ha sido registrada.`,
        });
      }
      onFormSubmit();
    } catch (error) {
      console.error("Error guardando el registro de formación:", error);
      toast({
        variant: "destructive",
        title: "Error al Guardar",
        description: "No se pudo guardar el registro. Por favor, intente de nuevo.",
      });
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="empleadoId" render={({ field }) => (<FormItem><FormLabel>Responsable / Principal Involucrado</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione un empleado"/></SelectTrigger></FormControl><SelectContent>{users.map(user => (<SelectItem key={user.username} value={user.username}>{user.fullName}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
            <FormField control={form.control} name="tipo" render={({ field }) => (<FormItem><FormLabel>Tipo de Actividad</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Curso">Curso</SelectItem><SelectItem value="Certificación">Certificación</SelectItem><SelectItem value="Evaluación de Competencia">Evaluación de Competencia</SelectItem><SelectItem value="Inducción">Inducción</SelectItem></SelectContent></Select><FormMessage /></FormItem>)}/>
            <FormField control={form.control} name="nombre_actividad" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Nombre de la Actividad / Curso</FormLabel><FormControl><Input placeholder="Ej: Curso de Cromatografía de Gases" {...field} /></FormControl><FormMessage /></FormItem>)}/>
            <FormField control={form.control} name="fecha" render={({ field }) => (<FormItem><FormLabel>Fecha de Realización</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal",!field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "dd-MM-yyyy") : <span>Seleccione fecha</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)}/>
            <FormField control={form.control} name="fecha_vencimiento" render={({ field }) => (<FormItem><FormLabel>Fecha de Vencimiento (Opcional)</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal",!field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "dd-MM-yyyy") : <span>Seleccione fecha</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)}/>
            <FormField control={form.control} name="evaluador" render={({ field }) => (<FormItem><FormLabel>Evaluador / Institución</FormLabel><FormControl><Input placeholder="Ej: OTEC Qualitas" {...field} /></FormControl><FormMessage /></FormItem>)}/>
            <FormField control={form.control} name="resultado" render={({ field }) => (<FormItem><FormLabel>Resultado</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Aprobado">Aprobado</SelectItem><SelectItem value="Reprobado">Reprobado</SelectItem><SelectItem value="Pendiente">Pendiente</SelectItem><SelectItem value="Completado">Completado</SelectItem></SelectContent></Select><FormMessage /></FormItem>)}/>
            <FormField control={form.control} name="observaciones" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Observaciones y Detalles de Evaluación</FormLabel><FormControl><Textarea placeholder="Añada cualquier nota relevante, detalles de la evaluación, puntajes, etc." {...field} /></FormControl><FormMessage /></FormItem>)}/>
        </div>
        <div className="flex justify-end pt-4"><Button type="submit"><Save className="mr-2 h-4 w-4" />{isEditing ? 'Guardar Cambios' : 'Registrar Actividad'}</Button></div>
      </form>
    </Form>
  );
}
