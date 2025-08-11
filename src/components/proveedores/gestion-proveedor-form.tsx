

"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useDynamicData, type Proveedor } from "@/context/data-context";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface GestionProveedorFormProps {
  proveedorToEdit: Proveedor | null;
  onFormSubmit: () => void;
}

const formSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().nonempty("El nombre del proveedor es requerido."),
  tipo: z.string().nonempty("El tipo de proveedor es requerido."),
  contacto_nombre: z.string().optional(),
  contacto_email: z.string().email("Debe ser un correo electrónico válido.").optional().or(z.literal('')),
  contacto_telefono: z.string().optional(),
  estado: z.enum(['Activo', 'En evaluación', 'Inactivo']),
  certificacionesISO: z.string().optional(),
  contratoUrl: z.string().url("Debe ser una URL válida.").optional().or(z.literal('')),
  observaciones: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function GestionProveedorForm({ proveedorToEdit, onFormSubmit }: GestionProveedorFormProps) {
  const { toast } = useToast();
  const { addProveedor, updateProveedor, addRecentActivity } = useDynamicData();
  const isEditing = !!proveedorToEdit;

  const defaultValues = React.useMemo(() => ({
      id: proveedorToEdit?.id || undefined,
      nombre: proveedorToEdit?.nombre || "",
      tipo: proveedorToEdit?.tipo || "",
      contacto_nombre: proveedorToEdit?.contacto_nombre || "",
      contacto_email: proveedorToEdit?.contacto_email || "",
      contacto_telefono: proveedorToEdit?.contacto_telefono || "",
      estado: proveedorToEdit?.estado || 'Activo',
      certificacionesISO: proveedorToEdit?.certificacionesISO || "",
      contratoUrl: proveedorToEdit?.contratoUrl || "",
      observaciones: proveedorToEdit?.observaciones || "",
    }), [proveedorToEdit]);
    
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  React.useEffect(() => {
      form.reset(defaultValues);
  }, [proveedorToEdit, defaultValues, form]);

  const onSubmit = async (data: FormValues) => {
    const proveedorData = data;
    try {
      if (isEditing && proveedorToEdit) {
        await updateProveedor(proveedorToEdit.id, proveedorData);
        await addRecentActivity({
          user: "Usuario del Sistema", // Mock user
          action: `actualizó el proveedor ${data.nombre}`,
        });
        toast({
          title: "Proveedor Actualizado",
          description: `El proveedor ${data.nombre} ha sido actualizado.`,
        });
      } else {
        await addProveedor(proveedorData as Omit<Proveedor, 'id'>);
        await addRecentActivity({
          user: "Usuario del Sistema",
          action: `registró al nuevo proveedor ${data.nombre}`,
        });
        toast({
          title: "Proveedor Registrado",
          description: `El proveedor ${data.nombre} ha sido añadido.`,
        });
      }
      onFormSubmit();
    } catch (error) {
      console.error("Error guardando el proveedor:", error);
      toast({
        variant: "destructive",
        title: "Error al Guardar",
        description: "No se pudo guardar el proveedor. Por favor, intente de nuevo.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6 pr-3">
          <div className="space-y-4">
              <h3 className="text-lg font-medium">Información General</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="nombre" render={({ field }) => (<FormItem><FormLabel>Nombre del Proveedor</FormLabel><FormControl><Input placeholder="Ej: Laboratorios Acme S.A." {...field} /></FormControl><FormMessage /></FormItem>)}/>
                  <FormField control={form.control} name="tipo" render={({ field }) => (<FormItem><FormLabel>Tipo de Proveedor</FormLabel><FormControl><Input placeholder="Ej: Calibración, Materia Prima" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                  <FormField control={form.control} name="estado" render={({ field }) => (<FormItem><FormLabel>Estado</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Activo">Activo</SelectItem><SelectItem value="En evaluación">En evaluación</SelectItem><SelectItem value="Inactivo">Inactivo</SelectItem></SelectContent></Select><FormMessage /></FormItem>)}/>
              </div>
          </div>

          <Separator />

          <div className="space-y-4">
              <h3 className="text-lg font-medium">Información de Contacto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="contacto_nombre" render={({ field }) => (<FormItem><FormLabel>Nombre del Contacto</FormLabel><FormControl><Input placeholder="Nombre y Apellido" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                  <FormField control={form.control} name="contacto_email" render={({ field }) => (<FormItem><FormLabel>Email de Contacto</FormLabel><FormControl><Input type="email" placeholder="contacto@empresa.com" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                  <FormField control={form.control} name="contacto_telefono" render={({ field }) => (<FormItem><FormLabel>Teléfono de Contacto</FormLabel><FormControl><Input placeholder="+56 9 1234 5678" {...field} /></FormControl><FormMessage /></FormItem>)}/>
              </div>
          </div>

          <Separator />

          <div className="space-y-4">
              <h3 className="text-lg font-medium">Documentación y Cumplimiento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="certificacionesISO" render={({ field }) => (<FormItem><FormLabel>Certificaciones ISO</FormLabel><FormControl><Input placeholder="Ej: ISO 9001, ISO 17025" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                  <FormField control={form.control} name="contratoUrl" render={({ field }) => (<FormItem><FormLabel>URL del Contrato</FormLabel><FormControl><Input placeholder="https://ejemplo.com/contrato.pdf" {...field} /></FormControl><FormMessage /></FormItem>)}/>
              </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
              <h3 className="text-lg font-medium">Observaciones</h3>
              <FormField control={form.control} name="observaciones" render={({ field }) => (<FormItem><FormControl><Textarea placeholder="Añada cualquier nota relevante sobre el proveedor..." {...field} /></FormControl><FormMessage /></FormItem>)}/>
          </div>

          <div className="flex justify-end pt-4"><Button type="submit"><Save className="mr-2 h-4 w-4" />{isEditing ? 'Guardar Cambios' : 'Registrar Proveedor'}</Button></div>
        </div>
      </form>
    </Form>
  );
}
