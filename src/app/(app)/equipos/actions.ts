
"use server";

import * as dataService from "@/services/data-service";
import { revalidatePath } from "next/cache";

export async function deleteEquipoAction(equipoId: string) {
    try {
        await dataService.deleteEquipo(equipoId);
        revalidatePath('/equipos');
        return { success: true, message: "El equipo ha sido eliminado correctamente." };
    } catch (error) {
        console.error("Failed to delete equipo", error);
        return { success: false, message: "No se pudo eliminar el equipo. Intente de nuevo." };
    }
}
