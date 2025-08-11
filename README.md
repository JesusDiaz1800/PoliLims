# PoliLIMS - Prototipo LIMS en Firebase Studio

Este repositorio contiene el prototipo funcional para PoliLIMS, un Sistema de Gestión de Información de Laboratorio (LIMS) moderno, diseñado para cumplir con los requisitos de la norma ISO/IEC 17025.

La aplicación está siendo construida con Next.js, TypeScript, Tailwind CSS y ShadCN para el frontend, y utiliza Firebase (Firestore, Authentication, Storage) para el backend, todo dentro del entorno de desarrollo de Firebase Studio.

## Primeros Pasos

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Firebase CLI (para usar el Emulador)

### Instalación

1.  Clona el repositorio:
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <NOMBRE_DEL_REPOSITORIO>
    ```

2.  Instala las dependencias del proyecto:
    ```bash
    npm install
    ```
    o
    ```bash
    yarn install
    ```

### Ejecutar con el Emulador de Firebase

Para un desarrollo local completo que simule el entorno de Firebase, se recomienda usar el Firebase Emulator Suite.

1.  **Inicia el Emulador de Firebase:**
    Abre una terminal y ejecuta el siguiente comando. Esto iniciará los emuladores para Firestore, Authentication, y otros servicios de Firebase.

    ```bash
    firebase emulators:start
    ```

2.  **Inicia la aplicación de Next.js:**
    En una segunda terminal, ejecuta el comando de desarrollo:

    ```bash
    npm run dev
    ```

    La aplicación estará disponible en `http://localhost:3000`. Se conectará automáticamente al Emulador de Firebase que se está ejecutando localmente.

### Flujo de Usuario de Demostración

La aplicación utiliza un sistema de inicio de sesión simulado. Puede usar cualquiera de los siguientes correos electrónicos para iniciar sesión como diferentes roles de usuario:

-   **Jefe de Calidad:** `jefe.calidad@polifusion.cl`
-   **Ing. Analista de Calidad:** `jdiaz@polifusion.cl`
-   **Analista de Calidad:** `afigueroa@polifusion.cl`
-   **Inspector de Calidad:** `eibanez@polifusion.cl`

La contraseña para todos los usuarios es `password`.
