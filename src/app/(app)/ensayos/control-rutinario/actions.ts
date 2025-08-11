
"use server";

import { revalidatePath } from "next/cache";
import * as dataService from "@/services/data-service";

export async function deleteRegistroAction(registroId: string) {
    try {
        await dataService.deleteRegistro(registroId);
        revalidatePath('/ensayos/control-rutinario');
        return { success: true, message: "El registro ha sido eliminado correctamente." };
    } catch (error) {
        console.error("Failed to delete registro", error);
        return { success: false, message: "No se pudo eliminar el registro. Intente de nuevo." };
    }
}
