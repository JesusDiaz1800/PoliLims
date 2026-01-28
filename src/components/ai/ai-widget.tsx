"use client";

import { useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Sparkles, 
  Send, 
  Loader2,
  Brain,
  Zap
} from "lucide-react";
import { getLabAssistantResponse } from "@/services/ai-service";

interface AIWidgetProps {
  className?: string;
}

export function AIWidget({ className }: AIWidgetProps) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await getLabAssistantResponse(inputValue);
      if (response.success && response.data) {
        setLastResponse(response.data);
      }
    } catch (error) {
      setLastResponse("Lo siento, no pude procesar tu consulta. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    "¿Cómo optimizar procesos?",
    "Análisis de datos",
    "Control de calidad"
  ];

  return (
    <div className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Bot className="h-5 w-5 text-primary" />
          <span>Asistente IA</span>
          <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Prompts */}
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setInputValue(prompt)}
            >
              <Zap className="h-3 w-3 mr-1" />
              {prompt}
            </Button>
          ))}
        </div>

        {/* Input */}
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Pregunta al asistente..."
            disabled={isLoading}
            className="flex-1 text-sm"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || isLoading}
            size="icon"
            className="h-9 w-9"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Response */}
        {lastResponse && (
          <div className="bg-muted rounded-lg p-3 text-sm">
            <div className="flex items-start space-x-2">
              <Brain className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <Badge variant="secondary" className="text-xs">Respuesta IA</Badge>
                <p className="text-sm leading-relaxed">{lastResponse}</p>
              </div>
            </div>
          </div>
        )}

        {/* Status */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>IA Funcional</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Online</span>
          </div>
        </div>
      </CardContent>
    </div>
  );
}
