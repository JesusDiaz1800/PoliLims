
"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  TestTube,
  Recycle,
  ClipboardCheck,
  Wrench,
  Droplets,
  ClipboardList,
  Users,
  GraduationCap,
  Database,
  ShieldCheck,
  Bell,
  Calculator,
  Settings,
  Map,
  Rocket,
  Ship,
  Library,
  FilePlus2,
  FileSearch,
  GitBranch,
  Thermometer,
  AlertOctagon,
  Code2,
  MessageSquarePlus,
  LogOut,
  Info,
  CalendarCheck,
  History,
  Truck,
  BookCheck,
  FileText,
  SlidersHorizontal,
  Search,
  Beaker,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { User } from "@/services/user-service";
import { Logo } from "@/components/logo";
import { useChatWidget } from "@/components/soporte/chat-widget";
import { Input } from "./ui/input";

const ensayosSubMenu = [
    { 
      label: 'Tuberías', 
      icon: SlidersHorizontal,
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
    label: "Gestión de Equipos",
    icon: BookCheck,
    href: "/equipos",
    subItems: [
      { href: "/equipos", label: "Inventario de Equipos", icon: ClipboardList },
      { href: "/equipos/control", label: "Control de Equipos", icon: History },
      { href: "/equipos/programa", label: "Programa", icon: CalendarCheck },
    ],
  },
  { href: "/auditorias", label: "Auditorías", icon: ClipboardCheck },
  { href: "/control-ambiental", label: "Control Ambiental", icon: Thermometer },
  { href: "/no-conformidades", label: "No Conformidades", icon: AlertOctagon },
  {
    label: "Proveedores",
    icon: Truck,
    href: "/proveedores",
    subItems: [{ href: "/proveedores/gestion", label: "Gestión de Proveedores", icon: ClipboardList }],
  },
  { href: "/workflows", label: "Flujos de Trabajo", icon: GitBranch },
  { href: "/administracion/formacion", label: "Formación y Competencia", icon: GraduationCap },
  { href: "/administracion/incertidumbre", label: "Calculadora de Incertidumbre", icon: Calculator },
  { href: "/importaciones", label: "Control de Importaciones", icon: Ship },
  { href: "/portal", label: "Portal de Clientes", icon: Users },
];


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


const bibliotecaSubMenu = [
    { href: '/biblioteca/documentos', label: 'Documentos', icon: Library },
];

const reportsSubMenu = [
    { href: '/reports/generador', label: 'Generador de Informes', icon: FilePlus2 },
    { href: '/reports/biblioteca', label: 'Biblioteca de Informes', icon: FileSearch },
];


