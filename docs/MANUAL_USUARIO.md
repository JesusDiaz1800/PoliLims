# Manual de Usuario - PoliLIMS

## 1. Introducción

¡Bienvenido a PoliLIMS! Este manual te guiará a través de las funciones principales de la aplicación, diseñadas para facilitar tu trabajo diario en el laboratorio de calidad de Polifusión S.A.

## 2. Primeros Pasos: Inicio de Sesión

Para acceder al sistema, utiliza el correo electrónico y la contraseña proporcionados por el administrador. En la versión de prototipo, puedes usar una de las siguientes cuentas para explorar los diferentes roles:

-   **Jefe de Calidad:** `vlutz@polifusion.cl`
-   **Ing. Analista de Calidad:** `jdiaz@polifusion.cl`
-   **Analista de Calidad:** `afigueroa@polifusion.cl`
-   **Inspector de Calidad:** `eibanez@polifusion.cl`

La contraseña para todos es: `password`

## 3. Dashboard: Tu Centro de Mando

El **Dashboard** es la primera pantalla que verás. Te ofrece una vista rápida del estado del laboratorio:
-   **KPIs (Indicadores Clave):** Tarjetas con el número total de ensayos, el porcentaje de aprobación, los ensayos pendientes y las no conformidades abiertas.
-   **Gráficos:** Visualizaciones sobre la carga de trabajo por analista, el estado de los ensayos y las tendencias a lo largo del tiempo.
-   **Filtros:** Puedes filtrar la información del dashboard por rango de fechas, analista, tipo de ensayo y más.

## 4. Flujo de Trabajo de un Ensayo

### 4.1. Ingreso de Muestra (Inspectores de Calidad)

La recepción de una nueva muestra se realiza desde la sección **Ensayos > Control Rutinario**.

1.  Haz clic en **"Ingresar Producto"**.
2.  Completa el formulario con la información de producción (fecha, hora, máquina, producto, etc.).
3.  Ingresa las mediciones dimensionales y visuales. El sistema te alertará si un valor está fuera de norma.
4.  **Importante:** Si la muestra física se va a enviar al laboratorio para más análisis, marca la casilla **"Muestra Entregada a Laboratorio"**.
5.  Haz clic en **"Registrar Control"**.

Al marcar la casilla, se creará automáticamente una nueva solicitud de ensayo que los analistas verán en sus pantallas.

### 4.2. Registro de Resultados (Analistas de Calidad)

Los ensayos asignados se gestionan en las subsecciones de **Ensayos** (ej. Tuberías HDPE, Materia Prima).

1.  Busca el ensayo que necesitas procesar en la tabla.
2.  Haz clic en el menú de acciones (tres puntos) y selecciona **"Editar / Ingresar Datos"**.
3.  Se abrirá un formulario detallado con pestañas para cada tipo de análisis (Melt Index, Densidad, etc.).
4.  Ingresa los datos crudos de tus mediciones en los campos correspondientes. El sistema calculará los resultados finales automáticamente.
5.  Una vez completados todos los análisis, haz clic en **"Guardar Resultados"**. El estado del ensayo se actualizará.

### 4.3. Aprobación de Resultados (Jefe/Ing. de Calidad)

Los ensayos finalizados deben ser revisados y aprobados.

1.  En la tabla de seguimiento, busca los ensayos con estado "Pendiente de Revisión".
2.  Desde el menú de acciones, selecciona **"Aprobar / Revisar"**.
3.  En el diálogo, elige "Aprobado" o "Rechazado" y añade un comentario si es necesario.
4.  Guarda la decisión.

## 5. Generación de Informes y Certificados

Ve a **Informes y Certificados > Generador de Informes**.

-   **Para un Informe de Lotes:**
    1.  En la pestaña "Informe de Resultado de Ensayos", filtra y selecciona uno o más ensayos **aprobados**.
    2.  Haz clic en "Generar Informe".
    3.  Se mostrará una vista previa del documento con los resultados promediados.
    4.  Puedes imprimirlo o guardarlo como PDF.

-   **Para un Certificado Histórico de Producto:**
    1.  Ve a la pestaña "Certificado Histórico por Producto".
    2.  Selecciona un producto y un parámetro de la lista (ej. Melt Index).
    3.  Haz clic en "Generar Certificado".
    4.  Se creará un informe con estadísticas y un gráfico de tendencia para ese parámetro a lo largo del tiempo.

## 6. Gestión de No Conformidades

Si detectas una desviación o un problema, regístralo en **Procesos de Gestión > No Conformidades**.

1.  Haz clic en "Registrar Incidencia".
2.  Completa el formulario, describiendo el problema, la fecha, la severidad y el responsable de la acción correctiva.
3.  Guarda la incidencia. El sistema le dará seguimiento hasta su cierre.

## 7. Asistente de IA

En la esquina inferior derecha, encontrarás el widget del chat de soporte. Úsalo para:
-   Preguntar sobre procedimientos (ej. "¿Cómo se calibra el equipo X?").
-   Pedir que te lleve a una página específica (ej. "Llévame a la gestión de equipos").
-   Consultar normativas.
