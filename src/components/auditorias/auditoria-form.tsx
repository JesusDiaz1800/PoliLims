
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
import type { Auditoria, User } from "@/context/data-context";
import { Textarea } from "@/components/ui/textarea";
import * as dataService from "@/services/data-service";

interface AuditoriaFormProps {
  auditoriaToEdit: Auditoria | null;
  onFormSubmit: () => void;
  users: User[];
}

const formSchema = z.object({
  id: z.string().optional(),
  tipo: z.enum(['Interna', 'Externa - Proveedor', 'Externa - Certificación']),
  fecha_inicio: z.date({ required_error: "La fecha de inicio es requerida." }),
  fecha_fin: z.date({ required_error: "La fecha de finalización es requerida." }),
  auditor_lider: z.string().nonempty("El auditor líder es requerido."),
  auditores: z.array(z.string()).optional(),
  alcance: z.string().nonempty("El alcance es requerido."),
  objetivos: z.string().optional(),
  estado: z.enum(['Planificada', 'En Curso', 'Finalizada', 'Cancelada']),
});

type FormValues = z.infer<typeof formSchema>;

export function AuditoriaForm({ auditoriaToEdit, onFormSubmit, users }: AuditoriaFormProps) {
  const { toast } = useToast();
  const isEditing = !!auditoriaToEdit;

  const defaultValues = React.useMemo(() => ({
      id: auditoriaToEdit?.id || undefined,
      tipo: auditoriaToEdit?.tipo || 'Interna',
      fecha_inicio: auditoriaToEdit?.fecha_inicio ? parseISO(auditoriaToEdit.fecha_inicio) : new Date(),
      fecha_fin: auditoriaToEdit?.fecha_fin ? parseISO(auditoriaToEdit.fecha_fin) : new Date(),
      auditor_lider: auditoriaToEdit?.auditor_lider || "",
      auditores: auditoriaToEdit?.auditores || [],
      alcance: auditoriaToEdit?.alcance || "",
      objetivos: auditoriaToEdit?.objetivos || "",
      estado: auditoriaToEdit?.estado || 'Planificada',
    }), [auditoriaToEdit]);
    
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  React.useEffect(() => {
      form.reset(defaultValues);
  }, [auditoriaToEdit, defaultValues, form]);

  const onSubmit = async (data: FormValues) => {
    const auditoriaData = {
      ...data,
      fecha_inicio: format(data.fecha_inicio, "yyyy-MM-dd"),
      fecha_fin: format(data.fecha_fin, "yyyy-MM-dd"),
    };

    try {
      if (isEditing && auditoriaToEdit) {
        await dataService.updateAuditoria(auditoriaToEdit.id, auditoriaData as any);
        toast({
          title: "Auditoría Actualizada",
          description: `La auditoría ${auditoriaToEdit.id} ha sido actualizada.`,
        });
      } else {
        const { id, ...newAuditoriaData } = auditoriaData;
        await dataService.addAuditoria(newAuditoriaData as any);
        toast({
          title: "Auditoría Planificada",
          description: "La nueva auditoría ha sido registrada en el sistema.",
        });
      }
      onFormSubmit();
    } catch (error) {
      console.error("Error guardando la auditoría:", error);
      toast({
        variant: "destructive",
        title: "Error al Guardar",
        description: "No se pudo guardar la auditoría. Por favor, intente de nuevo.",
      });
    }
  };

  const userOptions = users.map(u => ({ value: u.fullName, label: u.fullName }));
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="tipo" render={({ field }) => (<FormItem><FormLabel>Tipo de Auditoría</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Interna">Interna</SelectItem><SelectItem value="Externa - Proveedor">Externa - Proveedor</SelectItem><SelectItem value="Externa - Certificación">Externa - Certificación</SelectItem></SelectContent></Select><FormMessage /></FormItem>)}/>
          <FormField control={form.control} name="estado" render={({ field }) => (<FormItem><FormLabel>Estado</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Planificada">Planificada</SelectItem><SelectItem value="En Curso">En Curso</SelectItem><SelectItem value="Finalizada">Finalizada</SelectItem><SelectItem value="Cancelada">Cancelada</SelectItem></SelectContent></Select><FormMessage /></FormItem>)}/>
          <FormField control={form.control} name="fecha_inicio" render={({ field }) => (<FormItem><FormLabel>Fecha de Inicio</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full justify-start text-left font-normal",!field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "dd-MM-yyyy") : <span>Seleccione fecha</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)}/>
          <FormField control={form.control} name="fecha_fin" render={({ field }) => (<FormItem><FormLabel>Fecha de Fin</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full justify-start text-left font-normal",!field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "dd-MM-yyyy") : <span>Seleccione fecha</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)}/>
        </div>
        <FormField control={form.control} name="auditor_lider" render={({ field }) => (
            <FormItem>
              <FormLabel>Auditor Líder</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione un responsable"/></SelectTrigger></FormControl>
                <SelectContent>
                  {userOptions.map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}/>
        <FormField control={form.control} name="alcance" render={({ field }) => (<FormItem><FormLabel>Alcance de la Auditoría</FormLabel><FormControl><Textarea placeholder="Ej: 'Procesos de ensayo de materias primas según ISO/IEC 17025:2017, cláusulas 7.2 a 7.7'" {...field} /></FormControl><FormMessage /></FormItem>)}/>
        <FormField control={form.control} name="objetivos" render={({ field }) => (<FormItem><FormLabel>Objetivos de la Auditoría</FormLabel><FormControl><Textarea placeholder="Ej: 'Verificar la conformidad con los procedimientos internos P-001 y P-002, evaluar la competencia del personal...'" {...field} /></FormControl><FormMessage /></FormItem>)}/>
        <div className="flex justify-end pt-4"><Button type="submit"><Save className="mr-2 h-4 w-4" />{isEditing ? 'Guardar Cambios' : 'Planificar Auditoría'}</Button></div>
      </form>
    </Form>
  );
}
