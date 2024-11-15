import { CarForm } from "@/components/cars/car-form";

export default function NewCarPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add New Car</h1>
      <CarForm />
    </div>
  );
}