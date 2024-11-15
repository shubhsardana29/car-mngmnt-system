import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const carSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  tags: z.string().min(1),
  images: z.array(z.string()),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, description, tags, images } = carSchema.parse(body);

    const car = await db.car.create({
      data: {
        title,
        description,
        tags,
        userId: session.id,
        images: {
          create: images.map((url) => ({
            url,
          })),
        },
      },
    });

    return NextResponse.json(car);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const session = await getSession();
    if (!session?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const cars = await db.car.findMany();
    return NextResponse.json(cars);
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
