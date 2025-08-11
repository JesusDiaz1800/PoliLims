

"use client";

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Loading from '@/app/(app)/loading';
import * as dataService from "@/services/data-service";
import type { Ensayo } from '@/context/data-context';
import type { User } from '@/services/user-service';
import { findUserByUsername } from '@/services/user-service';
import { EnsayosProductoTerminadoTable } from '@/components/ensayos/tuberias/ensayos-producto-terminado-table';
import { EnsayoProductoTerminadoDialog } from '@/components/ensayos/tuberias/ensayo-producto-terminado-dialog';

export default function TuberiasHdpePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [ensayos, setEnsayos] = React.useState<Ensayo[]>([]);
    const [user, setUser] = React.useState<User | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedEnsayo, setSelectedEnsayo] = React.useState<Ensayo | null>(null);

    const [activeTab, setActiveTab] = React.useState('all');

    React.useEffect(() => {
        const loadPageData = async () => {
            setIsLoading(true);
            const [userData, initialData] = await Promise.all([
                findUserByUsername(searchParams.get('user') || 'jdiaz'),
                dataService.getInitialData()
            ]);
            setUser(userData);
            setEnsayos(initialData.ensayos);

            const ensayoId = searchParams.get('id');
            if (ensayoId) {
                const ensayo = initialData.ensayos.find(e => e.id === ensayoId);
                if (ensayo) {
                    setSelectedEnsayo(ensayo);
                    setIsDialogOpen(true);
                }
            }
            setIsLoading(false);
        };
        loadPageData();
    }, [searchParams]);

    const handleOpenDialog = (ensayo: Ensayo, filterType: string = 'all') => {
        setSelectedEnsayo(ensayo);
        setActiveTab(filterType);
        setIsDialogOpen(true);
    };
    
    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedEnsayo(null);
        // Clean up URL
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.delete('id');
        router.replace(`${window.location.pathname}?${newSearchParams.toString()}`);
    };

    const hdpeEnsayos = React.useMemo(() => {
        return ensayos.filter(e => e.tipo === 'Tubería HDPE');
    }, [ensayos]);

    if(isLoading || !user) return <Loading />;

    return (
        <div className="space-y-6">
            <EnsayosProductoTerminadoTable
                ensayos={hdpeEnsayos}
                tipoEnsayo="HDPE"
                onOpenDialog={handleOpenDialog}
                user={user}
            />
            {selectedEnsayo && (
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
