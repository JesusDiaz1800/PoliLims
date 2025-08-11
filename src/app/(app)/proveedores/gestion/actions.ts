
"use server";

import * as dataService from "@/services/data-service";
import { revalidatePath } from "next/cache";

export async function deleteProveedorAction(proveedorId: string) {
    try {
        await dataService.deleteProveedor(proveedorId);
        revalidatePath('/proveedores/gestion');
        return { success: true, message: "El proveedor ha sido eliminado correctamente." };
    } catch (error) {
        console.error("Failed to delete proveedor", error);
        return { success: false, message: "No se pudo eliminar el proveedor. Intente de nuevo." };
    }
}
