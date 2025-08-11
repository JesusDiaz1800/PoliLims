
"use client";

import * as React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Trash2, PlusCircle, Calculator, Save, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalculoIncertidumbre } from "@/context/data-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const uncertaintyComponentSchema = z.object({
  descripcion: z.string().nonempty("La descripción es requerida."),
  valor: z.number({ required_error: "El valor es requerido.", invalid_type_error: "Debe ser un número."}).min(0, "El valor no puede ser negativo."),
  unidades: z.string().optional(),
  tipo: z.enum(['A', 'B']),
  distribucion: z.enum(['normal', 'rectangular', 'triangular']),
  divisor: z.number().optional(),
  desviacion_estandar: z.number().optional(),
});

const formSchema = z.object({
  nombre_calculo: z.string().nonempty("El nombre del cálculo es requerido."),
  componentes: z.array(uncertaintyComponentSchema).min(1, "Debe añadir al menos un componente de incertidumbre."),
  factor_cobertura: z.number({ required_error: "El factor k es requerido." }).min(1, "El factor k debe ser al menos 1."),
});

type FormValues = z.infer<typeof formSchema>;
type Componente = z.infer<typeof uncertaintyComponentSchema>;

interface CalculadoraIncertidumbreProps {
  onCalculoGuardado: (calculo: Omit<CalculoIncertidumbre, 'id'>) => void;
}

