

"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, PlusCircle, Search, Filter, Pencil, ShieldCheck, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import type { User } from "@/services/user-service";
import { findUserByUsername } from "@/services/user-service";
import { ApprovalDialog } from "@/components/ensayos/approval-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { ReportData } from "@/app/(app)/reports/generador/actions";
import { ReportContainer } from "@/components/reports/ReportContainer";
import { format } from "date-fns";
import { parseISO } from "date-fns";
import type { Ensayo, RecentActivity } from "@/context/data-context";
import * as dataService from "@/services/data-service";
import Loading from "../../loading";
import { EnsayoProductoTerminadoDialog } from "@/components/ensayos/tuberias/ensayo-producto-terminado-dialog";
import { useDynamicData } from "@/context/data-context";

const pendingStatuses = ["En Progreso", "En Análisis", "Pendiente de Revisión"];

function getStatusVariant(status: string) {
    if (pendingStatuses.includes(status)) return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30";
    switch (status) {
        case "Aprobado": return "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30";
        case "Rechazado": return "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30";
        default: return "bg-secondary";
    }
}

function getStatusLabel(status: string): string {
  if (pendingStatuses.includes(status)) {
    return 'Pendiente';
  }
  return status;
}

const formatValue = (value: any, decimals: number = 2) => {
    if (value === null || value === undefined || value === '' || isNaN(Number(value))) return 'N/A';
    return Number(value).toFixed(decimals);
};

