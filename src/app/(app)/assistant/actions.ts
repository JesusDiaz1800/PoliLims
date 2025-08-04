
"use server";

import { z } from "zod";
import { codeAssistant } from "@/ai/flows/code-assistant";

const formSchema = z.object({
  prompt: z.string().min(10, "Your request must be at least 10 characters."),
});

type FormState = {
  message: string;
  data?: {
    response: string;
  } | null;
  error?: string | null;
  fieldErrors?: Record<string, string[] | undefined> | null;
}

export async function getCodeSuggestion(prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = formSchema.safeParse({
    prompt: formData.get("prompt"),
  });

  if (!parsed.success) {
    return { 
      message: "Invalid form data.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await codeAssistant(parsed.data);
    return { message: "Success", data: result };
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return { message: "Failed to get suggestion from AI.", error: (error as Error).message };
  }
}
