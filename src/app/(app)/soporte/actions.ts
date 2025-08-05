
"use server";

import { z } from "zod";
import { soporteLaboratorio, type SoporteInput } from "@/ai/flows/soporte-laboratorio";

const formSchema = z.object({
  prompt: z.string().min(1, "Your request must be at least 1 character."),
  history: z.array(z.object({
    role: z.string(),
    content: z.string(),
  })),
});

type FormState = {
  message: string;
  data?: {
    response: string;
    navigation?: string;
  } | null;
  error?: string | null;
  fieldErrors?: Record<string, string[] | undefined> | null;
}

export async function getSoporteSuggestion(prevState: FormState, formData: FormData): Promise<FormState> {
  
  const rawData = {
    prompt: formData.get("prompt"),
    history: JSON.parse(formData.get("history") as string || "[]"),
  }

  const parsed = formSchema.safeParse(rawData);

  if (!parsed.success) {
    return { 
      message: "Invalid form data.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await soporteLaboratorio(parsed.data as SoporteInput);
    return { message: "Success", data: result };
  } catch (error) {
    console.error("AI Soporte Error:", error);
    return { message: "Failed to get suggestion from AI.", error: (error as Error).message };
  }
}
