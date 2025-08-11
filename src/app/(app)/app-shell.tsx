
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
  SidebarSeparator,
} from "@/components/ui/sidebar";
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
  HardHat,
  Factory,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { User } from "@/services/user-service";
import { Logo } from "@/components/logo";
import { useChatWidget } from "@/components/soporte/chat-widget";
import { cn } from "@/lib/utils";

type MenuItem = {
  href?: string;
  label?: string;
  icon?: any;
  subItems?: MenuItem[];
  subMenu?: MenuItem[];
  type?: "separator";
  onClick?: () => void;
};

/* ----------- Submenus ----------- */
const ensayosSubMenu: MenuItem[] = [
  {
    label: "Tuberías",
    icon: HardHat, // Reemplazado de SlidersHorizontal
    href: "/ensayos/tuberias",
    subItems: [
      { href: "/ensayos/tuberias/hdpe", label: "HDPE", icon: Beaker },
      { href: "/ensayos/tuberias/pp", label: "PP", icon: Beaker },
    ],
  },
  { href: "/ensayos/materia-prima", label: "Materia Prima", icon: TestTube },
  { href: "/ensayos/reprocesado", label: "Reprocesado", icon: Recycle },
  { type: "separator" },
  { href: "/ensayos/control-rutinario", label: "Control Rutinario", icon: ClipboardCheck },
  { href: "/ensayos/control-accesorios", label: "Control de Accesorios", icon: Wrench },
  { href: "/ensayos/control-agua", label: "Control de Agua", icon: Droplets },
  { type: "separator" },
  { href: "/ensayos/seguimiento", label: "Seguimiento General", icon: ClipboardList },
];

