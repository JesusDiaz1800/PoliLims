
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

type MenuItem = {
  href?: string;
  label?: string;
  icon?: any;
  subItems?: MenuItem[];
  subMenu?: MenuItem[];
  type?: "separator";
  onClick?: () => void;
};

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
  // An item is active if its href is a prefix of the current path
  const isActive = !!(item.href && pathname.startsWith(item.href));

  const Icon = item.icon;

  return (
    <Collapsible key={item.label ?? item.href} defaultOpen={isActive} className="w-full" disabled={disabled}>
      <CollapsibleTrigger asChild disabled={disabled}>
        <SidebarMenuButton
          variant="ghost"
          className="w-full justify-between group/button text-white hover:bg-white/10 hover:text-white data-[active=true]:text-cyan-400"
          isActive={isActive}
          disabled={disabled}
          aria-disabled={disabled}
        >
          <div className="flex items-center gap-3 flex-1">
            {Icon && <Icon className="size-5 shrink-0" />}
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
                return <SidebarSeparator key={`sub-sep-${index}`} className="my-1 bg-white/20" />;
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
                    className="w-full justify-start text-white hover:bg-white/10 hover:text-white data-[active=true]:text-cyan-400"
                    isActive={isSubItemActive}
                    disabled={disabled}
                    aria-disabled={disabled}
                  >
                    <Link href={hrefWithQuery}>
                      <div className="flex items-center">
                        {IconSub && <IconSub className="mr-2 size-4" />}
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

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/ensayos": "Ensayos",
  "/informes": "Informes y Certificados",
  "/biblioteca": "Biblioteca",
  "/asistentes": "Asistentes de IA",
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

const menuItems = (toggleChat: () => void): MenuItem[] => [
    // Acceso Rápido
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      label: "Ensayos",
      icon: SlidersHorizontal,
      href: "/ensayos",
      subMenu: [
        { label: "Tuberías HDPE", icon: Beaker, href: "/ensayos/tuberias/hdpe" },
        { label: "Tuberías PP", icon: Beaker, href: "/ensayos/tuberias/pp" },
        { label: "Materia Prima", icon: TestTube, href: "/ensayos/materia-prima" },
        { label: "Reprocesado", icon: Recycle, href: "/ensayos/reprocesado" },
        { type: "separator" },
        { label: "Control Rutinario", icon: ClipboardCheck, href: "/ensayos/control-rutinario" },
        { label: "Seguimiento General", icon: ClipboardList, href: "/ensayos/seguimiento" },
      ],
    },
    {
      label: "Informes",
      icon: FileText,
      href: "/reports",
      subMenu: [
        { href: "/reports/generador", label: "Generador de Informes", icon: FilePlus2 },
        { href: "/reports/biblioteca", label: "Biblioteca de Informes", icon: FileSearch },
      ],
    },
    { label: "Biblioteca", icon: Library, href: "/biblioteca/documentos" },
    {
      label: "Asistentes",
      icon: Code2,
      href: "/asistentes",
      subMenu: [
        { href: "/assistant", label: "Asistente de Código", icon: Code2 },
        { href: "#", label: "Soporte de Laboratorio", icon: MessageSquarePlus, onClick: toggleChat },
      ]
    },
    { type: "separator" },
    // Procesos de Gestión
    {
      label: "Procesos de Gestión",
      icon: Layers3,
      href: "/procesos",
      subMenu: [
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
          subItems: [
            { href: "/proveedores/gestion", label: "Gestión de Proveedores", icon: ClipboardList },
          ],
        },
        { href: "/workflows", label: "Flujos de Trabajo", icon: GitBranch },
        { href: "/administracion/formacion", label: "Formación y Competencia", icon: GraduationCap },
        { href: "/administracion/incertidumbre", label: "Calculadora de Incertidumbre", icon: Calculator },
        { href: "/importaciones", label: "Control de Importaciones", icon: Ship },
        { href: "/portal", label: "Portal de Clientes", icon: Users },
      ],
    },
    { type: "separator" },
    // Administración
    {
      label: "Administración",
      icon: Settings,
      href: "/admin",
      subMenu: [
        { href: "/administracion/usuarios", label: "Gestión de Usuarios", icon: Users },
        { href: "/administracion/permisos", label: "Roles y Permisos", icon: ShieldCheck },
        { href: "/administracion/configuracion", label: "Configuración", icon: Settings },
        { href: "/administracion/notificaciones", label: "Notificaciones", icon: Bell },
        { href: "/administracion/basedatos", label: "Base de Datos", icon: Database },
        { href: "/administracion/rutas", label: "Rutas Disponibles", icon: Map },
        { type: "separator" },
        { href: "/administracion/proximos-pasos", label: "Próximos Pasos", icon: Rocket },
      ],
    },
  ];

export function AppShell({ children, user }: { children: React.ReactNode; user: User }) {
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const { isMobile } = useSidebar();
  const { setIsOpen, setIsWidgetVisible } = useChatWidget();
  const isInspectorView = !!(user && user.role === "Inspector de Calidad");

  const userQuery = searchParams ? searchParams.toString() : "";

  const getPageTitle = React.useCallback(() => {
    const title = pageTitles[pathname];
    if (title) return title;
    // Fallback for nested routes
    for (const key in pageTitles) {
      if (pathname.startsWith(key) && key !== "/") {
        return pageTitles[key];
      }
    }
    return "Dashboard";
  }, [pathname]);

  const handleMenuClick = (e: React.MouseEvent, onClick?: () => void) => {
    if (onClick) {
      e.preventDefault();
      try {
        onClick();
      } catch (err) {
        // swallow
      }
      setIsWidgetVisible(true);
      setIsOpen(true);
    }
  };

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
            {menuItems(() => {
              setIsWidgetVisible(true);
              setIsOpen(true);
            }).map((item, index) => {
              const isDisabled =
                isInspectorView &&
                !["/dashboard", "/ensayos/control-rutinario"].some((p) =>
                  Boolean(item.href && item.href.startsWith(p))
                );

              if (item.type === "separator") {
                return <SidebarSeparator key={`sep-${index}`} className="my-2 bg-white/20" />;
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

              const isActive = pathname === item.href || (item.href && item.href !== "/" && pathname.startsWith(item.href));
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
                    className="text-white hover:bg-white/10 hover:text-white data-[active=true]:text-cyan-400"
                  >
                    <Link
                      href={hrefWithQuery}
                      onClick={(e) => handleMenuClick(e, item.onClick)}
                    >
                      <div className="flex items-center gap-3">
                        {Icon && <Icon className="size-5 shrink-0" />}
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
              <SidebarMenuButton
                asChild
                variant="ghost"
                tooltip={{ content: "Cerrar Sesión", side: "right", align: "center" }}
                className="text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/login">
                  <div className="flex items-center gap-3">
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
              {user?.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={user?.fullName ?? "User"} />
              ) : (
                <AvatarFallback>{user?.initials ?? "U"}</AvatarFallback>
              )}
            </Avatar>

            <div className="flex flex-col text-sm overflow-hidden group-data-[state=collapsed]/sidebar-wrapper:hidden">
              <span className="font-semibold truncate">{user?.fullName ?? "Usuario"}</span>
              <span className="text-white/70 text-xs truncate">{user?.role ?? ""}</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold font-headline text-foreground">{getPageTitle()}</h1>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 custom-scrollbar">{children}</main>
      </div>
    </div>
  );
}
