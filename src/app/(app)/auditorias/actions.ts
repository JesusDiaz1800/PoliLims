
"use server";

import * as dataService from "@/services/data-service";
import { revalidatePath } from "next/cache";

export async function deleteAuditoriaAction(auditoriaId: string) {
    try {
        await dataService.deleteAuditoria(auditoriaId);
        revalidatePath('/auditorias');
        return { success: true, message: "La auditoría ha sido eliminada correctamente." };
    } catch (error) {
        console.error("Failed to delete auditoria", error);
        return { success: false, message: "No se pudo eliminar la auditoría. Intente de nuevo." };
    }
}
