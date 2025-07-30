import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Portal',
};


export default function ClientPortalPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Portal</CardTitle>
        <CardDescription>A dedicated portal for clients to submit samples.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Users className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold font-headline">Client Portal Coming Soon</h3>
        <p className="text-muted-foreground mt-2">A personalized web interface for clients to independently submit samples.</p>
      </CardContent>
    </Card>
  );
}
