# 🏗️ ARQUITECTURA DE MICROSERVICIOS - POLILIMS

## 📋 **VISIÓN GENERAL**

PoliLims implementa una arquitectura de microservicios moderna y escalable que garantiza alta disponibilidad, rendimiento óptimo y cumplimiento total con ISO/IEC 17025.

## 🏛️ **ARQUITECTURA DE MICROSERVICIOS**

### **1. MICROSERVICIOS PRINCIPALES**

```
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY (Kong/Envoy)                    │
│                    - Autenticación                             │
│                    - Rate Limiting                             │
│                    - Load Balancing                             │
│                    - SSL Termination                            │
└─────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
        ┌───────────▼──────────┐    │    ┌───────────▼──────────┐
        │   AUTH SERVICE       │    │    │   USER SERVICE       │
        │   - JWT Tokens       │    │    │   - User Management  │
        │   - OAuth2           │    │    │   - Roles & Perms    │
        │   - MFA              │    │    │   - Profiles         │
        └──────────────────────┘    │    └──────────────────────┘
                                    │
        ┌───────────▼──────────┐    │    ┌───────────▼──────────┐
        │   SAMPLE SERVICE     │    │    │   ASSAY SERVICE      │
        │   - Sample Mgmt      │    │    │   - Assay Execution  │
        │   - Chain of Custody │    │    │   - Method Mgmt      │
        │   - Inventory        │    │    │   - Results          │
        └──────────────────────┘    │    └──────────────────────┘
                                    │
        ┌───────────▼──────────┐    │    ┌───────────▼──────────┐
        │   EQUIPMENT SERVICE  │    │    │   CALIBRATION SERVICE│
        │   - Equipment Mgmt   │    │    │   - Calibration      │
        │   - Maintenance      │    │    │   - Verification     │
        │   - Status Tracking  │    │    │   - Standards        │
        └──────────────────────┘    │    └──────────────────────┘
                                    │
        ┌───────────▼──────────┐    │    ┌───────────▼──────────┐
        │   QUALITY SERVICE    │    │    │   REPORTING SERVICE  │
        │   - Non-conformities │    │    │   - Certificates     │
        │   - Corrective Actions│   │    │   - Reports          │
        │   - Complaints       │    │    │   - Analytics        │
        └──────────────────────┘    │    └──────────────────────┘
                                    │
        ┌───────────▼──────────┐    │    ┌───────────▼──────────┐
        │   AUDIT SERVICE      │    │    │   NOTIFICATION SERVICE│
        │   - Audit Trails     │    │    │   - Email/SMS        │
        │   - Compliance       │    │    │   - Alerts           │
        │   - Logging          │    │    │   - Webhooks         │
        └──────────────────────┘    │    └──────────────────────┘
```

### **2. DETALLE DE MICROSERVICIOS**

#### **🔐 AUTH SERVICE**
```typescript
// Autenticación y Autorización
interface AuthService {
  // Autenticación
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  logout(token: string): Promise<void>;
  refreshToken(refreshToken: string): Promise<AuthResponse>;
  
  // Autorización
  validateToken(token: string): Promise<TokenValidation>;
  checkPermission(userId: string, resource: string, action: string): Promise<boolean>;
  
  // MFA
  setupMFA(userId: string): Promise<MFASetup>;
  verifyMFA(userId: string, code: string): Promise<boolean>;
  
  // Gestión de sesiones
  createSession(userId: string, deviceInfo: DeviceInfo): Promise<Session>;
  invalidateSession(sessionId: string): Promise<void>;
}
```

#### **👥 USER SERVICE**
```typescript
// Gestión de Usuarios
interface UserService {
  // CRUD Usuarios
  createUser(userData: CreateUserRequest): Promise<User>;
  updateUser(userId: string, userData: UpdateUserRequest): Promise<User>;
  deleteUser(userId: string): Promise<void>;
  getUser(userId: string): Promise<User>;
  listUsers(filters: UserFilters): Promise<User[]>;
  
  // Roles y Permisos
  assignRole(userId: string, roleId: string): Promise<void>;
  removeRole(userId: string, roleId: string): Promise<void>;
  getUserRoles(userId: string): Promise<Role[]>;
  
  // Perfiles
  updateProfile(userId: string, profile: UserProfile): Promise<UserProfile>;
  getProfile(userId: string): Promise<UserProfile>;
}
```

