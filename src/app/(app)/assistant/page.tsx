"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Sparkles, 
  Code, 
  BarChart3, 
  MessageSquare, 
  Lightbulb,
  Zap,
  Brain
} from "lucide-react";
import { AIChat } from "@/components/ai/ai-chat";

const aiFeatures = [
  {
    icon: <Code className="h-6 w-6" />,
    title: "Generación de Código",
    description: "Obtén código optimizado para análisis de datos y automatización de procesos del laboratorio.",
    color: "text-blue-500"
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Análisis de Datos",
    description: "Análisis inteligente de resultados de ensayos y tendencias de calidad.",
    color: "text-green-500"
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Asistencia General",
    description: "Responde preguntas sobre protocolos, estándares y mejores prácticas del laboratorio.",
    color: "text-purple-500"
  },
  {
    icon: <Lightbulb className="h-6 w-6" />,
    title: "Optimización",
    description: "Sugerencias para mejorar la eficiencia y calidad de los procesos del laboratorio.",
    color: "text-yellow-500"
  }
];

const quickPrompts = [
  "¿Cómo optimizar el proceso de análisis de muestras?",
  "Genera código para validar datos de ensayos",
  "Analiza las tendencias de calidad del último mes",
  "¿Cuáles son las mejores prácticas para control de calidad?"
];

export default function AssistantPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Bot className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold">Asistente IA - PoliLims</h1>
          <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Tu compañero inteligente para optimizar procesos, generar código y analizar datos del laboratorio
        </p>
        <Button 
          onClick={() => setIsChatOpen(true)}
          size="lg"
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          <Brain className="h-5 w-5 mr-2" />
          Iniciar Conversación
        </Button>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {aiFeatures.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className={`mx-auto mb-2 ${feature.color}`}>
                {feature.icon}
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Prompts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Preguntas Rápidas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start text-left h-auto p-4"
                onClick={() => {
                  setIsChatOpen(true);
                  // Aquí podrías pasar el prompt al chat
                }}
              >
                <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm">{prompt}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">100%</p>
                <p className="text-sm text-muted-foreground">Funcional</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500/10 rounded-full">
                <Zap className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">Instantáneo</p>
                <p className="text-sm text-muted-foreground">Respuesta</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500/10 rounded-full">
                <Brain className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">IA</p>
                <p className="text-sm text-muted-foreground">Inteligente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Modal */}
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