export function CalculadoraIncertidumbre({ onCalculoGuardado }: CalculadoraIncertidumbreProps) {

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre_calculo: "",
      componentes: [],
      factor_cobertura: 2,
    },
  });

  const { control, handleSubmit, watch, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "componentes",
  });

  const watchedComponents = watch("componentes");

  const calcularIncertidumbre = React.useCallback((componentes: Componente[]) => {
    return componentes.map(c => {
      let stdDev = 0;
      if (c.tipo === 'A') {
        stdDev = c.valor; // Se asume que el valor ya es la desviación estándar experimental
      } else { // Tipo B
        switch (c.distribucion) {
          case 'normal':
            stdDev = c.valor / 2; // Asumiendo que el valor es el 95% de confianza (k=2)
            break;
          case 'rectangular':
            stdDev = c.valor / Math.sqrt(3);
            break;
          case 'triangular':
            stdDev = c.valor / Math.sqrt(6);
            break;
        }
      }
      return { ...c, desviacion_estandar: stdDev };
    });
  }, []);
  
  const componentesCalculados = React.useMemo(() => 
    calcularIncertidumbre(watchedComponents), 
  [watchedComponents, calcularIncertidumbre]);

  const incertidumbreCombinada = React.useMemo(() => {
    const sumOfSquares = componentesCalculados.reduce((acc, c) => acc + Math.pow(c.desviacion_estandar || 0, 2), 0);
    return Math.sqrt(sumOfSquares);
  }, [componentesCalculados]);
  
  const factorCobertura = watch("factor_cobertura");
  const incertidumbreExpandida = incertidumbreCombinada * (factorCobertura || 0);

  const onSubmit = async (data: FormValues) => {
    const calculoParaGuardar = {
        nombre: data.nombre_calculo,
        fecha: new Date().toISOString(),
        usuario: "Victor Lutz", // Mocked user
        resultado: {
            incertidumbreCombinada,
            incertidumbreExpandida,
            factorCobertura: data.factor_cobertura,
        },
        componentes: componentesCalculados,
    };
    onCalculoGuardado(calculoParaGuardar);
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculadora de Incertidumbre de Medición</CardTitle>
        <CardDescription>Estime la incertidumbre combinada y expandida según la guía GUM (ISO/IEC Guide 98-3).</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField control={form.control} name="nombre_calculo" render={({ field }) => (<FormItem><FormLabel>Nombre del Cálculo</FormLabel><FormControl><Input placeholder="Ej: Incertidumbre de pesada en balanza analítica" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                 <FormField control={form.control} name="factor_cobertura" render={({ field }) => (<FormItem><FormLabel>Factor de Cobertura (k)</FormLabel><FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 1)} /></FormControl><FormMessage /></FormItem>)}/>
            </div>
             <Separator/>
            <div>
              <FormLabel>Componentes de Incertidumbre</FormLabel>
              <div className="mt-2 space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-12 gap-2 p-3 border rounded-lg relative">
                    <FormField control={form.control} name={`componentes.${index}.descripcion`} render={({ field }) => (<FormItem className="col-span-12 md:col-span-3"><FormLabel className="text-xs">Descripción</FormLabel><FormControl><Input placeholder="Ej: Repetibilidad" {...field} /></FormControl></FormItem>)}/>
                    <FormField control={form.control} name={`componentes.${index}.valor`} render={({ field }) => (<FormItem className="col-span-6 md:col-span-2"><FormLabel className="text-xs">Valor</FormLabel><FormControl><Input type="number" step="any" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl></FormItem>)} />
                    <FormField control={form.control} name={`componentes.${index}.unidades`} render={({ field }) => (<FormItem className="col-span-6 md:col-span-1"><FormLabel className="text-xs">Unidades</FormLabel><FormControl><Input placeholder="mg, °C..." {...field} /></FormControl></FormItem>)} />
                    <FormField control={form.control} name={`componentes.${index}.tipo`} render={({ field }) => (<FormItem className="col-span-6 md:col-span-2"><FormLabel className="text-xs">Tipo</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="A">Tipo A</SelectItem><SelectItem value="B">Tipo B</SelectItem></SelectContent></Select></FormItem>)} />
                    <FormField control={form.control} name={`componentes.${index}.distribucion`} render={({ field }) => (<FormItem className="col-span-6 md:col-span-2"><FormLabel className="text-xs">Distribución</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={watchedComponents[index]?.tipo === 'A'}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="normal">Normal</SelectItem><SelectItem value="rectangular">Rectangular</SelectItem><SelectItem value="triangular">Triangular</SelectItem></SelectContent></Select></FormItem>)} />
                    <div className="col-span-12 md:col-span-2">
                        <FormLabel className="text-xs">Incertidumbre Estándar (u)</FormLabel>
                        <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm">
                           {componentesCalculados[index]?.desviacion_estandar?.toExponential(3) || '0.000e+0'}
                        </div>
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => append({ descripcion: '', valor: 0, unidades: '', tipo: 'B', distribucion: 'normal' })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Añadir Componente
                </Button>
              </div>
            </div>
             <Separator/>
             <Alert>
                <BookOpen className="h-4 w-4" />
                <AlertTitle>Guía Rápida (Referencia GUM)</AlertTitle>
                <AlertDescription>
                    <ul className="list-disc pl-4 mt-2 space-y-1">
                        <li><b>Tipo A:</b> Evaluada por métodos estadísticos (ej. desviación estándar de una serie de mediciones).</li>
                        <li><b>Tipo B:</b> Evaluada por otros medios (ej. datos de certificados de calibración, manuales, experiencia previa).</li>
                        <li><b>Distribución:</b> Describe la probabilidad de los valores. Use <b>Rectangular</b> para límites definidos sin preferencia (ej. resolución de un equipo), <b>Normal</b> para datos de certificados (k=2).</li>
                    </ul>
                </AlertDescription>
            </Alert>
            <Alert>
                <Calculator className="h-4 w-4" />
                <AlertTitle>Resultados del Cálculo</AlertTitle>
                <AlertDescription>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                            <p className="font-semibold">Incertidumbre Combinada (uc)</p>
                            <p className="font-mono text-lg">{incertidumbreCombinada.toExponential(4)}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Incertidumbre Expandida (U = uc * k)</p>
                            <p className="font-mono text-lg text-primary">{incertidumbreExpandida.toExponential(4)}</p>
                        </div>
                    </div>
                </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit"><Save className="mr-2 h-4 w-4"/> Guardar Cálculo en Historial</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
