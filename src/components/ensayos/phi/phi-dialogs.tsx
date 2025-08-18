
"use client";

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, Controller } from 'react-hook-form';
import { format, parse } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import type { EnsayoPHI } from '@/context/data-context';
import { Combobox } from '@/components/ui/combobox';
import { useToast } from '@/hooks/use-toast';
import { useDynamicData } from '@/context/data-context';

const productosPHI = [
    { value: "90mm x 12m SMARTCOLORS PN-16 SDR-11", label: "90mm x 12m SMARTCOLORS PN-16 SDR-11" },
    { value: "75mm x 6m SMART PIPE/PP-RCT PN-16 S-3,2", label: "75mm x 6m SMART PIPE/PP-RCT PN-16 S-3,2" },
    { value: "63mm x 100m SMARTCOLORS PN-10 SDR-17", label: "63mm x 100m SMARTCOLORS PN-10 SDR-17" },
    { value: "50mm x 6m SMARTCOLORS PN-12,5 SDR-13,6", label: "50mm x 6m SMARTCOLORS PN-12,5 SDR-13,6" },
    { value: "32mm x 200m HDPE PN-16 SDR-11", label: "32mm x 200m HDPE PN-16 SDR-11" },
];

const rayas = [
    { value: 'Sin Raya', label: 'Sin Raya' },
    { value: 'Azul', label: 'Azul' },
    { value: 'Roja', label: 'Roja' },
    { value: 'Verde', label: 'Verde' },
    { value: 'Blanca', label: 'Blanca' },
];

interface NewEnsayoFormProps {
    onClose: () => void;
    addEnsayo: (ensayo: Omit<EnsayoPHI, 'id'>) => Promise<void>;
}

function NewEnsayoForm({ onClose, addEnsayo }: NewEnsayoFormProps) {
    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
      defaultValues: {
        fechaIngresoManual: format(new Date(), 'dd-MM-yyyy'),
        fechaInicio: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        producto: '',
        raya: 'Sin Raya',
        horas: '100'
      }
    });
    const { toast } = useToast();

    const onSubmit = async (data: any) => {
        try {
            const fechaInicioDate = parse(data.fechaInicio, 'dd-MM-yyyy HH:mm:ss', new Date());

            await addEnsayo({
                ...data,
                horas: parseFloat(data.horas),
                fechaInicio: fechaInicioDate.toISOString(),
                estado: 'EN PROCESO',
            });
            toast({ title: "Ensayo Iniciado", description: "El nuevo ensayo de PHI ha sido registrado." });
            onClose();
        } catch (error) {
            toast({ variant: 'destructive', title: "Error", description: "No se pudo iniciar el ensayo." });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <div className="space-y-2">
                <Label htmlFor="fechaIngresoManual">Ingreso</Label>
                <Input id="fechaIngresoManual" {...register('fechaIngresoManual', { required: true })} />
                {errors.fechaIngresoManual && <p className="text-destructive text-sm mt-1">Este campo es requerido</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="fechaInicio">Inicio</Label>
                <Input id="fechaInicio" {...register('fechaInicio', { required: true })} />
                {errors.fechaInicio && <p className="text-destructive text-sm mt-1">Este campo es requerido</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="producto">Producto</Label>
                 <Controller
                    name="producto"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Combobox options={productosPHI} onChange={field.onChange} value={field.value} placeholder="Seleccione producto..." />
                    )}
                  />
                {errors.producto && <p className="text-destructive text-sm mt-1">Este campo es requerido</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="raya">Color de Raya</Label>
                <Controller
                    name="raya"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Combobox options={rayas} onChange={field.onChange} value={field.value} placeholder="Seleccione color..."/>
                    )}
                  />
                {errors.raya && <p className="text-destructive text-sm mt-1">Este campo es requerido</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="horas">Tiempo de Ensayo (horas)</Label>
                <Input id="horas" type="number" step="any" {...register('horas', { required: true })} />
                {errors.horas && <p className="text-destructive text-sm mt-1">Este campo es requerido</p>}
            </div>
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                <Button type="submit">Iniciar Ensayo</Button>
            </DialogFooter>
        </form>
    );
}


interface ResultFormProps {
    onClose: () => void;
    updateEnsayo: (id: string, updatedData: Partial<EnsayoPHI>) => Promise<void>;
    ensayosActivos: EnsayoPHI[];
}

