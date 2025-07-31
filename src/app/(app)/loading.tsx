import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center h-[calc(100vh-8rem)]">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <div>
            <p className="text-xl font-semibold font-headline text-foreground">Cargando...</p>
            <p className="text-muted-foreground">Por favor, espere un momento.</p>
        </div>
      </div>
    </div>
  );
}
