import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const instruments = [
    { name: "GC-MS 01", status: "Activo", calibrationDue: 90, assignedTo: "Jesus Diaz" },
    { name: "HPLC 03", status: "Activo", calibrationDue: 75, assignedTo: "Maximiliano M." },
    { name: "Espectrómetro FTIR", status: "Mantenimiento", calibrationDue: 0, assignedTo: "-" },
    { name: "pH Metro A2", status: "Activo", calibrationDue: 12, assignedTo: "Antonia Figueroa" },
    { name: "Viscosímetro 04", status: "Inactivo", calibrationDue: 45, assignedTo: "-" },
];

function getStatusClass(status: string) {
    switch (status) {
        case "Activo": return "bg-green-100 text-green-800";
        case "Mantenimiento": return "bg-red-100 text-red-800";
        case "Inactivo": return "bg-yellow-100 text-yellow-800";
        default: return "bg-secondary";
    }
}

function getProgressColor(value: number) {
    if (value > 75) return "bg-green-500";
    if (value > 25) return "bg-yellow-500";
    return "bg-red-500";
}


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
                            <TableHead className="text-center">Estado</TableHead>
                            <TableHead>Próxima Calibración</TableHead>
                            <TableHead>Asignado a</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {instruments.map((instrument) => (
                            <TableRow key={instrument.name}>
                                <TableCell className="font-medium">{instrument.name}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline" className={cn("border-transparent font-normal", getStatusClass(instrument.status))}>
                                        {instrument.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Progress value={instrument.calibrationDue} 
                                                  className="w-32 h-2" 
                                                  indicatorClassName={getProgressColor(instrument.calibrationDue)} />
                                        <span className="text-sm font-mono text-muted-foreground">{instrument.calibrationDue}%</span>
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
