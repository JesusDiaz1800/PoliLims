


import type { Ensayo, Registro, RecentActivity, Equipo, ControlEvento, NoConformidad, Importacion, GeneratedReport, CalculoIncertidumbre, Proveedor, CondicionAmbiental, Formacion, Auditoria, Hallazgo } from "@/context/data-context";
import { isPast, parse, subDays, format as formatDate, addYears } from 'date-fns';


// --- DEMO DATA ---
const demoRegistros: Registro[] = [
    { id: 'CTRL-001', fecha: '20-07-2025', hora: '10:30', inspector: 'Elias Ibañez', maquinista: 'ANDRÉS REYES', maquina: 'PE1', producto: 'Tubería HDPE 90mm PN-16 SDR-11', marca: 'POLIFUSIÓN S.A.', diametro: 90.1, espesor_min: 8.2, espesor_max: 8.3, largo: 1000, peso_muestra: 2200, peso_kg_m: 2.2, ovalidad: 0.5, observaciones_visuales: 'Sin observaciones', color_tuberia: 'Negro', color_linea: 'Azul', resultado: 'Conforme', enviado_lab: true },
    { id: 'CTRL-002', fecha: '20-07-2025', hora: '11:15', inspector: 'Cristian Montellano', maquinista: 'ALEXIS SANDOVAL', maquina: 'PE2', producto: 'Tubería HDPE 110mm PN-10 SDR-17', marca: 'POLIFUSIÓN S.A.', diametro: 110.2, espesor_min: 6.5, espesor_max: 6.6, largo: 1000, peso_muestra: 2100, peso_kg_m: 2.1, ovalidad: 0.6, observaciones_visuales: '', color_tuberia: 'Negro', color_linea: 'Azul', resultado: 'Conforme', enviado_lab: true },
    { id: 'CTRL-003', fecha: '19-07-2025', hora: '14:00', inspector: 'Daniel Palma', maquinista: 'CARLOS DOMÍNGUEZ', maquina: 'PP3', producto: 'Tubería PP-R 25mm PN-20', marca: 'SMART PIPES SpA', diametro: 25.3, espesor_min: 4.2, espesor_max: 4.3, largo: 1000, peso_muestra: 300, peso_kg_m: 0.3, ovalidad: 0.2, observaciones_visuales: 'Superficie ligeramente rugosa', color_tuberia: 'Verde', color_linea: 'Roja', resultado: 'No Conforme', enviado_lab: false },
    { id: 'CTRL-004', fecha: '19-07-2025', hora: '09:05', inspector: 'Luis Parada', maquinista: 'CRISTIAN DUQUE', maquina: 'PE3', producto: 'Tubería HDPE 63mm PN-16 SDR-11', marca: 'POLIFUSIÓN S.A.', diametro: 63.1, espesor_min: 5.8, espesor_max: 5.9, largo: 1000, peso_muestra: 1100, peso_kg_m: 1.1, ovalidad: 0.4, observaciones_visuales: '', color_tuberia: 'Negro', color_linea: 'Azul', resultado: 'Conforme', enviado_lab: true },
];

