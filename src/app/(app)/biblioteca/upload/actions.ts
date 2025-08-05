
"use server";

import { z } from "zod";
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { revalidatePath } from "next/cache";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB
const ACCEPTED_FILE_TYPES = ["text/plain"];

const formSchema = z.object({
  file: z
    .instanceof(File, { message: "Se requiere un archivo." })
    .refine((file) => file.size > 0, "El archivo no puede estar vacío.")
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `El tamaño máximo del archivo es de 4MB.`
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "Solo se permiten archivos .txt"
    ),
});

type FormState = {
  message: string;
  error?: string | null;
  fieldErrors?: Record<string, string[] | undefined> | null;
}

export async function uploadDocument(prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = formSchema.safeParse({
    file: formData.get("file"),
  });

  if (!parsed.success) {
    return { 
      message: "Formulario inválido.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { file } = parsed.data;

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Guardar el archivo en public/data
    const filePath = join(process.cwd(), 'public', 'data', file.name);
    await writeFile(filePath, buffer);

    console.log(`Archivo cargado y guardado en: ${filePath}`);

    // Revalidar la ruta para que la tabla de documentos se actualice
    revalidatePath('/biblioteca/documentos');

    return { message: "Archivo cargado con éxito." };
  } catch (error) {
    console.error("Error al cargar el archivo:", error);
    return { message: "Error al cargar el archivo.", error: (error as Error).message };
  }
}
