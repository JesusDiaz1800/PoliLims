
"use client";

import { GenericFormPage } from '@/components/generic-form-page';
import { Beaker } from 'lucide-react';

export default function EquiposPage() {
    const formFields = [
        { name: 'nombre_equipo', label: 'Nombre del Equipo', type: 'text', placeholder: 'Ej: Espectrómetro FTIR' },
        { name: 'id_equipo', label: 'ID de Equipo', type: 'text', placeholder: 'Ej: EQ-FTIR-01' },
        { name: 'marca', label: 'Marca', type: 'text', placeholder: 'Ej: PerkinElmer' },
        { name: 'modelo', label: 'Modelo', type: 'text', placeholder: 'Ej: Spectrum Two' },
        { name: 'fecha_adquisicion', label: 'Fecha de Adquisición', type: 'date' },
        { name: 'estado', label: 'Estado', type: 'select', options: ['Activo', 'En Mantenimiento', 'Inactivo', 'Requiere Calibración'] },
        { name: 'proxima_calibracion', label: 'Próxima Calibración', type: 'date' },
        { name: 'ubicacion', label: 'Ubicación', type: 'text', placeholder: 'Ej: Sala de Instrumentación' },
    ];

    return (
        <GenericFormPage
            title="Gestión de Equipos"
            description="Administre el inventario, calibración y mantenimiento de los equipos del laboratorio."
            icon={Beaker}
            formFields={formFields}
            formTitle="Registrar Nuevo Equipo"
            formDescription="Complete los detalles para añadir un nuevo equipo al inventario."
            buttonText="Guardar Equipo"
        />
    );
}
