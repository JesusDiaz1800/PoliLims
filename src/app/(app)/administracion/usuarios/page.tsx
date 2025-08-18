
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Search, UserPlus, Filter, Edit, Trash2 } from "lucide-react";
import * as userService from "@/services/user-service";
import { useToast } from "@/hooks/use-toast";


export default function UsuariosPage() {
    const [users, setUsers] = React.useState<userService.User[]>([]);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [roleFilter, setRoleFilter] = React.useState("Todos");
    const { toast } = useToast();

    React.useEffect(() => {
        const fetchUsers = async () => {
            const allUsers = await userService.getAllUsers();
            setUsers(allUsers);
        };
        fetchUsers();
    }, []);

    const handleAction = (action: string, userName: string) => {
        toast({
            title: `Acción: ${action}`,
            description: `Funcionalidad para '${userName}' no implementada en este prototipo.`,
        });
    }

    const roles = ["Todos", ...Array.from(new Set(users.map(u => u.role)))];

    const filteredUsers = users
        .filter(user => roleFilter === 'Todos' || user.role === roleFilter)
        .filter(user => 
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex-1 space-y-1.5">
                        <CardTitle>Gestión de Usuarios</CardTitle>
                        <CardDescription>Administre el personal, sus roles y accesos al sistema.</CardDescription>
                    </div>
                    <div className="flex w-full sm:w-auto items-center gap-2">
                        <div className="relative flex-1 sm:flex-initial">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nombre o usuario..."
                                className="pl-9 w-full sm:w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                         <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Filtrar por rol" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map(role => (
                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button className="w-full sm:w-auto" onClick={() => handleAction('Añadir Usuario', '')}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Añadir Usuario
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.username}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                                            <AvatarFallback>{user.initials}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{user.fullName}</p>
                                            <p className="text-sm text-muted-foreground">{user.username}@polifusion.cl</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-green-600 border-green-600/50 bg-green-500/10">Activo</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => handleAction('Editar Usuario', user.fullName)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive" onClick={() => handleAction('Eliminar Usuario', user.fullName)}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Eliminar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
