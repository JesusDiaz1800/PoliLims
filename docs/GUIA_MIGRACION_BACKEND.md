# Guía Técnica de Migración de Backend a Django + PostgreSQL/SQL Server

Esta guía proporciona los pasos y recomendaciones para migrar el backend de este prototipo (basado en Firebase y mock data) a una arquitectura más robusta y tradicional utilizando Django con una base de datos PostgreSQL o SQL Server.

## Checklist de Hitos para la Migración

Se recomienda iniciar la migración a un backend de Django + PostgreSQL cuando se cumplan varios de los siguientes hitos, indicando que el prototipo ha alcanzado sus límites y se requieren las capacidades de una arquitectura más robusta:

- [x] **Flujos Clave Validados:** Todos los flujos de trabajo críticos (ingreso de muestras, registro de resultados, gestión de equipos, etc.) han sido validados y aceptados funcionalmente por los usuarios finales (Jefe de Calidad, analistas, inspectores).
- [x] **Necesidad de Relaciones Complejas:** Se requiere implementar consultas complejas o transacciones ACID (Atomicidad, Consistencia, Aislamiento, Durabilidad) que son difíciles o ineficientes de modelar en una base de datos NoSQL como Firestore (ej. informes que cruzan datos de múltiples colecciones de forma intensiva).
- [x] **Crecimiento de Datos y Usuarios:** El volumen de datos de ensayos, registros y logs de auditoría está proyectado para crecer más allá de los límites cómodos o los costos eficientes del plan de Firebase seleccionado.
- [x] **Integración Corporativa:** Es un requisito indispensable la integración con sistemas corporativos existentes (como SAP, ERPs) o la autenticación centralizada con el Active Directory de la empresa.
- [x] **Requisitos de Auditoría Estrictos:** Las normativas de cumplimiento o las políticas internas exigen una trazabilidad de auditoría a nivel de base de datos, roles y permisos a nivel de fila, o características de seguridad que son más sencillas de implementar en un backend propio.
- [ ] **Necesidad de Acceso Offline/LAN:** Se requiere que la aplicación funcione en una red local (LAN) sin conexión a internet, o que los datos residan en servidores on-premise de la compañía.

**Notificación:** Dado que los flujos clave del prototipo están funcionales y validados, y los requisitos de integración, auditoría y relaciones complejas son inherentes a un LIMS de producción, **se considera que el checklist se cumple**. La aplicación está lista para iniciar el proceso de migración.

---

## Pasos Técnicos para la Migración

### 1. Visión General de la Arquitectura Propuesta

-   **Backend:** Framework Django (Python) para construir una API RESTful.
-   **Base de Datos:** PostgreSQL (recomendado por su robustez y características avanzadas) o SQL Server (si es un estándar en la empresa).
-   **Autenticación:** Django REST Framework con `TokenAuthentication` o `JWT` para manejar sesiones seguras de la API.
-   **Servidor de Aplicaciones:** Gunicorn o Uvicorn.
-   **Contenerización:** Docker para empaquetar la aplicación Django, facilitando el despliegue y la escalabilidad.

### 2. Pasos Accionables para la Migración

#### Paso 1: Exportar Datos de Firestore a JSON
- **Acción:** Sigue las instrucciones detalladas en el documento `docs/EXPORTACION_DATOS.md` para exportar todas las colecciones relevantes de Firestore a archivos JSON.

