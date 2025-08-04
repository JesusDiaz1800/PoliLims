
"use server";

import { z } from "zod";
import { documentAssistant, type DocumentAssistantInput } from "@/ai/flows/document-assistant";

const formSchema = z.object({
  prompt: z.string().min(10, "Your request must be at least 10 characters."),
  history: z.array(z.object({
    role: z.string(),
    content: z.string(),
  })),
});

type FormState = {
  message: string;
  data?: {
    response: string;
  } | null;
  error?: string | null;
  fieldErrors?: Record<string, string[] | undefined> | null;
}

export async function getDocumentSuggestion(prevState: FormState, formData: FormData): Promise<FormState> {
  
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
    const result = await documentAssistant(parsed.data as DocumentAssistantInput);
    return { message: "Success", data: result };
  } catch (error) {
    console.error("AI Document Assistant Error:", error);
    return { message: "Failed to get suggestion from AI.", error: (error as Error).message };
  }
}