const demoEnsayos: Ensayo[] = [
    // --- July 2025 Data ---
    { id: 'LAB-07-01', id_muestra: 'CTRL-001', tipo: 'Tubería HDPE', analista: 'Jesus Diaz', fecha: '23-07-2025', estado: 'Pendiente de Revisión', producto: 'Tubería HDPE 90mm', lote: 'Lote-250722-PE1', meltIndexCalculado: null, meltIndexVariacion: null, densidadCalculada: null, negroHumoCalculado: null, fecha_ingreso: '22-07-2025', hora: '15:00', inspector: 'Luis Parada', maquina: 'PE1', created_by: 'eibanez', created_at: '2025-07-20T10:30:00Z', modified_by: 'jdiaz', modified_at: '2025-07-23T11:00:00Z', assigned_to: 'Jesus Diaz' },
    { id: 'LAB-07-02', tipo: 'Tubería PP', analista: 'Antonia Figueroa', fecha: '23-07-2025', estado: 'En Análisis', producto: 'Tubería PP-R 50mm', lote: 'Lote-250722-PP2', meltIndexCalculado: 0.28, meltIndexVariacion: 1.5, densidadCalculada: 0.905, negroHumoCalculado: null, fecha_ingreso: '22-07-2025', hora: '13:20', inspector: 'Cristian Montellano', maquina: 'PP2', created_by: 'cmontellano', created_at: '2025-07-20T11:15:00Z', modified_by: 'afigueroa', modified_at: '2025-07-23T09:00:00Z', assigned_to: 'Antonia Figueroa' },
    { id: 'LAB-07-03', tipo: 'Materia Prima', analista: 'Antonia Figueroa', fecha: '23-07-2025', estado: 'Aprobado', producto: 'HE3490LS', lote: '1325115', proveedor: 'BOREALIS CO.', orden_compra: '170708', melt_index_reportado: '0.2308', meltIndexCalculado: 0.241, meltIndexVariacion: 4.42, densidad_liquido: '0.959', densidadCalculada: 0.959, negroHumoCalculado: 2.25, created_by: 'afigueroa', created_at: '2025-07-21T14:00:00Z', modified_by: 'vlutz', modified_at: '2025-07-23T16:00:00Z', assigned_to: 'Antonia Figueroa' },
    { id: 'LAB-07-04', tipo: 'Reprocesado', analista: 'Robinson Córdova', fecha: '22-07-2025', estado: 'En Progreso', producto: 'Reprocesado Lote RP-0720', lote: 'RP-0720', meltIndexCalculado: 0.29, meltIndexVariacion: 3.2, densidadCalculada: 0.955, negroHumoCalculado: 2.3, created_by: 'rcordova', created_at: '2025-07-22T08:00:00Z', modified_by: 'rcordova', modified_at: '2025-07-22T11:00:00Z', assigned_to: 'Robinson Córdova' },
    { id: 'LAB-07-05', id_muestra: 'CTRL-002', tipo: 'Tubería HDPE', analista: 'Bryan Vásquez', fecha: '22-07-2025', estado: 'Aprobado', producto: 'Tubería HDPE 110mm', lote: 'Lote-250719-PE2', meltIndexCalculado: 0.25, meltIndexVariacion: 2.0, densidadCalculada: 0.960, negroHumoCalculado: 2.15, fecha_ingreso: '19-07-2025', hora: '11:15', inspector: 'Cristian Montellano', maquina: 'PE2', created_by: 'cmontellano', created_at: '2025-07-19T11:15:00Z', modified_by: 'vlutz', modified_at: '2025-07-22T17:00:00Z', assigned_to: 'Bryan Vásquez' },
];


