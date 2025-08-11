
"use client";

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";
import type { Metadata } from 'next';

// This would typically come from a service or API
const roles = [
  { id: 'jefe_calidad', name: 'Jefe de Calidad', description: 'Acceso total y permisos de aprobación.' },
  { id: 'analista_calidad', name: 'Analista de Calidad', description: 'Registra y edita ensayos de laboratorio.' },
  { id: 'inspector_calidad', name: 'Inspector de Calidad', description: 'Registra controles de rutina en producción.' },
  { id: 'admin_sistema', name: 'Administrador del Sistema', description: 'Gestiona usuarios y configuración.' },
];

const permissions = {
  dashboard: { label: 'Ver Dashboard', roles: ['jefe_calidad', 'analista_calidad', 'inspector_calidad', 'admin_sistema'] },
  ensayos: { label: 'Ver Ensayos', roles: ['jefe_calidad', 'analista_calidad'] },
  registrar_ensayos: { label: 'Registrar Ensayos', roles: ['jefe_calidad', 'analista_calidad', 'inspector_calidad'] },
  aprobar_ensayos: { label: 'Aprobar Ensayos', roles: ['jefe_calidad'] },
  equipos: { label: 'Gestionar Equipos', roles: ['jefe_calidad', 'admin_sistema'] },
  ver_equipos: { label: 'Ver Equipos', roles: ['analista_calidad', 'inspector_calidad'] },
  informes: { label: 'Generar Informes', roles: ['jefe_calidad', 'analista_calidad'] },
  no_conformidades: { label: 'Gestionar No Conformidades', roles: ['jefe_calidad', 'analista_calidad'] },
  administracion: { label: 'Administrar Sistema', roles: ['admin_sistema'] },
};

type PermissionKey = keyof typeof permissions;

export default function PermisosPage() {
  const [selectedRole, setSelectedRole] = React.useState(roles[0]);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Roles de Usuario</CardTitle>
            <CardDescription>Seleccione un rol para ver sus permisos asociados.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedRole.id === role.id ? 'bg-accent/80 text-accent-foreground border-accent' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="font-semibold">{role.name}</div>
                  <div className="text-sm text-muted-foreground">{role.description}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary"/>
              <CardTitle>Permisos para: {selectedRole.name}</CardTitle>
            </div>
            <CardDescription>
              La matriz de permisos define qué acciones puede realizar cada rol dentro de la aplicación.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Módulo / Funcionalidad</TableHead>
                  <TableHead className="text-center">Permiso Concedido</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.keys(permissions).map((key) => {
                  const permKey = key as PermissionKey;
                  const hasPermission = permissions[permKey].roles.includes(selectedRole.id);
                  return (
                    <TableRow key={permKey}>
                      <TableCell className="font-medium">{permissions[permKey].label}</TableCell>
                      <TableCell className="text-center">
                        <Checkbox checked={hasPermission} disabled />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    