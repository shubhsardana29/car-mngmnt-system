"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({
  value = [],
  onChange,
  maxImages = 10,
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);

  const onUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        setLoading(true);
        const files = Array.from(e.target.files || []);

        if (value.length + files.length > maxImages) {
          toast.error(`Maximum ${maxImages} images allowed`);
          return;
        }

        // In a real app, you would upload to a storage service
        // For demo, we'll create object URLs
        const urls = files.map((file) => URL.createObjectURL(file));
        onChange([...value, ...urls]);
      } catch (error) {
        toast.error("Error uploading images");
      } finally {
        setLoading(false);
      }
    },
    [value, onChange, maxImages]
  );

  const onRemove = useCallback(
    (url: string) => {
      onChange(value.filter((current) => current !== url));
    },
    [onChange, value]
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {value.map((url) => (
          <div
            key={url}
            className="group relative aspect-square rounded-lg overflow-hidden border"
          >
            <Image
              src={url}
              alt="Car image"
              className="object-cover"
              fill
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
              onClick={() => onRemove(url)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {value.length < maxImages && (
          <div className="aspect-square relative border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-accent/50 transition cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={onUpload}
              disabled={loading}
            />
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Add Images</p>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Upload up to {maxImages} images. Recommended size: 1200x800px.
      </p>
    </div>
  );
}