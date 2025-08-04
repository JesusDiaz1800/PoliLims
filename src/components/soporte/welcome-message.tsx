
import { FileText, Thermometer, FlaskConical } from "lucide-react";

const examplePrompts = [
    {
        icon: <Thermometer className="h-5 w-5 text-primary" />,
        text: "¿A qué temperatura se debe realizar el ensayo de melt index para el polietileno?",
    },
    {
        icon: <FileText className="h-5 w-5 text-primary" />,
        text: "¿Cuál es el procedimiento para el ensayo de negro de humo?",
    },
    {
        icon: <FlaskConical className="h-5 w-5 text-primary" />,
        text: "Explícame cómo se calcula la densidad de una muestra.",
    },
];

export function WelcomeMessage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold font-headline">Asistente IA de PoliLIMS</h2>
                <p className="text-muted-foreground">¿Cómo puedo ayudarte hoy?</p>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                {examplePrompts.map((prompt, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-background hover:bg-muted cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                           {prompt.icon}
                           <p className="text-sm text-left">{prompt.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

