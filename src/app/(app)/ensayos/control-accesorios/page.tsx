
"use client";

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';

const defaultValues = {
  tipo_accesorio: '',
  material: '',
  dimension: '',
  lote: '',
  inspeccion_visual: false,
  rebabas: false,
  superficie: false,
  marcado: false,
  observaciones: '',
  veredicto: '',
  responsable: '',
};

export default function ControlAccesoriosPage() {
    const { toast } = useToast();
    const form = useForm({ defaultValues });

    const onSubmit = (data: any) => {
        console.log(data);
        toast({
            title: "Control de Accesorios Registrado",
            description: "Los resultados de la inspección han sido guardados.",
        });
        form.reset(defaultValues);
    };

    const analistas = [
        { value: "Elias Ibañez", label: "Elias Ibañez" },
        { value: "Cristian Montellano", label: "Cristian Montellano" },
        { value: "Daniel Palma", label: "Daniel Palma" },
        { value: "Luis Parada", label: "Luis Parada" },
    ];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Wrench className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle>Control de Calidad de Accesorios</CardTitle>
                        <CardDescription>Registre y consulte los controles de calidad para accesorios (fittings, codos, etc.).</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                             <FormField control={form.control} name="tipo_accesorio" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Accesorio</FormLabel>
                                    <FormControl><Input placeholder="Ej: Codo 90°, Unión" {...field} /></FormControl>
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="material" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Material</FormLabel>
                                    <FormControl><Input placeholder="Ej: HDPE, PP-R" {...field} /></FormControl>
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="dimension" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dimensión</FormLabel>
                                    <FormControl><Input placeholder="Ej: 90mm, 1/2 pulgada" {...field} /></FormControl>
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="lote" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lote de Producción</FormLabel>
                                    <FormControl><Input placeholder="Número de lote" {...field} /></FormControl>
                                </FormItem>
                            )} />
                        </div>
                        <Card>
                          <CardHeader>
                              <CardTitle>Inspección Visual y Dimensional</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                  <FormField control={form.control} name="inspeccion_visual" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 h-fit"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Apariencia Conforme</FormLabel></FormItem>)} />
                                  <FormField control={form.control} name="rebabas" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 h-fit"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Libre de Rebabas</FormLabel></FormItem>)} />
                                  <FormField control={form.control} name="superficie" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 h-fit"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Superficie Lisa</FormLabel></FormItem>)} />
                                  <FormField control={form.control} name="marcado" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 h-fit"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Marcado Correcto</FormLabel></FormItem>)} />
                              </div>
                              <FormField control={form.control} name="observaciones" render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Observaciones Adicionales</FormLabel>
                                      <FormControl><Textarea placeholder="Añada cualquier nota relevante sobre la inspección..." {...field} /></FormControl>
                                  </FormItem>
                              )} />
                          </CardContent>
                        </Card>
                         <div className="flex items-end justify-between gap-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
                                <FormField control={form.control} name="veredicto" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Veredicto Final</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un resultado..." /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="Aprobado">Aprobado</SelectItem>
                                                <SelectItem value="Rechazado">Rechazado</SelectItem>
                                                <SelectItem value="Aprobado con Observaciones">Aprobado con Observaciones</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="responsable" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Responsable de Inspección</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Seleccione inspector..." /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {analistas.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                           </div>
                            <Button type="submit" className="h-10">
                                <Save className="mr-2 h-4 w-4" />
                                Guardar Inspección
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
