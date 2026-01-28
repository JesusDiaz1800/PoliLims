# Estilos Modernos - PoliLims

## Tema Oscuro Refactorizado

### Fondo Azul Oscuro con Degradados
- Color base: `hsl(220 25% 8%)` - Azul oscuro elegante
- Degradado principal: Linear gradient de 135° con variaciones sutiles
- Efectos radiales: Degradados circulares con colores azul, púrpura y cian
- Fondo fijo: `background-attachment: fixed` para efecto de profundidad

## Botones Modernos con Degradados

### Tipos Disponibles:
1. **default**: Degradado azul institucional con efectos de brillo
2. **secondary**: Degradado gris azulado con borde dinámico
3. **outline**: Borde azul que se llena en hover
4. **ghost**: Transparente con fondo sutil en hover
5. **destructive**: Degradado rojo con elevación pronunciada

### Características:
- Efectos de hover con elevación y sombras
- Animaciones suaves de 0.3s
- Efecto de brillo que se desliza
- Sombras profesionales con colores específicos

## Uso:
```tsx
import { Button } from "@/components/ui/button";

<Button variant="default">Botón Principal</Button>
<Button variant="secondary">Botón Secundario</Button>
<Button variant="outline">Botón Outline</Button>
```

## Mejoras en Componentes:
- Tarjetas con degradados sutiles
- Inputs con efectos de focus mejorados
- Popovers con sombras pronunciadas
