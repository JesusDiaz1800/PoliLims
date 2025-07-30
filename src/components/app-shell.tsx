"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    SidebarInset,
    SidebarTrigger,
    useSidebar,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import {
    LayoutDashboard,
    GitBranch,
    Users,
    FileText,
    Bot,
    FlaskConical,
    Beaker,
    Database,
    ShieldCheck,
    Settings,
    FilePlus2,
    ClipboardList,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/workflows', label: 'Flujos de Trabajo', icon: GitBranch },
    { href: '/reports', label: 'Informes', icon: FileText },
    { type: 'separator' },
    { href: '/ensayos/registro', label: 'Registrar Ensayo', icon: FilePlus2 },
    { href: '/ensayos/seguimiento', label: 'Seguimiento', icon: ClipboardList },
    { type: 'separator' },
    { href: '/muestras', label: 'Muestras', icon: FlaskConical },
    { href: '/equipos', label: 'Equipos', icon: Beaker },
    { href: '/portal', label: 'Portal de Clientes', icon: Users },
    { type: 'separator' },
    { href: '/troubleshooting', label: 'Soporte IA', icon: Bot },
    { href: '/administracion', label: 'Administración', icon: Settings, 
      subItems: [
        { href: '/administracion/usuarios', label: 'Gestión de Usuarios', icon: Users },
        { href: '/administracion/basedatos', label: 'Base de Datos', icon: Database },
        { href: '/administracion/permisos', label: 'Roles y Permisos', icon: ShieldCheck },
      ]
    },
];

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { state, isMobile } = useSidebar();

    const getPageTitle = () => {
        for (const item of menuItems) {
            if (item.href && pathname.startsWith(item.href)) {
                return item.label;
            }
            if (item.subItems) {
                const subItem = item.subItems.find(sub => pathname.startsWith(sub.href));
                if (subItem) return subItem.label;
            }
        }
        if (pathname === '/') return 'Dashboard';
        return 'PoliLIMS';
    }

    return (
        <div className="flex min-h-screen w-full bg-background/50 dark:bg-sidebar-background/50">
            <Sidebar>
                <SidebarHeader>
                    <div className="flex items-center gap-2.5">
                       <Logo />
                       <span className="font-headline text-lg font-semibold text-primary">PoliLIMS</span>
                    </div>
                </SidebarHeader>
                <SidebarContent className="p-2">
                    <SidebarMenu>
                        {menuItems.map((item, index) => (
                           item.type === 'separator' ? <SidebarSeparator key={`sep-${index}`} className="my-1" /> :
                            <SidebarMenuItem key={item.href || index}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === item.href || (item.href && item.href !== '/dashboard' && pathname.startsWith(item.href))}
                                    tooltip={state === 'collapsed' && !isMobile ? item.label : undefined}
                                >
                                    <Link href={item.href || '#'}>
                                        <item.icon />
                                        <span>{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                    <div className="flex items-center gap-3 p-2">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src="https://placehold.co/40x40.png" alt="Victor Lutz" data-ai-hint="man portrait"/>
                            <AvatarFallback>VL</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-sm overflow-hidden">
                            <span className="font-medium truncate">Victor Lutz</span>
                            <span className="text-muted-foreground text-xs truncate">Jefe de Calidad</span>
                        </div>
                    </div>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="md:hidden"/>
                         <h1 className="text-xl font-semibold font-headline text-foreground">
                           {getPageTitle()}
                        </h1>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background">
                    {children}
                </main>
            </SidebarInset>
        </div>
    );
}