function NavCollapsible({ item, pathname, disabled = false, userQuery, isSearchActive }: { item: any; pathname: string; disabled?: boolean; userQuery: string, isSearchActive?: boolean }) {
  const subMenuItems = item.subMenu || item.subItems;
  const defaultOpen = isSearchActive || pathname.startsWith(item.href);

  return (
    <Collapsible key={item.label} defaultOpen={defaultOpen} className="w-full" disabled={disabled}>
      <CollapsibleTrigger asChild disabled={disabled}>
        <SidebarMenuButton
          variant="ghost"
          className="w-full justify-between group/button"
          isActive={pathname.startsWith(item.href)}
          disabled={disabled}
          aria-disabled={disabled}
        >
          <div className="flex items-center gap-3 flex-1">
            <item.icon className="size-5 shrink-0" />
            <span className="truncate">{item.label}</span>
          </div>
          <svg
            className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/button:rotate-180"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
          </svg>
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenu className="pl-4">
          {subMenuItems &&
            subMenuItems.map((subItem: any, index: number) => {
              if (subItem.type === "separator") {
                return <SidebarSeparator key={`sub-sep-${index}`} className="my-1 bg-white/20 dark:bg-gray-700" />;
              }
              if (subItem.subItems || (subItem.subMenu && subItem.subMenu.length > 0)) {
                return <NavCollapsible key={subItem.label || subItem.href} item={subItem} pathname={pathname} disabled={disabled} userQuery={userQuery} isSearchActive={isSearchActive}/>;
              }
              const isSubItemActive = pathname === subItem.href;

              return (
                <SidebarMenuItem key={subItem.href}>
                  <SidebarMenuButton
                    asChild
                    size="sm"
                    variant="ghost"
                    className="w-full justify-start text-white hover:bg-white/10 data-[active=true]:bg-white/10"
                    isActive={isSubItemActive}
                    disabled={disabled}
                    aria-disabled={disabled}
                  >
                    <Link href={`${subItem.href}?${userQuery}`} className="relative">
                      {isSubItemActive && <div className="absolute left-[-1rem] top-0 bottom-0 w-1 bg-white dark:bg-primary rounded-r-full"></div>}
                      {subItem.icon && <subItem.icon className="mr-2 size-4" />}
                      <span>{subItem.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
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
    '/administracion/incertidumbre': 'Calculadora de Incertidumbre',
    '/administracion/configuracion': 'Configuración',
    '/administracion/proximos-pasos': 'Próximos Pasos para Producción',
    '/administracion/rutas': 'Rutas Disponibles',
    '/administracion/notificaciones': 'Gestión de Notificaciones',
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

const menuItems = (toggleChat: () => void): any[] => [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
        label: 'Ensayos',
        icon: TestTube,
        subMenu: ensayosSubMenu,
        href: '/ensayos'
    },
    { 
        label: 'Procesos de Gestión', 
        icon: GitBranch,
        subMenu: procesosGestionSubMenu,
        href: '/gestion',
    },
     { 
        label: 'Informes y Certificados', 
        icon: FileText,
        subMenu: reportsSubMenu,
        href: '/reports',
    },
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

export function AppShell({ children, user }: { children: React.ReactNode; user: User }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isMobile } = useSidebar();
  const { setIsOpen, setIsWidgetVisible } = useChatWidget();
  const isInspectorView = user?.role === "Inspector de Calidad";
  const userQuery = searchParams.toString();
  const [searchTerm, setSearchTerm] = React.useState("");

  const getPageTitle = React.useCallback(() => {
    const title = pageTitles[pathname];
    if (title) return title;

    for (const item of menuItems(() => {})) {
      if (item.href && pathname === item.href) return item.label;
    }

    return "Dashboard";
  }, [pathname]);

  const handleMenuClick = (e: React.MouseEvent, onClick?: () => void) => {
    if (onClick) {
      e.preventDefault();
      setIsWidgetVisible(true);
      setIsOpen(true);
    }
  };

  const filterMenu = (menu: any[], term: string): any[] => {
    if (!term) return menu;
    const lowerCaseTerm = term.toLowerCase();

    return menu.reduce((acc: any[], item: any) => {
      if (item.type === 'separator') {
        return acc;
      }
      
      const labelMatch = item.label.toLowerCase().includes(lowerCaseTerm);

      if (item.subMenu || item.subItems) {
        const subItems = item.subMenu || item.subItems;
        const filteredSub = filterMenu(subItems, term);
        if (filteredSub.length > 0) {
          acc.push({ ...item, subMenu: filteredSub, subItems: filteredSub });
        } else if (labelMatch) {
          acc.push({ ...item, subMenu: [], subItems: []});
        }
      } else if (labelMatch) {
        acc.push(item);
      }
      return acc;
    }, []);
  };

  const filteredMenuItems = filterMenu(menuItems(() => setIsOpen(true)), searchTerm);

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <Sidebar
        className="
          bg-[#1C3664] text-white
          dark:bg-card
          shadow-lg
          transition-colors duration-300
        "
      >
        <SidebarContent>
          <div className="py-4 overflow-hidden transition-all duration-300">
            <Logo className="w-48 group-data-[state=collapsed]/sidebar-wrapper:w-9 group-data-[state=collapsed]/sidebar-wrapper:px-0" />
          </div>

          <div className="px-3 pb-2 group-data-[state=collapsed]/sidebar-wrapper:hidden">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
                <Input
                  type="search"
                  placeholder="Buscar en el menú..."
                  className="w-full rounded-lg bg-white/10 pl-8 h-9 border-0 text-white placeholder:text-white/50 focus:bg-white/20 focus:ring-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

          {isInspectorView && (
            <Alert className="m-2 border-cyan-600/30 bg-cyan-600/10 text-cyan-300 dark:border-cyan-400/50 dark:bg-cyan-900/30 dark:text-cyan-400">
              <Info className="h-4 w-4 text-cyan-500" />
              <AlertTitle className="text-cyan-300 dark:text-cyan-400">Modo Inspector</AlertTitle>
              <AlertDescription className="text-cyan-200 dark:text-cyan-300">
                La vista está limitada a las funciones de inspector de calidad.
              </AlertDescription>
            </Alert>
          )}

          <SidebarMenu>
            {filteredMenuItems.length > 0 ? filteredMenuItems.map((item, index) => {
              const isDisabled =
                isInspectorView &&
                !["/dashboard", "/ensayos/control-rutinario"].some((p) =>
                  item.href?.startsWith(p)
                );

              if (item.type === "separator") {
                return (
                  <SidebarSeparator
                    key={`sep-${index}`}
                    className="my-2 bg-white/20 dark:bg-gray-700"
                  />
                );
              }
              if (item.subMenu) {
                return (
                  <NavCollapsible
                    key={item.label}
                    item={item}
                    pathname={pathname}
                    disabled={isDisabled}
                    userQuery={userQuery}
                    isSearchActive={!!searchTerm}
                  />
                );
              }

              const isActive =
                pathname === item.href ||
                (item.href && item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <SidebarMenuItem key={item.href || index}>
                  <SidebarMenuButton
                    asChild
                    variant="ghost"
                    isActive={isActive}
                    tooltip={{ content: item.label, side: "right", align: "center" }}
                    disabled={isDisabled}
                    aria-disabled={isDisabled}
                    className="
                      text-white
                      hover:bg-white/10
                      dark:hover:bg-muted
                      data-[active=true]:bg-white/10
                      data-[active=true]:dark:text-foreground
                      relative
                    "
                  >
                    <Link
                      href={`${item.href}?${userQuery}`}
                      onClick={(e) => handleMenuClick(e, item.onClick)}
                    >
                      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white dark:bg-primary rounded-r-full"></div>}
                      <div className="flex items-center gap-3">
                        <item.icon className="size-5 shrink-0" aria-hidden="true" />
                        <span className="truncate">{item.label}</span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }) : (
              <div className="text-center text-white/60 p-4 text-sm group-data-[state=expanded]/sidebar-wrapper:block hidden">
                <p>No se encontraron resultados para "{searchTerm}"</p>
              </div>
            )}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="px-3 py-2 border-t border-white/20 dark:border-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                size="sm"
                variant="ghost"
                tooltip={{ content: "Cerrar Sesión", side: "right", align: "center" }}
                className="text-white hover:bg-white/10 dark:text-foreground/80 dark:hover:bg-muted dark:hover:text-foreground"
              >
                <Link href="/login" aria-label="Cerrar sesión">
                  <div className="flex items-center gap-3">
                    <LogOut className="size-5 shrink-0" aria-hidden="true" />
                    <span className="truncate">Cerrar Sesión</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarSeparator className="my-2 bg-white/20 dark:bg-border" />

          <div className="flex items-center gap-3 group-data-[state=collapsed]/sidebar-wrapper:justify-center group-data-[state=collapsed]/sidebar-wrapper:py-2">
            <Avatar
              className="h-10 w-10 border-2 border-white/30 dark:border-border"
              aria-label={`Avatar de ${user?.fullName ?? "usuario"}`}
            >
              {user?.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={user?.fullName ?? "User"} />
              ) : (
                <AvatarFallback>{user?.initials ?? "U"}</AvatarFallback>
              )}
            </Avatar>

            <div className="flex flex-col text-sm overflow-hidden group-data-[state=collapsed]/sidebar-wrapper:hidden">
              <span className="font-semibold truncate text-white dark:text-foreground">{user?.fullName ?? "Usuario"}</span>
              <span className="text-white/70 dark:text-muted-foreground text-xs truncate">{user?.role ?? ""}</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <header
          className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6"
          role="banner"
        >
          <div className="flex items-center gap-2">
            <SidebarTrigger aria-label="Toggle sidebar" />
            <h1
              className="text-xl font-semibold font-headline text-foreground"
              tabIndex={-1}
            >
              {getPageTitle()}
            </h1>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto relative" style={{ WebkitOverflowScrolling: "touch" }}>
            <main
                className="min-w-full p-4 sm:p-6 custom-scrollbar"
                role="main"
                tabIndex={-1}
            >
                {children}
            </main>
        </div>
      </div>
    </div>
  );
}
