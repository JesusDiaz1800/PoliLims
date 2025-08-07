
"use client";

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, Save } from 'lucide-react';
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

const defaultValues = {
    ph: '',
    conductividad: '',
    cloro_residual: '',
    dureza: '',
    observaciones: '',
    responsable: '',
};

export default function ControlAguaPage() {
    const { toast } = useToast();
    const form = useForm({ defaultValues });

    const onSubmit = (data: any) => {
        console.log(data);
        toast({
            title: "Control de Agua Registrado",
            description: "Los resultados del análisis de agua han sido guardados.",
        });
        form.reset(defaultValues);
    };

    const analistas = [
        { value: "Jesus Diaz", label: "Jesus Diaz" },
        { value: "Maximiliano Miranda", label: "Maximiliano Miranda" },
        { value: "Antonia Figueroa", label: "Antonia Figueroa" },
        { value: "Robinson Córdova", label: "Robinson Córdova" },
        { value: "Bryan Vásquez", label: "Bryan Vásquez" },
    ];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Droplets className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle>Control de Calidad de Agua</CardTitle>
                        <CardDescription>Registre los resultados de los análisis periódicos del agua utilizada en el laboratorio.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                             <FormField control={form.control} name="ph" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>pH</FormLabel>
                                    <FormControl><Input type="number" step="0.1" placeholder="Ej: 7.2" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="conductividad" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Conductividad [µS/cm]</FormLabel>
                                    <FormControl><Input type="number" placeholder="Ej: 150" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="cloro_residual" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cloro Residual [ppm]</FormLabel>
                                    <FormControl><Input type="number" step="0.1" placeholder="Ej: 0.5" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="dureza" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dureza Total [mg/L CaCO₃]</FormLabel>
                                    <FormControl><Input type="number" placeholder="Ej: 80" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                         <FormField control={form.control} name="observaciones" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Observaciones</FormLabel>
                                <FormControl><Textarea placeholder="Añada cualquier nota relevante sobre la calidad del agua..." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="flex items-center justify-between">
                            <FormField control={form.control} name="responsable" render={({ field }) => (
                                <FormItem className="w-full max-w-xs">
                                    <FormLabel>Responsable del Análisis</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Seleccione analista..." /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {analistas.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Button type="submit">
                                <Save className="mr-2 h-4 w-4" />
                                Guardar Registro
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
