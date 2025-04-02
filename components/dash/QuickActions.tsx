"use client";
// components/dashboard/QuickActions.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import CreateDialog from "@/components/dash/CreateDialog"; // Your existing create dialog component

export default function QuickActions() {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="default" 
            className="w-full" 
            onClick={() => router.push('/dashboard/certificates')}
          >
            View All Certificates
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => router.push('/dashboard/expiring')}
          >
            Check Expiring Certificates
          </Button>
          <CreateDialog />
        </div>
      </CardContent>
    </Card>
  );
}