let recentActivityData: RecentActivity[] = [
    { id: 'ACT-1', user: 'Jesus Diaz', action: 'actualizó el ensayo LAB-07-01', timestamp: new Date(new Date('2025-07-23T10:30:00Z').getTime() - 5 * 60 * 1000).toISOString() },
    { id: 'ACT-2', user: 'Elias Ibañez', action: 'registró un nuevo control para Tubería HDPE 90mm', timestamp: new Date(new Date('2025-07-23T10:30:00Z').getTime() - 15 * 60 * 1000).toISOString() },
    { id: 'ACT-3', user: 'Victor Lutz', action: 'ha iniciado sesión', timestamp: new Date(new Date('2025-07-23T10:30:00Z').getTime() - 2 * 60 * 60 * 1000).toISOString() },
    { id: 'ACT-4', user: 'Antonia Figueroa', action: 'comenzó a procesar el ensayo LAB-07-02', timestamp: new Date(new Date('2025-07-23T10:30:00Z').getTime() - 5 * 60 * 60 * 1000).toISOString() },
    { id: 'ACT-5', user: 'Cristian Montellano', action: 'registró un control no conforme para Tubería HDPE 200mm', timestamp: new Date(new Date('2025-07-23T10:30:00Z').getTime() - 24 * 60 * 60 * 1000).toISOString() },
    { id: 'ACT-6', user: 'Maximiliano Miranda', action: 'aprobó el informe para el ensayo LAB-07-03', timestamp: new Date(new Date('2025-07-23T10:30:00Z').getTime() - 1.5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'ACT-7', user: 'Robinson Córdova', action: 'registró un nuevo ensayo de reprocesado', timestamp: new Date(new Date('2025-07-23T10:30:00Z').getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() },
];


const demoEquipos: Equipo[] = [
  { id: 'EQ-01', nombre: 'Espectrómetro FTIR', estado: 'Activo', marca: 'PerkinElmer', modelo: 'Spectrum Two', numero_serie: 'FTIR-9876', fecha_puesta_marcha: '10-01-2022', proxima_calibracion: '15-01-2026', ubicacion: 'Mesón Central, Lab. Principal', criticidad: 'Alta', fotoUrl: 'https://placehold.co/400x400/cccccc/313437?text=FTIR', observaciones: 'Equipo sensible a vibraciones.', ensayos_asociados: ['dsc', 'tio'], manual_url: '#', procedimiento_url: '#' },
  { id: 'EQ-02', nombre: 'Prensa de Impacto', estado: 'Activo', marca: 'CEAST', modelo: '9050', numero_serie: 'IMP-5432', fecha_puesta_marcha: '05-03-2021', proxima_calibracion: '20-12-2025', ubicacion: 'Área de Ensayos Mecánicos', criticidad: 'Media', fotoUrl: 'https://placehold.co/400x400/94a3b8/313437?text=Impacto' },
  { id: 'EQ-03', nombre: 'Calorímetro DSC', estado: 'Activo', marca: 'TA Instruments', modelo: 'Q200', numero_serie: 'DSC-1122', fecha_puesta_marcha: '15-06-2020', proxima_calibracion: '30-11-2025', ubicacion: 'Sala de Análisis Térmico', criticidad: 'Alta', fotoUrl: '', ensayos_asociados: ['dsc', 'tio'] },
  { id: 'EQ-04', nombre: 'Plastómetro MFI', estado: 'Activo', marca: 'CEAST', modelo: 'Melt Flow 2000', numero_serie: 'MFI-3344', fecha_puesta_marcha: '20-02-2023', proxima_calibracion: '01-03-2026', ubicacion: 'Mesón Central, Lab. Principal', criticidad: 'Media', fotoUrl: 'https://placehold.co/400x400/6ee7b7/313437?text=MFI', ensayos_asociados: ['melt_index'] },
  { id: 'EQ-05', nombre: 'Balanza Analítica', estado: 'En Mantenimiento', marca: 'Mettler Toledo', modelo: 'MS-TS', numero_serie: 'BAL-5566', fecha_puesta_marcha: '01-09-2019', proxima_calibracion: '10-08-2025', ubicacion: 'Sala de Pesaje', criticidad: 'Alta', fotoUrl: '', ensayos_asociados: ['densidad', 'negro_humo', 'fibra_vidrio', 'humedad'] },
  { id: 'EQ-06', nombre: 'Mufla para Cenizas', estado: 'Activo', marca: 'Thermo Scientific', modelo: 'Thermolyne', numero_serie: 'MUF-7788', fecha_puesta_marcha: '12-11-2018', proxima_calibracion: '28-02-2026', ubicacion: 'Área de Hornos', criticidad: 'Baja', fotoUrl: 'https://placehold.co/400x400/f87171/313437?text=Mufla', ensayos_asociados: ['negro_humo', 'fibra_vidrio', 'cenizas'] },
  { id: 'EQ-07', nombre: 'Máquina de Tracción', estado: 'Inactivo', marca: 'Instron', modelo: '3369', numero_serie: 'TRAC-9900', fecha_puesta_marcha: '30-01-2017', proxima_calibracion: '30-07-2025', ubicacion: 'Área de Ensayos Mecánicos', criticidad: 'Media', fotoUrl: '', ensayos_asociados: ['traccion'] },
];

const demoControles: ControlEvento[] = [
    { id: 'CE-01', equipoId: 'EQ-01', fecha: '15-01-2025', tipo: 'Calibración', responsable: 'Servicio Externo', observaciones: 'Calibración anual completa según procedimiento XYZ.', certificadoUrl: '#' },
    { id: 'CE-02', equipoId: 'EQ-01', fecha: '15-04-2025', tipo: 'Verificación', responsable: 'Jesus Diaz', observaciones: 'Verificación interna con patrón de referencia. Todo OK.' },
    { id: 'CE-03', equipoId: 'EQ-05', fecha: '10-07-2025', tipo: 'Mantenimiento Correctivo', responsable: 'Servicio Técnico Mettler', observaciones: 'Reemplazo de celda de carga. Requiere recalibración.' },
    { id: 'CE-04', equipoId: 'EQ-02', fecha: '20-12-2024', tipo: 'Calibración', responsable: 'Servicio Externo', certificadoUrl: '#' },
    { id: 'CE-05', equipoId: 'EQ-02', fecha: '20-06-2025', tipo: 'Verificación', responsable: 'Maximiliano Miranda' },
    { id: 'CE-06', equipoId: 'EQ-06', fecha: '01-06-2025', tipo: 'Mantenimiento Preventivo', responsable: 'Robinson Córdova', observaciones: 'Limpieza de cámara y revisión de termocupla.' },
];

let demoNoConformidades: NoConformidad[] = Array.from({ length: 15 }, (_, i) => {
    const tipos: NoConformidad['tipo'][] = ['Interna', 'Reclamo de Cliente', 'Auditoría'];
    const estados: NoConformidad['estado'][] = ['Abierta', 'En Investigación', 'Resuelta', 'Cerrada'];
    const severidades: NoConformidad['severidad'][] = ['Baja', 'Media', 'Alta', 'Crítica'];
    const responsables = ['Victor Lutz', 'Jesus Diaz', 'Maximiliano Miranda', 'Antonia Figueroa'];
    
    return {
        id: `NC-${String(i + 1).padStart(3, '0')}`,
        tipo: tipos[i % tipos.length],
        fecha_deteccion: `1${i % 9 + 1}-07-2025`,
        descripcion: `Descripción de la incidencia de prueba número ${i + 1}. Este es un texto de ejemplo para simular un problema detectado.`,
        estado: estados[i % estados.length],
        severidad: severidades[i % severidades.length],
        responsable: responsables[i % responsables.length],
        fecha_vencimiento: `2${i % 9 + 1}-07-2025`,
        accion_correctiva: i % 3 === 0 ? `Se implementó la acción correctiva #${i+1} para solucionar el problema raíz.` : undefined,
    };
});

const demoImportaciones: Importacion[] = [
    { id: 'IMP-001', bl: 'YMLUC236092186', fecha_embarque: '11-12-2021', sca: '65344', fecha_emision_cert: '07-03-2022', di: '2400301661-3', etiqueta_rango_inicio: '7820106', etiqueta_rango_fin: '7820606', operacion: '170389', proveedor: 'RYNO', fecha_solicitada: '03-02-2022', fecha_entrega_calidad: '21-02-2022', cantidad_lote: 15821, fecha_liberacion: '05-04-2022', ingresado_siss: true, estado: 'CADUCADO' },
    { id: 'IMP-002', bl: '(M)MEDUIG157023(H)GOA0051266', fecha_embarque: '02-12-2021', sca: '65792', fecha_emision_cert: '21-03-2022', di: '2400301371-1', etiqueta_rango_inicio: '7820907', etiqueta_rango_fin: '7821907', operacion: '170374', proveedor: 'UNIDELTA', fecha_solicitada: '16-02-2022', fecha_entrega_calidad: '02-03-2022', cantidad_lote: 16593, fecha_liberacion: '25-03-2022', ingresado_siss: true, estado: 'CADUCADO' },
    { id: 'IMP-003', bl: 'NBO210082100', fecha_embarque: '24-12-2021', sca: '65793', fecha_emision_cert: '21-03-2022', di: '2400302578-7', etiqueta_rango_inicio: '7821908', etiqueta_rango_fin: '7822908', operacion: '170412', proveedor: 'AOLONG', fecha_solicitada: '17-02-2022', fecha_entrega_calidad: '22-02-2022', cantidad_lote: 7202, fecha_devolucion: '21-03-2022', fecha_liberacion: '21-03-2022', ingresado_siss: true, estado: 'CADUCADO' },
];

const demoGeneratedReports: GeneratedReport[] = [
    { id: 'REP-001', nombre: '2025-07-23 - HE3490LS - Lote 1325115.pdf', tipo: 'Materia Prima', fecha_creacion: '23-07-2025', path: '/informes/materia-prima/2025-07-23-HE3490LS-1325115.pdf', ensayoIds: ['LAB-07-03'] },
    { id: 'REP-002', nombre: '2025-07-21 - R202P - Lote 500312.pdf', tipo: 'Materia Prima', fecha_creacion: '21-07-2025', path: '/informes/materia-prima/2025-07-21-R202P-500312.pdf', ensayoIds: ['LAB-07-07'] },
];

let demoIncertidumbre: CalculoIncertidumbre[] = Array.from({ length: 22 }, (_, i) => ({
    id: `INC-${String(i + 1).padStart(3, '0')}`,
    nombre: `Cálculo de Incertidumbre para Equipo EQ-${String(i % 7 + 1).padStart(2, '0')}`,
    fecha: new Date(2025, 6, 24 - i).toISOString(),
    usuario: "Victor Lutz",
    resultado: {
        incertidumbreCombinada: 0.00015 + (i * 0.00001),
        incertidumbreExpandida: (0.00015 + (i * 0.00001)) * 2,
        factorCobertura: 2,
    },
    componentes: [
        { descripcion: 'Calibración', valor: 0.0002 + (i * 0.00001), tipo: 'B', distribucion: 'rectangular', unidades: 'g' },
        { descripcion: 'Repetibilidad', valor: 0.0001 - (i * 0.000005), tipo: 'A', distribucion: 'normal', unidades: 'g' },
        { descripcion: 'Resolución de Display', valor: 0.00005, tipo: 'B', distribucion: 'rectangular', unidades: 'g' },
    ]
}));

let demoProveedores: Proveedor[] = [
    { id: 'PROV-001', nombre: 'Sigma-Aldrich', tipo: 'Reactivos', contacto_nombre: 'Juan Pérez', contacto_email: 'juan.perez@sigma.com', estado: 'Activo', certificacionesISO: 'ISO 9001', evaluaciones: [{ fecha: '15-01-2025', calidad: 5, cumplimiento: 5, puntualidad: 4, comentarios: 'Excelente calidad de reactivos.' }] },
    { id: 'PROV-002', nombre: 'Trescal', tipo: 'Calibración', contacto_nombre: 'María González', contacto_email: 'maria.gonzalez@trescal.com', estado: 'Activo', certificacionesISO: 'ISO 17025', evaluaciones: [{ fecha: '20-02-2025', calidad: 5, cumplimiento: 5, puntualidad: 5, comentarios: 'Servicio puntual y profesional.' }] },
    { id: 'PROV-003', nombre: 'BOREALIS CO.', tipo: 'Materia Prima', contacto_nombre: 'Peter Schmidt', contacto_email: 'peter.schmidt@borealis.com', estado: 'Activo', evaluaciones: [{ fecha: '01-03-2025', calidad: 4, cumplimiento: 5, puntualidad: 3, comentarios: 'Retraso menor en la última entrega.' }, { fecha: '05-12-2024', calidad: 5, cumplimiento: 5, puntualidad: 5, comentarios: 'Sin problemas.' }] },
    { id: 'PROV-004', nombre: 'Merck', tipo: 'Reactivos', estado: 'Activo', evaluaciones: [] },
    { id: 'PROV-005', nombre: 'Servicios de Ingeniería Metrológica', tipo: 'Calibración', estado: 'En evaluación' },
    ...Array.from({ length: 25 }, (_, i) => ({
      id: `PROV-${String(i + 6).padStart(3, '0')}`,
      nombre: `Proveedor de Prueba ${i + 1}`,
      tipo: i % 2 === 0 ? 'Materia Prima' : 'Servicios Generales',
      estado: i % 5 === 0 ? 'Inactivo' : 'Activo',
      evaluaciones: i % 3 === 0 ? [{ fecha: `10-04-2025`, calidad: 4, cumplimiento: 4, puntualidad: 5, comentarios: 'Evaluación de ejemplo.'}] : []
    }))
];

const zonas = ['Laboratorio Principal', 'Sala de Muestras', 'Área de Ensayos Mecánicos'];
let demoCondicionesAmbientales: CondicionAmbiental[] = [];
for (let i = 90; i >= 0; i--) {
    zonas.forEach(zona => {
        const timestamp = subDays(new Date(), i).toISOString();
        demoCondicionesAmbientales.push({
            id: `ENV-${zona.charAt(0)}-${timestamp}`,
            zona,
            timestamp,
            temperatura: 22.5 + (Math.random() - 0.5) * 5, // Temp between 20-25
            humedad: 45 + (Math.random() - 0.5) * 20, // Humidity between 35-55
            presion: 1012 + (Math.random() - 0.5) * 10, // Pressure around 1012 hPa
            usuario: 'Sistema'
        });
    });
}

let demoFormacion: Formacion[] = [
    { id: 'FORM-001', empleadoId: 'jdiaz', empleadoNombre: 'Jesus Diaz', tipo: 'Certificación', nombre_actividad: 'Auditor Interno ISO/IEC 17025:2017', fecha: '2023-11-15', evaluador: 'AENOR', resultado: 'Aprobado', fecha_vencimiento: '2025-11-15' },
    { id: 'FORM-002', empleadoId: 'afigueroa', empleadoNombre: 'Antonia Figueroa', tipo: 'Curso', nombre_actividad: 'Cromatografía de Gases Avanzada', fecha: '2024-03-20', evaluador: 'Waters Corp.', resultado: 'Completado' },
    { id: 'FORM-003', empleadoId: 'mmiranda', empleadoNombre: 'Maximiliano Miranda', tipo: 'Evaluación de Competencia', nombre_actividad: 'Análisis de Melt Index (ASTM D1238)', fecha: '2024-06-10', evaluador: 'Victor Lutz', resultado: 'Aprobado' },
    { id: 'FORM-004', empleadoId: 'rcordova', empleadoNombre: 'Robinson Córdova', tipo: 'Inducción', nombre_actividad: 'Inducción General de Laboratorio', fecha: '2024-01-15', evaluador: 'Jesus Diaz', resultado: 'Completado', observaciones: 'Completó todos los módulos satisfactoriamente.' },
    { id: 'FORM-005', empleadoId: 'bvasquez', empleadoNombre: 'Bryan Vásquez', tipo: 'Curso', nombre_actividad: 'Buenas Prácticas de Laboratorio (BPL)', fecha: '2023-09-05', evaluador: 'OTEC Qualitas', resultado: 'Aprobado' },
    { id: 'FORM-006', empleadoId: 'jdiaz', empleadoNombre: 'Jesus Diaz', tipo: 'Evaluación de Competencia', nombre_actividad: 'Manejo de Espectrómetro FTIR', fecha: '2024-07-01', evaluador: 'Victor Lutz', resultado: 'Pendiente' },
];

let demoAuditorias: Auditoria[] = [
    { id: 'AUD-INT-001', tipo: 'Interna', fecha_inicio: '2025-08-01', fecha_fin: '2025-08-02', auditor_lider: 'Victor Lutz', auditores: ['Jesus Diaz'], alcance: 'Procesos de ensayo de materias primas (Cláusulas 7.2 a 7.7 de ISO 17025)', estado: 'Planificada' },
    { id: 'AUD-EXT-001', tipo: 'Externa - Certificación', fecha_inicio: '2025-09-15', fecha_fin: '2025-09-17', auditor_lider: 'Juan Garcia (AENOR)', auditores: [], alcance: 'Auditoría de seguimiento para certificación ISO/IEC 17025', estado: 'Planificada' },
    { id: 'AUD-PROV-001', tipo: 'Externa - Proveedor', fecha_inicio: '2025-07-20', fecha_fin: '2025-07-20', auditor_lider: 'Maximiliano Miranda', auditores: [], alcance: 'Auditoría al sistema de calidad del proveedor de reactivos Sigma-Aldrich', estado: 'Finalizada' },
    { id: 'AUD-INT-002', tipo: 'Interna', fecha_inicio: '2025-05-10', fecha_fin: '2025-05-11', auditor_lider: 'Victor Lutz', auditores: ['Antonia Figueroa'], alcance: 'Gestión de equipos y calibraciones (Cláusula 6.4 de ISO 17025)', estado: 'Finalizada' },
    { id: 'AUD-INT-003', tipo: 'Interna', fecha_inicio: '2025-07-25', fecha_fin: '2025-07-26', auditor_lider: 'Jesus Diaz', auditores: ['Maximiliano Miranda'], alcance: 'Procesos de gestión de no conformidades y acciones correctivas (Cláusula 8.7 de ISO 17025)', estado: 'En Curso' }
];

export interface AlertaConfig {
    id: string;
    nombre: string;
    descripcion: string;
    roles: string[];
    email: { activa: boolean; plantilla: string; };
    sms: { activa: boolean; plantilla: string; };
}

export interface Notificacion {
    id: string;
    fecha: string; // ISO 8601 string
    canal: 'Email' | 'SMS';
    destinatario: string;
    asunto: string;
    estado: 'Enviado' | 'Fallido' | 'Pendiente';
}

export interface PlantillaNotificacion {
    id: string;
    nombre: string;
    descripcion: string;
    asunto: string;
    cuerpo: string; // Contenido con placeholders como {{variable}}
}

export const mockAlertConfigs: AlertaConfig[] = [
    { id: 'cal_vencimiento', nombre: 'Vencimiento de Calibración', descripcion: 'Notifica 30, 15 y 3 días antes del vencimiento de la calibración de un equipo.', roles: ['Jefe de Calidad', 'Ing. Analista de Calidad'], email: { activa: true, plantilla: 'cal_vencimiento_email' }, sms: { activa: false, plantilla: 'cal_vencimiento_sms' } },
    { id: 'nc_nueva', nombre: 'Nueva No Conformidad Registrada', descripcion: 'Notifica al responsable asignado cuando se crea una nueva no conformidad.', roles: ['Responsable Asignado'], email: { activa: true, plantilla: 'nc_nueva_email' }, sms: { activa: false, plantilla: 'nc_nueva_sms' } },
    { id: 'ac_vencimiento', nombre: 'Vencimiento de Acción Correctiva', descripcion: 'Alerta al responsable 7 días antes de la fecha límite para cerrar una acción correctiva.', roles: ['Responsable Asignado', 'Jefe de Calidad'], email: { activa: true, plantilla: 'ac_vencimiento_email' }, sms: { activa: true, plantilla: 'ac_vencimiento_sms' } },
];

export const mockNotificationHistory: Notificacion[] = [
    { id: 'NOTIF-001', fecha: '2025-07-23T10:00:00Z', canal: 'Email', destinatario: 'jefe.calidad@polifusion.cl', asunto: 'Alerta: Calibración próxima a vencer para EQ-05', estado: 'Enviado' },
    { id: 'NOTIF-002', fecha: '2025-07-22T14:30:00Z', canal: 'Email', destinatario: 'jdiaz@polifusion.cl', asunto: 'Asignación de No Conformidad: NC-015', estado: 'Enviado' },
    { id: 'NOTIF-003', fecha: '2025-07-22T09:00:00Z', canal: 'SMS', destinatario: '+56912345678', asunto: 'Vencimiento Acción Correctiva NC-012', estado: 'Enviado' },
    { id: 'NOTIF-004', fecha: '2025-07-21T18:00:00Z', canal: 'Email', destinatario: 'admin@polifusion.cl', asunto: 'Fallo en el envío de notificación a proveedor', estado: 'Fallido' },
];

export const mockAlertTemplates: PlantillaNotificacion[] = [
    { id: 'cal_vencimiento_email', nombre: 'Email de Vencimiento de Calibración', descripcion: 'Plantilla para notificar sobre calibraciones próximas a vencer.', asunto: 'Alerta de Calibración: {{equipo.nombre}} vence en {{dias_restantes}} días', cuerpo: 'Estimado(a),\n\nLe informamos que la calibración del equipo {{equipo.nombre}} (ID: {{equipo.id}}) está programada para vencer el {{equipo.proxima_calibracion}}.\n\nPor favor, tome las acciones necesarias para coordinar su calibración a tiempo.\n\nAtentamente,\nSistema PoliLIMS.'},
    { id: 'nc_nueva_email', nombre: 'Email de Nueva No Conformidad', descripcion: 'Notifica al usuario asignado sobre una nueva NC.', asunto: 'Nueva No Conformidad Asignada: {{nc.id}}', cuerpo: 'Hola {{usuario.nombre}},\n\nSe le ha asignado como responsable de la No Conformidad N° {{nc.id}} ({{nc.descripcion}}), detectada el {{nc.fecha_deteccion}}.\n\nPor favor, ingrese al sistema para revisar los detalles y establecer un plan de acción.\n\nGracias,\nSistema PoliLIMS.'},
    { id: 'ac_vencimiento_email', nombre: 'Email de Vencimiento de Acción Correctiva', descripcion: 'Alerta sobre el vencimiento próximo de una acción correctiva.', asunto: 'Recordatorio: Acción Correctiva para NC {{nc.id}} vence pronto', cuerpo: 'Estimado(a) {{usuario.nombre}},\n\nEste es un recordatorio de que la fecha límite para completar la acción correctiva asociada a la No Conformidad N° {{nc.id}} es el {{nc.fecha_vencimiento}}.\n\nPor favor, asegúrese de completar y documentar la acción antes de la fecha indicada.\n\nSaludos,\nSistema PoliLIMS.'},
];


let generatedReports = [...demoGeneratedReports];
let calculosIncertidumbre = [...demoIncertidumbre];

export async function addGeneratedReport(report: Omit<GeneratedReport, 'id'>): Promise<GeneratedReport> {
    const newReport = { ...report, id: `REP-${String(generatedReports.length + 1).padStart(3, '0')}` };
    generatedReports.unshift(newReport);
    return newReport;
}

export async function deleteGeneratedReport(id: string): Promise<void> {
    generatedReports = generatedReports.filter(r => r.id !== id);
}

export async function addCalculoIncertidumbre(calculo: Omit<CalculoIncertidumbre, 'id'>): Promise<CalculoIncertidumbre> {
    const newCalculo = { ...calculo, id: `INC-${String(calculosIncertidumbre.length + 1).padStart(3, '0')}` };
    calculosIncertidumbre.unshift(newCalculo);
    return newCalculo;
}

export async function addCondicionAmbiental(registro: Omit<CondicionAmbiental, 'id' | 'timestamp'>): Promise<CondicionAmbiental> {
    const newRegistro = { ...registro, id: `ENV-${Math.random()}`, timestamp: new Date().toISOString() };
    demoCondicionesAmbientales.push(newRegistro);
    return newRegistro;
}

// Dummy add/update/delete functions to simulate API calls
export async function addEnsayo(ensayo: Omit<Ensayo, 'id'>) {
    const newEnsayo = { ...ensayo, id: `LAB-NEW-${Math.random().toString(16).slice(2)}` };
    // demoEnsayos.unshift(newEnsayo);
    return newEnsayo;
}
export async function updateEnsayo(id: string, updatedData: Partial<Ensayo>) { return; }
export async function deleteEnsayo(id: string) { return; }
export async function addRegistro(registro: Omit<Registro, 'id'>) { 
    const newRegistro = { ...registro, id: `CTRL-NEW-${Math.random().toString(16).slice(2)}` };
    return newRegistro;
}
export async function deleteRegistro(id: string) { return; }
export async function addEquipo(equipo: Omit<Equipo, 'id'>) {
    const newEquipo = { ...equipo, id: `EQ-NEW-${Math.random().toString(16).slice(2)}` };
    return newEquipo;
}
export async function updateEquipo(id: string, updatedData: Partial<Equipo>) { return; }
export async function deleteEquipo(id: string) { return; }
export async function addControlEvento(evento: Omit<ControlEvento, 'id'>) { 
    const newEvento = { ...evento, id: `CE-NEW-${Math.random().toString(16).slice(2)}` };
    return newEvento;
}
export async function addIncidencia(incidencia: Omit<NoConformidad, 'id'>) { 
    const newIncidencia = { ...incidencia, id: `NC-NEW-${Math.random().toString(16).slice(2)}` };
    return newIncidencia;
}
export async function updateIncidencia(id: string, updatedData: Partial<NoConformidad>) { return; }
export async function deleteIncidencia(id: string) {
    demoNoConformidades = demoNoConformidades.filter(nc => nc.id !== id);
}
export async function addImportacion(importacion: Omit<Importacion, 'id'>) {
    const newImportacion = { ...importacion, id: `IMP-NEW-${Math.random().toString(16).slice(2)}` };
    return newImportacion;
 }
export async function updateImportacion(id: string, updatedData: Partial<Importacion>) { return; }
export async function deleteImportacion(id: string) { return; }

export async function addProveedor(proveedor: Omit<Proveedor, 'id'>) {
    const newProveedor = { ...proveedor, id: `PROV-NEW-${Math.random().toString(16).slice(2)}` };
    demoProveedores.unshift(newProveedor);
    return newProveedor;
}
export async function updateProveedor(id: string, updatedData: Partial<Proveedor>) {
    demoProveedores = demoProveedores.map(p => p.id === id ? { ...p, ...updatedData } : p);
}
export async function deleteProveedor(id: string) {
    demoProveedores = demoProveedores.filter(p => p.id !== id);
}

export async function addFormacion(record: Omit<Formacion, 'id'>) {
    const newRecord = { ...record, id: `FORM-NEW-${Math.random().toString(16).slice(2)}` };
    demoFormacion.unshift(newRecord);
    return newRecord;
}
export async function updateFormacion(id: string, updatedData: Partial<Formacion>) {
    demoFormacion = demoFormacion.map(f => f.id === id ? { ...f, ...updatedData } : f);
}
export async function deleteFormacion(id: string) {
    demoFormacion = demoFormacion.filter(f => f.id !== id);
}

export async function addAuditoria(auditoria: Omit<Auditoria, 'id'>) {
    const newAuditoria = { ...auditoria, id: `AUD-NEW-${Math.random().toString(16).slice(2)}` };
    demoAuditorias.unshift(newAuditoria);
    return newAuditoria;
}
export async function updateAuditoria(id: string, updatedData: Partial<Auditoria>) {
    demoAuditorias = demoAuditorias.map(a => a.id === id ? { ...a, ...updatedData } : a);
}
export async function deleteAuditoria(id: string) {
    demoAuditorias = demoAuditorias.filter(a => a.id !== id);
}

export async function addRecentActivity(activity: Omit<RecentActivity, 'id' | 'timestamp'>) { 
     const newActivity = { ...activity, id: `ACT-NEW-${Math.random().toString(16).slice(2)}`, timestamp: new Date().toISOString() };
    recentActivityData.unshift(newActivity);
    return newActivity;
}

/**
 * @function getInitialData
 * @description Simulates fetching the entire initial state for the application.
 * In a real-world scenario, this would be broken down into multiple, more specific API calls.
 * For the prototype, it aggregates all demo data into a single object.
 * It also applies some dynamic logic, like updating equipment status based on the current date.
 * @returns {Promise<object>} A promise that resolves to an object containing all initial data arrays.
 */
export async function getInitialData() {
    const today = new Date();
    // Dynamically update equipment status based on calibration date for realistic simulation.
    const updatedEquipos = demoEquipos.map(equipo => {
        if (equipo.estado === 'Activo' && isPast(parse(equipo.proxima_calibracion, 'dd-MM-yyyy', new Date()))) {
            return { ...equipo, estado: 'Requiere Calibración' as const };
        }
        return equipo;
    });

    return {
        ensayos: demoEnsayos,
        registros: demoRegistros,
        recentActivity: recentActivityData,
        equipos: updatedEquipos,
        controles: demoControles,
        noConformidades: demoNoConformidades,
        importaciones: demoImportaciones,
        generatedReports: generatedReports,
        calculosIncertidumbre: calculosIncertidumbre,
        proveedores: demoProveedores,
        condicionesAmbientales: demoCondicionesAmbientales,
        formacion: demoFormacion,
        auditorias: demoAuditorias,
    };
}
