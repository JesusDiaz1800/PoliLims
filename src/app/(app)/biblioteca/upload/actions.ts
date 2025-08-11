
"use server";

import { z } from "zod";
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { revalidatePath } from "next/cache";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
// Lista de tipos MIME más permisiva para documentos de oficina
const ACCEPTED_FILE_TYPES = [
  "text/plain",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
];

const formSchema = z.object({
  file: z
    .instanceof(File, { message: "Se requiere un archivo." })
    .refine((file) => file.size > 0, "El archivo no puede estar vacío.")
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `El tamaño máximo del archivo es de 5MB.`
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "Formato de archivo no soportado. Pruebe con .txt, .pdf, .doc, .docx, .xls, .xlsx"
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