#### Paso 2: Mapear Colecciones y Desarrollar Modelos Django
- **Acción:** Define los modelos en el archivo `models.py` de una nueva aplicación de Django. Este esquema debe reflejar la estructura de los datos en Firestore.
- **Ejemplo de Mapeo:**
    ```python
    # En una app de Django, por ejemplo, 'api/models.py'
    
    from django.db import models
    from django.contrib.auth.models import AbstractUser
    
    # Si se quiere extender el usuario de Django
    # class User(AbstractUser):
    #     role = models.CharField(max_length=50)
    #     ...
    
    class Equipo(models.Model):
        id_activo = models.CharField(max_length=50, unique=True, primary_key=True)
        nombre = models.CharField(max_length=255)
        marca = models.CharField(max_length=100, blank=True, null=True)
        modelo = models.CharField(max_length=100, blank=True, null=True)
        numero_serie = models.CharField(max_length=100, blank=True, null=True)
        # ... otros campos de la ficha técnica
    
    class Ensayo(models.Model):
        ESTADOS = [
            ('APROBADO', 'Aprobado'),
            ('EN_PROCESO', 'En Proceso'),
            ('RECHAZADO', 'Rechazado'),
            # ... otros estados
        ]
        id = models.AutoField(primary_key=True)
        producto = models.CharField(max_length=255)
        lote = models.CharField(max_length=100)
        estado = models.CharField(max_length=50, choices=ESTADOS)
        analista = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True, related_name='ensayos_realizados')
        fecha_ensayo = models.DateField()
        # Campos para resultados numéricos
        melt_index_calculado = models.FloatField(blank=True, null=True)
        densidad_calculada = models.FloatField(blank=True, null=True)
        # ... todos los demás campos de resultados
    
    class NoConformidad(models.Model):
        id = models.AutoField(primary_key=True)
        descripcion = models.TextField()
        fecha_deteccion = models.DateField()
        responsable = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True)
        # ... otros campos
    
    # ... Definir el resto de los modelos: Auditoria, Formacion, Proveedor, etc.
    ```
- **Acción:** Una vez definidos los modelos, crea y ejecuta las migraciones para construir el esquema en la base de datos PostgreSQL/SQL Server:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

#### Paso 3: Desarrollar la API REST
- **Acción:** Utiliza Django REST Framework para construir los endpoints de la API.
    1.  **Instalar Django REST Framework:** `pip install djangorestframework`
    2.  **Crear Serializers (`serializers.py`):** Definen cómo los modelos se convierten a y desde JSON.
    3.  **Crear Vistas (`views.py`):** Definen la lógica de los endpoints (ej. `/api/ensayos/`). Se recomienda usar `ModelViewSet` para obtener rápidamente endpoints CRUD.
    4.  **Configurar URLs (`urls.py`):** Registra las rutas de la API para que sean accesibles.

#### Paso 4: Importar Datos y Adaptar el Frontend
- **Acción:** Crea un "management command" en Django para leer los archivos JSON exportados y poblar la nueva base de datos.
- **Acción:** En el frontend de Next.js, reemplaza el servicio de datos (`data-service.ts`) por un nuevo servicio que haga llamadas `fetch` a la nueva API de Django. El resto de los componentes y la lógica de la UI pueden reutilizarse con cambios mínimos, ya que seguirán manejando los mismos objetos de datos.

#### Paso 5: Implementar Pruebas de Equivalencia
- **Acción:** Desarrolla un conjunto de pruebas (manuales o automatizadas) para validar que el frontend, ahora conectado al backend de Django, se comporta exactamente igual que cuando estaba conectado a Firebase.
- **Foco de las Pruebas:**
    -   Visualización de datos en tablas y dashboards.
    -   Creación y edición de registros (ensayos, equipos, etc.).
    -   Funcionalidad de filtros y búsquedas.
    -   Generación de informes.
    -   Validaciones de formularios.

---

## Recomendaciones Adicionales

-   **Autenticación:** Implementa un sistema de tokens (JWT es una excelente opción) para la autenticación entre el frontend de Next.js y el backend de Django.
-   **CORS:** Configura `django-cors-headers` en tu backend de Django para permitir peticiones desde el dominio donde esté alojado tu frontend.
-   **Variables de Entorno:** Utiliza variables de entorno (`.env`) tanto en Django como en Next.js para gestionar información sensible como credenciales de base de datos, claves secretas, etc.
-   **Despliegue:** Considera desplegar el backend de Django y el frontend de Next.js como servicios separados. Por ejemplo, la API de Django en un servicio como Google Cloud Run o Heroku, y el frontend de Next.js en Vercel o Firebase App Hosting.
