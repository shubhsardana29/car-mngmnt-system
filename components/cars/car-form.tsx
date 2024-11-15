"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ImageUpload } from "./image-upload";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const carSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tags: z.string().min(1, "At least one tag is required"),
});

type CarFormData = z.infer<typeof carSchema>;

interface CarFormProps {
  initialData?: {
    id: string;
    title: string;
    description: string;
    tags: string;
    images: { id: string; url: string }[];
  };
}

export function CarForm({ initialData }: CarFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(
    initialData?.images.map((img) => img.url) || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      tags: "",
    },
  });

  const onSubmit = async (data: CarFormData) => {
    try {
      setLoading(true);
      const endpoint = initialData
        ? `/api/cars/${initialData.id}`
        : "/api/cars";
      const method = initialData ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          images,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save car");
      }

      toast.success(initialData ? "Car updated!" : "Car created!");
      router.push("/dashboard/cars");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Car" : "Add New Car"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Enter car title"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter car description"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              {...register("tags")}
              placeholder="luxury, sports, sedan"
            />
            {errors.tags && (
              <p className="text-sm text-red-500">{errors.tags.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Images (up to 10)</Label>
            <ImageUpload
              value={images}
              onChange={(urls) => setImages(urls)}
              maxImages={10}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : initialData ? "Update Car" : "Create Car"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}