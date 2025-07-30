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
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem
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
    Thermometer,
    TestTube,
    Recycle,
    Wrench,
    Droplets,
    ClipboardCheck,
    ChevronDown,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

const ensayosSubMenu = [
    { 
      label: 'Tuberías', 
      icon: Thermometer,
      subItems: [
        { href: '/ensayos/tuberias/hdpe', label: 'HDPE' },
        { href: '/ensayos/tuberias/pp', label: 'PP' },
      ]
    },
    { href: '/ensayos/materia-prima', label: 'Materia Prima', icon: TestTube },
    { href: '/ensayos/reprocesado', label: 'Reprocesado', icon: Recycle },
    { href: '/ensayos/control-accesorios', label: 'Control de Accesorios', icon: Wrench },
    { href: '/ensayos/control-agua', label: 'Control de Agua', icon: Droplets },
    { href: '/ensayos/control-rutinario', label: 'Control Rutinario', icon: ClipboardCheck },
];

const administracionSubMenu = [
    { href: '/administracion/usuarios', label: 'Gestión de Usuarios', icon: Users },
    { href: '/administracion/basedatos', label: 'Base de Datos', icon: Database },
    { href: '/administracion/permisos', label: 'Roles y Permisos', icon: ShieldCheck },
];

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/workflows', label: 'Flujos de Trabajo', icon: GitBranch },
    { href: '/reports', label: 'Informes', icon: FileText },
    { type: 'separator' },
    {
        label: 'Ensayos',
        icon: FilePlus2,
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

const NavCollapsible = ({ item, pathname }: { item: any, pathname: string }) => (
    <Collapsible
      key={item.label}
      defaultOpen={pathname.startsWith(item.href)}
      className="w-full"
    >
      <CollapsibleTrigger asChild>
          <SidebarMenuButton
            variant="default"
            className="w-full justify-between"
            isActive={pathname.startsWith(item.href)}
          >
            <div className='flex items-center gap-2'>
              <item.icon />
              <span>{item.label}</span>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
          </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {item.subMenu.map((subItem: any) => (
            subItem.subItems ? (
                 <Collapsible key={subItem.label} defaultOpen={pathname.startsWith(subItem.href || '#')} className="w-full">
                     <CollapsibleTrigger asChild>
                         <SidebarMenuSubButton asChild size="sm" className="w-full justify-between pr-2">
                             <div className='flex items-center gap-2'>
                                <subItem.icon/>
                                {subItem.label}
                                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                             </div>
                         </SidebarMenuSubButton>
                     </CollapsibleTrigger>
                     <CollapsibleContent>
                         <SidebarMenuSub className="border-l-0 pl-4">
                             {subItem.subItems.map((childItem: any) => (
                                 <SidebarMenuSubItem key={childItem.href}>
                                     <SidebarMenuSubButton asChild size="sm" isActive={pathname === childItem.href}>
                                         <Link href={childItem.href}>{childItem.label}</Link>
                                     </SidebarMenuSubButton>
                                 </SidebarMenuSubItem>
                             ))}
                         </SidebarMenuSub>
                     </CollapsibleContent>
                 </Collapsible>
            ) : (
                <SidebarMenuSubItem key={subItem.href}>
                    <SidebarMenuSubButton asChild size="sm" isActive={pathname === subItem.href}>
                        <Link href={subItem.href}>
                           <subItem.icon className="mr-2" />
                           {subItem.label}
                        </Link>
                    </SidebarMenuSubButton>
                </SidebarMenuSubItem>
            )
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
);


export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { state, isMobile } = useSidebar();

    const getPageTitle = () => {
        for (const item of menuItems) {
             if (item.href && pathname === item.href) return item.label;
             if (item.subMenu) {
                for(const subItem of item.subMenu) {
                    if (subItem.href && pathname === subItem.href) return subItem.label;
                    if(subItem.subItems) {
                        const child = subItem.subItems.find(child => pathname === child.href);
                        if(child) return child.label;
                    }
                }
            }
        }
        if (pathname.startsWith('/ensayos/tuberias/hdpe')) return 'Ensayos de Tuberías HDPE';
        if (pathname.startsWith('/ensayos/tuberias/pp')) return 'Ensayos de Tuberías PP';
        if (pathname.startsWith('/ensayos/materia-prima')) return 'Ensayos de Materia Prima';
        if (pathname.startsWith('/ensayos/reprocesado')) return 'Ensayos de Reprocesado';
        if (pathname.startsWith('/ensayos/control-accesorios')) return 'Control de Accesorios';
        if (pathname.startsWith('/ensayos/control-agua')) return 'Control de Agua';
        if (pathname.startsWith('/ensayos/control-rutinario')) return 'Control Rutinario';
        if (pathname.startsWith('/administracion/usuarios')) return 'Gestión de Usuarios';
        if (pathname.startsWith('/administracion/basedatos')) return 'Base de Datos';
        if (pathname.startsWith('/administracion/permisos')) return 'Roles y Permisos';
        if (pathname === '/dashboard') return 'Dashboard';
        return 'PoliLIMS';
    }

    return (
        <div className="flex min-h-screen w-full bg-background/50 dark:bg-sidebar-background/50">
            <Sidebar>
                <SidebarHeader>
                    <div className="flex items-center gap-2.5">
                       <Logo className="w-12 h-12" />
                       <span className="font-headline text-xl font-semibold text-primary">PoliLIMS</span>
                    </div>
                </SidebarHeader>
                <SidebarContent className="p-2">
                    <SidebarMenu>
                        {menuItems.map((item, index) => {
                            if (item.type === 'separator') {
                                return <SidebarSeparator key={`sep-${index}`} className="my-1" />;
                            }
                            if (item.subMenu) {
                                return <NavCollapsible key={item.label} item={item} pathname={pathname} />;
                            }
                            return (
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
                            );
                        })}
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