const gestionSubMenu: MenuItem[] = [
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

const administracionSubMenu: MenuItem[] = [
  { href: "/administracion/usuarios", label: "Gestión de Usuarios", icon: Users },
  { href: "/administracion/basedatos", label: "Base de Datos", icon: Database },
  { href: "/administracion/permisos", label: "Roles y Permisos", icon: ShieldCheck },
  { href: "/administracion/notificaciones", label: "Notificaciones", icon: Bell },
  { href: "/administracion/configuracion", label: "Configuración", icon: Settings },
  { href: "/administracion/rutas", label: "Rutas Disponibles", icon: Map },
  { type: "separator" },
  { href: "/administracion/proximos-pasos", label: "Próximos Pasos", icon: Rocket },
];

/* ----------- NavCollapsible ----------- */
const NavCollapsible = ({
  item,
  pathname,
  disabled = false,
  userQuery,
}: {
  item: MenuItem;
  pathname: string;
  disabled?: boolean;
  userQuery?: string;
}) => {
  const subMenuItems = item.subMenu || item.subItems;
  const isActive = !!(item.href && pathname.startsWith(item.href));
  const Icon = item.icon;

  return (
    <Collapsible key={item.label ?? item.href} defaultOpen={isActive} className="w-full" disabled={disabled}>
      <CollapsibleTrigger asChild disabled={disabled}>
        <SidebarMenuButton
          variant="ghost"
          className="w-full justify-between group/button text-white/80 hover:bg-white/10 hover:text-white data-[active=true]:bg-white/10 data-[active=true]:text-white"
          isActive={isActive}
          disabled={disabled}
          aria-disabled={disabled}
          aria-expanded={isActive}
        >
          <div className="flex items-center gap-3 flex-1">
            {Icon && <Icon className="size-5 shrink-0" aria-hidden />}
            <span className="truncate">{item.label}</span>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/button:rotate-180" />
        </SidebarMenuButton>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <SidebarMenu className="pl-4">
          {subMenuItems &&
            subMenuItems.map((subItem, index) => {
              if (!subItem) return null;
              if (subItem.type === "separator") {
                return <SidebarSeparator key={`sub-sep-${index}`} className="my-1" />;
              }

              if (subItem.subItems || (subItem.subMenu && subItem.subMenu.length > 0)) {
                return (
                  <NavCollapsible
                    key={subItem.label ?? subItem.href ?? `nested-${index}`}
                    item={subItem}
                    pathname={pathname}
                    disabled={disabled}
                    userQuery={userQuery}
                  />
                );
              }

              const IconSub = subItem.icon;
              const isSubItemActive = pathname === subItem.href;
              const hrefWithQuery = subItem.href ? `${subItem.href}${userQuery ? `?${userQuery}` : ""}` : "#";

              return (
                <SidebarMenuItem key={subItem.href ?? `sub-${index}`}>
                  <SidebarMenuButton
                    asChild
                    size="sm"
                    variant="ghost"
                    className="w-full justify-start text-white/80 hover:bg-white/10 hover:text-white data-[active=true]:bg-white/10 data-[active=true]:text-white"
                    isActive={isSubItemActive}
                    disabled={disabled}
                    aria-disabled={disabled}
                  >
                    <Link href={hrefWithQuery}>
                      <div className="flex items-center">
                        {IconSub && <IconSub className="mr-2 size-4" aria-hidden />}
                        <span>{subItem.label}</span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
        </SidebarMenu>
      </CollapsibleContent>
    </Collapsible>
  );
};

/* ---------------- Page Titles ---------------- */
const pageTitles: Record<string, string> = {
  "/equipos": "Inventario de Equipos",
  "/equipos/control": "Control de Equipos",
  "/equipos/programa": "Programa de Calibración y Mantenimiento",
  "/control-ambiental": "Control de Condiciones Ambientales",
  "/auditorias": "Gestión de Auditorías",
  "/ensayos/tuberias/hdpe": "Ensayos de Tuberías HDPE",
  "/ensayos/tuberias/pp": "Ensayos de Tuberías PP",
  "/ensayos/materia-prima": "Ensayos de Materia Prima",
  "/ensayos/reprocesado": "Ensayos de Reprocesado",
  "/ensayos/control-accesorios": "Control de Accesorios",
  "/ensayos/control-agua": "Control de Agua",
  "/ensayos/control-rutinario": "Control Rutinario de Tuberías",
  "/ensayos/seguimiento": "Seguimiento General de Ensayos",
  "/administracion/usuarios": "Gestión de Usuarios",
  "/administracion/formacion": "Gestión de Formación y Competencia",
  "/administracion/basedatos": "Base de Datos",
  "/administracion/permisos": "Roles y Permisos",
  "/administracion/notificaciones": "Notificaciones",
  "/administracion/incertidumbre": "Calculadora de Incertidumbre",
  "/administracion/configuracion": "Configuración",
  "/administracion/proximos-pasos": "Próximos Pasos para Producción",
  "/administracion/rutas": "Rutas Disponibles",
  "/assistant": "Asistente de Código",
  "/portal": "Portal de Clientes",
  "/importaciones": "Control de Importaciones",
  "/no-conformidades": "Gestión de No Conformidades",
  "/biblioteca/documentos": "Gestor Documental",
  "/reports/generador": "Generador de Informes y Certificados",
  "/reports/biblioteca": "Biblioteca de Informes",
  "/workflows": "Flujos de Trabajo",
  "/proveedores/gestion": "Gestión de Proveedores",
  "/procesos/equipos/lista": "Lista de Equipos",
  "/procesos/equipos/mantenimiento": "Mantenimiento de Equipos",
  "/procesos/equipos/calibraciones": "Calibraciones de Equipos",
  "/procesos/auditorias": "Auditorías",
  "/procesos/control-ambiental": "Control Ambiental",
  "/procesos/no-conformidades": "No Conformidades",
  "/procesos/proveedores/lista": "Lista de Proveedores",
  "/procesos/proveedores/evaluaciones": "Evaluaciones de Proveedores",
  "/procesos/flujos": "Flujos de Trabajo",
  "/procesos/formacion": "Formación y Competencia",
  "/procesos/calculadora-incertidumbre": "Calculadora de Incertidumbre",
  "/procesos/control-importaciones": "Control de Importaciones",
  "/procesos/portal-clientes": "Portal de Clientes",
  "/admin/usuarios": "Gestión de Usuarios",
  "/admin/roles": "Roles y Permisos",
  "/admin/configuracion": "Configuración del Sistema",
};

/* ---------------- Menu Items ---------------- */
const menuItems = (toggleChat: () => void): MenuItem[] => [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    label: "Ensayos",
    icon: HardHat,
    subMenu: ensayosSubMenu,
    href: "/ensayos",
  },
  {
    label: "Informes",
    icon: FileText,
    href: "/reports",
    subItems: [
      { href: "/reports/generador", label: "Generador de Informes", icon: FilePlus2 },
      { href: "/reports/biblioteca", label: "Biblioteca de Informes", icon: FileSearch },
    ],
  },
  {
    label: "Biblioteca",
    icon: Library,
    href: "/biblioteca",
    subItems: [{ href: "/biblioteca/documentos", label: "Documentos", icon: Library }],
  },
  {
    label: "Asistentes",
    icon: Code2,
    href: "/asistentes",
     subItems: [
      { href: "/soporte", label: "Soporte de Laboratorio", icon: MessageSquarePlus, onClick: toggleChat },
      { href: "/assistant", label: "Asistente de Código", icon: Code2 },
    ],
  },
  { type: "separator" },
  {
    label: "Operaciones de Gestión",
    icon: Factory, // Usando un icono más representativo
    subMenu: gestionSubMenu,
    href: "/procesos",
  },
  { type: "separator" },
  {
    label: "Administración",
    icon: Settings,
    subMenu: administracionSubMenu,
    href: "/admin",
  },
];

/* ---------------- AppShell ---------------- */
export function AppShell({ children, user }: { children: React.ReactNode; user: User }) {
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const { setIsOpen, setIsWidgetVisible } = useChatWidget();
  const isInspectorView = !!(user && user.role === "Inspector de Calidad");

  const userQuery = searchParams ? searchParams.toString() : "";

  const getPageTitle = React.useCallback(() => {
    const title = pageTitles[pathname];
    if (title) return title;
    
    for (const item of menuItems(() => {})) {
      if (!item.href) continue;
      if(pathname.startsWith(item.href)) return item.label ?? "Dashboard";

      if(item.subMenu) {
          for (const subItem of item.subMenu) {
               if(subItem.href && pathname.startsWith(subItem.href)) return subItem.label ?? item.label ?? "Dashboard";
          }
      }
    }

    return "Dashboard";
  }, [pathname]);

  const handleMenuClick = (e: React.MouseEvent, onClick?: () => void) => {
    if (onClick) {
      e.preventDefault();
      try {
        onClick();
      } catch {
        // ignore
      }
      setIsWidgetVisible(true);
      setIsOpen(true);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <Sidebar
        className="border-r-0"
        style={{ backgroundColor: 'hsl(var(--card))' }}
        role="navigation"
        aria-label="Main sidebar"
      >
        <SidebarContent>
          <div className="py-4 pl-1 overflow-hidden transition-all duration-300">
            <Logo className="w-44 group-data-[state=collapsed]/sidebar-wrapper:w-9 group-data-[state=collapsed]/sidebar-wrapper:px-0" />
          </div>

          {isInspectorView && (
            <Alert className="m-2 border-primary/30 bg-primary/10" role="status">
              <Info className="h-4 w-4 text-primary" aria-hidden />
              <AlertTitle className="text-primary/90">Modo Inspector</AlertTitle>
              <AlertDescription className="text-primary/70">
                La vista está limitada a las funciones de inspector de calidad.
              </AlertDescription>
            </Alert>
          )}

          <SidebarMenu>
            {menuItems(() => setIsOpen(true)).map((item, index) => {
              const isDisabled =
                isInspectorView &&
                !["/dashboard", "/ensayos/control-rutinario"].some((p) => Boolean(item.href && item.href.startsWith(p)));

              if (item.type === "separator") {
                return <SidebarSeparator key={`sep-${index}`} className="my-2" />;
              }

              if (item.subMenu) {
                return (
                  <NavCollapsible
                    key={item.label ?? item.href ?? `menu-${index}`}
                    item={item}
                    pathname={pathname}
                    disabled={isDisabled}
                    userQuery={userQuery}
                  />
                );
              }

              const isActive = pathname === item.href || (item.href && item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;
              const hrefWithQuery = item.href ? `${item.href}${userQuery ? `?${userQuery}` : ""}` : "#";

              return (
                <SidebarMenuItem key={item.href ?? `item-${index}`}>
                  <SidebarMenuButton
                    asChild
                    variant="ghost"
                    isActive={isActive}
                    tooltip={{ content: item.label ?? "", side: "right", align: "center" }}
                    disabled={isDisabled}
                    aria-disabled={isDisabled}
                    className="text-white/80 hover:bg-white/10 hover:text-white data-[active=true]:bg-white/10 data-[active=true]:text-white"
                  >
                    <Link
                      href={hrefWithQuery}
                      onClick={(e) => handleMenuClick(e, item.onClick)}
                    >
                      <div className="flex items-center gap-3">
                        {Icon && <Icon className="size-5 shrink-0" aria-hidden />}
                        <span className="truncate">{item.label}</span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
  
          <SidebarFooter className="px-3 py-2 border-t">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  size="sm"
                  variant="ghost"
                  tooltip={{ content: "Cerrar Sesión", side: "right", align: "center" }}
                  className="text-white/80 hover:bg-white/10 hover:text-white"
                >
                  <Link href="/login" aria-label="Cerrar sesión">
                    <div className="flex items-center gap-3">
                      <LogOut className="size-5 shrink-0" aria-hidden />
                      <span className="truncate">Cerrar Sesión</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
  
            <SidebarSeparator className="my-2" />
  
            <div className="flex items-center gap-3 group-data-[state=collapsed]/sidebar-wrapper:justify-center group-data-[state=collapsed]/sidebar-wrapper:py-2">
              <Avatar className="h-10 w-10 border-2" aria-label={`Avatar de ${user?.fullName ?? "usuario"}`}>
                {user?.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={user?.fullName ?? "User"} />
                ) : (
                  <AvatarFallback>{user?.initials ?? "U"}</AvatarFallback>
                )}
              </Avatar>
  
              <div className="flex flex-col text-sm overflow-hidden group-data-[state=collapsed]/sidebar-wrapper:hidden">
                <span className="font-semibold truncate">{user?.fullName ?? "Usuario"}</span>
                <span className="text-xs truncate">{user?.role ?? ""}</span>
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
              <h1 className="text-xl font-semibold font-headline text-foreground" tabIndex={-1}>
                {getPageTitle()}
              </h1>
            </div>
          </header>
  
          <main
            className="flex-1 overflow-auto p-4 sm:p-6 custom-scrollbar"
            role="main"
            tabIndex={-1}
          >
            {children}
          </main>
        </div>
      </div>
    );
  }
