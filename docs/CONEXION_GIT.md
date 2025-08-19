# Guía para Conectar tu Repositorio de Firebase a GitHub

Esta guía te explicará cómo tomar el código de tu proyecto actual en Firebase Studio y conectarlo a un repositorio de GitHub para establecer un flujo de trabajo de Despliegue Continuo (CI/CD).

## El Concepto Clave

- **Firebase Studio:** Es tu entorno de desarrollo en la nube, donde editas el código.
- **GitHub (o similar):** Es donde se almacena el historial de tu código de forma permanente. Es la "fuente de la verdad".
- **Firebase App Hosting:** Es el servicio que aloja y ejecuta tu aplicación. Se puede conectar a GitHub para desplegar automáticamente los cambios.

El objetivo es que GitHub sea el origen, y que cada cambio que subas a GitHub se despliege automáticamente en Firebase.

## Pasos para la Conexión

### Paso 1: Obtener el Código en tu Computadora Local

Primero, necesitas una copia local del código que has estado editando en Firebase Studio.

1.  **Instala la Firebase CLI:** Si no la tienes, sigue las [instrucciones oficiales de instalación](https://firebase.google.com/docs/cli).

2.  **Inicia sesión en Firebase:**
    ```bash
    firebase login
    ```

3.  **Clona el repositorio desde Firebase App Hosting:** Necesitarás tu ID de Proyecto y el ID del Repositorio.
    -   Puedes encontrar el **ID del Proyecto** en la configuración de tu proyecto de Firebase (el icono del engranaje).
    -   El **ID del Repositorio** lo puedes obtener listando tus repositorios con el comando: `firebase apphosting:repositories:list --project TU_ID_DE_PROYECTO`

    Una vez que tengas ambos, ejecuta el siguiente comando reemplazando los valores:
    ```bash
    firebase apphosting:repositories:clone ID_DEL_REPOSITORIO --project=TU_ID_DE_PROYECTO
    ```
    Esto creará una carpeta en tu computadora con todo el código.

### Paso 2: Crear un Repositorio en GitHub

1.  Ve a [GitHub.com](https://github.com) y crea un **nuevo repositorio vacío**.
    -   Dale un nombre (ej. `polilims-app`).
    -   **Importante:** No inicialices el repositorio con un archivo `README`, `.gitignore` o licencia. Debe estar completamente vacío.

### Paso 3: Conectar tu Código Local a GitHub

Ahora, desde la carpeta que clonaste en el Paso 1, ejecuta estos comandos en tu terminal.

1.  **Navega a la carpeta del proyecto:**
    ```bash
    cd NOMBRE_DE_LA_CARPETA_CLONADA
    ```

2.  **Conecta tu repositorio local con el de GitHub:** Reemplaza la URL con la que te proporcionó GitHub al crear el repositorio.
    ```bash
    git remote add origin URL_DE_TU_REPOSITORIO_EN_GITHUB.git
    ```

3.  **(Opcional pero recomendado) Asegúrate de que tu rama principal se llame `main`:**
    ```bash
    git branch -M main
    ```

4.  **Sube tu código a GitHub:** Este comando envía todo tu proyecto a GitHub por primera vez.
    ```bash
    git push -u origin main
    ```

### Paso 4: Configurar el Despliegue Continuo en Firebase

¡Esta es la parte mágica!

1.  Ve a la **Consola de Firebase** de tu proyecto.
2.  En el menú de la izquierda, ve a **App Hosting**.
3.  Selecciona tu backend de App Hosting.
4.  Ve a la pestaña **"GitHub"**.
5.  Haz clic en **"Vincular a GitHub"** y sigue el proceso de autenticación.
6.  Selecciona el repositorio de GitHub que acabas de crear (`polilims-app`).
7.  Configura el despliegue para que se active en cada `push` a la rama `main`.
8.  Guarda la configuración.

## Flujo de Trabajo Futuro

A partir de ahora:

1.  **Desarrolla localmente** en tu computadora (en la carpeta que clonaste).
2.  Cuando termines un cambio, guárdalo en Git (`git add .`, `git commit -m "..."`).
3.  Sube los cambios a GitHub (`git push`).
4.  **Firebase detectará el cambio automáticamente, construirá tu aplicación y la desplegará sin que tengas que hacer nada más.**

Aunque puedes seguir usando Firebase Studio para ediciones rápidas, el flujo de trabajo profesional y recomendado es trabajar localmente con Git y GitHub.
