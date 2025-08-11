# Guía para Exportar Datos de Firestore a JSON

Esta guía describe cómo exportar colecciones de una base de datos de Firestore a un formato JSON, lo cual es útil para backups, migraciones o análisis de datos locales. Utilizaremos la herramienta de línea de comandos `gcloud`, que forma parte del SDK de Google Cloud.

## Prerrequisitos

1.  **Tener instalado el SDK de Google Cloud:** Si aún no lo tienes, sigue las instrucciones de instalación en la [documentación oficial de Google Cloud](https://cloud.google.com/sdk/docs/install).

2.  **Autenticación:** Asegúrate de estar autenticado con una cuenta que tenga los permisos necesarios sobre el proyecto de Firebase/Google Cloud. Ejecuta el siguiente comando para iniciar sesión:
    ```bash
    gcloud auth login
    ```

3.  **Configurar el Proyecto:** Establece el proyecto de Google Cloud correcto en tu configuración de `gcloud`. Puedes encontrar tu ID de Proyecto en la configuración de tu proyecto de Firebase.
    ```bash
    gcloud config set project TU_ID_DE_PROYECTO
    ```

## Proceso de Exportación

La exportación se realiza utilizando los servicios de importación y exportación gestionados de Firestore, que utilizan un bucket de Google Cloud Storage para almacenar los archivos de salida.

### Paso 1: Crear un Bucket de Google Cloud Storage

Si aún no tienes un bucket para las exportaciones, necesitas crear uno.

1.  Ve a la consola de Google Cloud -> Cloud Storage -> Buckets.
2.  Haz clic en "Crear Bucket".
3.  Dale un nombre único global (ej. `backup-firestore-polilims`).
4.  Elige una ubicación y una clase de almacenamiento (Standard es una buena opción para empezar).
5.  Mantén el resto de las opciones por defecto y haz clic en "Crear".

### Paso 2: Ejecutar el Comando de Exportación

Con el SDK configurado y el bucket creado, puedes exportar todas las colecciones de tu base de datos de Firestore.

El siguiente comando exportará la base de datos completa a una carpeta dentro de tu bucket con la fecha actual.

```bash
gcloud firestore export gs://NOMBRE_DE_TU_BUCKET/backups/$(date +%Y-%m-%d)
```

**Ejemplo:**
```bash
gcloud firestore export gs://backup-firestore-polilims/backups/$(date +%Y-%m-%d)
```

**Exportar colecciones específicas:**

Si solo deseas exportar ciertas colecciones, puedes especificarlas con el flag `--collection-ids`.

```bash
gcloud firestore export gs://NOMBRE_DE_TU_BUCKET/backups/$(date +%Y-%m-%d) --collection-ids='ensayos','equipos','usuarios'
```

### Paso 3: Descargar los Datos (Opcional)

Una vez que la exportación se ha completado, los datos estarán en tu bucket de Cloud Storage. No estarán en un único archivo JSON, sino en un formato de metadatos de nivel de Firestore.

Para obtener un formato JSON más manejable, una opción es utilizar librerías o scripts que lean estos datos y los conviertan.

Una alternativa más directa para backups legibles es utilizar una librería de terceros como `firestore-export-import`.

#### Usando `node-firestore-import-export`

Esta es una herramienta popular que puedes usar desde un script de Node.js para exportar colecciones a un único archivo JSON.

1.  **Instala la herramienta:**
    ```bash
    npm install -g node-firestore-import-export
    ```

2.  **Obtén las credenciales de tu cuenta de servicio:**
    *   Ve a la consola de Firebase -> Configuración del Proyecto -> Cuentas de Servicio.
    *   Genera una nueva clave privada y descarga el archivo JSON. Guárdalo en un lugar seguro.

3.  **Ejecuta el comando de exportación:**
    ```bash
    firestore-export -a /ruta/a/tu/archivo-de-credenciales.json -b /ruta/de/salida/backup.json
    ```
    Esto exportará todas las colecciones en un solo archivo `backup.json`.

    Para exportar una colección específica:
    ```bash
    firestore-export -a /ruta/a/tu/archivo-de-credenciales.json -b /ruta/de/salida/ensayos.json -n ensayos
    ```

Esta segunda opción suele ser más práctica para migraciones y análisis locales, ya que el formato de salida es un JSON directamente utilizable.
