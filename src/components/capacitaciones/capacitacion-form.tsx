
"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Save, PlusCircle, Trash2, Users, Check, X } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Checkbox } from "../ui/checkbox";

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
  asistentes: z.array(z.object({
    empleadoId: z.string(),
    asistio: z.boolean(),
  })).optional(),
  evaluacion: z.object({
    preguntas: z.array(z.object({ pregunta: z.string() })).optional(),
    resultados: z.array(z.object({
      empleadoId: z.string(),
      respuestas: z.array(z.string()).optional(),
      resultado: z.enum(['Aprobado', 'Reprobado']),
    })).optional(),
  }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CapacitacionForm({ capacitacionToEdit, onFormSubmit, users }: CapacitacionFormProps) {
  const { toast } = useToast();
  const { addCapacitacion, updateCapacitacion, addRecentActivity } = useDynamicData();
  const isEditing = !!capacitacionToEdit;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: capacitacionToEdit?.nombre || "",
      fecha: capacitacionToEdit?.fecha ? parseISO(capacitacionToEdit.fecha) : new Date(),
      instructor: capacitacionToEdit?.instructor || "",
      temario: capacitacionToEdit?.temario || "",
      estado: capacitacionToEdit?.estado || 'Planificada',
      asistentes: capacitacionToEdit?.asistentes || [],
      evaluacion: {
        preguntas: capacitacionToEdit?.evaluacion?.preguntas || [],
        resultados: capacitacionToEdit?.evaluacion?.resultados || [],
      },
    },
  });

  const { control, register, setValue } = form;

  const { fields: asistentesFields, append: appendAsistente, remove: removeAsistente } = useFieldArray({ control, name: "asistentes" });
  const { fields: preguntasFields, append: appendPregunta, remove: removePregunta } = useFieldArray({ control, name: "evaluacion.preguntas" });
  const { fields: resultadosFields, append: appendResultado, remove: removeResultado, update: updateResultado } = useFieldArray({ control, name: "evaluacion.resultados" });
  
  React.useEffect(() => {
    if (capacitacionToEdit) {
      form.reset({
        ...capacitacionToEdit,
        fecha: parseISO(capacitacionToEdit.fecha),
        asistentes: capacitacionToEdit.asistentes || [],
        evaluacion: {
          preguntas: capacitacionToEdit.evaluacion?.preguntas || [],
          resultados: capacitacionToEdit.evaluacion?.resultados || [],
        },
      });
    }
  }, [capacitacionToEdit, form]);

  const onSubmit = async (data: FormValues) => {
    const capacitacionData = { ...data, fecha: format(data.fecha, "yyyy-MM-dd") };
    try {
      if (isEditing && capacitacionToEdit) {
        await updateCapacitacion(capacitacionToEdit.id, capacitacionData as any);
        toast({ title: "Capacitación Actualizada" });
      } else {
        await addCapacitacion(capacitacionData as any);
        toast({ title: "Capacitación Creada" });
      }
      onFormSubmit();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo guardar la capacitación." });
    }
  };

  const getUserName = (id: string) => users.find(u => u.username === id)?.fullName || 'Desconocido';

  return (
    <Form form={form} onSubmit={onSubmit}>
      <div className="space-y-6">
        {/* Información General */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="nombre" render={({ field }) => (<FormItem><FormLabel>Nombre Capacitación</FormLabel><FormControl><Input placeholder="Ej: Uso seguro de equipos de laboratorio" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="fecha" render={({ field }) => (<FormItem><FormLabel>Fecha</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal",!field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "dd-MM-yyyy") : <span>Seleccione fecha</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="instructor" render={({ field }) => (<FormItem><FormLabel>Instructor / Institución</FormLabel><FormControl><Input placeholder="Nombre del instructor o empresa" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="estado" render={({ field }) => (<FormItem><FormLabel>Estado</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Planificada">Planificada</SelectItem><SelectItem value="Realizada">Realizada</SelectItem><SelectItem value="Cancelada">Cancelada</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="temario" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Temario / Descripción</FormLabel><FormControl><Textarea placeholder="Describa los temas a tratar..." {...field} rows={4} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        <Separator />

        {/* Asistentes */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2"><Users className="h-5 w-5"/>Asistencia</h3>
          <div className="border rounded-md">
            <Table>
                <TableHeader><TableRow><TableHead>Empleado</TableHead><TableHead className="text-center w-24">Asistió</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader>
                <TableBody>
                    {asistentesFields.map((field, index) => (
                        <TableRow key={field.id}>
                            <TableCell>{getUserName(field.empleadoId)}</TableCell>
                            <TableCell className="text-center"><Checkbox {...register(`asistentes.${index}.asistio`)} /></TableCell>
                            <TableCell><Button type="button" variant="ghost" size="icon" onClick={() => removeAsistente(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </div>
          <Select onValueChange={(value) => appendAsistente({ empleadoId: value, asistio: false })}>
            <SelectTrigger><SelectValue placeholder="Añadir asistente..."/></SelectTrigger>
            <SelectContent>{users.map(user => (<SelectItem key={user.username} value={user.username}>{user.fullName}</SelectItem>))}</SelectContent>
          </Select>
        </div>
        <Separator />

        {/* Evaluación */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Evaluación</h3>
           {preguntasFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                  <Input {...register(`evaluacion.preguntas.${index}.pregunta`)} placeholder={`Pregunta ${index + 1}`}/>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removePregunta(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
              </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => appendPregunta({ pregunta: '' })}><PlusCircle className="mr-2 h-4 w-4" />Añadir Pregunta</Button>
        </div>
        
        {isEditing && (
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Resultados de Evaluación</h3>
                {form.watch('asistentes')?.filter(a => a.asistio).map(asistente => {
                    const resultadoIndex = resultadosFields.findIndex(r => r.empleadoId === asistente.empleadoId);
                    const resultadoActual = resultadoIndex > -1 ? resultadosFields[resultadoIndex].resultado : undefined;
                    return (
                        <div key={asistente.empleadoId} className="p-3 border rounded-lg">
                            <p className="font-semibold">{getUserName(asistente.empleadoId)}</p>
                            <div className="flex items-center gap-4 mt-2">
                                <FormLabel>Resultado:</FormLabel>
                                <Button size="sm" type="button" variant={resultadoActual === 'Aprobado' ? 'default' : 'outline'} onClick={() => {
                                    const payload = { empleadoId: asistente.empleadoId, resultado: 'Aprobado' as const, respuestas: [] };
                                    if(resultadoIndex > -1) updateResultado(resultadoIndex, payload); else appendResultado(payload);
                                }}>
                                    <Check className="mr-2 h-4 w-4"/> Aprobado
                                </Button>
                                <Button size="sm" type="button" variant={resultadoActual === 'Reprobado' ? 'destructive' : 'outline'} onClick={() => {
                                     const payload = { empleadoId: asistente.empleadoId, resultado: 'Reprobado' as const, respuestas: [] };
                                     if(resultadoIndex > -1) updateResultado(resultadoIndex, payload); else appendResultado(payload);
                                }}>
                                    <X className="mr-2 h-4 w-4"/> Reprobado
                                </Button>
                            </div>
                        </div>
                    )
                })}
            </div>
        )}

        <div className="flex justify-end pt-4"><Button type="submit"><Save className="mr-2 h-4 w-4"/>{isEditing ? 'Guardar Cambios' : 'Crear Capacitación'}</Button></div>
      </div>
    </Form>
  );
}

