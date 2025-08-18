
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import type { Capacitacion, User } from "@/context/data-context";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Save } from "lucide-react";
import { Table, TableBody, TableCell, TableRow, TableHeader, TableHead } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface AsistenciaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  capacitacion: Capacitacion;
  users: User[];
  onSave: (id: string, data: Partial<Capacitacion>) => Promise<void>;
}

export function AsistenciaDialog({ isOpen, onClose, capacitacion, users, onSave }: AsistenciaDialogProps) {
  const { toast } = useToast();
  const [asistentes, setAsistentes] = React.useState(capacitacion.asistentes || []);

  React.useEffect(() => {
    if (isOpen) {
        setAsistentes(capacitacion.asistentes || []);
    }
  }, [isOpen, capacitacion.asistentes]);

  const handleToggleAsistencia = (empleadoId: string) => {
    setAsistentes(prev => 
      prev.map(a => a.empleadoId === empleadoId ? { ...a, asistio: !a.asistio } : a)
    );
  };

  const handleAddAsistente = (empleadoId: string) => {
    if (!asistentes.some(a => a.empleadoId === empleadoId)) {
        setAsistentes(prev => [...prev, { empleadoId, asistio: false }]);
    }
  };

  const handleSave = async () => {
    try {
        await onSave(capacitacion.id, { asistentes });
        toast({ title: "Asistencia guardada", description: "Se ha actualizado la lista de asistentes." });
        onClose();
    } catch(e) {
        toast({ variant: 'destructive', title: "Error", description: "No se pudo guardar la asistencia." });
    }
  };

  const getAvatarInfo = (name: string) => {
    const fallback = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    return { fallback };
  };

  const usuariosDisponibles = users.filter(u => !asistentes.some(a => a.empleadoId === u.username));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gestionar Asistencia: {capacitacion.nombre}</DialogTitle>
          <DialogDescription>
            Añada los empleados convocados y marque quiénes asistieron a la capacitación.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
                <Select onValueChange={handleAddAsistente}>
                    <SelectTrigger><SelectValue placeholder="Añadir empleado convocado..." /></SelectTrigger>
                    <SelectContent>
                        {usuariosDisponibles.map(user => (
                            <SelectItem key={user.username} value={user.username}>{user.fullName}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => handleAddAsistente('')} disabled>
                    <PlusCircle className="mr-2 h-4 w-4"/> Añadir
                </Button>
            </div>
            <ScrollArea className="h-72 w-full rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Empleado</TableHead>
                            <TableHead className="text-center w-24">Asistió</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {asistentes.map(asistente => {
                            const user = users.find(u => u.username === asistente.empleadoId);
                            const avatar = getAvatarInfo(user?.fullName || '??');
                            return (
                            <TableRow key={asistente.empleadoId}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={user?.avatarUrl} />
                                            <AvatarFallback>{avatar.fallback}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{user?.fullName || 'Usuario no encontrado'}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Checkbox
                                        checked={asistente.asistio}
                                        onCheckedChange={() => handleToggleAsistencia(asistente.empleadoId)}
                                    />
                                </TableCell>
                            </TableRow>
                        )})}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
        <DialogFooter>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave}><Save className="mr-2 h-4 w-4"/> Guardar Asistencia</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