const renderDynamicTable = (ensayos: Ensayo[], filterType: string, handleEditClick: (ensayo: Ensayo) => void, handleOpenApprovalDialog: (ensayo: Ensayo) => void, handleOpenReportDialog: (ensayo: Ensayo) => void, canApprove: boolean) => {
  
  const renderActions = (ensayo: Ensayo) => (
      <TableCell className="text-right sticky right-0 bg-card z-10">
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEditClick(ensayo)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar / Ingresar Datos
              </DropdownMenuItem>
              {canApprove && (
                  <DropdownMenuItem onSelect={() => handleOpenApprovalDialog(ensayo)}>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Aprobar / Revisar
                  </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleOpenReportDialog(ensayo)}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir Informe
              </DropdownMenuItem>
          </DropdownMenuContent>
          </DropdownMenu>
      </TableCell>
  );

  let headers, renderRow;

  switch (filterType) {
    case 'Materia Prima':
      headers = (<>
        <TableHead>Producto</TableHead><TableHead>Lote</TableHead><TableHead>Fecha</TableHead><TableHead>Analista</TableHead><TableHead>Estado</TableHead><TableHead className="text-right">M.I. Ensayado</TableHead><TableHead className="text-right">% Var. MI</TableHead><TableHead className="text-right">Densidad</TableHead><TableHead className="text-right">% Negro Humo</TableHead><TableHead className="text-right">Punto Fusión</TableHead><TableHead className="text-right">TIO [min]</TableHead>
      </>);
      renderRow = (ensayo: Ensayo) => (<>
        <TableCell className="font-medium">{ensayo.producto}</TableCell><TableCell>{ensayo.lote}</TableCell><TableCell>{ensayo.fecha}</TableCell><TableCell>{ensayo.analista}</TableCell><TableCell><Badge className={cn("border-transparent font-normal", getStatusVariant(ensayo.estado))}>{ensayo.estado}</Badge></TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.meltIndexCalculado, 4)}</TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.meltIndexVariacion, 2)}%</TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.densidadCalculada, 4)}</TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.negroHumoCalculado, 2)}%</TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.dsc_punto_fusion, 2)}</TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.tio_tiempo, 2)}</TableCell>
      </>);
      break;
    case 'Reprocesado':
        headers = (<>
            <TableHead>Lote</TableHead><TableHead>Fecha</TableHead><TableHead>Analista</TableHead><TableHead>Estado</TableHead><TableHead className="text-right">M.I. Ensayado</TableHead><TableHead className="text-right">% Var. MI</TableHead><TableHead className="text-right">Densidad</TableHead><TableHead className="text-right">% Negro Humo</TableHead><TableHead className="text-right">TIO [min]</TableHead>
        </>);
        renderRow = (ensayo: Ensayo) => (<>
            <TableCell className="font-medium">{ensayo.lote}</TableCell><TableCell>{ensayo.fecha}</TableCell><TableCell>{ensayo.analista}</TableCell><TableCell><Badge className={cn("border-transparent font-normal", getStatusVariant(ensayo.estado))}>{ensayo.estado}</Badge></TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.meltIndexCalculado, 4)}</TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.meltIndexVariacion, 2)}%</TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.densidadCalculada, 4)}</TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.negroHumoCalculado, 2)}%</TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.tio_tiempo, 2)}</TableCell>
        </>);
        break;
    case 'Tubería HDPE':
        headers = (<>
            <TableHead>Producto</TableHead><TableHead>Lote</TableHead><TableHead>Estado</TableHead><TableHead className="text-right">M.I. Ensayado</TableHead><TableHead className="text-right">% Var. MI</TableHead><TableHead className="text-right">Densidad</TableHead><TableHead className="text-right">% NH</TableHead><TableHead className="text-right">Dispersión NH</TableHead><TableHead className="text-right">Res. Tracción</TableHead><TableHead className="text-right">Elong. Rotura</TableHead><TableHead className="text-right">TIO</TableHead>
        </>);
         renderRow = (ensayo: Ensayo) => (<>
            <TableCell className="font-medium">{ensayo.producto}</TableCell><TableCell>{ensayo.lote}</TableCell><TableCell><Badge className={cn("border-transparent font-normal", getStatusVariant(ensayo.estado))}>{ensayo.estado}</Badge></TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.meltIndexCalculado, 4)}</TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.meltIndexVariacion, 2)}%</TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.densidadCalculada, 4)}</TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.negroHumoCalculado, 2)}%</TableCell><TableCell className="text-right">{ensayo.dispersion_nh || 'N/A'}</TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.resistencia_traccion, 2)}</TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.elongacion_rotura, 2)}%</TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.tio_tiempo, 2)}</TableCell>
        </>);
        break;
    case 'Tubería PP':
        headers = (<>
             <TableHead>Producto</TableHead><TableHead>Lote</TableHead><TableHead>Estado</TableHead><TableHead className="text-right">M.I. Ensayado</TableHead><TableHead className="text-right">% Var. MI</TableHead><TableHead className="text-right">Densidad</TableHead><TableHead className="text-right">% FV Total</TableHead><TableHead className="text-right">% FV Capa Intermedia</TableHead>
        </>);
        renderRow = (ensayo: Ensayo) => (<>
            <TableCell className="font-medium">{ensayo.producto}</TableCell><TableCell>{ensayo.lote}</TableCell><TableCell><Badge className={cn("border-transparent font-normal", getStatusVariant(ensayo.estado))}>{ensayo.estado}</Badge></TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.meltIndexCalculado, 4)}</TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.meltIndexVariacion, 2)}%</TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.densidadCalculada, 4)}</TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.fvTotalPorcentaje, 2)}%</TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.fvIntermediaPorcentaje, 2)}%</TableCell>
        </>);
        break;
    default: // ALL
        headers = (<>
            <TableHead>Producto / ID</TableHead><TableHead>Lote</TableHead><TableHead>Analista</TableHead><TableHead className="text-right">Melt Index</TableHead><TableHead className="text-right">% Var. MI</TableHead><TableHead className="text-right">Densidad</TableHead><TableHead className="text-right">% Negro Humo</TableHead><TableHead className="text-center">Estado</TableHead>
        </>);
        renderRow = (ensayo: Ensayo) => (<>
            <TableCell><div className="flex flex-col"><span className="font-medium">{ensayo.producto}</span><span className="text-xs text-muted-foreground font-mono">{ensayo.id}</span></div></TableCell><TableCell>{ensayo.lote || 'N/A'}</TableCell><TableCell>{ensayo.analista}</TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.meltIndexCalculado, 4)}</TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.meltIndexVariacion, 2)}%</TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.densidadCalculada, 4)}</TableCell><TableCell className="text-right font-mono">{formatValue(ensayo.negroHumoCalculado, 2)}%</TableCell><TableCell className="text-center"><Badge className={cn("border-transparent font-normal", getStatusVariant(ensayo.estado))}>{getStatusLabel(ensayo.estado)}</Badge></TableCell>
        </>);
        break;
  }
  
  return (
    <Table>
        <TableHeader><TableRow>{headers}<TableHead className="text-right sticky right-0 bg-card z-10">Acciones</TableHead></TableRow></TableHeader>
        <TableBody>
            {ensayos.map((ensayo) => (
                <TableRow key={ensayo.id}>
                    {renderRow(ensayo)}
                    {renderActions(ensayo)}
                </TableRow>
            ))}
        </TableBody>
    </Table>
  )
};