#### **🧪 SAMPLE SERVICE**
```typescript
// Gestión de Muestras
interface SampleService {
  // CRUD Muestras
  createSample(sampleData: CreateSampleRequest): Promise<Sample>;
  updateSample(sampleId: string, sampleData: UpdateSampleRequest): Promise<Sample>;
  deleteSample(sampleId: string): Promise<void>;
  getSample(sampleId: string): Promise<Sample>;
  listSamples(filters: SampleFilters): Promise<Sample[]>;
  
  // Cadena de Custodia
  trackSample(sampleId: string, action: SampleAction): Promise<TrackingRecord>;
  getSampleHistory(sampleId: string): Promise<TrackingRecord[]>;
  
  // Inventario
  addToInventory(sampleId: string, location: string): Promise<void>;
  removeFromInventory(sampleId: string): Promise<void>;
  getInventoryStatus(location?: string): Promise<InventoryStatus[]>;
  
  // Códigos de Barras
  generateBarcode(sampleId: string): Promise<Barcode>;
  scanBarcode(barcode: string): Promise<Sample>;
}
```

#### **🔬 ASSAY SERVICE**
```typescript
// Gestión de Ensayos
interface AssayService {
  // CRUD Ensayos
  createAssay(assayData: CreateAssayRequest): Promise<Assay>;
  updateAssay(assayId: string, assayData: UpdateAssayRequest): Promise<Assay>;
  deleteAssay(assayId: string): Promise<void>;
  getAssay(assayId: string): Promise<Assay>;
  listAssays(filters: AssayFilters): Promise<Assay[]>;
  
  // Ejecución de Ensayos
  startAssay(assayId: string, analystId: string): Promise<void>;
  recordResult(assayId: string, result: AssayResult): Promise<void>;
  completeAssay(assayId: string): Promise<void>;
  
  // Métodos
  createMethod(methodData: CreateMethodRequest): Promise<Method>;
  updateMethod(methodId: string, methodData: UpdateMethodRequest): Promise<Method>;
  validateMethod(methodId: string): Promise<ValidationResult>;
  
  // Control de Calidad
  addQualityControl(assayId: string, qcData: QualityControlData): Promise<void>;
  evaluateQualityControl(qcId: string): Promise<QCEvaluation>;
}
```

#### **⚙️ EQUIPMENT SERVICE**
```typescript
// Gestión de Equipos
interface EquipmentService {
  // CRUD Equipos
  createEquipment(equipmentData: CreateEquipmentRequest): Promise<Equipment>;
  updateEquipment(equipmentId: string, equipmentData: UpdateEquipmentRequest): Promise<Equipment>;
  deleteEquipment(equipmentId: string): Promise<void>;
  getEquipment(equipmentId: string): Promise<Equipment>;
  listEquipment(filters: EquipmentFilters): Promise<Equipment[]>;
  
  // Mantenimiento
  scheduleMaintenance(equipmentId: string, maintenance: MaintenanceSchedule): Promise<void>;
  recordMaintenance(equipmentId: string, maintenance: MaintenanceRecord): Promise<void>;
  getMaintenanceHistory(equipmentId: string): Promise<MaintenanceRecord[]>;
  
  // Estado
  updateStatus(equipmentId: string, status: EquipmentStatus): Promise<void>;
  getStatus(equipmentId: string): Promise<EquipmentStatus>;
}
```

#### **🔧 CALIBRATION SERVICE**
```typescript
// Gestión de Calibración
interface CalibrationService {
  // Calibración
  scheduleCalibration(equipmentId: string, calibration: CalibrationSchedule): Promise<void>;
  recordCalibration(equipmentId: string, calibration: CalibrationRecord): Promise<void>;
  getCalibrationHistory(equipmentId: string): Promise<CalibrationRecord[]>;
  
  // Verificaciones Intermedias
  scheduleVerification(equipmentId: string, verification: VerificationSchedule): Promise<void>;
  recordVerification(equipmentId: string, verification: VerificationRecord): Promise<void>;
  
  // Patrones de Referencia
  createStandard(standardData: CreateStandardRequest): Promise<Standard>;
  updateStandard(standardId: string, standardData: UpdateStandardRequest): Promise<Standard>;
  getStandard(standardId: string): Promise<Standard>;
  
  // Trazabilidad
  establishTraceability(equipmentId: string, traceability: TraceabilityData): Promise<void>;
  getTraceability(equipmentId: string): Promise<TraceabilityChain>;
}
```

