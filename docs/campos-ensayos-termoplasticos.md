# 🔬 CAMPOS DE ENSAYOS DE TERMOPLÁSTICOS - POLILIMS

## ✅ **CONFIRMACIÓN: TODOS LOS CAMPOS MANTENIDOS**

### **Campos Básicos del Ensayo**
- **Identificación**: `id`, `codigo`, `tipo`
- **Estado**: `estado` (Pendiente, En Proceso, En Análisis, Pendiente de Revisión, Aprobado, Rechazado, Cancelado)
- **Fechas**: `fecha`, `fecha_inicio`, `fecha_fin`
- **Personal**: `analista`, `supervisor`, `inspector`
- **Información General**: `producto`, `lote`, `cliente`, `prioridad`
- **Tiempos**: `tiempoEstimado`, `tiempoReal`
- **Resultados**: `resultado`, `observaciones`, `certificado`

### **Propiedades Físico-Químicas**
- **Melt Index (Índice de Fluidez)**:
  - `meltIndexCalculado` (number) - Valor calculado en g/10min
  - `meltIndexVariacion` (number) - Variación porcentual
  - `melt_index_reportado` (string) - Valor reportado por proveedor
  - `meltIndexMediciones` (Array) - Array de 6 mediciones individuales para cálculo

- **Densidad**:
  - `densidadCalculada` (number) - Densidad calculada en g/cm³
  - `densidad_liquido` (string) - Densidad del líquido de referencia
  - `equipo_densidad` (string) - Equipo utilizado para medición de densidad

- **Negro de Humo**:
  - `negroHumoCalculado` (number | null) - Porcentaje calculado
  - `dispersion_nh` (string) - Dispersión (A1, A2, B1, B2, etc.)

- **Punto de Fusión**:
  - `dsc_punto_fusion` (number) - Punto de fusión por DSC en °C

- **Fibra de Vidrio**:
  - `fvTotalPorcentaje` (number) - Porcentaje total de fibra de vidrio
  - `fvIntermediaPorcentaje` (number) - Porcentaje de fibra de vidrio intermedia

### **Propiedades Mecánicas**
- **Resistencia a la Tracción**: `resistencia_traccion` (number) - MPa
- **Elongación a la Rotura**: `elongacion_rotura` (number) - %
- **Tiempo de Impacto**: `tio_tiempo` (number) - segundos

### **Condiciones Ambientales**
- **Temperatura**: `temperatura` (number) - °C
- **Humedad**: `humedad` (number) - %
- **Presión**: `presion` (number) - hPa

### **Información de Muestra**
- **Identificación**: `id_muestra` (string)
- **Fechas**: `fecha_ingreso` (string), `hora` (string)
- **Personal**: `inspector` (string)
- **Equipos**: `maquina` (string), `equipo_densidad` (string), `equipo_melt` (string)

### **Datos de Proveedor**
- **Proveedor**: `proveedor` (string)
- **Orden de Compra**: `orden_compra` (string)

## 🏗️ **INTEGRACIÓN COMPLETA EN NUEVA ARQUITECTURA**

### **Esquema de Base de Datos Completo**
```sql
CREATE TABLE ensayos.ensayos_termoplasticos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    estado VARCHAR(50) DEFAULT 'Pendiente',
    
    -- Información básica
    producto VARCHAR(200),
    lote VARCHAR(100),
    cliente VARCHAR(200),
    prioridad VARCHAR(20),
    fecha DATE,
    fecha_inicio TIMESTAMP WITH TIME ZONE,
    fecha_fin TIMESTAMP WITH TIME ZONE,
    
    -- Personal
    analista VARCHAR(100),
    supervisor VARCHAR(100),
    inspector VARCHAR(100),
    
    -- Tiempos
    tiempo_estimado DECIMAL(8,2),
    tiempo_real DECIMAL(8,2),
    
    -- Resultados
    resultado TEXT,
    observaciones TEXT,
    certificado VARCHAR(200),
    
    -- Propiedades físico-químicas
    melt_index_calculado DECIMAL(10,6),
    melt_index_variacion DECIMAL(5,2),
    melt_index_reportado VARCHAR(20),
    melt_index_mediciones JSONB, -- Array de 6 mediciones
    
    densidad_calculada DECIMAL(10,6),
    densidad_liquido VARCHAR(20),
    equipo_densidad VARCHAR(100),
    
    negro_humo_calculado DECIMAL(5,2),
    dispersion_nh VARCHAR(10),
    
    dsc_punto_fusion DECIMAL(6,2),
    
    fv_total_porcentaje DECIMAL(5,2),
    fv_intermedia_porcentaje DECIMAL(5,2),
    
    -- Propiedades mecánicas
    resistencia_traccion DECIMAL(8,2),
    elongacion_rotura DECIMAL(8,2),
    tio_tiempo DECIMAL(8,2),
    
    -- Condiciones ambientales
    temperatura DECIMAL(5,2),
    humedad DECIMAL(5,2),
    presion DECIMAL(8,2),
    
    -- Información de muestra
    id_muestra VARCHAR(50),
    fecha_ingreso DATE,
    hora TIME,
    maquina VARCHAR(50),
    equipo_melt VARCHAR(100),
    
    -- Datos de proveedor
    proveedor VARCHAR(100),
    orden_compra VARCHAR(50),
    
    -- Auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES personal.usuarios(id),
    updated_by UUID REFERENCES personal.usuarios(id)
);
```

