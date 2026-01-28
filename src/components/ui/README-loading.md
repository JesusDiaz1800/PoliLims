# Componente de Carga Optimizado

## Descripción
Componente de carga reutilizable y optimizado para toda la aplicación PoliLims, con múltiples variantes y tamaños.

## Características
- ✅ **Múltiples variantes**: fullscreen, inline, overlay
- ✅ **Diferentes tamaños**: sm, md, lg
- ✅ **Mensajes rotativos**: mensajes automáticos que cambian cada 2 segundos
- ✅ **Mensaje personalizado**: posibilidad de usar un mensaje fijo
- ✅ **Optimizado**: React.memo para evitar re-renders innecesarios
- ✅ **Responsive**: se adapta a diferentes tamaños de pantalla
- ✅ **Accesible**: incluye aria-labels y estados apropiados

## Uso Básico

```tsx
import Loading from "@/components/ui/loading-optimized";

// Carga fullscreen (pantalla completa)
<Loading variant="fullscreen" size="lg" />

// Carga inline (dentro de un contenedor)
<Loading variant="inline" size="md" />

// Carga rápida para navegación
import { QuickLoading } from "@/components/ui/loading-optimized";
<QuickLoading />

// Carga con overlay
import { LoadingOverlay } from "@/components/ui/loading-optimized";
<LoadingOverlay isVisible={isLoading}>
  <div>Contenido que se oculta durante la carga</div>
</LoadingOverlay>
```

## Props

### Loading
- `variant`: "fullscreen" | "inline" | "overlay" (default: "fullscreen")
- `size`: "sm" | "md" | "lg" (default: "md")
- `message`: string (mensaje personalizado)
- `showMessages`: boolean (mostrar mensajes rotativos, default: true)
- `className`: string (clases CSS adicionales)

### LoadingSpinner
- `size`: "sm" | "md" | "lg" (default: "md")
- `className`: string (clases CSS adicionales)

### LoadingOverlay
- `isVisible`: boolean (mostrar/ocultar overlay)
- `children`: ReactNode (contenido que se oculta)
- Todas las props de Loading

## Mensajes por Defecto
1. "Cargando componentes..."
2. "Analizando datos del laboratorio..."
3. "Calibrando instrumentos virtuales..."
4. "Optimizando visualizaciones..."
5. "Poniendo todo a punto..."

## Implementación en la App

### Carga Principal (App)
```tsx
// src/app/(app)/loading.tsx
import Loading from "@/components/ui/loading-optimized";

export default function AppLoading() {
  return <Loading variant="fullscreen" size="lg" />;
}
```

### Carga de Dashboard
```tsx
// src/app/(app)/dashboard/loading.tsx
import Loading from "@/components/ui/loading-optimized";

export default function DashboardLoading() {
  return <Loading variant="inline" size="md" />;
}
```

## Optimizaciones
- **React.memo**: Evita re-renders innecesarios
- **useState para cliente**: Previene errores de hidratación
- **useEffect optimizado**: Limpia intervalos correctamente
- **CSS optimizado**: Usa variables CSS del tema
- **Lazy loading**: Componentes se cargan solo cuando se necesitan

## Archivos Relacionados
- `src/components/ui/loading-optimized.tsx` - Componente principal
- `src/components/ui/loading.tsx` - Archivo de exportación
- `src/components/logo-alt.tsx` - Logo usado en el spinner
- `src/app/(app)/loading.tsx` - Carga de la aplicación
- `src/app/(app)/dashboard/loading.tsx` - Carga del dashboard
