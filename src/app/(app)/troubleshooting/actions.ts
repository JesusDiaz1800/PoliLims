
"use server";

import { z } from "zod";
import { troubleshootingAssistant, type TroubleshootingInput } from "@/ai/flows/troubleshooting-flow";

const formSchema = z.object({
  errorMessage: z.string().min(10, "El mensaje de error debe tener al menos 10 caracteres."),
  usagePatterns: z.string().min(20, "La descripción del uso debe tener al menos 20 caracteres."),
});

type FormState = {
  message: string;
  data?: {
    problemIdentification: string;
    suggestedSolutions: string;
    relevantDocumentation: string;
  } | null;
  error?: string | null;
  fieldErrors?: Record<string, string[] | undefined> | null;
}

export async function getTroubleshootingSuggestion(prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = formSchema.safeParse({
    errorMessage: formData.get("errorMessage"),
    usagePatterns: formData.get("usagePatterns"),
  });

  if (!parsed.success) {
    return { 
      message: "Invalid form data.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await troubleshootingAssistant(parsed.data as TroubleshootingInput);
    return { message: "Success", data: result };
  } catch (error) {
    console.error("AI Troubleshooting Error:", error);
    return { message: "Failed to get suggestion from AI.", error: (error as Error).message };
  }
}
