
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
import type { CondicionAmbiental } from "@/context/data-context";

interface RegistroAmbientalFormProps {
  zonas: string[];
  usuarios: string[];
  onAddRecord: (data: Omit<CondicionAmbiental, 'id' | 'timestamp'>) => Promise<void>;
}

const formSchema = z.object({
  zona: z.string({ required_error: "La zona es requerida." }),
  temperatura: z.number({ required_error: "La temperatura es requerida.", invalid_type_error: "Debe ser un número." }),
  humedad: z.number({ required_error: "La humedad es requerida.", invalid_type_error: "Debe ser un número." }).min(0).max(100),
  presion: z.number({ invalid_type_error: "Debe ser un número." }).optional(),
  usuario: z.string({ required_error: "El usuario es requerido." }),
});

type FormValues = z.infer<typeof formSchema>;

export function RegistroAmbientalForm({ zonas, usuarios, onAddRecord }: RegistroAmbientalFormProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      zona: zonas[0] || "",
      usuario: usuarios[0] || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await onAddRecord(data);
      toast({
        title: "Registro Guardado",
        description: `Se ha guardado la lectura para ${data.zona}.`,
      });
      form.reset({ ...form.getValues(), temperatura: undefined, humedad: undefined, presion: undefined });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar el registro.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="zona" render={({ field }) => (
          <FormItem><FormLabel>Zona</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
            <SelectContent>{zonas.map(z => <SelectItem key={z} value={z}>{z}</SelectItem>)}</SelectContent>
          </Select><FormMessage /></FormItem>
        )}/>
        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="temperatura" render={({ field }) => (<FormItem><FormLabel>Temp. (°C)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value))}/></FormControl><FormMessage /></FormItem>)}/>
            <FormField control={form.control} name="humedad" render={({ field }) => (<FormItem><FormLabel>Humedad (%)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value))}/></FormControl><FormMessage /></FormItem>)}/>
        </div>
         <FormField control={form.control} name="presion" render={({ field }) => (<FormItem><FormLabel>Presión (hPa) (Opcional)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value))}/></FormControl><FormMessage /></FormItem>)}/>
         <FormField control={form.control} name="usuario" render={({ field }) => (
          <FormItem><FormLabel>Usuario</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
            <SelectContent>{usuarios.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
          </Select><FormMessage /></FormItem>
        )}/>
        <Button type="submit" className="w-full">
            <Save className="mr-2 h-4 w-4"/> Guardar
        </Button>
      </form>
    </Form>
  );
}
