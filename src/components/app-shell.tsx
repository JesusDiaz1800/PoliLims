

"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    SidebarTrigger,
    useSidebar,
    SidebarSeparator
} from '@/components/ui/sidebar';
import {
    LayoutDashboard,
    GitBranch,
    Users,
    FileText,
    FlaskConical,
    Beaker,
    Database,
    ShieldCheck,
    Settings,
    FilePlus2,
    ClipboardList,
    TestTube,
    Recycle,
    Wrench,
    Droplets,
    ClipboardCheck,
    ChevronDown,
    Layers3,
    SlidersHorizontal,
    Construction,
    Cylinder,
    Code2,
    AlertOctagon,
    Ship,
    BookCheck,
    History,
    Library,
    Rocket,
    CalendarCheck,
    UploadCloud,
    MessageSquarePlus,
    LogOut,
    Info,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import type { User } from '@/services/user-service';
import { Logo } from './logo';
import { useChatWidget } from './soporte/chat-widget';


const ensayosSubMenu = [
    { 
      label: 'Tuberías', 
      icon: Construction,
      href: '/ensayos/tuberias',
      subItems: [
        { href: '/ensayos/tuberias/hdpe', label: 'HDPE', icon: Cylinder },
        { href: '/ensayos/tuberias/pp', label: 'PP', icon: Cylinder },
      ]
    },
    { href: '/ensayos/materia-prima', label: 'Materia Prima', icon: TestTube },
    { href: '/ensayos/reprocesado', label: 'Reprocesado', icon: Recycle },
    { type: 'separator' },
    { href: '/ensayos/control-rutinario', label: 'Control Rutinario', icon: ClipboardCheck },
    { href: '/ensayos/control-accesorios', label: 'Control de Accesorios', icon: Wrench },
    { href: '/ensayos/control-agua', label: 'Control de Agua', icon: Droplets },
    { type: 'separator' },
    { href: '/ensayos/seguimiento', label: 'Seguimiento General', icon: ClipboardList },
];

const administracionSubMenu = [
    { href: '/administracion/usuarios', label: 'Gestión de Usuarios', icon: Users },
    { href: '/administracion/basedatos', label: 'Base de Datos', icon: Database },
    { href: '/administracion/permisos', label: 'Roles y Permisos', icon: ShieldCheck },
    { href: '/administracion/configuracion', label: 'Configuración', icon: Settings },
    { type: 'separator' },
    { href: '/administracion/proximos-pasos', label: 'Próximos Pasos', icon: Rocket },
];

const operacionesSubMenu = [
    { href: '/importaciones', label: 'Control de Importaciones', icon: Ship },
    { href: '/portal', label: 'Portal de Clientes', icon: Users },
];

const equiposSubMenu = [
    { href: '/equipos', label: 'Inventario de Equipos', icon: ClipboardList },
    { href: '/equipos/control', label: 'Control de Equipos', icon: History },
    { href: '/equipos/programa', label: 'Programa', icon: CalendarCheck },
];

const bibliotecaSubMenu = [
    { href: '/biblioteca/documentos', label: 'Documentos', icon: Library },
    { href: '/biblioteca/upload', label: 'Cargar Documento', icon: UploadCloud },
];

const NavCollapsible = ({ item, pathname, disabled = false, userQuery }: { item: any, pathname: string, disabled?: boolean, userQuery: string }) => {
    const subMenuItems = item.subMenu || item.subItems;

    return (
    <Collapsible
      key={item.label}
      defaultOpen={pathname.startsWith(item.href)}
      className="w-full"
      disabled={disabled}
    >
      <CollapsibleTrigger asChild disabled={disabled}>
          <SidebarMenuButton
            variant="ghost"
            className="w-full justify-between group/button"
            isActive={pathname.startsWith(item.href)}
            disabled={disabled}
            aria-disabled={disabled}
          >
            <div className='flex items-center gap-3 flex-1'>
              <item.icon className="size-5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/button:rotate-180" />
          </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenu className="pl-4">
          {subMenuItems && subMenuItems.map((subItem: any, index: number) => {
            if (subItem.type === 'separator') {
                return <SidebarSeparator key={`sub-sep-${index}`} className="my-1" />;
            }
            if (subItem.subItems || (subItem.subMenu && subItem.subMenu.length > 0)) {
                return <NavCollapsible key={subItem.label || subItem.href} item={subItem} pathname={pathname} disabled={disabled} userQuery={userQuery} />;
            }
            const isSubItemActive = pathname === subItem.href;
            
            return (
                <SidebarMenuItem key={subItem.href}>
                    <SidebarMenuButton 
                        asChild 
                        size="sm" 
                        variant="ghost" 
                        className="w-full justify-start" 
                        isActive={isSubItemActive} 
                        disabled={disabled}
                        aria-disabled={disabled}
                        >
                        <Link href={`${subItem.href}?${userQuery}`}>
                           {subItem.icon && <subItem.icon className="mr-2 size-4" />}
                           <span>{subItem.label}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            )
})}
        </SidebarMenu>
      </CollapsibleContent>
    </Collapsible>
);
}

const pageTitles: Record<string, string> = {
    '/equipos': 'Inventario de Equipos',
    '/equipos/control': 'Control de Equipos',
    '/equipos/programa': 'Programa de Calibración y Mantenimiento',
    '/ensayos/tuberias/hdpe': 'Ensayos de Tuberías HDPE',
    '/ensayos/tuberias/pp': 'Ensayos de Tuberías PP',
    '/ensayos/materia-prima': 'Ensayos de Materia Prima',
    '/ensayos/reprocesado': 'Ensayos de Reprocesado',
    '/ensayos/control-accesorios': 'Control de Accesorios',
    '/ensayos/control-agua': 'Control de Agua',
    '/ensayos/control-rutinario': 'Control Rutinario de Tuberías',
    '/ensayos/seguimiento': 'Seguimiento General de Ensayos',
    '/administracion/usuarios': 'Gestión de Usuarios',
    '/administracion/basedatos': 'Base de Datos',
    '/administracion/permisos': 'Roles y Permisos',
    '/administracion/configuracion': 'Configuración',
    '/administracion/proximos-pasos': 'Próximos Pasos para Producción',
    '/assistant': 'Asistente de Código',
    '/portal': 'Portal de Clientes',
    '/importaciones': 'Control de Importaciones',
    '/no-conformidades': 'Gestión de No Conformidades',
    '/biblioteca/documentos': 'Biblioteca de Documentos',
    '/biblioteca/upload': 'Cargar Documento',
};

const menuItems = (toggleChat: () => void) => [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
        label: 'Ensayos',
        icon: SlidersHorizontal,
        subMenu: ensayosSubMenu,
        href: '/ensayos'
    },
    { 
        label: 'Gestión de Equipos', 
        icon: BookCheck,
        subMenu: equiposSubMenu,
        href: '/equipos',
    },
    { href: '/no-conformidades', label: 'No Conformidades', icon: AlertOctagon },
    {
        label: 'Operaciones',
        icon: Layers3,
        subMenu: operacionesSubMenu,
        href: '/operaciones'
    },
    { href: '/reports', label: 'Informes y Certificados', icon: FileText },
    { href: '/workflows', label: 'Flujos de Trabajo', icon: GitBranch },
    { 
        label: 'Biblioteca', 
        icon: Library,
        subMenu: bibliotecaSubMenu,
        href: '/biblioteca',
    },
    { type: 'separator' },
    { href: '/soporte', label: 'Soporte de Laboratorio', icon: MessageSquarePlus, onClick: toggleChat },
    { href: '/assistant', label: 'Asistente de Código', icon: Code2 },
    { type: 'separator' },
    {
        label: 'Administración',
        icon: Settings,
        subMenu: administracionSubMenu,
        href: '/administracion'
    },
];

