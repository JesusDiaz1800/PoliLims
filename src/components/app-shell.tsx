
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
    SidebarInset,
    SidebarTrigger,
    useSidebar,
    SidebarSeparator
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
    TestTube,
    Recycle,
    Wrench,
    Droplets,
    ClipboardCheck,
    ChevronDown,
    Layers2,
    Layers3,
    SlidersHorizontal,
    Construction,
    Unplug,
    Info,
    LogOut,
    Cylinder,
    Codepen
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import type { User } from '@/services/user-service';


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
    { href: '/ensayos/seguimiento', label: 'Seguimiento', icon: ClipboardList },
];

const administracionSubMenu = [
    { href: '/administracion/usuarios', label: 'Gestión de Usuarios', icon: Users },
    { href: '/administracion/basedatos', label: 'Base de Datos', icon: Database },
    { href: '/administracion/permisos', label: 'Roles y Permisos', icon: ShieldCheck },
    { href: '/administracion/configuracion', label: 'Configuración', icon: Settings },
];

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/workflows', label: 'Flujos de Trabajo', icon: GitBranch },
    { href: '/reports', label: 'Informes', icon: FileText },
    { type: 'separator' },
    {
        label: 'Ensayos',
        icon: SlidersHorizontal,
        subMenu: ensayosSubMenu,
        href: '/ensayos'
    },
    { type: 'separator' },
    { href: '/muestras', label: 'Muestras', icon: FlaskConical },
    { href: '/equipos', label: 'Equipos', icon: Beaker },
    { href: '/portal', label: 'Portal de Clientes', icon: Users },
    { type: 'separator' },
    { href: '/troubleshooting', label: 'Soporte IA', icon: Bot },
    {
        label: 'Administración',
        icon: Settings,
        subMenu: administracionSubMenu,
        href: '/administracion'
    },
];

const NavCollapsible = ({ item, pathname, disabled = false, userQuery }: { item: any, pathname: string, disabled?: boolean, userQuery: string }) => (
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
            <div className='flex items-center gap-3'>
              <item.icon className="size-5" />
              <span>{item.label}</span>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/button:rotate-180" />
          </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenu className="pl-4">
          {item.subMenu.map((subItem: any, index: number) => {
            if (subItem.type === 'separator') {
                return <SidebarSeparator key={`sub-sep-${index}`} className="my-1" />;
            }
            if (subItem.subItems) {
                return (
                    <Collapsible key={subItem.label || subItem.href} defaultOpen={subItem.href && pathname.startsWith(subItem.href)} className="w-full" disabled={disabled}>
                         <CollapsibleTrigger asChild disabled={disabled}>
                             <SidebarMenuButton size="sm" variant="ghost" className="w-full justify-between group/sub-button pr-3" disabled={disabled} aria-disabled={disabled}>
                                <div className="flex items-center gap-3">
                                    {subItem.icon && <subItem.icon className="size-4" />}
                                    <span>{subItem.label}</span>
                                </div>
                                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/sub-button:rotate-180" />
                            </SidebarMenuButton>
                         </CollapsibleTrigger>
                         <CollapsibleContent>
                             <SidebarMenu className="pl-5 border-l-2 border-dashed border-sidebar-border/30">
                                 {subItem.subItems.map((childItem: any) => (
                                     <SidebarMenuItem key={childItem.href}>
                                         <SidebarMenuButton asChild size="sm" variant="ghost" className="w-full justify-start" disabled={disabled} aria-disabled={disabled}>
                                             <Link href={`${childItem.href}?${userQuery}`}>
                                                 {childItem.icon ? <childItem.icon className="size-3 mr-2 text-primary-foreground/80" /> : <div className="w-3 mr-2" /> }
                                                 {childItem.label}
                                             </Link>
                                         </SidebarMenuButton>
                                     </SidebarMenuItem>
                                 ))}
                             </SidebarMenu>
                         </CollapsibleContent>
                    </Collapsible>
                );
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


export function AppShell({ children, user }: { children: React.ReactNode, user: User }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { state, isMobile } = useSidebar();
    const isInspectorView = user?.role === 'Inspector de Calidad';

    const userQuery = searchParams.toString();

    const getPageTitle = () => {
        if (pathname.startsWith('/ensayos/tuberias/hdpe')) return 'Ensayos de Tuberías HDPE';
        if (pathname.startsWith('/ensayos/tuberias/pp')) return 'Ensayos de Tuberías PP';
        if (pathname.startsWith('/ensayos/materia-prima')) return 'Ensayos de Materia Prima';
        if (pathname.startsWith('/ensayos/reprocesado')) return 'Ensayos de Reprocesado';
        if (pathname.startsWith('/ensayos/control-accesorios')) return 'Control de Accesorios';
        if (pathname.startsWith('/ensayos/control-agua')) return 'Control de Agua';
        if (pathname.startsWith('/ensayos/control-rutinario')) return 'Control Rutinario de Tuberías';
        if (pathname.startsWith('/ensayos/seguimiento')) return 'Seguimiento de Ensayos';
        if (pathname.startsWith('/administracion/usuarios')) return 'Gestión de Usuarios';
        if (pathname.startsWith('/administracion/basedatos')) return 'Base de Datos';
        if (pathname.startsWith('/administracion/permisos')) return 'Roles y Permisos';
        if (pathname.startsWith('/administracion/configuracion')) return 'Configuración';
        
        for (const item of menuItems) {
             if (item.href && pathname === item.href) return item.label;
        }

        return 'Dashboard';
    }

    return (
        <div className="flex min-h-screen w-full">
            <Sidebar variant="sidebar" collapsible="icon" className="bg-primary text-primary-foreground">
                <SidebarHeader>
                    <div className="flex items-center justify-center h-16 w-full text-primary-foreground">
                       <Logo className="w-32 h-auto group-data-[collapsible=icon]:w-10" />
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
                        {menuItems.map((item, index) => {
                            const isDisabled = isInspectorView && item.href !== '/ensayos/control-rutinario' && item.href !== '/dashboard';

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
                                        <Link href={`${item.href}?${userQuery}`}>
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
                    <div className="flex items-center gap-3 p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:py-2">
                        <Avatar className="h-10 w-10 border-2 border-primary-foreground/30">
                            <AvatarImage src={user.avatarUrl} alt={user.fullName} data-ai-hint="man portrait"/>
                            <AvatarFallback>{user.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-sm overflow-hidden group-data-[collapsible=icon]:hidden">
                            <span className="font-semibold truncate">{user.fullName}</span>
                            <span className="text-primary-foreground/70 text-xs truncate">{user.role}</span>
                        </div>
                    </div>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="md:hidden"/>
                         <h1 className="text-xl font-semibold font-headline text-foreground">
                           {getPageTitle()}
                        </h1>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {children}
                </main>
            </SidebarInset>
        </div>
    );
}

    
    
