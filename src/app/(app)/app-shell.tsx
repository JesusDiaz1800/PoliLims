
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
    Sidebar,
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
    Code2,
    AlertOctagon,
    Ship,
    BookCheck,
    History,
    Library,
    Rocket,
    CalendarCheck,
    MessageSquarePlus,
    LogOut,
    Info,
    FileSearch,
    Map,
    Calculator,
    Truck,
    Thermometer,
    GraduationCap,
    Bell,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { User } from '@/services/user-service';
import { Logo } from '@/components/logo';
import { useChatWidget } from '@/components/soporte/chat-widget';


const ensayosSubMenu = [
    { 
      label: 'Tuberías', 
      icon: SlidersHorizontal, // Using a more generic icon for the group
      href: '/ensayos/tuberias',
      subItems: [
        { href: '/ensayos/tuberias/hdpe', label: 'HDPE', icon: Beaker },
        { href: '/ensayos/tuberias/pp', label: 'PP', icon: Beaker },
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

const procesosGestionSubMenu = [
    { 
        label: 'Gestión de Equipos', 
        icon: BookCheck,
        href: '/equipos',
        subItems: [
            { href: '/equipos', label: 'Inventario de Equipos', icon: ClipboardList },
            { href: '/equipos/control', label: 'Control de Equipos', icon: History },
            { href: '/equipos/programa', label: 'Programa', icon: CalendarCheck },
        ]
    },
    { href: '/auditorias', label: 'Auditorías', icon: ClipboardCheck },
    { href: '/control-ambiental', label: 'Control Ambiental', icon: Thermometer },
    { href: '/no-conformidades', label: 'No Conformidades', icon: AlertOctagon },
    { 
        label: 'Proveedores', 
        icon: Truck,
        href: '/proveedores',
        subItems: [
            { href: '/proveedores/gestion', label: 'Gestión de Proveedores', icon: ClipboardList },
        ],
    },
    { href: '/workflows', label: 'Flujos de Trabajo', icon: GitBranch },
    { href: '/administracion/formacion', label: 'Formación y Competencia', icon: GraduationCap },
    { href: '/administracion/incertidumbre', label: 'Calculadora de Incertidumbre', icon: Calculator },
];

const operacionesSubMenu = [
    { href: '/importaciones', label: 'Control de Importaciones', icon: Ship },
    { href: '/portal', label: 'Portal de Clientes', icon: Users },
]


const administracionSubMenu = [
    { href: '/administracion/usuarios', label: 'Gestión de Usuarios', icon: Users },
    { href: '/administracion/basedatos', label: 'Base de Datos', icon: Database },
    { href: '/administracion/permisos', label: 'Roles y Permisos', icon: ShieldCheck },
    { href: '/administracion/notificaciones', label: 'Notificaciones', icon: Bell },
    { href: '/administracion/configuracion', label: 'Configuración', icon: Settings },
    { href: '/administracion/rutas', label: 'Rutas Disponibles', icon: Map },
    { type: 'separator' },
    { href: '/administracion/proximos-pasos', label: 'Próximos Pasos', icon: Rocket },
];

const NavCollapsible = ({ item, pathname, disabled = false, userQuery }: { item: any, pathname: string, disabled?: boolean, userQuery: string }) => {
    const subMenuItems = item.subMenu || item.subItems;
    // An item is active if its href is the start of the current pathname
    const isActive = item.href && pathname.startsWith(item.href);

    return (
    <Collapsible
      key={item.label}
      defaultOpen={isActive}
      className="w-full"
      disabled={disabled}
    >
      <CollapsibleTrigger asChild disabled={disabled}>
          <SidebarMenuButton
            variant="ghost"
            className="w-full justify-between group/button text-white hover:bg-white/10 hover:text-white data-[active=true]:text-cyan-400"
            isActive={isActive}
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
                return <SidebarSeparator key={`sub-sep-${index}`} className="my-1 bg-white/20" />;
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
                        className="w-full justify-start text-white hover:bg-white/10 hover:text-white data-[active=true]:text-cyan-400" 
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
    '/control-ambiental': 'Control de Condiciones Ambientales',
    '/auditorias': 'Gestión de Auditorías',
    '/ensayos/tuberias/hdpe': 'Ensayos de Tuberías HDPE',
    '/ensayos/tuberias/pp': 'Ensayos de Tuberías PP',
    '/ensayos/materia-prima': 'Ensayos de Materia Prima',
    '/ensayos/reprocesado': 'Ensayos de Reprocesado',
    '/ensayos/control-accesorios': 'Control de Accesorios',
    '/ensayos/control-agua': 'Control de Agua',
    '/ensayos/control-rutinario': 'Control Rutinario de Tuberías',
    '/ensayos/seguimiento': 'Seguimiento General de Ensayos',
    '/administracion/usuarios': 'Gestión de Usuarios',
    '/administracion/formacion': 'Gestión de Formación y Competencia',
    '/administracion/basedatos': 'Base de Datos',
    '/administracion/permisos': 'Roles y Permisos',
    '/administracion/notificaciones': 'Notificaciones',
    '/administracion/incertidumbre': 'Calculadora de Incertidumbre',
    '/administracion/configuracion': 'Configuración',
    '/administracion/proximos-pasos': 'Próximos Pasos para Producción',
    '/administracion/rutas': 'Rutas Disponibles',
    '/assistant': 'Asistente de Código',
    '/portal': 'Portal de Clientes',
    '/importaciones': 'Control de Importaciones',
    '/no-conformidades': 'Gestión de No Conformidades',
    '/biblioteca/documentos': 'Gestor Documental',
    '/reports/generador': 'Generador de Informes y Certificados',
    '/reports/biblioteca': 'Biblioteca de Informes',
    '/workflows': 'Flujos de Trabajo',
    '/proveedores/gestion': 'Gestión de Proveedores',
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
        label: 'Informes y Certificados', 
        icon: FileText,
        href: '/reports',
        subItems: [
            { href: '/reports/generador', label: 'Generador de Informes', icon: FilePlus2 },
            { href: '/reports/biblioteca', label: 'Biblioteca de Informes', icon: FileSearch },
        ]
    },
    { 
        label: 'Biblioteca', 
        icon: Library,
        href: '/biblioteca',
        subItems: [
            { href: '/biblioteca/documentos', label: 'Documentos', icon: Library },
        ]
    },
    { type: 'separator' },
     {
        label: 'Procesos de Gestión',
        icon: Layers3,
        subMenu: procesosGestionSubMenu,
        href: '/gestion' // Use a virtual base path for the group
    },
    {
        label: 'Operaciones',
        icon: GitBranch,
        subMenu: operacionesSubMenu,
        href: '/operaciones'
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
        <div className="flex min-h-screen w-full bg-muted/40">
            <Sidebar className="dark:bg-card text-white border-r-0">
                <SidebarContent className="text-white">
                     <div className="py-4 pl-1 overflow-hidden transition-all duration-300">
                        <Logo className="w-44 group-data-[state=collapsed]/sidebar-wrapper:w-9 group-data-[state=collapsed]/sidebar-wrapper:px-0" />
                    </div>
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
                                return <SidebarSeparator key={`sep-${index}`} className="my-2 bg-white/20" />;
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
                                        className="text-white hover:bg-white/10 hover:text-white data-[active=true]:text-cyan-400"
                                    >
                                        <Link href={`${item.href}?${userQuery}`} onClick={(e) => handleMenuClick(e, item.onClick)}>
                                            <div className='flex items-center gap-3'>
                                                <item.icon className="size-5 shrink-0" />
                                                <span className="truncate">{item.label}</span>
                                            </div>
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
                           <SidebarMenuButton asChild variant="ghost" tooltip={{content: "Cerrar Sesión", side: "right", align: "center"}} className="text-white hover:bg-white/10 hover:text-white">
                                <Link href="/login">
                                    <div className='flex items-center gap-3'>
                                        <LogOut className="size-5 shrink-0" />
                                        <span className="truncate">Cerrar Sesión</span>
                                    </div>
                                </Link>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                    <SidebarSeparator className="my-2 bg-white/20" />
                    <div className="flex items-center gap-3 group-data-[state=collapsed]/sidebar-wrapper:justify-center group-data-[state=collapsed]/sidebar-wrapper:py-2">
                        <Avatar className="h-10 w-10 border-2 border-white/30">
                            <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                            <AvatarFallback>{user.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-sm overflow-hidden group-data-[state=collapsed]/sidebar-wrapper:hidden">
                            <span className="font-semibold truncate">{user.fullName}</span>
                            <span className="text-white/70 text-xs truncate">{user.role}</span>
                        </div>
                    </div>
                </SidebarFooter>
            </Sidebar>
            <div className='flex flex-col flex-1 h-screen overflow-hidden'>
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


    