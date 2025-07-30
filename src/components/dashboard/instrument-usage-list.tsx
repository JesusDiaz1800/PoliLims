import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const instruments = [
    { name: "GC-MS 01", status: "Active", calibrationDue: 90, assignedTo: "Jesus Diaz" },
    { name: "HPLC 03", status: "Active", calibrationDue: 75, assignedTo: "Maximiliano M." },
    { name: "FTIR Spectrometer", status: "Maintenance", calibrationDue: 0, assignedTo: "-" },
    { name: "pH Meter A2", status: "Active", calibrationDue: 12, assignedTo: "Antonia Figueroa" },
    { name: "Viscometer 04", status: "Inactive", calibrationDue: 45, assignedTo: "-" },
];

export function InstrumentUsageList() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Instrument Status</CardTitle>
                <CardDescription>Real-time usage and calibration tracking of lab instruments.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Instrument</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Calibration</TableHead>
                            <TableHead>Assigned To</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {instruments.map((instrument) => (
                            <TableRow key={instrument.name}>
                                <TableCell className="font-medium">{instrument.name}</TableCell>
                                <TableCell>
                                    <Badge variant={instrument.status === 'Active' ? 'default' : instrument.status === 'Maintenance' ? 'destructive' : 'secondary'} className={instrument.status === 'Active' ? 'bg-green-500/20 text-green-700 border-green-500/30' : ''}>
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