#### **✅ QUALITY SERVICE**
```typescript
// Gestión de Calidad
interface QualityService {
  // No Conformidades
  createNonConformity(ncData: CreateNonConformityRequest): Promise<NonConformity>;
  updateNonConformity(ncId: string, ncData: UpdateNonConformityRequest): Promise<NonConformity>;
  closeNonConformity(ncId: string, resolution: NonConformityResolution): Promise<void>;
  
  // Acciones Correctivas
  createCorrectiveAction(caData: CreateCorrectiveActionRequest): Promise<CorrectiveAction>;
  updateCorrectiveAction(caId: string, caData: UpdateCorrectiveActionRequest): Promise<CorrectiveAction>;
  verifyCorrectiveAction(caId: string, verification: CorrectiveActionVerification): Promise<void>;
  
  // Quejas
  createComplaint(complaintData: CreateComplaintRequest): Promise<Complaint>;
  investigateComplaint(complaintId: string, investigation: ComplaintInvestigation): Promise<void>;
  resolveComplaint(complaintId: string, resolution: ComplaintResolution): Promise<void>;
  
  // Auditorías Internas
  scheduleAudit(auditData: AuditSchedule): Promise<Audit>;
  conductAudit(auditId: string, findings: AuditFindings[]): Promise<void>;
  closeAudit(auditId: string, report: AuditReport): Promise<void>;
}
```

#### **📊 REPORTING SERVICE**
```typescript
// Generación de Reportes
interface ReportingService {
  // Certificados de Análisis
  generateCertificate(assayId: string, template: string): Promise<Certificate>;
  approveCertificate(certificateId: string, approverId: string): Promise<void>;
  issueCertificate(certificateId: string): Promise<IssuedCertificate>;
  
  // Reportes Personalizados
  createReport(reportData: CreateReportRequest): Promise<Report>;
  generateReport(reportId: string, parameters: ReportParameters): Promise<GeneratedReport>;
  scheduleReport(reportId: string, schedule: ReportSchedule): Promise<void>;
  
  // Análisis y Tendencias
  generateAnalytics(parameters: AnalyticsParameters): Promise<AnalyticsResult>;
  createDashboard(dashboardData: CreateDashboardRequest): Promise<Dashboard>;
  updateDashboard(dashboardId: string, dashboardData: UpdateDashboardRequest): Promise<Dashboard>;
}
```

#### **🔍 AUDIT SERVICE**
```typescript
// Auditoría y Trazabilidad
interface AuditService {
  // Registro de Auditoría
  logAction(action: AuditAction): Promise<void>;
  getAuditTrail(filters: AuditFilters): Promise<AuditRecord[]>;
  
  // Cumplimiento
  checkCompliance(complianceCheck: ComplianceCheck): Promise<ComplianceResult>;
  generateComplianceReport(parameters: ComplianceReportParameters): Promise<ComplianceReport>;
  
  // Integridad de Datos
  validateDataIntegrity(dataIntegrityCheck: DataIntegrityCheck): Promise<DataIntegrityResult>;
  generateIntegrityReport(parameters: IntegrityReportParameters): Promise<IntegrityReport>;
}
```

#### **🔔 NOTIFICATION SERVICE**
```typescript
// Notificaciones y Alertas
interface NotificationService {
  // Notificaciones
  sendNotification(notification: NotificationRequest): Promise<void>;
  sendEmail(emailData: EmailRequest): Promise<void>;
  sendSMS(smsData: SMSRequest): Promise<void>;
  
  // Alertas
  createAlert(alertData: CreateAlertRequest): Promise<Alert>;
  triggerAlert(alertId: string, context: AlertContext): Promise<void>;
  acknowledgeAlert(alertId: string, userId: string): Promise<void>;
  
  // Webhooks
  registerWebhook(webhookData: WebhookRegistration): Promise<Webhook>;
  triggerWebhook(webhookId: string, payload: any): Promise<void>;
}
```

## 🗄️ **BASE DE DATOS DISTRIBUIDA**