### **Interface TypeScript Completa**
```typescript
export interface EnsayoTermoplastico {
  id: string;
  codigo: string;
  tipo: string;
  estado: 'Pendiente' | 'En Proceso' | 'En Análisis' | 'Pendiente de Revisión' | 'Aprobado' | 'Rechazado' | 'Cancelado';
  
  // Información básica
  producto: string;
  lote: string;
  cliente: string;
  prioridad: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  fecha: string;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  
  // Personal
  analista: string;
  supervisor?: string;
  inspector?: string;
  
  // Tiempos
  tiempoEstimado: number;
  tiempoReal: number;
  
  // Resultados
  resultado: string;
  observaciones: string;
  certificado: string;
  
  // Propiedades físico-químicas
  meltIndexCalculado?: number;
  meltIndexVariacion?: number;
  melt_index_reportado?: string;
  meltIndexMediciones?: Array<{value: string | number}>; // Array de 6 mediciones
  
  densidadCalculada?: number;
  densidad_liquido?: string;
  equipo_densidad?: string;
  
  negroHumoCalculado?: number | null;
  dispersion_nh?: string;
  
  dsc_punto_fusion?: number;
  
  fvTotalPorcentaje?: number;
  fvIntermediaPorcentaje?: number;
  
  // Propiedades mecánicas
  resistencia_traccion?: number;
  elongacion_rotura?: number;
  tio_tiempo?: number;
  
  // Condiciones ambientales
  temperatura: number;
  humedad: number;
  presion: number;
  
  // Información de muestra
  id_muestra?: string;
  fecha_ingreso?: string;
  hora?: string;
  maquina?: string;
  equipo_melt?: string;
  
  // Datos de proveedor
  proveedor?: string;
  orden_compra?: string;
  
  // Auditoría
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by?: string;
}
```

## ✅ **CONFIRMACIÓN FINAL COMPLETA**

### **Todos los Campos Confirmados**
**Se mantienen TODOS los campos específicos para ensayos de termoplásticos, incluyendo:**

- ✅ **Campos básicos**: `id`, `codigo`, `tipo`, `estado`, `fecha`, `analista`, `resultado`, etc.
- ✅ **Melt Index completo**: `meltIndexCalculado`, `meltIndexVariacion`, `melt_index_reportado`, `meltIndexMediciones`
- ✅ **Densidad completa**: `densidadCalculada`, `densidad_liquido`, `equipo_densidad`
- ✅ **Negro de Humo**: `negroHumoCalculado`, `dispersion_nh`
- ✅ **Punto de Fusión**: `dsc_punto_fusion`
- ✅ **Fibra de Vidrio**: `fvTotalPorcentaje`, `fvIntermediaPorcentaje`
- ✅ **Propiedades Mecánicas**: `resistencia_traccion`, `elongacion_rotura`, `tio_tiempo`
- ✅ **Condiciones Ambientales**: `temperatura`, `humedad`, `presion`
- ✅ **Información de Muestra**: `id_muestra`, `fecha_ingreso`, `hora`, `inspector`, `maquina`, `equipo_melt`
- ✅ **Datos de Proveedor**: `proveedor`, `orden_compra`
- ✅ **Campos de Control**: `tiempoEstimado`, `tiempoReal`, `observaciones`, `certificado`

### **Funcionalidades Mantenidas**
- ✅ **Cálculos automáticos** de Melt Index (con 6 mediciones)
- ✅ **Cálculos automáticos** de Densidad
- ✅ **Validaciones** de rangos y especificaciones
- ✅ **Selección de equipos** para cada medición
- ✅ **Reportes** específicos para termoplásticos
- ✅ **Trazabilidad** completa de muestras
- ✅ **Control de calidad** integrado

**TODOS los campos de ensayos de termoplásticos se mantienen 100% intactos en la nueva arquitectura ISO/IEC 17025.**
