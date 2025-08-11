# Manual del Administrador - PoliLIMS

## 1. Introducción

Este manual está dirigido a los usuarios con rol de "Administrador del Sistema" o "Jefe de Calidad" con permisos elevados. Describe las funcionalidades clave para la configuración, mantenimiento y gestión general de la aplicación PoliLIMS.

## 2. Gestión de Usuarios y Roles (Próximamente)

La sección **Administración > Gestión de Usuarios** permitirá realizar las siguientes acciones una vez que se conecte a un sistema de autenticación real (como Active Directory o la autenticación de Firebase):

-   **Añadir nuevos usuarios:** Registrar nuevos miembros del personal en el sistema.
-   **Asignar roles:** Definir qué rol (Jefe de Calidad, Analista, Inspector) tiene cada usuario. El rol determina los permisos y las vistas a las que puede acceder.
-   **Editar perfiles:** Actualizar nombres, roles o desactivar usuarios que ya no forman parte del laboratorio.

La sección **Administración > Roles y Permisos** ofrece una vista de solo lectura de las capacidades de cada rol. En un futuro, esta sección podría permitir una personalización más granular de los permisos.

## 3. Gestión de Equipos

Ubicado en **Procesos de Gestión > Gestión de Equipos > Inventario de Equipos**.

-   **Registrar un nuevo equipo:**
    1.  Haga clic en el botón "Registrar Nuevo Equipo".
    2.  Complete la ficha técnica con toda la información relevante (ID, nombre, marca, modelo, etc.).
    3.  Añada la fecha de próxima calibración. Esto es crucial para el sistema de alertas.
    4.  Puede asociar el equipo a los ensayos en los que se utiliza.
    5.  Haga clic en "Registrar Equipo".

-   **Editar un equipo:**
    1.  En la tabla de inventario, haga clic en el menú de acciones (tres puntos) del equipo deseado y seleccione "Editar".
    2.  Modifique los campos necesarios en el formulario.
    3.  Haga clic en "Guardar Cambios".

-   **Registrar eventos de control (Calibración/Mantenimiento):**
    1.  Vaya a la pestaña "Historial de Control" dentro de los detalles de un equipo, o directamente desde el menú principal.
    2.  Haga clic en "Registrar Evento".
    3.  Seleccione el tipo de evento, la fecha, el responsable y añada observaciones.
    4.  Si es una calibración, puede añadir la fecha del próximo control para actualizar automáticamente el estado del equipo.

## 4. Configuración de la Aplicación

Ubicado en **Administración > Configuración**.

-   **Tema Visual:** Permite al usuario cambiar entre un tema claro y oscuro para la interfaz. La configuración se guarda localmente en el navegador del usuario.
-   **Idioma:** Prepara la aplicación para futuras traducciones. Actualmente, el español está seleccionado por defecto.

## 5. Base de Conocimiento para IA

Los documentos que alimentan al Asistente de IA se gestionan en **Biblioteca > Documentos**.

-   **Cargar un documento:**
    1.  Vaya a la sección "Cargar Documento".
    2.  Seleccione un archivo de texto (`.txt`). Para mejores resultados, copie el contenido de sus manuales o procedimientos a un archivo de texto plano.
    3.  Haga clic en "Cargar Archivo".
    4.  El documento aparecerá en la tabla y estará disponible para que el asistente de IA lo consulte.
-   **Aprobar un documento:** La aprobación es un paso simulado que representa la firma digital. Un Jefe de Calidad puede "aprobar" un documento para marcarlo como la versión oficial.

## 6. Próximos Pasos para Puesta en Producción

La sección **Administración > Próximos Pasos** es una guía crucial que el administrador o el equipo de TI debe revisar. Detalla los pasos necesarios para migrar este prototipo a un entorno de producción seguro y escalable, incluyendo:
-   Despliegue en la nube.
-   Implementación de un sistema de autenticación real.
-   Configuración de una base de datos centralizada.
-   Gestión de almacenamiento de archivos.

Es fundamental coordinar con el departamento de TI de la empresa para llevar a cabo estos pasos.
