import { TroubleshootingForm } from '@/components/troubleshooting/troubleshooting-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Troubleshooting',
};

export default function TroubleshootingPage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-2 text-center mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl">
          AI-Powered Troubleshooting
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Analyze error messages and unusual usage patterns to proactively identify potential problems and receive relevant documentation and solutions.
        </p>
      </div>
      <TroubleshootingForm />
    </div>
  );
}
