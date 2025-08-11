
"use client";

import * as React from 'react';
import type { CondicionAmbiental } from '@/context/data-context';
import Loading from '@/app/(app)/loading';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AmbientalStatsCard } from '@/components/ambiental/ambiental-stats-card';
import { HistorialAmbientalChart } from '@/components/ambiental/historial-ambiental-chart';
import { RegistroAmbientalForm } from '@/components/ambiental/registro-ambiental-form';
import { Monitor, Thermometer, Droplets, Settings } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import * as dataService from "@/services/data-service";

export default function ControlAmbientalPage() {
    const [condicionesAmbientales, setCondicionesAmbientales] = React.useState<CondicionAmbiental[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [zonaSeleccionada, setZonaSeleccionada] = React.useState('Laboratorio Principal');

    React.useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            const data = await dataService.getInitialData();
            setCondicionesAmbientales(data.condicionesAmbientales);
            setIsLoading(false);
        }
        loadData();
    }, []);

    const addCondicionAmbiental = async (data: Omit<CondicionAmbiental, 'id' | 'timestamp'>) => {
        const newRecord = await dataService.addCondicionAmbiental(data);
        setCondicionesAmbientales(prev => [...prev, newRecord]);
    };
    
    const addRecentActivity = async (activity: { user: string; action: string }) => {
        await dataService.addRecentActivity(activity);
    };

    if (isLoading) {
        return <Loading />;
    }

    const zonas = Array.from(new Set(condicionesAmbientales.map(c => c.zona)));

    const datosZonaSeleccionada = condicionesAmbientales.filter(c => c.zona === zonaSeleccionada);
    const ultimaLectura = datosZonaSeleccionada.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    const limites: { [key: string]: { temp: { min: number, max: number }, hum: { min: number, max: number } } } = {
        'Laboratorio Principal': { temp: { min: 18, max: 25 }, hum: { min: 30, max: 60 } },
        'Sala de Muestras': { temp: { min: 15, max: 28 }, hum: { min: 20, max: 70 } },
        'Área de Ensayos Mecánicos': { temp: { min: 18, max: 26 }, hum: { min: 25, max: 65 } },
    };

    const usuarios = ["Jesus Diaz", "Maximiliano Miranda", "Antonia Figueroa", "Robinson Córdova", "Bryan Vásquez"];

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Monitor className="h-8 w-8 text-primary"/>
                            <div>
                                <CardTitle>Control de Condiciones Ambientales</CardTitle>
                                <CardDescription>Monitoreo y registro de los parámetros ambientales del laboratorio.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                       {zonas.map(zona => {
                           const ultimaLecturaZona = condicionesAmbientales
                                .filter(c => c.zona === zona)
                                .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
                           return (
                                <AmbientalStatsCard 
                                    key={zona}
                                    zona={zona}
                                    ultimaLectura={ultimaLecturaZona}
                                    limites={limites[zona]}
                                />
                           )
                       })}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Registrar Medición</CardTitle>
                        <CardDescription>Ingrese una nueva lectura de condiciones.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RegistroAmbientalForm
                            zonas={zonas}
                            usuarios={usuarios}
                            onAddRecord={async (data) => {
                                await addCondicionAmbiental(data);
                                await addRecentActivity({
                                    user: data.usuario,
                                    action: `registró condiciones ambientales para ${data.zona}`,
                                });
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <CardTitle>Historial de Tendencias</CardTitle>
                            <CardDescription>Análisis visual de los parámetros ambientales a lo largo del tiempo.</CardDescription>
                        </div>
                        <div className='w-full md:w-auto'>
                             <Label htmlFor='zona-selector' className="sr-only">Seleccionar Zona</Label>
                            <Select value={zonaSeleccionada} onValueChange={setZonaSeleccionada}>
                                <SelectTrigger id="zona-selector" className="w-full md:w-[250px]">
                                    <SelectValue placeholder="Seleccione una zona" />
                                </SelectTrigger>
                                <SelectContent>
                                    {zonas.map(zona => <SelectItem key={zona} value={zona}>{zona}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div>
                             <h3 className="text-md font-semibold mb-2 flex items-center gap-2 text-muted-foreground"><Thermometer className="h-5 w-5"/>Temperatura (°C)</h3>
                            <HistorialAmbientalChart 
                                data={datosZonaSeleccionada}
                                dataKey="temperatura"
                                strokeColor="hsl(var(--chart-2))"
                                limits={limites[zonaSeleccionada].temp}
                            />
                        </div>
                        <div>
                            <h3 className="text-md font-semibold mb-2 flex items-center gap-2 text-muted-foreground"><Droplets className="h-5 w-5"/>Humedad Relativa (%)</h3>
                            <HistorialAmbientalChart 
                                data={datosZonaSeleccionada}
                                dataKey="humedad"
                                strokeColor="hsl(var(--chart-1))"
                                limits={limites[zonaSeleccionada].hum}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