### **Patrón de Base de Datos por Microservicio**

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE PER SERVICE                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   AUTH DB   │ │  USER DB    │ │ SAMPLE DB   │ │ ASSAY DB    │
│ PostgreSQL  │ │ PostgreSQL  │ │ PostgreSQL  │ │ PostgreSQL  │
│ - Users     │ │ - Profiles  │ │ - Samples   │ │ - Assays    │
│ - Sessions  │ │ - Roles     │ │ - Tracking  │ │ - Methods   │
│ - Tokens    │ │ - Perms     │ │ - Inventory │ │ - Results   │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘

┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ EQUIPMENT DB│ │CALIBRATION DB│ │ QUALITY DB  │ │ REPORTING DB│
│ PostgreSQL  │ │ PostgreSQL  │ │ PostgreSQL  │ │ PostgreSQL  │
│ - Equipment │ │ - Calibration│ │ - NonConf   │ │ - Reports   │
│ - Maintenance│ │ - Standards │ │ - Actions   │ │ - Templates │
│ - Status    │ │ - Traceability│ │ - Complaints│ │ - Analytics │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘

┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  AUDIT DB   │ │NOTIFICATION DB│ │  CACHE DB   │ │  QUEUE DB   │
│ PostgreSQL  │ │ PostgreSQL  │ │   Redis     │ │   RabbitMQ  │
│ - AuditLog  │ │ - Notifications│ │ - Sessions │ │ - Messages │
│ - Compliance│ │ - Alerts    │ │ - Cache     │ │ - Events    │
│ - Integrity │ │ - Webhooks  │ │ - Locks     │ │ - Tasks     │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

## 🔄 **COMUNICACIÓN ENTRE SERVICIOS**

### **Patrones de Comunicación**

#### **1. Síncrona (HTTP/gRPC)**
```typescript
// Comunicación síncrona para operaciones críticas
interface SyncCommunication {
  // gRPC para alta performance
  equipmentService: {
    getEquipmentStatus(equipmentId: string): Promise<EquipmentStatus>;
    validateCalibration(equipmentId: string): Promise<ValidationResult>;
  };
  
  // HTTP REST para operaciones estándar
  sampleService: {
    getSample(sampleId: string): Promise<Sample>;
    updateSampleStatus(sampleId: string, status: SampleStatus): Promise<void>;
  };
}
```

#### **2. Asíncrona (Event-Driven)**
```typescript
// Comunicación asíncrona para eventos
interface AsyncCommunication {
  // Eventos de dominio
  events: {
    'sample.created': SampleCreatedEvent;
    'assay.completed': AssayCompletedEvent;
    'equipment.calibration.due': CalibrationDueEvent;
    'quality.nonconformity.created': NonConformityCreatedEvent;
  };
  
  // Comandos
  commands: {
    'schedule.calibration': ScheduleCalibrationCommand;
    'generate.certificate': GenerateCertificateCommand;
    'send.notification': SendNotificationCommand;
  };
}
```

### **Message Broker (RabbitMQ)**
```yaml
# Configuración de RabbitMQ
rabbitmq:
  exchanges:
    - name: polilims.events
      type: topic
      durable: true
    - name: polilims.commands
      type: direct
      durable: true
  
  queues:
    - name: sample.events
      exchange: polilims.events
      routing_key: sample.*
    - name: assay.events
      exchange: polilims.events
      routing_key: assay.*
    - name: equipment.events
      exchange: polilims.events
      routing_key: equipment.*
    - name: quality.events
      exchange: polilims.events
      routing_key: quality.*
```

## 🐳 **CONTAINERIZACIÓN Y ORQUESTACIÓN**

