import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const instruments = [
    { name: "GC-MS 01", status: "Activo", calibrationDue: 90, assignedTo: "Jesus Diaz" },
    { name: "HPLC 03", status: "Activo", calibrationDue: 75, assignedTo: "Maximiliano M." },
    { name: "Espectrómetro FTIR", status: "Mantenimiento", calibrationDue: 0, assignedTo: "-" },
    { name: "pH Metro A2", status: "Activo", calibrationDue: 12, assignedTo: "Antonia Figueroa" },
    { name: "Viscosímetro 04", status: "Inactivo", calibrationDue: 45, assignedTo: "-" },
];

export function InstrumentUsageList() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Estado de Equipos</CardTitle>
                <CardDescription>Seguimiento en tiempo real del uso y calibración de los equipos del laboratorio.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Equipo</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Calibración</TableHead>
                            <TableHead>Asignado a</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {instruments.map((instrument) => (
                            <TableRow key={instrument.name}>
                                <TableCell className="font-medium">{instrument.name}</TableCell>
                                <TableCell>
                                    <Badge variant={instrument.status === 'Activo' ? 'default' : instrument.status === 'Mantenimiento' ? 'destructive' : 'secondary'} 
                                           className={
                                            instrument.status === 'Activo' ? 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30' : 
                                            instrument.status === 'Mantenimiento' ? 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30' :
                                            'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30'
                                           }>
                                        {instrument.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Progress value={instrument.calibrationDue} className="w-24 h-2" />
                                        <span className="text-xs text-muted-foreground">{instrument.calibrationDue}%</span>
                                    </div>
                                </TableCell>
                                <TableCell>{instrument.assignedTo}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
