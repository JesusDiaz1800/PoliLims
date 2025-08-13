"use client";

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Loading from '@/app/(app)/loading';
import type { Ensayo } from '@/context/data-context';
import type { User } from '@/services/user-service';
import { EnsayosProductoTerminadoTable } from '@/components/ensayos/tuberias/ensayos-producto-terminado-table';
import { EnsayoProductoTerminadoDialog } from '@/components/ensayos/tuberias/ensayo-producto-terminado-dialog';
import { useDynamicData } from '@/context/data-context';
import { FilterProvider } from '@/context/filter-context';

function TuberiasPpPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { ensayos, isLoaded, user } = useDynamicData();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedEnsayo, setSelectedEnsayo] = React.useState<Ensayo | null>(null);
    const [activeTab, setActiveTab] = React.useState('all');

    React.useEffect(() => {
        if (isLoaded) {
            const ensayoId = searchParams.get('id');
            if (ensayoId) {
                const ensayo = ensayos.find(e => e.id === ensayoId);
                if (ensayo) {
                    setSelectedEnsayo(ensayo);
                    setIsDialogOpen(true);
                }
            }
        }
    }, [searchParams, isLoaded, ensayos]);

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

    const ppEnsayos = React.useMemo(() => {
        return ensayos.filter(e => e.tipo === 'Tubería PP');
    }, [ensayos]);

    if(!isLoaded || !user) return <Loading />;

    return (
        <div className="space-y-6">
            <EnsayosProductoTerminadoTable
                ensayos={ppEnsayos}
                tipoEnsayo="PP"
                onOpenDialog={handleOpenDialog}
                user={user}
            />
            {selectedEnsayo && (
                 <EnsayoProductoTerminadoDialog
                    isOpen={isDialogOpen}
                    onClose={handleCloseDialog}
                    ensayo={selectedEnsayo}
                    tipo="PP"
                    user={user}
                    defaultTab={activeTab}
                 />
            )}
        </div>
    );
}

export default function TuberiasPpPage() {
    return (
        <FilterProvider>
            <TuberiasPpPageContent />
        </FilterProvider>
    )
}
