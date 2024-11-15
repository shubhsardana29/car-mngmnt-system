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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, description, tags, images } = carSchema.parse(body);

    // Verify ownership
    const car = await db.car.findUnique({
      where: {
        id: params.id,
        userId: session.id,
      },
    });

    if (!car) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Update car and images
    await db.car.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        description,
        tags,
        images: {
          deleteMany: {},
          create: images.map((url) => ({
            url,
          })),
        },
      },
    });

    return NextResponse.json({ success: true });
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify ownership
    const car = await db.car.findUnique({
      where: {
        id: params.id,
        userId: session.id,
      },
    });

    if (!car) {
      return new NextResponse("Not found", { status: 404 });
    }

    await db.car.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify ownership
    const car = await db.car.findUnique({
      where: {
        id: params.id,
        userId: session.id,
      },
    });

    if (!car) {
      return new NextResponse("Not found", { status: 404 });
    }

    await db.car.findFirst({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(car);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}