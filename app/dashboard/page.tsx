import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, ImageIcon } from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();
  const stats = await db.car.aggregate({
    where: {
      userId: session?.id,
    },
    _count: {
      id: true,
    },
  });

  const imageStats = await db.image.aggregate({
    where: {
      car: {
        userId: session?.id,
      },
    },
    _count: {
      id: true,
    },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Welcome back, {session?.name || "User"}!</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats._count.id}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{imageStats._count.id}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}