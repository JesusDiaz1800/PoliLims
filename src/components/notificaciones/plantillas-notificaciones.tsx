
"use client";

import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { PlantillaNotificacion } from "@/services/data-service";
import { PlantillaPreviewDialog } from "./plantilla-preview-dialog";

interface PlantillasNotificacionesProps {
    initialTemplates: PlantillaNotificacion[];
}

export function PlantillasNotificaciones({ initialTemplates }: PlantillasNotificacionesProps) {
    const [templates, setTemplates] = React.useState(initialTemplates);
    const [selectedTemplate, setSelectedTemplate] = React.useState<PlantillaNotificacion | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
    const { toast } = useToast();

    const handlePreview = (template: PlantillaNotificacion) => {
        setSelectedTemplate(template);
        setIsPreviewOpen(true);
    };

    const handleEdit = (template: PlantillaNotificacion) => {
        toast({
            title: "Función Próximamente",
            description: "La edición de plantillas estará disponible en una futura actualización.",
        });
    }

    return (
        <>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[30%]">Nombre de la Plantilla</TableHead>
                            <TableHead className="w-[50%]">Descripción</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {templates.map((template) => (
                            <TableRow key={template.id}>
                                <TableCell className="font-medium">{template.nombre}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{template.descripcion}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => handlePreview(template)}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Vista Previa
                                    </Button>
                                    <Button variant="secondary" size="sm" onClick={() => handleEdit(template)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <PlantillaPreviewDialog
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                template={selectedTemplate}
            />
        </>
    );
}

