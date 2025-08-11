
"use server";

import * as dataService from "@/services/data-service";
import { revalidatePath } from "next/cache";

export async function deleteImportacionAction(importacionId: string) {
    try {
        await dataService.deleteImportacion(importacionId);
        revalidatePath('/importaciones');
        return { success: true, message: "El registro de importación ha sido eliminado correctamente." };
    } catch (error) {
        console.error("Failed to delete importacion", error);
        return { success: false, message: "No se pudo eliminar el registro. Intente de nuevo." };
    }
}
