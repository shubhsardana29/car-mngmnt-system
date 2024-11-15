import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CarForm } from "@/components/cars/car-form";

interface EditCarPageProps {
  params: {
    id: string;
  };
}

export default async function EditCarPage({ params }: EditCarPageProps) {
  const session = await getSession();
  const car = await db.car.findUnique({
    where: {
      id: params.id,
      userId: session?.id,
    },
    include: {
      images: true,
    },
  });

  if (!car) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Car</h1>
      <CarForm initialData={car} />
    </div>
  );
}