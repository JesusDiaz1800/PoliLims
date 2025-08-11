
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parse, isValid } from "date-fns";
import { CalendarIcon, Save, Image as ImageIcon, X } from "lucide-react";
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
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

interface EquipoFormProps {
  equipoToEdit: Equipo | null;
  onFormSubmit: () => void;
}

const ensayosDisponibles = [
  { id: 'melt_index', label: 'Melt Index' },
  { id: 'densidad', label: 'Densidad' },
  { id: 'traccion', label: 'Tracción y Elongación' },
  { id: 'negro_humo', label: '% Negro de Humo' },
  { id: 'dispersion_nh', label: 'Dispersión de Negro de Humo' },
  { id: 'tio', label: 'Tiempo de Inducción a la Oxidación (TIO)' },
  { id: 'fibra_vidrio', label: 'Porcentaje de Fibra de Vidrio' },
  { id: 'dsc', label: 'DSC (Calorimetría Diferencial de Barrido)' },
  { id: 'humedad', label: 'Porcentaje de Humedad' },
  { id: 'cenizas', label: 'Porcentaje de Cenizas'},
];

const formSchema = z.object({
  id: z.string().nonempty("El ID de activo es requerido."),
  nombre: z.string().nonempty("El nombre del equipo es requerido."),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  numero_serie: z.string().optional(),
  ubicacion: z.string().optional(),
  criticidad: z.enum(["Alta", "Media", "Baja"]).optional(),
  estado: z.enum(["Activo", "En Mantenimiento", "Inactivo", "Requiere Calibración"]),
  fecha_puesta_marcha: z.date().optional(),
  proxima_calibracion: z.date({
    required_error: "La fecha de próxima calibración es requerida.",
  }),
  observaciones: z.string().optional(),
  fotoUrl: z.string().optional(),
  manual_url: z.string().url("Debe ser una URL válida.").optional().or(z.literal('')),
  procedimiento_url: z.string().url("Debe ser una URL válida.").optional().or(z.literal('')),
  ensayos_asociados: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const parseDateSafe = (dateString?: string): Date | undefined => {
    if (!dateString) return undefined;
    const date = parse(dateString, 'dd-MM-yyyy', new Date());
    return isValid(date) ? date : undefined;
}


export function EquipoForm({ equipoToEdit, onFormSubmit }: EquipoFormProps) {
  const { toast } = useToast();
  const { addEquipo, updateEquipo, addRecentActivity } = useDynamicData();
  const isEditing = !!equipoToEdit;
  const [imagePreview, setImagePreview] = React.useState<string | null>(equipoToEdit?.fotoUrl || null);

  const defaultValues = React.useMemo(() => ({
      id: equipoToEdit?.id || "",
      nombre: equipoToEdit?.nombre || "",
      marca: equipoToEdit?.marca || "",
      modelo: equipoToEdit?.modelo || "",
      numero_serie: equipoToEdit?.numero_serie || "",
      ubicacion: equipoToEdit?.ubicacion || "",
      criticidad: equipoToEdit?.criticidad || "Media",
      estado: equipoToEdit?.estado || "Activo",
      fecha_puesta_marcha: parseDateSafe(equipoToEdit?.fecha_puesta_marcha),
      proxima_calibracion: parseDateSafe(equipoToEdit?.proxima_calibracion) || new Date(),
      observaciones: equipoToEdit?.observaciones || "",
      fotoUrl: equipoToEdit?.fotoUrl || "",
      manual_url: equipoToEdit?.manual_url || "",
      procedimiento_url: equipoToEdit?.procedimiento_url || "",
      ensayos_asociados: equipoToEdit?.ensayos_asociados || [],
    }), [equipoToEdit]);
    
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  React.useEffect(() => {
      form.reset(defaultValues);
      setImagePreview(defaultValues.fotoUrl || null);
  }, [equipoToEdit, defaultValues, form]);


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);
        form.setValue("fotoUrl", dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };


  const onSubmit = async (data: FormValues) => {
    const equipoData = {
        ...data,
        proxima_calibracion: format(data.proxima_calibracion, "dd-MM-yyyy"),
        fecha_puesta_marcha: data.fecha_puesta_marcha ? format(data.fecha_puesta_marcha, "dd-MM-yyyy") : undefined,
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4 pr-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="id" render={({ field }) => (<FormItem><FormLabel>ID de Activo</FormLabel><FormControl><Input placeholder="Ej: EQ-FTIR-01" {...field} disabled={isEditing}/></FormControl><FormMessage /></FormItem>)}/>
              <FormField control={form.control} name="nombre" render={({ field }) => (<FormItem><FormLabel>Nombre del Equipo</FormLabel><FormControl><Input placeholder="Ej: Espectrómetro FTIR" {...field} /></FormControl><FormMessage /></FormItem>)}/>
              <FormField control={form.control} name="marca" render={({ field }) => (<FormItem><FormLabel>Marca</FormLabel><FormControl><Input placeholder="Ej: PerkinElmer" {...field} /></FormControl><FormMessage /></FormItem>)}/>
              <FormField control={form.control} name="modelo" render={({ field }) => (<FormItem><FormLabel>Modelo</FormLabel><FormControl><Input placeholder="Ej: Spectrum Two" {...field} /></FormControl><FormMessage /></FormItem>)}/>
              <FormField control={form.control} name="numero_serie" render={({ field }) => (<FormItem><FormLabel>N° Serie</FormLabel><FormControl><Input placeholder="Número de serie del fabricante" {...field} /></FormControl><FormMessage /></FormItem>)}/>
              <FormField control={form.control} name="ubicacion" render={({ field }) => (<FormItem><FormLabel>Ubicación</FormLabel><FormControl><Input placeholder="Ej: Mesón Central, Lab Principal" {...field} /></FormControl><FormMessage /></FormItem>)}/>
              <FormField control={form.control} name="criticidad" render={({ field }) => (<FormItem><FormLabel>Criticidad</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione la criticidad" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Alta">Alta</SelectItem><SelectItem value="Media">Media</SelectItem><SelectItem value="Baja">Baja</SelectItem></SelectContent></Select><FormMessage /></FormItem>)}/>
              <FormField control={form.control} name="estado" render={({ field }) => (<FormItem><FormLabel>Estado</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione un estado" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Activo">Activo</SelectItem><SelectItem value="En Mantenimiento">En Mantenimiento</SelectItem><SelectItem value="Inactivo">Inactivo</SelectItem><SelectItem value="Requiere Calibración">Requiere Calibración</SelectItem></SelectContent></Select><FormMessage /></FormItem>)}/>
              <FormField control={form.control} name="fecha_puesta_marcha" render={({ field }) => (<FormItem><FormLabel>Fecha Puesta en Marcha</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal",!field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "dd-MM-yyyy") : <span>Seleccione fecha</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)}/>
              <FormField control={form.control} name="proxima_calibracion" render={({ field }) => (<FormItem><FormLabel>Próxima Calibración</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "dd-MM-yyyy") : <span>Seleccione fecha</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)}/>
          </div>
          <Separator/>
          <div className="space-y-4">
              <FormLabel>Ensayos Realizados</FormLabel>
              <p className="text-sm text-muted-foreground">Marque todos los ensayos en los que se utiliza este equipo.</p>
              <FormField control={form.control} name="ensayos_asociados" render={() => (<FormItem className="grid grid-cols-2 md:grid-cols-3 gap-4"> {ensayosDisponibles.map((ensayo) => (<FormField key={ensayo.id} control={form.control} name="ensayos_asociados" render={({ field }) => { return (<FormItem key={ensayo.id} className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value?.includes(ensayo.id)} onCheckedChange={(checked) => { return checked ? field.onChange([...(field.value || []), ensayo.id]) : field.onChange((field.value || []).filter((value) => value !== ensayo.id))}} /></FormControl><FormLabel className="font-normal">{ensayo.label}</FormLabel></FormItem>)}} />))}<FormMessage /></FormItem>)}/>
          </div>
          <Separator/>
          <div className="space-y-4">
              <FormLabel>Documentación</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="manual_url" render={({ field }) => (<FormItem><FormLabel>URL del Manual de Usuario</FormLabel><FormControl><Input placeholder="https://ejemplo.com/manual.pdf" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                  <FormField control={form.control} name="procedimiento_url" render={({ field }) => (<FormItem><FormLabel>URL del Procedimiento de Ensayo</FormLabel><FormControl><Input placeholder="https://ejemplo.com/procedimiento.pdf" {...field} /></FormControl><FormMessage /></FormItem>)}/>
              </div>
          </div>
          <Separator/>
          <div className="space-y-4">
              <FormField control={form.control} name="observaciones" render={({ field }) => (<FormItem><FormLabel>Observaciones</FormLabel><FormControl><Textarea placeholder="Añada cualquier nota relevante sobre el equipo..." {...field} /></FormControl><FormMessage /></FormItem>)}/>
              <div className="space-y-2">
                  <FormLabel>Fotografía del Equipo</FormLabel>
                  <FormControl><Input id="picture" type="file" className="hidden" accept="image/*" onChange={handleImageChange} /></FormControl>
                  <label htmlFor="picture" className="cursor-pointer">
                      <div className="relative flex items-center justify-center w-full h-48 border-2 border-dashed rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                          {imagePreview ? (<><Image src={imagePreview} alt="Vista previa del equipo" layout="fill" objectFit="contain" className="rounded-lg" /><Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 z-10" onClick={(e) => { e.preventDefault(); setImagePreview(null); form.setValue("fotoUrl", "");}}><X className="h-4 w-4" /></Button></>) : (<div className="text-center"><ImageIcon className="mx-auto h-10 w-10 mb-2" /><span>Haga clic para seleccionar una imagen</span></div>)}
                      </div>
                  </label>
              </div>
          </div>
          <div className="flex justify-end pt-4"><Button type="submit"><Save className="mr-2 h-4 w-4" />{isEditing ? 'Guardar Cambios' : 'Registrar Equipo'}</Button></div>
        </div>
      </form>
    </Form>
  );
}