export function AppShell({ children, user }: { children: React.ReactNode, user: User }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { isMobile } = useSidebar();
    const { setIsOpen, setIsWidgetVisible } = useChatWidget();
    const isInspectorView = user?.role === 'Inspector de Calidad';

    const userQuery = searchParams.toString();

    const getPageTitle = React.useCallback(() => {
        const title = pageTitles[pathname];
        if (title) return title;

        for (const item of menuItems(() => {})) {
            if (item.href && pathname === item.href) return item.label;
        }

        return 'Dashboard';
    }, [pathname]);

    const handleMenuClick = (e: React.MouseEvent, onClick?: () => void) => {
        if(onClick) {
            e.preventDefault();
            setIsWidgetVisible(true);
            setIsOpen(true);
        }
    }

    return (
        <div className="flex min-h-screen w-full bg-background">
            <Sidebar>
                <SidebarHeader className="h-16 flex items-center px-4 group-data-[state=collapsed]/sidebar-wrapper:justify-center group-data-[state=collapsed]/sidebar-wrapper:px-0">
                    <div className="flex items-center w-48 group-data-[state=collapsed]/sidebar-wrapper:w-auto group-data-[state=collapsed]/sidebar-wrapper:justify-center">
                       <Logo />
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    {isInspectorView && (
                        <Alert className="m-2 border-primary/30 bg-primary/10">
                            <Info className="h-4 w-4 text-primary" />
                            <AlertTitle className="text-primary/90">Modo Inspector</AlertTitle>
                            <AlertDescription className="text-primary/70">
                                La vista está limitada a las funciones de inspector de calidad.
                            </AlertDescription>
                        </Alert>
                    )}
                    <SidebarMenu>
                        {menuItems(() => setIsOpen(true)).map((item, index) => {
                            const isDisabled = isInspectorView && !['/dashboard', '/ensayos/control-rutinario'].some(p => item.href?.startsWith(p));

                            if (item.type === 'separator') {
                                return <SidebarSeparator key={`sep-${index}`} className="my-2" />;
                            }
                            if (item.subMenu) {
                                return <NavCollapsible key={item.label} item={item} pathname={pathname} disabled={isDisabled} userQuery={userQuery} />;
                            }
                             const isActive = pathname === item.href || (item.href && item.href !== '/dashboard' && pathname.startsWith(item.href));

                            return (
                                <SidebarMenuItem key={item.href || index}>
                                    <SidebarMenuButton
                                        asChild
                                        variant="ghost"
                                        isActive={isActive}
                                        tooltip={{content: item.label, side:"right", align:"center"}}
                                        disabled={isDisabled}
                                        aria-disabled={isDisabled}
                                    >
                                        <Link href={`${item.href}?${userQuery}`} onClick={(e) => handleMenuClick(e, item.onClick)}>
                                            <item.icon className="size-5" />
                                            <span>{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                           <SidebarMenuButton asChild variant="ghost" tooltip={{content: "Cerrar Sesión", side: "right", align: "center"}}>
                                <Link href="/login">
                                    <LogOut className="size-5" />
                                    <span>Cerrar Sesión</span>
                                </Link>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                    <SidebarSeparator className="my-2" />
                    <div className="flex items-center gap-3 p-2 group-data-[state=collapsed]/sidebar-wrapper:justify-center group-data-[state=collapsed]/sidebar-wrapper:p-0 group-data-[state=collapsed]/sidebar-wrapper:py-2">
                        <Avatar className="h-10 w-10 border-2 border-primary-foreground/30">
                            <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                            <AvatarFallback>{user.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-sm overflow-hidden group-data-[state=collapsed]/sidebar-wrapper:hidden">
                            <span className="font-semibold truncate">{user.fullName}</span>
                            <span className="text-primary-foreground/70 text-xs truncate">{user.role}</span>
                        </div>
                    </div>
                </SidebarFooter>
            </Sidebar>
            <div className='flex flex-col flex-1 overflow-hidden'>
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger/>
                         <h1 className="text-xl font-semibold font-headline text-foreground">
                           {getPageTitle()}
                        </h1>
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-4 sm:p-6 custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}
