"use client";

import * as React from "react";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";

export function ButtonExamples() {
  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Botones Modernos con Degradados</CardTitle>
          <CardDescription>
            Ejemplos de botones con estilos modernos y degradados sutiles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Botón Principal</Button>
            <Button variant="secondary">Botón Secundario</Button>
            <Button variant="outline">Botón Outline</Button>
            <Button variant="ghost">Botón Ghost</Button>
            <Button variant="destructive">Botón Destructivo</Button>
            <Button variant="link">Botón Link</Button>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button variant="default" size="sm">Pequeño</Button>
            <Button variant="default" size="default">Normal</Button>
            <Button variant="default" size="lg">Grande</Button>
            <Button variant="default" size="icon">🔍</Button>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button variant="default" disabled>Deshabilitado</Button>
            <Button variant="secondary" disabled>Secundario Deshabilitado</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