### **Docker Compose para Desarrollo**
```yaml
version: '3.8'

services:
  # API Gateway
  api-gateway:
    image: kong:latest
    ports:
      - "8000:8000"
      - "8443:8443"
    environment:
      KONG_DATABASE: postgres
      KONG_PG_HOST: postgres
    depends_on:
      - postgres

  # Microservicios
  auth-service:
    build: ./services/auth
    ports:
      - "3001:3000"
    environment:
      DATABASE_URL: postgresql://user:pass@auth-db:5432/auth
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - auth-db

  user-service:
    build: ./services/user
    ports:
      - "3002:3000"
    environment:
      DATABASE_URL: postgresql://user:pass@user-db:5432/user
    depends_on:
      - user-db

  sample-service:
    build: ./services/sample
    ports:
      - "3003:3000"
    environment:
      DATABASE_URL: postgresql://user:pass@sample-db:5432/sample
    depends_on:
      - sample-db

  assay-service:
    build: ./services/assay
    ports:
      - "3004:3000"
    environment:
      DATABASE_URL: postgresql://user:pass@assay-db:5432/assay
    depends_on:
      - assay-db

  equipment-service:
    build: ./services/equipment
    ports:
      - "3005:3000"
    environment:
      DATABASE_URL: postgresql://user:pass@equipment-db:5432/equipment
    depends_on:
      - equipment-db

  calibration-service:
    build: ./services/calibration
    ports:
      - "3006:3000"
    environment:
      DATABASE_URL: postgresql://user:pass@calibration-db:5432/calibration
    depends_on:
      - calibration-db

  quality-service:
    build: ./services/quality
    ports:
      - "3007:3000"
    environment:
      DATABASE_URL: postgresql://user:pass@quality-db:5432/quality
    depends_on:
      - quality-db

  reporting-service:
    build: ./services/reporting
    ports:
      - "3008:3000"
    environment:
      DATABASE_URL: postgresql://user:pass@reporting-db:5432/reporting
    depends_on:
      - reporting-db

  audit-service:
    build: ./services/audit
    ports:
      - "3009:3000"
    environment:
      DATABASE_URL: postgresql://user:pass@audit-db:5432/audit
    depends_on:
      - audit-db

  notification-service:
    build: ./services/notification
    ports:
      - "3010:3000"
    environment:
      DATABASE_URL: postgresql://user:pass@notification-db:5432/notification
    depends_on:
      - notification-db

  # Bases de datos
  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data

  auth-db:
    image: postgres:15
    environment:
      POSTGRES_DB: auth
      POSTGRES_PASSWORD: postgres
    volumes:
      - auth_data:/var/lib/postgresql/data

  user-db:
    image: postgres:15
    environment:
      POSTGRES_DB: user
      POSTGRES_PASSWORD: postgres
    volumes:
      - user_data:/var/lib/postgresql/data

  sample-db:
    image: postgres:15
    environment:
      POSTGRES_DB: sample
      POSTGRES_PASSWORD: postgres
    volumes:
      - sample_data:/var/lib/postgresql/data

  assay-db:
    image: postgres:15
    environment:
      POSTGRES_DB: assay
      POSTGRES_PASSWORD: postgres
    volumes:
      - assay_data:/var/lib/postgresql/data

  equipment-db:
    image: postgres:15
    environment:
      POSTGRES_DB: equipment
      POSTGRES_PASSWORD: postgres
    volumes:
      - equipment_data:/var/lib/postgresql/data

  calibration-db:
    image: postgres:15
    environment:
      POSTGRES_DB: calibration
      POSTGRES_PASSWORD: postgres
    volumes:
      - calibration_data:/var/lib/postgresql/data

  quality-db:
    image: postgres:15
    environment:
      POSTGRES_DB: quality
      POSTGRES_PASSWORD: postgres
    volumes:
      - quality_data:/var/lib/postgresql/data

  reporting-db:
    image: postgres:15
    environment:
      POSTGRES_DB: reporting
      POSTGRES_PASSWORD: postgres
    volumes:
      - reporting_data:/var/lib/postgresql/data

  audit-db:
    image: postgres:15
    environment:
      POSTGRES_DB: audit
      POSTGRES_PASSWORD: postgres
    volumes:
      - audit_data:/var/lib/postgresql/data

  notification-db:
    image: postgres:15
    environment:
      POSTGRES_DB: notification
      POSTGRES_PASSWORD: postgres
    volumes:
      - notification_data:/var/lib/postgresql/data

  # Message Broker
  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: admin

  # Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  # Monitoreo
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin

volumes:
  postgres_data:
  auth_data:
  user_data:
  sample_data:
  assay_data:
  equipment_data:
  calibration_data:
  quality_data:
  reporting_data:
  audit_data:
  notification_data:
```

### **Kubernetes para Producción**
```yaml
# Configuración de Kubernetes
apiVersion: v1
kind: Namespace
metadata:
  name: polilims

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
  namespace: polilims
spec:
  replicas: 3
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
      - name: auth-service
        image: polilims/auth-service:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: auth-db-secret
              key: url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: jwt-secret
              key: secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: auth-service
  namespace: polilims
spec:
  selector:
    app: auth-service
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP
```

