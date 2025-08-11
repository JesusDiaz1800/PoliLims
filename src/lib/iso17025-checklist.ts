
export interface ChecklistItem {
    clausula: string;
    requisito: string;
    evidencia: string;
    estado?: string;
    comentarios?: string;
    isHeader?: boolean;
}

export const iso17025Checklist: ChecklistItem[] = [
    {
        clausula: "I. REQUISITOS GENERALES",
        requisito: "",
        evidencia: "",
        isHeader: true
    },
    {
        clausula: "4.1 Imparcialidad",
        requisito: "Asegurar que el laboratorio y el personal están libres de presiones indebidas que puedan afectar la imparcialidad. Identificar y minimizar riesgos.",
        evidencia: "LEP-PRO-001 (Procedimiento de revisión de la Imparcialidad y la Confidencialidad), LEP-DGC-002 (Matriz de evaluación de Riesgos para la Imparcialidad), LEP-DOC-001 (Declaración de Imparcialidad y Confidencialidad del Personal)"
    },
    {
        clausula: "4.2 Confidencialidad",
        requisito: "Tener políticas y procedimientos para proteger la información confidencial y los derechos de propiedad de los clientes.",
        evidencia: "LEP-PRO-001 (Procedimiento de Gestión de la Imparcialidad y la Confidencialidad), LEP-DOC-001 (Declaración de Imparcialidad y Confidencialidad del Personal)"
    },
    {
        clausula: "II. REQUISITOS RELATIVOS A LA ESTRUCTURA",
        requisito: "",
        evidencia: "",
        isHeader: true
    },
    {
        clausula: "5.1 Estructura legal",
        requisito: "El laboratorio o la organización debe ser una entidad con responsabilidad legal.",
        evidencia: "Documentos que sustentan su constitución legal"
    },
    {
        clausula: "5.2 Organización",
        requisito: "Definir responsabilidades, autoridad e interrelación del personal clave que afecta la calidad; prever supervisión adecuada; nombrar dirección técnica y responsable de calidad, y suplentes. Asegurar que el personal es consciente de la pertinencia e importancia de sus actividades y su contribución a los objetivos del SGC.",
        evidencia: "LEP-DGC-003 (Organigrama actualizado del Laboratorio), LEP-INS-010 (Instructivo de Actividades y Responsabilidades), LEP-PRO-002 (Procedimiento de Gestión del Personal)"
    },
    {
        clausula: "III. REQUISITOS RELATIVOS A LOS RECURSOS",
        requisito: "",
        evidencia: "",
        isHeader: true
    },
    {
        clausula: "6.2 Personal",
        requisito: "Asegurar la competencia de todo el personal (educación, formación, experiencia, habilidades) que opera equipos, realiza ensayos/calibraciones, evalúa resultados y firma informes. Monitorear el desempeño y las competencias, y autorizar al personal para tareas específicas.",
        evidencia: "LEP-PRO-002 (Procedimiento de Gestión del Personal), LEP-DOC-002 (Perfiles de Puestos de Trabajo), LEP-PRO-003 (Procedimiento de Capacitación del Personal), LEP-DOC-004 (Registro de asistencia y evaluación de capacitación), LEP-DOC-005 (Registros de evaluación de desempeño técnico práctico del Personal)"
    },
    {
        clausula: "6.3 Instalaciones y condiciones ambientales",
        requisito: "Garantizar instalaciones y condiciones ambientales adecuadas que no afecten la validez de los resultados, monitoreando, controlando y registrando estas condiciones. Mantener separación entre áreas incompatibles y controlar el acceso.",
        evidencia: "LEP-PRO-005 (Procedimiento de Control de Instalaciones y Condiciones Ambientales), LEP-DGC-006 (Registros de Condiciones Ambientales)"
    },
    {
        clausula: "6.4 Equipamiento",
        requisito: "Disponer y asegurar el correcto funcionamiento de todo el equipamiento y software necesario, incluyendo su calibración, mantenimiento, identificación y protección contra ajustes no autorizados. Mantener registros completos de cada equipo.",
        evidencia: "LEP-PRO-005 (Procedimiento para la Gestión de Equipos e Instrumentos), LEP-INS-00X (Instructivo de uso de equipos), LEP-PRG-001 (Programa de Verificaciones, Calibraciones y Mantenimientos de equipos), LEP-INS-00X-1 (Hoja de Vida Equipo), LEP-INS-00X-2 (Certificado de Calibración Equipo), LEP-INS-00X-3 (Registro de Mantenimiento Equipo)"
    },
    {
        clausula: "6.5 Trazabilidad metrológica",
        requisito: "Establecer un programa y procedimiento de calibración para equipos y patrones, asegurando la trazabilidad metrológica al Sistema Internacional de Unidades (SI) a través de laboratorios competentes y acreditados.",
        evidencia: "LEP-PRG-001 (Programa de Verificaciones, Calibraciones y Mantenimientos de Equipos), Certificados de calibración, LEP-PRO-007 (Procedimiento para Trazabilidad Metrológica)"
    },
    {
        clausula: "6.6 Productos y servicios suministrados externamente",
        requisito: "Tener una política y procedimiento para la selección, compra, evaluación y reevaluación de proveedores de servicios y suministros críticos que afecten la calidad de los ensayos/calibraciones.",
        evidencia: "LEP-PRO-008 (Procedimiento para la gestión de Productos y Servicios Proporcionados externamente), LEP-DOC-00X (Registro de Servicios Externos)"
    },
    {
        clausula: "IV. REQUISITOS DEL PROCESO",
        requisito: "",
        evidencia: "",
        isHeader: true
    },
    {
        clausula: "7.1 Revisión de solicitudes, ofertas y contratos",
        requisito: "Establecer procedimientos para revisar pedidos, ofertas y contratos, asegurando que los requisitos sean claros, se tenga la capacidad y recursos, y se seleccione el método apropiado.",
        evidencia: "LEP-PRO-007 (Procedimiento de Revisión de Solicitudes, Ofertas y Contratos)"
    },
    {
        clausula: "7.2 Selección, verificación y validación de métodos",
        requisito: "Aplicar métodos y procedimientos apropiados, verificando su correcta aplicación antes de usar. Utilizar métodos normalizados o modificados.",
        evidencia: "LEP-PRO-009 (Procedimiento de Métodos de Ensayo: Selección, Verificación y Validación de Métodos), LEP-ins-00x (Procedimiento Interno Técnico de Ensayo), Registros de verificación/validación"
    },
    {
        clausula: "7.3 Muestreo",
        requisito: "(Si aplica) Contar con un plan y procedimientos para el muestreo basado en métodos estadísticos apropiados, y registrar los datos y operaciones relacionados.",
        evidencia: "Procedimiento de muestreo"
    },
    {
        clausula: "7.4 Manipulación de ítems de ensayo y calibración",
        requisito: "Establecer procedimientos para el transporte, recepción, manipulación, protección, almacenamiento, conservación y disposición final de los ítems de ensayo, incluyendo su identificación unívoca y el registro de anomalías.",
        evidencia: "LEP-PRO-009 (Procedimiento de Manipulación de Ítems de Ensayo), LEP-DGC-014 (Registros de anomalías)"
    },
    {
        clausula: "7.5 Registros técnicos",
        requisito: "Elaborar y mantener procedimientos para la gestión de todos los registros (calidad y técnicos), asegurando su legibilidad, recuperación, protección y conservación adecuada.",
        evidencia: "LEP-DGC-001 (Procedimiento de Control de Documentos y Registros), LEP-REG-00X (Registros técnicos de trabajo - observaciones, datos, cálculos, resultados)"
    },
    {
        clausula: "7.6 Evaluación de la incertidumbre de la medición",
        requisito: "Aplicar un procedimiento para estimar la incertidumbre de la medición para todas las calibraciones, tomando en cuenta todos los componentes significativos.",
        evidencia: "LEP-INC-001 (Procedimiento de Estimación de la Incertidumbre de la Medición), LEP-DOC-008 (Registros de estimación de la incertidumbre de Medición)"
    },
    {
        clausula: "7.7 Aseguramiento de la validez de los resultados",
        requisito: "Implementar procedimientos de control de calidad para el seguimiento de la validez de los resultados, registrando datos para detectar tendencias y participando en comparaciones interlaboratorios o programas de ensayos de aptitud.",
        evidencia: "LEP-PRO-010 (Procedimiento de Aseguramiento de la Validez de los Resultados), LEP-DGC-009 (Registros de Aseguramiento de la validez de los Resultados, Resultados de Ensayos de Aptitud / Comparaciones interlaboratorio)"
    },
    {
        clausula: "7.8 Informe de resultados",
        requisito: "Informar resultados de manera exacta, clara, sin ambigüedad y objetiva en informes o certificados que contengan toda la información requerida (identificación única, laboratorio, cliente, método, descripción del ítem, fechas, resultados, etc.). Las modificaciones deben ser claramente identificadas como suplementos o nuevos documentos.",
        evidencia: "LEP-INF-00X (Informes de Ensayo - resultados de los ensayos), LEP-PRO-10 (Procedimiento para elaboración de informes)"
    },
    {
        clausula: "7.9 Quejas",
        requisito: "Disponer de una política y procedimiento para la resolución de las quejas recibidas, manteniendo registros de las mismas, investigaciones y acciones correctivas.",
        evidencia: "LEP-PRO-011 (Procedimiento de gestión de Trabajo No Conforme / Reclamos), LEP-DGC-010 (Registros de Reclamos)"
    },
    {
        clausula: "7.10 Trabajo no conforme",
        requisito: "Contar con una política y procedimientos para gestionar el trabajo no conforme, incluyendo la asignación de responsabilidades, evaluación de la importancia, corrección, notificación al cliente y reanudación del trabajo. Implementar acciones correctivas si el problema puede recurrir.",
        evidencia: "LEP-PRO-011 (Procedimiento de gestión de Trabajo No Conforme / Reclamos), LEP-DGC-010 (Registros de trabajo no conforme)"
    },
    {
        clausula: "7.11 Control de los datos y gestión de la información",
        requisito: "Asegurar el acceso a los datos e información, validar el software y sistemas de gestión de la información, salvaguardar la integridad y confidencialidad de los datos, y mantener computadoras y equipos automatizados.",
        evidencia: "LEP-PRO-012 (Procedimiento de Control de datos y gestión de la Información)"
    },
    {
        clausula: "V. REQUISITOS DEL SISTEMA DE GESTIÓN",
        requisito: "",
        evidencia: "",
        isHeader: true
    },
    {
        clausula: "8.1 Opciones",
        requisito: "El laboratorio debe establecer, documentar, implementar y mantener un sistema de gestión que sea capaz de operar y demostrar el logro coherente de los requisitos de la norma ISO/IEC 17025. Puede optar por la Opción A (cumplir los requisitos del SGC de la ISO/IEC 17025) o la Opción B (si ya tiene un SGC certificado bajo ISO 9001).",
        evidencia: "LEP-MGC-001 (Manual de Calidad - incluye Política y objetivos de calidad)"
    },
    {
        clausula: "8.2 Documentación del sistema de gestión",
        requisito: "Establecer, documentar y mantener políticas y objetivos de calidad que demuestren el compromiso del laboratorio con la calidad, competencia, imparcialidad y mejora continua. Asegurar que las políticas y objetivos son entendidos e implementados.",
        evidencia: "LEP-MGC-001 (Manual de Calidad - incluye Política y Objetivos de Calidad)"
    },
    {
        clausula: "8.3 Control de documentos del sistema de gestión",
        requisito: "Establecer procedimientos para el control de todos los documentos (internos y externos), asegurando su revisión, aprobación, disponibilidad de versiones autorizadas, examen periódico, retiro de obsoletos y la identificación unívoca de los documentos y sus cambios.",
        evidencia: "LEP-DGC-001 (Procedimiento de Control de documentos y Registros), LEP-DGC-008 (Lista Maestra de Documentos)"
    },
    {
        clausula: "8.4 Control de registros",
        requisito: "Establecer y mantener procedimientos para la gestión de registros (identificación, recopilación, almacenamiento, protección, etc.) de calidad y técnicos, asegurando su legibilidad, recuperabilidad y protección contra acceso no autorizado.",
        evidencia: "LEP-DGC-001 (Procedimiento de Control de Documentos y registros)"
    },
    {
        clausula: "8.5 Acciones para abordar riesgos y oportunidades",
        requisito: "Identificar riesgos y oportunidades, planificar y ejecutar acciones para abordarlos, integrar estas acciones en el sistema de gestión y evaluar su eficacia.",
        evidencia: "LEP-PRO-013 (Procedimiento para Abordar Riesgos y Oportunidades), LEP-DGC-00X (Matriz de Riesgos y Oportunidades), LEP-PLN-002 (Plan de Acción para riesgos y oportunidades)"
    },
    {
        clausula: "8.6 Mejora",
        requisito: "Identificar y seleccionar oportunidades de mejora, implementarlas y buscar retroalimentación de los clientes.",
        evidencia: "LEP-PRO-015 (Procedimiento para la Mejora), LEP-DGC-011 (Registros de Solicitudes de Mejora)"
    },
    {
        clausula: "8.7 Acciones correctivas",
        requisito: "Implementar una política y procedimiento para acciones correctivas cuando se identifiquen trabajos no conformes o desvíos, incluyendo el análisis de causa raíz y el monitoreo de la eficacia de las acciones tomadas.",
        evidencia: "LEP-PRO-014 (Política y Procedimiento para acciones correctivas), LEP-DGC-012 (Registro de Acciones Correctivas)"
    },
    {
        clausula: "8.8 Auditorías internas",
        requisito: "Efectuar periódicamente auditorías internas de acuerdo con un calendario y procedimiento predeterminados, considerando todos los elementos del SGC. Los auditores deben ser formados, calificados e independientes (si es posible).",
        evidencia: "LEP-PRO-015 (Procedimiento de Auditoría Interna), LEP-PRG-003 (Programa de Auditoria interna), LEP-DGC-005 (Checklist Auditoria SGC 17025)"
    },
    {
        clausula: "8.9 Revisiones por la dirección",
        requisito: "La alta dirección debe efectuar periódicamente una revisión del sistema de gestión y de las actividades del laboratorio para asegurar su adecuación y eficacia continua, considerando diversos elementos de entrada y registrando los hallazgos y acciones resultantes.",
        evidencia: "LEP-PRO-016 (Procedimiento de Revisión por la Dirección), LEP-INF-001 (Informe de Revisión por la Dirección)"
    }
].map(item => ({ ...item, estado: '', comentarios: '' }));