export default function SeguimientoEnsayosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ensayos, isLoaded, filteredEnsayos: allFilteredEnsayos, updateEnsayo, addRecentActivity } = useDynamicData();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterType, setFilterType] = React.useState("Todos");
  const [user, setUser] = React.useState<User | null>(null);
  const [selectedEnsayo, setSelectedEnsayo] = React.useState<Ensayo | null>(null);
  const [reportData, setReportData] = React.useState<ReportData | null>(null);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = React.useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = React.useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = React.useState(false);

  React.useEffect(() => {
    async function loadUser() {
        const userData = await findUserByUsername(searchParams.get('user') || 'jdiaz');
        setUser(userData);
    }
    loadUser();
  }, [searchParams]);

  const canApprove = user?.role === 'Jefe de Calidad' || user?.role === 'Ing. Analista de Calidad';

  const ensayoTypes = React.useMemo(() => 
    ["Todos", ...Array.from(new Set(ensayos.map(e => e.tipo)))],
  [ensayos]);

  const filteredEnsayos = React.useMemo(() =>
    allFilteredEnsayos
      .filter(ensayo => filterType === "Todos" || ensayo.tipo === filterType)
      .filter(ensayo =>
        ensayo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ensayo.producto && ensayo.producto.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ensayo.analista && ensayo.analista.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ensayo.lote && ensayo.lote.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a,b) => parseISO(b.fecha.split('-').reverse().join('-')).getTime() - parseISO(a.fecha.split('-').reverse().join('-')).getTime()),
  [allFilteredEnsayos, filterType, searchTerm]);
  
  const handleRedirectToRegister = () => {
    router.push('/ensayos/control-rutinario');
  }

  const handleEditClick = (ensayo: Ensayo) => {
    setSelectedEnsayo(ensayo);
    setIsFormDialogOpen(true);
  };

  const handleOpenApprovalDialog = (ensayo: Ensayo) => {
    setSelectedEnsayo(ensayo);
    setIsApprovalDialogOpen(true);
  }

  const handleCloseApprovalDialog = async () => {
    setSelectedEnsayo(null);
    setIsApprovalDialogOpen(false);
  }
  
  const handleOpenReportDialog = (ensayo: Ensayo) => {
    const data: ReportData = {
        lotes: [ensayo.lote || 'N/A'],
        material: ensayo.tipo_material || ensayo.tipo,
        producto: ensayo.producto,
        fechaGeneracion: new Date().toLocaleDateString('es-ES'),
        inspector: ensayo.analista || 'N/A',
        corroborador: "Maximiliano Miranda Valdés",
        ensayos: [ensayo],
        promedios: ensayo, // For a single assay, promedios are the assay values
        filterType: ensayo.tipo,
    };
    setReportData(data);
    setIsReportDialogOpen(true);
  }

  const handleCloseReportDialog = () => {
    setReportData(null);
    setIsReportDialogOpen(false);
  }

  const handlePrint = () => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write('<html><head><title>Informe de Resultados</title>');
    
    // Copy stylesheets
    Array.from(document.styleSheets).forEach(sheet => {
        try {
            if (sheet.cssRules) {
                const rules = Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n');
                doc.write(`<style>${rules}</style>`);
            } else if (sheet.href) {
                doc.write(`<link rel="stylesheet" href="${sheet.href}">`);
            }
        } catch (e) {
            console.warn('Could not read stylesheet rules', e);
        }
    });

    const reportContent = document.getElementById("printable-report")?.innerHTML;
    if (reportContent) {
        doc.write('</head><body>');
        doc.write(reportContent);
        doc.write('</body></html>');
    }
    doc.close();

    setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
    }, 500);
  }
  
  if (!isLoaded || !user) {
    return <Loading />;
  }

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
                <CardTitle>Seguimiento General de Ensayos</CardTitle>
                <CardDescription>Visualice y filtre todos los ensayos registrados y sus principales resultados.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                 <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar por ID, producto, lote..."
                        className="pl-9 w-full sm:w-48"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                 <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-auto">
                      <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                      {ensayoTypes.map(type => (
                         <SelectItem key={type} value={type}>{type === "Todos" ? "Todos los tipos" : type}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                 <Button onClick={handleRedirectToRegister} className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Registrar Nuevo Ensayo
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
         <div className="relative overflow-x-auto">
         {filteredEnsayos.length > 0 ? (
           renderDynamicTable(filteredEnsayos, filterType, handleEditClick, handleOpenApprovalDialog, handleOpenReportDialog, canApprove || false)
         ) : (
            <div className="text-center py-16 text-muted-foreground">
                <Search className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-xl font-semibold">No se encontraron resultados</h3>
                <p>Intente ajustar su búsqueda o filtros.</p>
            </div>
        )}
        </div>
      </CardContent>
    </Card>
    {selectedEnsayo && user && (
        <ApprovalDialog
            isOpen={isApprovalDialogOpen}
            onClose={handleCloseApprovalDialog}
            ensayo={selectedEnsayo}
            user={user}
            updateEnsayo={updateEnsayo}
            addRecentActivity={addRecentActivity}
        />
    )}
     {selectedEnsayo && user && (selectedEnsayo.tipo === 'Tubería HDPE' || selectedEnsayo.tipo === 'Tubería PP') && (
        <EnsayoProductoTerminadoDialog
            isOpen={isFormDialogOpen}
            onClose={() => setIsFormDialogOpen(false)}
            ensayo={selectedEnsayo}
            tipo={selectedEnsayo.tipo.replace('Tubería ', '') as 'HDPE' | 'PP'}
            user={user}
            defaultTab={filterType}
        />
    )}
    {reportData && (
       <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
                <DialogTitle>Informe de Ensayo: {reportData.ensayos[0].id}</DialogTitle>
                <DialogDescription>
                    Vista previa del informe. Verifique la información antes de imprimir.
                </DialogDescription>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto custom-scrollbar pr-4 -mr-4">
              <div id="printable-report">
                  <ReportContainer reportData={reportData} />
              </div>
            </div>
             <div className="flex justify-end pt-4">
              <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir Informe
              </Button>
            </div>
          </DialogContent>
        </Dialog>
    )}
    </>
  );
}
