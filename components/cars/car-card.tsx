"use client";

import Image from "next/image";
import Link from "next/link";
import { Car } from "@prisma/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

interface CarCardProps {
  car: Car & {
    images: { url: string }[];
  };
  onDelete: (id: string) => void;
}

export function CarCard({ car, onDelete }: CarCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-1">{car.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {car.images[0] && (
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <Image
              src={car.images[0].url}
              alt={car.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {car.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {car.tags.split(",").map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
            >
              {tag.trim()}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/dashboard/cars/${car.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(car.id)}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}