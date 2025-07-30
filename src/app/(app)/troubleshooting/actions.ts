"use server";

import { z } from "zod";
import { aiPoweredTroubleshooting, AiPoweredTroubleshootingInput } from "@/ai/flows/ai-powered-troubleshooting";

const formSchema = z.object({
  errorMessage: z.string().min(10, "Error message must be at least 10 characters."),
  usagePatterns: z.string().min(10, "Usage patterns must be at least 10 characters."),
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
    const result = await aiPoweredTroubleshooting(parsed.data);
    return { message: "Success", data: result };
  } catch (error) {
    console.error("AI Troubleshooting Error:", error);
    return { message: "Failed to get suggestion from AI.", error: (error as Error).message };
  }
}
