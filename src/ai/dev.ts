import 'dotenv/config';
import { config } from 'dotenv';
config();

// This file is used for Genkit's development environment.
// It should not import flows that use zod schemas directly at the top level
// to avoid build issues with Next.js.
// Flows are loaded via their respective pages/actions.
import '@/ai/genkit';