function ResultForm({ onClose, updateEnsayo, ensayosActivos }: ResultFormProps) {
    const { register, handleSubmit, control, watch, formState: { errors } } = useForm();
    const { toast } = useToast();
    const huboFalla = watch('huboFalla');

    const onSubmit = async (data: any) => {
        try {
            const resultado = data.huboFalla
                ? `Con fallas: ${data.observacion}`
                : `Sin fallas a ${data.presion} [bar]`;
            
            await updateEnsayo(data.ensayoId, {
                estado: 'FINALIZADO',
                resultado: resultado,
            });
            toast({ title: "Resultado Registrado", description: "El ensayo ha sido marcado como finalizado." });
            onClose();
        } catch (error) {
            toast({ variant: 'destructive', title: "Error", description: "No se pudo registrar el resultado." });
        }
    };
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <div className="space-y-2">
                <Label htmlFor="ensayoId">Seleccionar Ensayo</Label>
                <Controller
                    name="ensayoId"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Combobox
                            options={ensayosActivos.map(e => ({ value: e.id, label: `${e.producto} (Inicio: ${format(new Date(e.fechaInicio), 'dd/MM HH:mm')})` }))}
                            onChange={field.onChange}
                            value={field.value}
                            placeholder="Seleccione un ensayo en proceso..."
                        />
                    )}
                />
                {errors.ensayoId && <p className="text-destructive text-sm mt-1">Debe seleccionar un ensayo.</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div className="space-y-2">
                    <Label htmlFor="presion">Presión (bar)</Label>
                    <Input id="presion" type="number" step="any" {...register('presion', { required: true })} />
                    {errors.presion && <p className="text-destructive text-sm mt-1">Campo requerido.</p>}
                </div>
                <div className="flex items-center space-x-2 pb-2">
                    <Checkbox id="huboFalla" {...register('huboFalla')} />
                    <Label htmlFor="huboFalla">¿Hubo Falla?</Label>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="observacion">Observación</Label>
                <Textarea id="observacion" {...register('observacion', { required: huboFalla })} />
                {errors.observacion && <p className="text-destructive text-sm mt-1">La observación es requerida si hubo fallas.</p>}
            </div>
             <DialogFooter>
                <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                <Button type="submit">Registrar</Button>
            </DialogFooter>
        </form>
    );
}

interface PhiDialogsProps {
    isNewEnsayoOpen: boolean;
    setIsNewEnsayoOpen: (isOpen: boolean) => void;
    isResultOpen: boolean;
    setIsResultOpen: (isOpen: boolean) => void;
    addEnsayo: (ensayo: Omit<EnsayoPHI, 'id'>) => Promise<void>;
    updateEnsayo: (id: string, updatedData: Partial<EnsayoPHI>) => Promise<void>;
    ensayosActivos: EnsayoPHI[];
}

export function PhiDialogs({
    isNewEnsayoOpen,
    setIsNewEnsayoOpen,
    isResultOpen,
    setIsResultOpen,
    addEnsayo,
    updateEnsayo,
    ensayosActivos,
}: PhiDialogsProps) {
    const { addEnsayoPHI, updateEnsayoPHI } = useDynamicData();

    return (
        <>
            <Dialog open={isNewEnsayoOpen} onOpenChange={setIsNewEnsayoOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Formulario de Ensayo</DialogTitle>
                        <DialogDescription>
                            Complete los datos para iniciar un nuevo monitoreo de Presión Hidrostática.
                        </DialogDescription>
                    </DialogHeader>
                    <NewEnsayoForm onClose={() => setIsNewEnsayoOpen(false)} addEnsayo={addEnsayoPHI} />
                </DialogContent>
            </Dialog>
            <Dialog open={isResultOpen} onOpenChange={setIsResultOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ingresar Resultado de Ensayo PHI</DialogTitle>
                        <DialogDescription>Seleccione un ensayo en proceso y registre su resultado final.</DialogDescription>
                    </DialogHeader>
                    <ResultForm onClose={() => setIsResultOpen(false)} updateEnsayo={updateEnsayoPHI} ensayosActivos={ensayosActivos} />
                </DialogContent>
            </Dialog>
        </>
    );
}
