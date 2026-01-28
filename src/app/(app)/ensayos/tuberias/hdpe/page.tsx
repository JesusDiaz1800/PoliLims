
"use client";

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Ensayo } from '@/context/data-context';
import type { User } from '@/services/user-service';
import { EnsayosProductoTerminadoTable } from '@/components/ensayos/tuberias/ensayos-producto-terminado-table';
import { EnsayoProductoTerminadoDialog } from '@/components/ensayos/tuberias/ensayo-producto-terminado-dialog';
import { useDynamicData } from '@/context/data-context';
import { FilterProvider } from '@/context/filter-context';

function TuberiasHdpePageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { ensayos, user } = useDynamicData();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedEnsayo, setSelectedEnsayo] = React.useState<Ensayo | null>(null);
    const [activeTab, setActiveTab] = React.useState('all');

    React.useEffect(() => {
        const ensayoId = searchParams.get('id');
        if (ensayoId) {
            const ensayo = ensayos.find(e => e.id === ensayoId);
            if (ensayo) {
                setSelectedEnsayo(ensayo);
                setIsDialogOpen(true);
            }
        }
    }, [searchParams, ensayos]);

    const handleOpenDialog = (ensayo: Ensayo, filterType: string = 'all') => {
        setSelectedEnsayo(ensayo);
        setActiveTab(filterType);
        setIsDialogOpen(true);
    };
    
    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedEnsayo(null);
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.delete('id');
        router.replace(`${window.location.pathname}?${newSearchParams.toString()}`);
    };

    const hdpeEnsayos = React.useMemo(() => {
        return ensayos.filter(e => e.tipo === 'Tubería HDPE');
    }, [ensayos]);

    return (
        <div className="page-container space-y-6">
            <EnsayosProductoTerminadoTable
                ensayos={hdpeEnsayos}
                tipoEnsayo="HDPE"
                onOpenDialog={handleOpenDialog}
                user={user}
            />
                    {selectedEnsayo && user && (
                          <EnsayoProductoTerminadoDialog
                              isOpen={isDialogOpen}
                              onClose={handleCloseDialog}
                              ensayo={selectedEnsayo}
                              tipo="HDPE"
                              user={user}
                              defaultTab={activeTab}
                          />
                    )}
        </div>
    );
}

export default function TuberiasHdpePage() {
    return (
        <FilterProvider>
            <TuberiasHdpePageContent />
        </FilterProvider>
    )
}
