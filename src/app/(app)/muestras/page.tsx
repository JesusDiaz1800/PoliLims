
"use client";

import { GenericFormPage } from '@/components/generic-form-page';
import { FlaskConical } from 'lucide-react';

export default function MuestrasPage() {
    const formFields = [
        { name: 'id_muestra', label: 'ID de Muestra', type: 'text', placeholder: 'Ej: M-2024-07-001' },
        { name: 'tipo_muestra', label: 'Tipo de Muestra', type: 'text', placeholder: 'Ej: Tubería HDPE' },
        { name: 'fecha_recepcion', label: 'Fecha de Recepción', type: 'date' },
        { name: 'cliente', label: 'Cliente', type: 'text', placeholder: 'Ej: Cliente Interno / Nombre Cliente' },
        { name: 'estado', label: 'Estado de la Muestra', type: 'select', options: ['Recibida', 'En Almacenamiento', 'En Ensayo', 'Archivada', 'Desechada'] },
        { name: 'ubicacion', label: 'Ubicación de Almacenamiento', type: 'text', placeholder: 'Ej: Refrigerador A, Estante 3' },
        { name: 'responsable', label: 'Responsable de Recepción', type: 'text', placeholder: 'Nombre del analista' },
    ];

    return (
        <GenericFormPage
            title="Gestión de Muestras"
            description="Administre el inventario y el ciclo de vida de las muestras del laboratorio."
            icon={FlaskConical}
            formFields={formFields}
            formTitle="Registrar Nueva Muestra"
            formDescription="Complete los campos para registrar una nueva muestra en el sistema."
            buttonText="Guardar Muestra"
        />
    );
}
