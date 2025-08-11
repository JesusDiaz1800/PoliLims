# Plan de Pruebas Funcionales - PoliLIMS

## 1. Objetivo

El propósito de este documento es describir el plan de pruebas funcionales para la aplicación PoliLIMS. El objetivo es verificar que todas las funcionalidades críticas operan según lo esperado, que los datos se manejan correctamente y que la experiencia de usuario es coherente y libre de errores.

## 2. Alcance

Este plan cubre las pruebas manuales para los siguientes módulos principales:
-   Recepción de Muestras y Creación de Ensayos.
-   Registro de Resultados de Laboratorio.
-   Generación de Informes y Certificados.
-   Gestión de No Conformidades.
-   Gestión de Equipos.
-   Dashboard y Visualización de Datos.

## 3. Criterios de Aceptación

-   **Éxito:** El resultado obtenido coincide con el resultado esperado.
-   **Fallo:** El resultado obtenido no coincide con el resultado esperado, o se produce un error inesperado en la aplicación.

---

## 4. Casos de Prueba

### Módulo 1: Recepción de Muestras (Control Rutinario)

| ID Caso | Descripción del Caso de Prueba                                                                                             | Pasos a Seguir                                                                                                                                                                                                                                | Resultado Esperado                                                                                                                                                           |
| :------ | :------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FP-001** | **Ingreso de control conforme SIN envío a lab.**                                                                           | 1. Iniciar sesión como Inspector. <br> 2. Ir a `Ensayos > Control Rutinario`. <br> 3. Hacer clic en "Ingresar Producto". <br> 4. Llenar el formulario con datos dentro de norma. <br> 5. **NO** marcar "Muestra Entregada a Laboratorio". <br> 6. Registrar. | El sistema guarda el registro con estado "Conforme". No se debe crear un nuevo ensayo en el módulo de seguimiento.                                                            |
| **FP-002** | **Ingreso de control no conforme.**                                                                                        | 1. Iniciar sesión como Inspector. <br> 2. Ir a `Ensayos > Control Rutinario`. <br> 3. Llenar el formulario con un valor de diámetro o espesor claramente fuera de los límites. <br> 4. Registrar.                                                       | El sistema muestra una alerta visual junto al campo no conforme. El registro se guarda con el estado "No Conforme".                                                           |
| **FP-003** | **Ingreso de control CON envío a lab.**                                                                                    | 1. Iniciar sesión como Inspector. <br> 2. Ir a `Ensayos > Control Rutinario`. <br> 3. Llenar el formulario. <br> 4. **SÍ** marcar "Muestra Entregada a Laboratorio". <br> 5. Registrar.                                                             | Se guarda el control. Se crea un nuevo registro en la tabla de `Seguimiento General` con un ID de ensayo único, en estado "Pendiente de Revisión" o similar.               |
| **FP-004** | **Cálculo automático de peso kg/m.**                                                                                       | 1. Iniciar sesión como Inspector. <br> 2. En el formulario de Control Rutinario, ingresar valores en "Largo Muestra" y "Peso muestra".                                                                                                        | El campo "Peso [kg/m]" se actualiza automáticamente con el resultado del cálculo: `(Peso muestra / Largo Muestra) / 10`.                                                    |

### Módulo 2: Registro de Resultados

| ID Caso | Descripción del Caso de Prueba                                                                                           | Pasos a Seguir                                                                                                                                                                                                   | Resultado Esperado                                                                                                                                                                  |
| :------ | :----------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FP-005** | **Cálculo de Melt Index y Variación.**                                                                                   | 1. Iniciar sesión como Analista. <br> 2. Abrir un ensayo de Tubería o Materia Prima. <br> 3. Ir a la pestaña "Melt Index". <br> 4. Ingresar 3 mediciones (ej. 0.1, 0.11, 0.12). <br> 5. Ingresar un valor de "M.I. Materia Prima". | El campo "Índice de fluidez ensayado" se actualiza con el promedio de las mediciones multiplicado por 2. El campo "Variación" se calcula correctamente respecto al valor de referencia. |
| **FP-006** | **Guardar resultados de un ensayo.**                                                                                     | 1. Iniciar sesión como Analista. <br> 2. Abrir un ensayo. <br> 3. Completar varios campos en diferentes pestañas. <br> 4. Hacer clic en "Guardar Resultados".                                                                | El formulario se cierra y la tabla principal refleja los nuevos datos ingresados. Aparece una notificación de éxito.                                                                  |
| **FP-007** | **Editar un ensayo existente.**                                                                                          | 1. Iniciar sesión como Analista. <br> 2. Guardar un ensayo. <br> 3. Volver a abrir el mismo ensayo desde la tabla. <br> 4. Modificar un valor y guardar de nuevo.                                                           | Los datos previamente guardados se cargan correctamente en el formulario. La segunda modificación se guarda exitosamente.                                                              |

### Módulo 3: Generación de Informes

| ID Caso | Descripción del Caso de Prueba                                                              | Pasos a Seguir                                                                                                                                                                                          | Resultado Esperado                                                                                                                                         |
| :------ | :------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FP-008** | **Generar Informe de Lotes (CoA).**                                                         | 1. Iniciar sesión como Jefe de Calidad. <br> 2. Ir a `Informes y Certificados`. <br> 3. Seleccionar dos o más ensayos aprobados de la tabla. <br> 4. Hacer clic en "Generar Informe".                       | Se muestra una vista previa de un informe en formato PDF que contiene los datos promediados de los ensayos seleccionados, con la información de trazabilidad correcta. |
| **FP-009** | **Generar Certificado Histórico.**                                                          | 1. Iniciar sesión como Jefe de Calidad. <br> 2. Ir a `Informes y Certificados`. <br> 3. Ir a la pestaña "Certificado Histórico". <br> 4. Seleccionar un producto y un parámetro de la lista. <br> 5. Generar. | Se muestra una vista previa de un informe con estadísticas (promedio, min, max) y un gráfico de tendencia para el parámetro y producto seleccionados.          |
| **FP-010** | **Validación: No se puede generar informe de ensayos no aprobados.**                          | 1. Ir al generador de informes. <br> 2. Verificar que en la tabla de selección solo aparezcan ensayos con estado "Aprobado".                                                                             | Solo los ensayos aprobados están disponibles para la selección.                                                                                              |

### Módulo 4: Gestión de No Conformidades (NC)

| ID Caso | Descripción del Caso de Prueba                             | Pasos a Seguir                                                                                                                                             | Resultado Esperado                                                                                                                                                  |
| :------ | :--------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **FP-011** | **Crear una nueva No Conformidad.**                          | 1. Iniciar sesión. <br> 2. Ir a `Procesos de Gestión > No Conformidades`. <br> 3. Hacer clic en "Registrar Incidencia". <br> 4. Completar y guardar el formulario. | La nueva NC aparece en la tabla principal con los datos correctos y el estado inicial "Abierta".                                                                    |
| **FP-012** | **Filtrar y buscar No Conformidades.**                       | 1. En la tabla de NC, usar la barra de búsqueda para buscar por ID, descripción o responsable.                                                              | La tabla se filtra en tiempo real para mostrar solo los registros que coinciden con el término de búsqueda.                                                       |

---
