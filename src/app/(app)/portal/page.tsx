
"use client";

import { GenericFormPage } from '@/components/generic-form-page';
import { Users } from 'lucide-react';

export default function ClientPortalPage() {
    const formFields = [
        { name: 'nombre_cliente', label: 'Nombre del Cliente', type: 'text', placeholder: 'Su nombre o el de su empresa' },
        { name: 'email_cliente', label: 'Correo Electrónico', type: 'email', placeholder: 'sudireccion@ejemplo.com' },
        { name: 'telefono_cliente', label: 'Teléfono de Contacto', type: 'tel', placeholder: '+56 9 1234 5678' },
        { name: 'tipo_muestra', label: 'Tipo de Muestra Enviada', type: 'text', placeholder: 'Ej: Granulado de PP, Trozo de tubería' },
        { name: 'cantidad_muestra', label: 'Cantidad', type: 'number', placeholder: 'Ej: 5' },
        { name: 'ensayos_requeridos', label: 'Ensayos Requeridos', type: 'textarea', placeholder: 'Liste los ensayos que necesita (ej: Melt Index, Densidad, etc.)' },
    ];

    return (
        <GenericFormPage
            title="Portal de Clientes"
            description="Un portal dedicado para que los clientes envíen solicitudes de ensayo de manera sencilla."
            icon={Users}
            formFields={formFields}
            formTitle="Enviar Nueva Solicitud de Ensayo"
            formDescription="Por favor, complete el formulario para registrar su muestra y los ensayos que necesita."
            buttonText="Enviar Solicitud"
        />
    );
}
