// Servicio de IA gratuito usando APIs públicas
export interface AIResponse {
  success: boolean;
  data?: string;
  error?: string;
}

export interface AIConfig {
  model: string;
  maxTokens: number;
  temperature: number;
}

// Configuraciones predefinidas para diferentes tipos de tareas
export const AI_CONFIGS = {
  CHAT: {
    model: "gpt2",
    maxTokens: 150,
    temperature: 0.7,
  },
  CODE: {
    model: "codellama/CodeLlama-7b-hf",
    maxTokens: 200,
    temperature: 0.3,
  },
  ANALYSIS: {
    model: "gpt2",
    maxTokens: 100,
    temperature: 0.5,
  },
} as const;

// API gratuita de Hugging Face (requiere token gratuito)
const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models";

// Función para generar respuestas usando IA gratuita
export async function generateAIResponse(
  prompt: string,
  config: AIConfig = AI_CONFIGS.CHAT
): Promise<AIResponse> {
  try {
    // Para desarrollo, usamos respuestas simuladas
    // En producción, puedes usar una API gratuita real
    return await simulateAIResponse(prompt, config);
  } catch (error) {
    console.error("Error en generación de IA:", error);
    return {
      success: false,
      error: "Error al generar respuesta de IA",
    };
  }
}

// Simulación de respuesta de IA para desarrollo
async function simulateAIResponse(
  prompt: string,
  config: AIConfig
): Promise<AIResponse> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  const lowerPrompt = prompt.toLowerCase();

  // Respuestas específicas para el laboratorio
  const labResponses = {
    // Ensayos específicos
    meltIndex: [
      "El ensayo de Melt Index (Índice de Fluidez) se realiza a una temperatura de **190°C ± 0.5°C** para materiales HDPE y PP. El peso estándar es de 2.16 kg, aunque también se puede usar 5.0 kg para materiales de alto peso molecular. El tiempo de precalentamiento es de 6 minutos.",
      "Para el ensayo de Melt Index en tuberías HDPE, la temperatura de trabajo es **190°C** con un peso de 2.16 kg. El material debe estar completamente seco y el tiempo de estabilización es de 6 minutos antes de comenzar la medición.",
      "El Melt Index se determina a **190°C** según la norma ASTM D1238. El procedimiento incluye: precalentamiento del material por 6 minutos, aplicación del peso de 2.16 kg, y corte de muestras cada 10 segundos durante 2 minutos."
    ],
    
    densidad: [
      "La densidad de materiales plásticos se determina mediante el método de inmersión en líquido según ASTM D792. Se utiliza agua destilada a **23°C ± 0.5°C** como medio de inmersión. El cálculo se realiza usando la fórmula: ρ = (a × ρw) / (a + w - b), donde 'a' es el peso en aire, 'w' es el peso del hilo, y 'b' es el peso en agua.",
      "Para ensayos de densidad en tuberías, la temperatura del baño de agua debe mantenerse a **23°C ± 0.5°C**. El material debe estar libre de burbujas y el tiempo de inmersión mínimo es de 30 segundos antes de la lectura.",
      "La densidad se mide a **23°C** usando el método de desplazamiento de agua. Es importante que las muestras estén completamente secas y libres de burbujas de aire para obtener resultados precisos."
    ],
    
    traccion: [
      "El ensayo de resistencia a la tracción se realiza según ASTM D638. La velocidad de ensayo es de **50 mm/min ± 10%** y la temperatura ambiente debe ser de **23°C ± 2°C**. Las probetas tipo I se utilizan para materiales con espesor mayor a 1 mm.",
      "Para resistencia a la tracción en tuberías, la velocidad de ensayo es **50 mm/min** y la temperatura de trabajo es **23°C ± 2°C**. Las probetas se cortan en dirección longitudinal y transversal según el tipo de ensayo requerido.",
      "El ensayo de tracción se ejecuta a **50 mm/min** de velocidad de separación de mordazas. La temperatura del laboratorio debe mantenerse a **23°C ± 2°C** y la humedad relativa entre 40-60%."
    ],
    
    presionHidrostatica: [
      "El ensayo de presión hidrostática se realiza según ASTM D1598. La temperatura del agua debe ser de **23°C ± 2°C** y la presión se aplica gradualmente hasta alcanzar el valor de prueba. El tiempo de ensayo varía según el tipo de tubería: 1000 horas para HDPE y 100 horas para PP.",
      "Para presión hidrostática en tuberías HDPE, la temperatura del medio es **23°C ± 2°C**. La presión se mantiene constante durante 1000 horas y se registra cualquier falla o deformación significativa.",
      "El ensayo de presión hidrostática requiere agua a **23°C ± 2°C**. La presión se aplica de forma continua y se monitorea durante todo el período de ensayo para detectar fallas prematuras."
    ],
    
    // Análisis de datos
    analysis: [
      "Basándome en los datos del laboratorio, observo una tendencia positiva en la calidad de los ensayos. Los resultados muestran una mejora del 15% en la precisión de las mediciones.",
      "El análisis de los datos de control de calidad indica que todos los parámetros están dentro de los límites especificados. La desviación estándar se mantiene por debajo del 2%.",
      "Los datos de los últimos 30 días muestran una estabilidad excelente en los procesos. Recomiendo continuar con los protocolos actuales.",
      "Se detecta una ligera variación en los resultados de la semana pasada. Sugiero revisar la calibración de los equipos y verificar los estándares de referencia."
    ],
    
    // Generación de código
    code: [
      "```typescript\n// Función para validación automática de resultados de ensayos\nfunction validateAssayResults(results: AssayResult[]): ValidationReport {\n  const validResults = results.filter(result => {\n    return result.temperature >= 20 && result.temperature <= 25 &&\n           result.ph >= 6.5 && result.ph <= 7.5 &&\n           result.concentration > 0;\n  });\n  \n  return {\n    total: results.length,\n    valid: validResults.length,\n    invalid: results.length - validResults.length,\n    confidence: (validResults.length / results.length) * 100\n  };\n}\n```",
      
      "```javascript\n// Optimización del proceso de análisis de muestras\nconst optimizeSampleAnalysis = (samples) => {\n  return samples\n    .filter(sample => sample.status === 'pending')\n    .sort((a, b) => a.priority - b.priority)\n    .map(sample => ({\n      ...sample,\n      estimatedTime: calculateProcessingTime(sample.type),\n      assignedTo: getAvailableTechnician()\n    }));\n};\n```",
      
      "```python\n# Script para análisis estadístico de datos de laboratorio\nimport pandas as pd\nimport numpy as np\nfrom scipy import stats\n\ndef analyze_lab_data(data):\n    df = pd.DataFrame(data)\n    \n    # Análisis de tendencias\n    trend_analysis = df.groupby('date')['value'].agg(['mean', 'std'])\n    \n    # Detección de outliers\n    z_scores = np.abs(stats.zscore(df['value']))\n    outliers = df[z_scores > 3]\n    \n    return {\n        'trend': trend_analysis,\n        'outliers': outliers,\n        'summary_stats': df['value'].describe()\n    }\n```"
    ],
    
    // Optimización de procesos
    optimization: [
      "Para optimizar el proceso de análisis de muestras, recomiendo implementar un sistema de priorización automática basado en la urgencia y tipo de ensayo. Esto reduciría el tiempo de procesamiento en un 25%.",
      "La automatización de la preparación de reactivos podría ahorrar hasta 2 horas diarias. Sugiero implementar un sistema de dispensación automática con control de calidad integrado.",
      "El análisis de flujo de trabajo muestra que el cuello de botella está en la validación manual. Implementar validación automática con alertas inteligentes mejoraría la eficiencia en un 40%.",
      "Recomiendo establecer un sistema de control estadístico de procesos (SPC) para detectar tendencias y variaciones antes de que afecten la calidad de los resultados."
    ],
    
    // Control de calidad
    quality: [
      "Los estándares de calidad ISO 17025 requieren documentación completa de todos los procedimientos. Asegúrate de mantener actualizados los manuales de calidad y procedimientos operativos.",
      "Para el control de calidad, implementa un sistema de trazabilidad completo que incluya: identificación única de muestras, registro de condiciones ambientales, y validación de resultados por personal autorizado.",
      "El control de calidad debe incluir verificaciones diarias de equipos, calibración regular según cronograma, y participación en programas de intercomparación.",
      "Establece límites de control estadístico para cada tipo de ensayo y monitorea las tendencias para detectar desviaciones antes de que afecten los resultados."
    ],
    
    // Protocolos y procedimientos
    protocols: [
      "El protocolo estándar para análisis de muestras incluye: identificación y registro, preparación según especificaciones, análisis con controles de calidad, validación de resultados, y reporte final.",
      "Para el manejo de muestras críticas, sigue el protocolo de cadena de custodia: registro de recepción, almacenamiento en condiciones controladas, análisis por personal autorizado, y archivo seguro de resultados.",
      "Los procedimientos de calibración deben realizarse según el cronograma establecido, usando estándares certificados y documentando todas las mediciones para garantizar la trazabilidad.",
      "El protocolo de validación de métodos incluye: verificación de especificidad, linealidad, precisión, exactitud, límites de detección y cuantificación, y robustez del método."
    ],
    
    // General
    general: [
      "Como asistente de IA para PoliLims, puedo ayudarte con análisis de datos, generación de código, optimización de procesos, y consultas sobre control de calidad y protocolos del laboratorio.",
      "El sistema PoliLims está diseñado para maximizar la eficiencia del laboratorio. ¿En qué área específica necesitas asistencia?",
      "Para obtener el mejor rendimiento del sistema, asegúrate de mantener actualizados los datos de equipos, personal, y procedimientos en la base de datos.",
      "La integración de todos los módulos del sistema permite un flujo de trabajo optimizado desde la recepción de muestras hasta la generación de reportes finales."
    ]
  };

  // Determinar el tipo de respuesta basado en el prompt
  let responseType = "general";
  
  // Ensayos específicos
  if (lowerPrompt.includes("melt index") || lowerPrompt.includes("índice de fluidez") || lowerPrompt.includes("melt")) {
    responseType = "meltIndex";
  } else if (lowerPrompt.includes("densidad") || lowerPrompt.includes("density")) {
    responseType = "densidad";
  } else if (lowerPrompt.includes("tracción") || lowerPrompt.includes("tensile") || lowerPrompt.includes("resistencia")) {
    responseType = "traccion";
  } else if (lowerPrompt.includes("presión hidrostática") || lowerPrompt.includes("hidrostática") || lowerPrompt.includes("pressure")) {
    responseType = "presionHidrostatica";
  } else if (lowerPrompt.includes("análisis") || lowerPrompt.includes("analysis") || lowerPrompt.includes("datos") || lowerPrompt.includes("tendencias")) {
    responseType = "analysis";
  } else if (lowerPrompt.includes("código") || lowerPrompt.includes("code") || lowerPrompt.includes("programa") || lowerPrompt.includes("script")) {
    responseType = "code";
  } else if (lowerPrompt.includes("optimizar") || lowerPrompt.includes("optimización") || lowerPrompt.includes("eficiencia") || lowerPrompt.includes("proceso")) {
    responseType = "optimization";
  } else if (lowerPrompt.includes("calidad") || lowerPrompt.includes("control") || lowerPrompt.includes("iso") || lowerPrompt.includes("estándar")) {
    responseType = "quality";
  } else if (lowerPrompt.includes("protocolo") || lowerPrompt.includes("procedimiento") || lowerPrompt.includes("método") || lowerPrompt.includes("manual")) {
    responseType = "protocols";
  }

  const responseArray = labResponses[responseType as keyof typeof labResponses];
  const randomResponse = responseArray[Math.floor(Math.random() * responseArray.length)];

  return {
    success: true,
    data: randomResponse,
  };
}

