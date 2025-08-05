
import { FileText, Thermometer, FlaskConical } from "lucide-react";
import { Button } from "../ui/button";

const examplePrompts = [
    {
        icon: <Thermometer className="h-5 w-5 text-primary" />,
        text: "¿A qué temperatura se debe realizar el ensayo de melt index para el polietileno?",
    },
    {
        icon: <FileText className="h-5 w-5 text-primary" />,
        text: "¿Cuál es el procedimiento para el ensayo de negro de humo?",
    },
];

interface WelcomeMessageProps {
    onPromptClick: (promptText: string) => void;
}

export function WelcomeMessage({ onPromptClick }: WelcomeMessageProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold font-headline">Bienvenido al Asistente</h2>
                <p className="text-muted-foreground max-w-md">¿Cómo puedo ayudarte hoy? Selecciona un ejemplo o escribe tu propia pregunta a continuación.</p>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-3 w-full max-w-lg">
                {examplePrompts.map((prompt, index) => (
                    <Button 
                        key={index} 
                        variant="outline" 
                        className="h-auto w-full justify-start text-left"
                        onClick={() => onPromptClick(prompt.text)}
                    >
                        <div className="flex items-start gap-3 p-2">
                           {prompt.icon}
                           <p className="text-sm font-normal whitespace-normal">{prompt.text}</p>
                        </div>
                    </Button>
                ))}
            </div>
        </div>
    );
}
