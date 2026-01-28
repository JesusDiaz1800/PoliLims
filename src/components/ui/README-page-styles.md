# Estilos de Páginas - PoliLims

## Cambios Realizados

### 1. Tema Oscuro Mejorado
- **Fondo azul oscuro profesional**: Reemplazado el negro puro por `hsl(220 25% 8%)`
- **Degradados sutiles**: Múltiples capas de degradados radiales con colores azul, púrpura y cian
- **Efecto de profundidad**: `background-attachment: fixed` para un efecto visual mejorado

### 2. Márgenes en Páginas
Se agregaron clases CSS para márgenes consistentes en todas las páginas (excepto dashboard):

#### Clases Disponibles:
- **`.page-container`**: Márgenes estándar (max-width: 1400px)
- **`.page-container-wide`**: Márgenes amplios (max-width: 1600px)
- **`.page-container-narrow`**: Márgenes estrechos (max-width: 1200px)

#### Responsive:
- **Desktop**: 1.5rem de padding
- **Tablet**: 1rem de padding
- **Mobile**: 0.75rem de padding

### 3. Páginas Actualizadas

#### Ensayos:
- ✅ `src/app/(app)/ensayos/tuberias/hdpe/page.tsx`
- ✅ `src/app/(app)/ensayos/tuberias/pp/page.tsx`
- ✅ `src/components/ensayos/seguimiento-page-content.tsx`

#### Administración:
- ✅ `src/app/(app)/administracion/usuarios/page.tsx`

### 4. Colores Institucionales
- **Azul institucional**: `#126FCC` aplicado a:
  - Etiquetas de estado "Aprobado"
  - Etiquetas de estado "Pendiente de Revisión"
  - Badges de estado "Activo"
  - Círculo de notificaciones

### 5. Excepción Dashboard
El dashboard mantiene su diseño original sin márgenes:
```css
.dashboard-page .page-container,
.dashboard-page .page-container-wide,
.dashboard-page .page-container-narrow {
  padding: 0;
  max-width: none;
  margin: 0;
}
```

## Uso

### Aplicar Márgenes a una Nueva Página:
```tsx
export default function MiPagina() {
  return (
    <div className="page-container">
      {/* Contenido de la página */}
    </div>
  );
}
```

### Aplicar Colores Institucionales:
```tsx
<Badge className="text-[#126FCC] border-[#126FCC]/30 bg-[#126FCC]/20">
  Estado
</Badge>
```

## Resultado Visual
- **Fondo profesional**: Azul oscuro con degradados sutiles
- **Márgenes consistentes**: Espaciado uniforme en todas las páginas
- **Colores unificados**: Identidad visual coherente con el azul institucional
- **Experiencia mejorada**: Diseño más limpio y profesional

