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
} from '@/components/ui/sidebar';
import {
    LayoutDashboard,
    GitBranch,
    Users,
    FileText,
    Bot,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/workflows', label: 'Workflows', icon: GitBranch },
    { href: '/portal', label: 'Client Portal', icon: Users },
    { href: '/reports', label: 'Reports', icon: FileText },
    { href: '/troubleshooting', label: 'AI Troubleshooting', icon: Bot },
];

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { state, isMobile } = useSidebar();

    const getPageTitle = () => {
        const currentItem = menuItems.find(item => pathname.startsWith(item.href));
        if (currentItem) return currentItem.label;
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
                        {menuItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                                    tooltip={state === 'collapsed' && !isMobile ? item.label : undefined}
                                >
                                    <Link href={item.href}>
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
