
'use server';
/**
 * @fileOverview An AI coding assistant.
 *
 * - codeAssistant - A function that handles code generation and assistance.
 * - CodeAssistantInput - The input type for the codeAssistant function.
 * - CodeAssistantOutput - The return type for the codeAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CodeAssistantInputSchema = z.object({
  prompt: z.string().describe('The user\'s request for code generation or assistance.'),
});
export type CodeAssistantInput = z.infer<typeof CodeAssistantInputSchema>;

const CodeAssistantOutputSchema = z.object({
  response: z.string().describe('The generated code or response from the AI assistant.'),
});
export type CodeAssistantOutput = z.infer<typeof CodeAssistantOutputSchema>;

export async function codeAssistant(input: CodeAssistantInput): Promise<CodeAssistantOutput> {
  return codeAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'codeAssistantPrompt',
  input: {schema: CodeAssistantInputSchema},
  output: {schema: CodeAssistantOutputSchema},
  prompt: `You are an expert AI coding assistant for an application built with Next.js, React, TypeScript, TailwindCSS, and ShadCN UI components.

  The user has requested help. Analyze their prompt and provide a helpful response.
  If they ask for code, provide a complete, clean, and well-formatted code block.
  If they ask for an explanation, be clear and concise.

  User Prompt: {{{prompt}}}
  
  Your response should be enclosed in a single markdown code block.`,
});

const codeAssistantFlow = ai.defineFlow(
  {
    name: 'codeAssistantFlow',
    inputSchema: CodeAssistantInputSchema,
    outputSchema: CodeAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
