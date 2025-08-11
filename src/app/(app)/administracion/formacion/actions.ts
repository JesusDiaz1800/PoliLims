
"use server";

import * as dataService from "@/services/data-service";
import { revalidatePath } from "next/cache";

export async function deleteFormacionAction(formacionId: string) {
    try {
        await dataService.deleteFormacion(formacionId);
        revalidatePath('/administracion/formacion');
        return { success: true, message: "El registro de formación ha sido eliminado." };
    } catch (error) {
        console.error("Failed to delete formacion", error);
        return { success: false, message: "No se pudo eliminar el registro. Intente de nuevo." };
    }
}
