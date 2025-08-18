
"use client";

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Capacitacion } from '@/context/data-context';
import { Save } from 'lucide-react';

interface RealizarEvaluacionFormProps {
    capacitacion: Capacitacion;
    onSubmit: (respuestas: string[]) => void;
}

export function RealizarEvaluacionForm({ capacitacion, onSubmit }: RealizarEvaluacionFormProps) {
    const defaultValues = capacitacion.evaluacion?.preguntas?.reduce((acc, _, index) => {
        acc[`respuesta_${index}`] = '';
        return acc;
    }, {} as Record<string, string>) || {};

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });

    const handleFormSubmit = (data: Record<string, string>) => {
        const respuestas = Object.values(data);
        onSubmit(respuestas);
    };

    if (!capacitacion.evaluacion || !capacitacion.evaluacion.preguntas || capacitacion.evaluacion.preguntas.length === 0) {
        return <p className="text-muted-foreground">Esta capacitación no tiene una evaluación definida.</p>;
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {capacitacion.evaluacion.preguntas.map((pregunta, index) => (
                <div key={index} className="space-y-2">
                    <Label htmlFor={`respuesta_${index}`}>
                        {index + 1}. {pregunta.pregunta}
                    </Label>
                    <Textarea 
                        id={`respuesta_${index}`}
                        {...register(`respuesta_${index}`, { required: 'Esta respuesta es requerida.' })}
                        placeholder="Escriba su respuesta aquí..."
                    />
                    {errors[`respuesta_${index}`] && <p className="text-sm text-destructive">{errors[`respuesta_${index}`]?.message as string}</p>}
                </div>
            ))}
            <div className="flex justify-end">
                <Button type="submit">
                    <Save className="mr-2 h-4 w-4"/>
                    Enviar Evaluación
                </Button>
            </div>
        </form>
    );
}

