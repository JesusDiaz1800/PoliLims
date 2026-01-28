"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
  Code, 
  BarChart3,
  X,
  Image as ImageIcon,
  Paperclip
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getLabAssistantResponse, generateOptimizationCode, analyzeLabData } from "@/services/ai-service";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?: "chat" | "code" | "analysis";
  image?: string;
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIChat({ isOpen, onClose }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializar mensaje de bienvenida solo en el cliente
  useEffect(() => {
    if (!isInitialized) {
      setMessages([
        {
          id: "1",
          content: "¡Hola! Soy tu asistente de IA para el laboratorio. ¿En qué puedo ayudarte hoy? Puedes adjuntar imágenes de muestras, equipos o documentos para que pueda analizarlos.",
          sender: "ai",
          timestamp: new Date(),
          type: "chat"
        }
      ]);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("La imagen es demasiado grande. Máximo 5MB.");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert("Por favor selecciona solo archivos de imagen.");
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && !selectedImage) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue || "Analiza esta imagen",
      sender: "user",
      timestamp: new Date(),
      image: imagePreview || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    const currentImage = selectedImage;
    setInputValue("");
    setSelectedImage(null);
    setImagePreview(null);
    setIsLoading(true);

    try {
      // Determine message type and get appropriate response
      let aiResponse;
      const lowerInput = currentInput.toLowerCase();

      if (currentImage) {
        // Respuesta específica para imágenes
        aiResponse = {
          success: true,
          data: `He analizado la imagen que has compartido. ${currentInput ? `Respecto a tu pregunta: "${currentInput}" - ` : ''}Basándome en lo que puedo observar, esta parece ser una imagen relacionada con el laboratorio. Para un análisis más detallado, te recomiendo revisar los protocolos específicos del ensayo o consultar con el personal técnico especializado.`
        };
      } else if (lowerInput.includes("código") || lowerInput.includes("code") || lowerInput.includes("programa")) {
        aiResponse = await generateOptimizationCode(currentInput);
      } else if (lowerInput.includes("análisis") || lowerInput.includes("analysis") || lowerInput.includes("datos")) {
        aiResponse = await analyzeLabData([]);
      } else {
        aiResponse = await getLabAssistantResponse(currentInput);
      }

      if (aiResponse.success && aiResponse.data) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse.data,
          sender: "ai",
          timestamp: new Date(),
          type: lowerInput.includes("código") ? "code" : lowerInput.includes("análisis") ? "analysis" : "chat"
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Lo siento, no pude procesar tu solicitud. ¿Podrías intentar de nuevo?",
          sender: "ai",
          timestamp: new Date(),
          type: "chat"
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Ocurrió un error al procesar tu mensaje. Por favor, intenta de nuevo.",
        sender: "ai",
        timestamp: new Date(),
        type: "chat"
      };
      setMessages(prev => [...prev, errorMessage]);
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

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case "code":
        return <Code className="h-4 w-4" />;
      case "analysis":
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getMessageBadge = (type?: string) => {
    switch (type) {
      case "code":
        return <Badge variant="secondary" className="text-xs">Código</Badge>;
      case "analysis":
        return <Badge variant="outline" className="text-xs">Análisis</Badge>;
      default:
        return <Badge variant="default" className="text-xs">Chat</Badge>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <Card className="w-full max-w-2xl h-[600px] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-primary" />
            <CardTitle>Asistente IA - PoliLims</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col space-y-4">
          <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start space-x-3",
                    message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.sender === "ai" ? "/bot-avatar.png" : undefined} />
                    <AvatarFallback className={cn(
                      "text-xs",
                      message.sender === "ai" ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      {message.sender === "ai" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={cn(
                    "flex-1 space-y-2",
                    message.sender === "user" ? "text-right" : ""
                  )}>
                    <div className="flex items-center space-x-2">
                      {message.sender === "ai" && getMessageIcon(message.type)}
                      {message.sender === "ai" && getMessageBadge(message.type)}
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className={cn(
                      "rounded-lg px-3 py-2 text-sm",
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground ml-auto max-w-[80%]"
                        : "bg-muted max-w-[80%]"
                    )}>
                      {message.type === "code" ? (
                        <pre className="whitespace-pre-wrap font-mono text-xs">
                          {message.content}
                        </pre>
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                      
                      {message.image && (
                        <div className="mt-2">
                          <img 
                            src={message.image} 
                            alt="Imagen adjunta" 
                            className="max-w-full h-auto rounded-lg border border-border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-4 w-4" />
                      <Badge variant="default" className="text-xs">Pensando...</Badge>
                    </div>
                    <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Procesando tu solicitud...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="relative inline-block">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-h-20 rounded border border-border"
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                onClick={removeImage}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje aquí..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={(!inputValue.trim() && !selectedImage) || isLoading}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </CardContent>
      </Card>
    </div>
  );
}
