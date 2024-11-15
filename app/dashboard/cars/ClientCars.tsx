'use client';

import { useState, useEffect, useCallback } from 'react';
import { CarCard } from "@/components/cars/car-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Plus } from "lucide-react";
import { deleteCar } from './car-actions';

export function ClientCars({ initialCars }: { initialCars: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [cars, setCars] = useState(initialCars);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); 
    return () => clearTimeout(handler); // Cleanup on input change
  }, [searchTerm]);

  // Filter cars whenever debouncedSearchTerm changes
  useEffect(() => {
    const filteredCars = initialCars.filter(
      (car) =>
        car.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        car.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        car.tags.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    setCars(filteredCars);
  }, [debouncedSearchTerm, initialCars]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (id: string) => {
    await deleteCar(id);
    setCars((prev) => prev.filter((car) => car.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Cars</h1>
        <div className="flex items-center space-x-4">
          <Input
            type="text"
            placeholder="Search cars..."
            value={searchTerm}
            onChange={handleSearch}
            className="max-w-xs"
          />
          <Button asChild>
            <Link href="/dashboard/cars/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New Car
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <CarCard
            key={car.id}
            car={car}
            onDelete={handleDelete}
          />
        ))}
      </div>
      {cars.length === 0 && (
        <div className="text-center">
          <p className="text-muted-foreground">No cars found. Add your first car!</p>
        </div>
      )}
    </div>
  );
}
