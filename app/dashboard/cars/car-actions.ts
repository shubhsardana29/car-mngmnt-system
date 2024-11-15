"use server";

import { db } from "@/lib/db";

export async function deleteCar(id: string) {
  await db.car.delete({
    where: { id },
  });
}