// This is an AI-powered assistant tool that analyzes error messages and unusual usage patterns, proactively identifying potential problems and suggesting relevant documentation.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiPoweredTroubleshootingInputSchema = z.object({
  errorMessage: z.string().describe('The error message to analyze.'),
  usagePatterns: z.string().describe('Description of recent usage patterns.'),
});

export type AiPoweredTroubleshootingInput = z.infer<typeof AiPoweredTroubleshootingInputSchema>;

const AiPoweredTroubleshootingOutputSchema = z.object({
  problemIdentification: z.string().describe('Identifies the potential problem based on the error message and usage patterns.'),
  suggestedSolutions: z.string().describe('Provides a list of suggested solutions to resolve the identified problem.'),
  relevantDocumentation: z.string().describe('Lists relevant documentation links or references for further assistance.'),
});

export type AiPoweredTroubleshootingOutput = z.infer<typeof AiPoweredTroubleshootingOutputSchema>;

export async function aiPoweredTroubleshooting(input: AiPoweredTroubleshootingInput): Promise<AiPoweredTroubleshootingOutput> {
  return aiPoweredTroubleshootingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPoweredTroubleshootingPrompt',
  input: {schema: AiPoweredTroubleshootingInputSchema},
  output: {schema: AiPoweredTroubleshootingOutputSchema},
  prompt: `You are an AI assistant for the PoliLIMS laboratory information management system.

  Your task is to analyze the provided error message and usage patterns to identify potential problems and suggest solutions.
  Also provide links or references to relevant documentation for further assistance.

  Error Message: {{{errorMessage}}}
  Usage Patterns: {{{usagePatterns}}}

  Identify the potential problem, suggest solutions, and list relevant documentation.
  Be concise and clear in your explanations.

  Follow this format strictly:

  Problem Identification: [Identified Problem]
  Suggested Solutions: [List of Suggested Solutions]
  Relevant Documentation: [Links or References]`,
});

const aiPoweredTroubleshootingFlow = ai.defineFlow(
  {
    name: 'aiPoweredTroubleshootingFlow',
    inputSchema: AiPoweredTroubleshootingInputSchema,
    outputSchema: AiPoweredTroubleshootingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