// Función para análisis de datos del laboratorio
export async function analyzeLabData(data: any[]): Promise<AIResponse> {
  const prompt = `Analiza los siguientes datos del laboratorio y proporciona insights: ${JSON.stringify(data)}`;
  return generateAIResponse(prompt, AI_CONFIGS.ANALYSIS);
}

// Función para generar código de optimización
export async function generateOptimizationCode(requirement: string): Promise<AIResponse> {
  const prompt = `Genera código optimizado para: ${requirement}`;
  return generateAIResponse(prompt, AI_CONFIGS.CODE);
}

// Función para asistencia general del laboratorio
export async function getLabAssistantResponse(question: string): Promise<AIResponse> {
  const prompt = `Pregunta sobre laboratorio: ${question}`;
  return generateAIResponse(prompt, AI_CONFIGS.CHAT);
}

// Función para optimización de procesos
export async function getProcessOptimization(process: string): Promise<AIResponse> {
  const prompt = `Optimización de proceso: ${process}`;
  return generateAIResponse(prompt, AI_CONFIGS.ANALYSIS);
}

// Función para consultas de control de calidad
export async function getQualityControlAdvice(topic: string): Promise<AIResponse> {
  const prompt = `Control de calidad: ${topic}`;
  return generateAIResponse(prompt, AI_CONFIGS.CHAT);
}
