import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ClientCars } from "./ClientCars";

export default async function CarsPage() {
  const session = await getSession();
  const cars = await db.car.findMany({
    where: {
      userId: session?.id,
    },
    include: {
      images: { select: { url: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return <ClientCars initialCars={cars} />;
}