## 📊 **MONITOREO Y OBSERVABILIDAD**

### **Stack de Monitoreo**
```yaml
# Prometheus Configuration
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "polilims_rules.yml"

scrape_configs:
  - job_name: 'polilims-services'
    static_configs:
      - targets: ['auth-service:3000', 'user-service:3000', 'sample-service:3000']
    metrics_path: /metrics
    scrape_interval: 10s

  - job_name: 'polilims-databases'
    static_configs:
      - targets: ['postgres:5432']
    metrics_path: /metrics

  - job_name: 'polilims-message-broker'
    static_configs:
      - targets: ['rabbitmq:15692']
    metrics_path: /metrics
```

### **Métricas Clave (KPIs)**
```typescript
// Métricas de rendimiento
interface PerformanceMetrics {
  // Latencia
  responseTime: {
    p50: number; // ms
    p95: number; // ms
    p99: number; // ms
  };
  
  // Throughput
  requestsPerSecond: number;
  transactionsPerSecond: number;
  
  // Disponibilidad
  uptime: number; // porcentaje
  errorRate: number; // porcentaje
  
  // Recursos
  cpuUsage: number; // porcentaje
  memoryUsage: number; // porcentaje
  diskUsage: number; // porcentaje
}

// Métricas de negocio
interface BusinessMetrics {
  // Ensayos
  assaysCompleted: number;
  assaysInProgress: number;
  averageTurnaroundTime: number; // horas
  
  // Calidad
  nonConformities: number;
  correctiveActions: number;
  customerComplaints: number;
  
  // Equipos
  equipmentUtilization: number; // porcentaje
  calibrationsDue: number;
  maintenanceScheduled: number;
}
```

## 🔒 **SEGURIDAD**

### **Autenticación y Autorización**
```typescript
// JWT Token Structure
interface JWTPayload {
  sub: string; // User ID
  iss: string; // Issuer (PoliLims)
  aud: string; // Audience
  exp: number; // Expiration
  iat: number; // Issued at
  nbf: number; // Not before
  jti: string; // JWT ID
  scope: string[]; // Permissions
  roles: string[]; // User roles
}

// OAuth2 Configuration
interface OAuth2Config {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
  authorizationEndpoint: string;
  tokenEndpoint: string;
  userInfoEndpoint: string;
}
```

### **Cifrado y Seguridad de Datos**
```typescript
// Data Encryption
interface EncryptionConfig {
  algorithm: 'AES-256-GCM';
  keyRotation: 90; // días
  hardwareSecurityModule: boolean;
  keyManagement: {
    provider: 'AWS KMS' | 'Azure Key Vault' | 'Google Cloud KMS';
    region: string;
    keyId: string;
  };
}

// Network Security
interface NetworkSecurity {
  tls: {
    version: '1.3';
    cipherSuites: string[];
    certificates: 'Let\'s Encrypt' | 'Custom';
  };
  firewall: {
    allowedIPs: string[];
    rateLimiting: {
      requestsPerMinute: number;
      burstSize: number;
    };
  };
}
```

## 🚀 **DESPLIEGUE Y CI/CD**

### **Pipeline de CI/CD**
```yaml
# GitHub Actions Workflow
name: PoliLims CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linting
      run: npm run lint
    
    - name: Run security scan
      run: npm audit

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Build Docker images
      run: |
        docker build -t polilims/auth-service:latest ./services/auth
        docker build -t polilims/user-service:latest ./services/user
        docker build -t polilims/sample-service:latest ./services/sample
        docker build -t polilims/assay-service:latest ./services/assay
        docker build -t polilims/equipment-service:latest ./services/equipment
        docker build -t polilims/calibration-service:latest ./services/calibration
        docker build -t polilims/quality-service:latest ./services/quality
        docker build -t polilims/reporting-service:latest ./services/reporting
        docker build -t polilims/audit-service:latest ./services/audit
        docker build -t polilims/notification-service:latest ./services/notification

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Kubernetes
      run: |
        kubectl apply -f k8s/
        kubectl rollout restart deployment -n polilims
```

Esta arquitectura de microservicios garantiza que PoliLims sea escalable, mantenible y cumpla con todos los requisitos de ISO/IEC 17025 para la acreditación del laboratorio.
