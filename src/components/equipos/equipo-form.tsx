
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useDynamicData, type Equipo } from "@/context/data-context";

interface EquipoFormProps {
  equipoToEdit: Equipo | null;
  onFormSubmit: () => void;
}

const formSchema = z.object({
  id: z.string().nonempty("El ID de activo es requerido."),
  nombre: z.string().nonempty("El nombre del equipo es requerido."),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  estado: z.enum(["Activo", "En Mantenimiento", "Inactivo", "Requiere Calibración"]),
  proxima_calibracion: z.date({
    required_error: "La fecha de próxima calibración es requerida.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function EquipoForm({ equipoToEdit, onFormSubmit }: EquipoFormProps) {
  const { toast } = useToast();
  const { addEquipo, updateEquipo, addRecentActivity } = useDynamicData();
  const isEditing = !!equipoToEdit;

  const defaultValues = React.useMemo(() => ({
      id: equipoToEdit?.id || "",
      nombre: equipoToEdit?.nombre || "",
      marca: equipoToEdit?.marca || "",
      modelo: equipoToEdit?.modelo || "",
      estado: equipoToEdit?.estado || "Activo",
      proxima_calibracion: equipoToEdit?.proxima_calibracion
        ? parseISO(equipoToEdit.proxima_calibracion)
        : new Date(),
    }), [equipoToEdit]);
    
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  React.useEffect(() => {
      form.reset(defaultValues);
  }, [equipoToEdit, defaultValues, form]);


  const onSubmit = async (data: FormValues) => {
    const equipoData = {
        ...data,
        proxima_calibracion: format(data.proxima_calibracion, "yyyy-MM-dd"),
    };

    try {
      if (isEditing && equipoToEdit) {
        await updateEquipo(equipoToEdit.id, equipoData);
        await addRecentActivity({
          user: "Usuario del Sistema", // This should be dynamic in a real app
          action: `actualizó el equipo ${data.nombre}`,
        });
        toast({
          title: "Equipo Actualizado",
          description: `El equipo ${data.nombre} ha sido actualizado.`,
        });
      } else {
        await addEquipo(equipoData);
        await addRecentActivity({
          user: "Usuario del Sistema",
          action: `registró el nuevo equipo ${data.nombre}`,
        });
        toast({
          title: "Equipo Registrado",
          description: `El equipo ${data.nombre} ha sido añadido al inventario.`,
        });
      }
      onFormSubmit();
    } catch (error) {
      console.error("Error guardando el equipo:", error);
      toast({
        variant: "destructive",
        title: "Error al Guardar",
        description: "No se pudo guardar el equipo. Por favor, intente de nuevo.",
      });
    }
  };

  return (
    <Form form={form} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>ID de Activo</FormLabel>
                    <FormControl>
                    <Input placeholder="Ej: EQ-FTIR-01" {...field} disabled={isEditing}/>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Nombre del Equipo</FormLabel>
                    <FormControl>
                    <Input placeholder="Ej: Espectrómetro FTIR" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="marca"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <FormControl>
                    <Input placeholder="Ej: PerkinElmer" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="modelo"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                    <Input placeholder="Ej: Spectrum Two" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione un estado" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="Activo">Activo</SelectItem>
                            <SelectItem value="En Mantenimiento">En Mantenimiento</SelectItem>
                            <SelectItem value="Inactivo">Inactivo</SelectItem>
                            <SelectItem value="Requiere Calibración">Requiere Calibración</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="proxima_calibracion"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Próxima Calibración</FormLabel>
                    <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Seleccione fecha</span>}
                        </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        />
                    </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
                )}
            />
      </div>
      <div className="flex justify-end pt-4">
        <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Guardar Cambios' : 'Registrar Equipo'}
        </Button>
      </div>
    </Form>
  );
}
