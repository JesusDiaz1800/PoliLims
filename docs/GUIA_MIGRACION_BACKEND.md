# Guía Técnica de Migración de Backend a Django + PostgreSQL/SQL Server

Esta guía proporciona los pasos y recomendaciones para migrar el backend de este prototipo (basado en Firebase y mock data) a una arquitectura más robusta y tradicional utilizando Django con una base de datos PostgreSQL o SQL Server.

## 1. Visión General de la Arquitectura Propuesta

-   **Backend:** Framework Django (Python) para construir una API RESTful.
-   **Base de Datos:** PostgreSQL (recomendado por su robustez y características avanzadas) o SQL Server (si es un estándar en la empresa).
-   **Autenticación:** Django REST Framework con `TokenAuthentication` o `JWT` para manejar sesiones seguras de la API.
-   **Servidor de Aplicaciones:** Gunicorn o Uvicorn.
-   **Contenerización:** Docker para empaquetar la aplicación Django, facilitando el despliegue y la escalabilidad.

## 2. Modelos de Datos (Esquema Django `models.py`)

A continuación se presenta un esquema de los modelos de Django que se corresponderían con las estructuras de datos (`interfaces`) del prototipo actual.

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

## 3. Pasos para la Migración

### Paso 1: Configurar el Proyecto Django

1.  **Crear el proyecto:**
    ```bash
    django-admin startproject polilims_backend
    cd polilims_backend
    python manage.py startapp api
    ```

2.  **Configurar la Base de Datos (`settings.py`):**
    *   Instalar el driver de base de datos (`psycopg2-binary` para PostgreSQL, `mssql-django` para SQL Server).
    *   Actualizar la configuración `DATABASES` en `settings.py` con las credenciales, host y puerto de tu servidor de base de datos.

3.  **Definir los Modelos:**
    *   Traducir todas las interfaces de `src/context/data-context.tsx` a modelos de Django en `api/models.py` como se ejemplificó arriba.

4.  **Crear y ejecutar las migraciones:**
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

### Paso 2: Crear la API REST

1.  **Instalar Django REST Framework:**
    ```bash
    pip install djangorestframework
    ```
2.  **Serializers:** Crear `api/serializers.py` para definir cómo los modelos de Django se convierten a y desde JSON.
    ```python
    from rest_framework import serializers
    from .models import Ensayo, Equipo

    class EnsayoSerializer(serializers.ModelSerializer):
        class Meta:
            model = Ensayo
            fields = '__all__'

    class EquipoSerializer(serializers.ModelSerializer):
        class Meta:
            model = Equipo
            fields = '__all__'
    # ... etc
    ```
3.  **Views (Vistas):** Crear `api/views.py` para definir los endpoints de la API (ej. `/api/ensayos/`, `/api/equipos/<id>/`). Se recomienda usar `ModelViewSet` para obtener rápidamente endpoints CRUD completos para cada modelo.
    ```python
    from rest_framework import viewsets
    from .models import Ensayo
    from .serializers import EnsayoSerializer

    class EnsayoViewSet(viewsets.ModelViewSet):
        queryset = Ensayo.objects.all()
        serializer_class = EnsayoSerializer
        # permission_classes = [IsAuthenticated] # Añadir permisos
    ```
4.  **URLs:** Configurar `api/urls.py` y el archivo principal `urls.py` del proyecto para registrar las rutas de la API.

### Paso 3: Importar los Datos

1.  **Exportar Datos de Firestore:**
    *   Sigue la guía en `EXPORTACION_DATOS.md` para exportar tus colecciones de Firestore a archivos JSON.

2.  **Crear un Script de Importación en Django:**
    *   Django permite crear "management commands" personalizados. Crea un script en `api/management/commands/import_data.py`.
    *   Este script leerá los archivos JSON exportados y creará instancias de los modelos de Django, guardándolas en la nueva base de datos.

    **Ejemplo de esqueleto del script:**
    ```python
    import json
    from django.core.management.base import BaseCommand
    from api.models import Ensayo, Equipo # Importar todos tus modelos

    class Command(BaseCommand):
        help = 'Importa datos desde archivos JSON exportados de Firestore'

        def handle(self, *args, **kwargs):
            self.stdout.write('Iniciando importación de datos...')

            # Importar Equipos
            with open('ruta/a/exportacion/equipos.json') as f:
                equipos_data = json.load(f)
                for equipo_id, equipo_obj in equipos_data.items():
                    Equipo.objects.update_or_create(
                        id_activo=equipo_id,
                        defaults={
                            'nombre': equipo_obj.get('nombre'),
                            'marca': equipo_obj.get('marca'),
                            # ... mapear todos los campos
                        }
                    )
            self.stdout.write(self.style.SUCCESS('Equipos importados exitosamente.'))

            # Importar Ensayos (y así sucesivamente para cada colección)
            # ...

            self.stdout.write(self.style.SUCCESS('Importación de datos completada.'))
    ```
3.  **Ejecutar el script:**
    ```bash
    python manage.py import_data
    ```

### Paso 4: Adaptar el Frontend

1.  **Eliminar `data-service.ts`:** El servicio de mock data ya no será necesario.
2.  **Crear un Servicio de API en el Frontend:**
    *   Crear un nuevo archivo (ej. `src/services/api-service.ts`) que contenga funciones para interactuar con la nueva API de Django.
    *   Utilizar `fetch` o una librería como `axios` para hacer las peticiones GET, POST, PUT, DELETE a los endpoints de Django.
    *   Ejemplo de función:
        ```typescript
        const API_BASE_URL = 'http://localhost:8000/api';

        export async function getEnsayos(): Promise<Ensayo[]> {
            const response = await fetch(`${API_BASE_URL}/ensayos/`);
            if (!response.ok) {
                throw new Error('Failed to fetch ensayos');
            }
            return response.json();
        }
        ```
3.  **Reemplazar Llamadas a Datos:**
    *   En todos los componentes y páginas (ej. `dashboard/page.tsx`, `equipos/page.tsx`), reemplazar las llamadas a `dataService.getInitialData()` por llamadas al nuevo `api-service.ts`.
    *   Manejar los estados de carga y error de las peticiones de red.
    *   Adaptar los hooks de `useState` y `useEffect` para que funcionen con la data asíncrona de la API.

## 4. Recomendaciones

-   **Autenticación:** Implementa un sistema de tokens (JWT es una excelente opción) para la autenticación entre el frontend de Next.js y el backend de Django.
-   **CORS:** Configura `django-cors-headers` en tu backend de Django para permitir peticiones desde el dominio donde esté alojado tu frontend.
-   **Variables de Entorno:** Utiliza variables de entorno (`.env`) tanto en Django como en Next.js para gestionar información sensible como credenciales de base de datos, claves secretas, etc.
-   **Despliegue:** Considera desplegar el backend de Django y el frontend de Next.js como servicios separados. Por ejemplo, la API de Django en un servicio como Google Cloud Run o Heroku, y el frontend de Next.js en Vercel o Firebase App Hosting.
