import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { GitBranch } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workflows',
};

export default function WorkflowsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflows</CardTitle>
        <CardDescription>Interactive workflow visualization to track samples and processes.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <GitBranch className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold font-headline">Workflow Visualization Coming Soon</h3>
        <p className="text-muted-foreground mt-2">This section will provide a graphical representation of your lab processes.</p>
      </CardContent>
    </Card>
  );
}
