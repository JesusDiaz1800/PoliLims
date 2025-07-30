import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reports',
};

export default function ReportsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Generation</CardTitle>
        <CardDescription>Create and manage reports and Certificates of Analysis (CoA).</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <FileText className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold font-headline">Report Generator Coming Soon</h3>
        <p className="text-muted-foreground mt-2">This section will allow for the creation of customizable reports and CoAs.</p>
      </CardContent>
    </Card>
  );
}
