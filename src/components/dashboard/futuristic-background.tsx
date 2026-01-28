"use client";

export function FuturisticBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Fondo base con gradiente futurista */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-100/80 to-indigo-100/60 dark:from-slate-900 dark:via-blue-900/50 dark:to-indigo-900/30" />
      
      {/* Overlay de gradiente */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 via-cyan-500/15 to-indigo-500/15 dark:from-blue-500/5 dark:via-cyan-500/5 dark:to-indigo-500/5" />
      
      {/* Grid futurista */}
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(90deg,transparent_98%,rgba(59,130,246,0.2)_100%),linear-gradient(180deg,transparent_98%,rgba(59,130,246,0.2)_100%)] bg-[length:20px_20px] dark:bg-[linear-gradient(90deg,transparent_98%,rgba(59,130,246,0.1)_100%),linear-gradient(180deg,transparent_98%,rgba(59,130,246,0.1)_100%)] dark:bg-[length:20px_20px]" />
      
      {/* Líneas de luz verticales */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-400/40 to-transparent dark:via-blue-400/20" />
      <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent dark:via-cyan-400/10" />
      <div className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-transparent via-indigo-400/30 to-transparent dark:via-indigo-400/10" />
      
      {/* Líneas de luz horizontales */}
      <div className="absolute bottom-0 left-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent dark:via-indigo-400/20" />
      <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent dark:via-blue-400/10" />
      
      {/* Círculos de luz decorativos */}
      <div className="absolute top-20 right-20 w-32 h-32 rounded-full blur-xl bg-blue-500/20 dark:bg-blue-500/10" />
      <div className="absolute bottom-20 left-20 w-24 h-24 rounded-full blur-xl bg-cyan-500/20 dark:bg-cyan-500/10" />
      <div className="absolute top-1/2 left-1/2 w-40 h-40 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 bg-indigo-500/15 dark:bg-indigo-500/5" />
    </div>
  );
}
