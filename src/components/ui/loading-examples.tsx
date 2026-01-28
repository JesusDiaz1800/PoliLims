"use client";

import * as React from "react";
import { Loading, LoadingSpinner, QuickLoading, LoadingOverlay } from "./loading-optimized";

// Ejemplo de uso del componente de carga optimizado
export const LoadingExamples = () => {
  const [showOverlay, setShowOverlay] = React.useState(false);

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">Ejemplos de Componentes de Carga</h2>
      
      {/* Carga Fullscreen */}
      <div className="card-glass p-6">
        <h3 className="text-lg font-semibold mb-4">Carga Fullscreen</h3>
        <Loading variant="fullscreen" size="lg" />
      </div>

      {/* Carga Inline */}
      <div className="card-glass p-6">
        <h3 className="text-lg font-semibold mb-4">Carga Inline</h3>
        <Loading variant="inline" size="md" />
      </div>

      {/* Carga Rápida */}
      <div className="card-glass p-6">
        <h3 className="text-lg font-semibold mb-4">Carga Rápida</h3>
        <QuickLoading />
      </div>

      {/* Carga con Overlay */}
      <div className="card-glass p-6">
        <h3 className="text-lg font-semibold mb-4">Carga con Overlay</h3>
        <button 
          onClick={() => setShowOverlay(!showOverlay)}
          className="btn-primary mb-4"
        >
          {showOverlay ? 'Ocultar' : 'Mostrar'} Overlay
        </button>
        <LoadingOverlay isVisible={showOverlay}>
          <div className="p-8 bg-muted rounded-lg">
            <p>Contenido que se oculta cuando aparece el overlay de carga</p>
          </div>
        </LoadingOverlay>
      </div>

      {/* Diferentes tamaños */}
      <div className="card-glass p-6">
        <h3 className="text-lg font-semibold mb-4">Diferentes Tamaños</h3>
        <div className="flex items-center gap-8">
          <div className="text-center">
            <LoadingSpinner size="sm" />
            <p className="text-sm mt-2">Pequeño</p>
          </div>
          <div className="text-center">
            <LoadingSpinner size="md" />
            <p className="text-sm mt-2">Mediano</p>
          </div>
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-sm mt-2">Grande</p>
          </div>
        </div>
      </div>

      {/* Carga con mensaje personalizado */}
      <div className="card-glass p-6">
        <h3 className="text-lg font-semibold mb-4">Carga con Mensaje Personalizado</h3>
        <Loading 
          variant="inline" 
          size="md" 
          message="Procesando datos del laboratorio..."
          showMessages={false}
        />
      </div>
    </div>
  );
};

export default LoadingExamples;
