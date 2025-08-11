
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDynamicData } from "@/context/data-context";
import type { Ensayo } from "@/context/data-context";
import type { User } from "@/services/user-service";
import { Save, ShieldCheck } from "lucide-react";

interface ApprovalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ensayo: Ensayo;
  user: User;
}

const formSchema = z.object({
  estado: z.enum(['Aprobado', 'Rechazado']),
  comentarios_aprobacion: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ApprovalDialog({ isOpen, onClose, ensayo, user }: ApprovalDialogProps) {
  const { toast } = useToast();
  const { updateEnsayo, addRecentActivity } = useDynamicData();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      estado: ensayo.estado === 'Aprobado' || ensayo.estado === 'Rechazado' ? ensayo.estado : 'Aprobado',
      comentarios_aprobacion: ensayo.comentarios_aprobacion || "",
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        estado: ensayo.estado === 'Aprobado' || ensayo.estado === 'Rechazado' ? ensayo.estado : 'Aprobado',
        comentarios_aprobacion: ensayo.comentarios_aprobacion || "",
      });
    }
  }, [isOpen, ensayo, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      await updateEnsayo(ensayo.id, {
        estado: data.estado,
        comentarios_aprobacion: data.comentarios_aprobacion,
      });

      await addRecentActivity({
        user: user.fullName,
        action: `ha ${data.estado.toLowerCase()} el ensayo ${ensayo.id}`,
      });

      toast({
        title: "Decisión Guardada",
        description: `El ensayo ${ensayo.id} ha sido marcado como ${data.estado}.`,
      });

      onClose();
    } catch (error) {
      console.error("Error al guardar la aprobación:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar la decisión. Por favor, intente de nuevo.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <DialogTitle>Aprobar / Rechazar Ensayo</DialogTitle>
            </div>
            <DialogDescription>
              Tome una decisión final para el ensayo <span className="font-bold font-mono text-foreground">{ensayo.id}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Decisión Final</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Aprobado">Aprobar Ensayo</SelectItem>
                      <SelectItem value="Rechazado">Rechazar Ensayo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comentarios_aprobacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentarios (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ej: Resultados consistentes con especificación del proveedor." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Guardar Decisión
            </Button>
          </DialogFooter>
         </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
