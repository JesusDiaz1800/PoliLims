# 🚀 Despliegue a Firebase Hosting

## Configuración Inicial

### 1. Instalar Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Iniciar sesión en Firebase
```bash
firebase login
```

### 3. Inicializar el proyecto (si es la primera vez)
```bash
firebase init hosting
```

## Despliegue

### Despliegue de Producción
```bash
npm run deploy
```

### Despliegue de Preview
```bash
npm run deploy:preview
```

### Despliegue Manual
```bash
npm run build
firebase deploy --only hosting
```

## Estructura del Proyecto

```
📁 PoliLims-Frontend (Este repositorio)
├── src/                    # Código fuente
├── out/                    # Build estático (generado)
├── firebase.json          # Configuración de Firebase
├── .firebaserc            # ID del proyecto
└── package.json           # Scripts de despliegue

📁 PoliLims-Backend (Repositorio separado)
├── api/                   # API endpoints
├── database/              # Configuración de base de datos
└── functions/             # Cloud Functions
```

## Ventajas de esta Configuración

✅ **Frontend y Backend Independientes**
- Cambios al frontend no afectan el backend
- Despliegues separados y controlados
- Desarrollo paralelo sin conflictos

✅ **Escalabilidad**
- Frontend en Firebase Hosting (CDN global)
- Backend en Cloud Functions/Cloud Run
- Base de datos en Firestore/Cloud SQL

✅ **Seguridad**
- Reglas de seguridad separadas
- Autenticación independiente
- Control de acceso granular

## URLs de Despliegue

- **Producción**: https://polilims-frontend.web.app
- **Preview**: https://polilims-frontend--preview-[hash].web.app

## Comandos Útiles

```bash
# Ver logs de despliegue
firebase hosting:log

# Listar canales de preview
firebase hosting:channel:list

# Eliminar canal de preview
firebase hosting:channel:delete preview

# Ver configuración del proyecto
firebase projects:list
```
