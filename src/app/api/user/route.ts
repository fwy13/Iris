import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import ShortUniqueId from "short-unique-id";

export type Payload = {
    name: string;
    avatar: string;
};

export async function POST(req: NextRequest) {
    const payload: Payload = await req.json();
    if (!payload.name || !payload.avatar)
        return NextResponse.json({ error: true });
    const id = new ShortUniqueId({ length: 10 }).rnd();
    const data = await prisma.users.create({
        data: {
            id,
            name: payload.name,
            avatar: payload.avatar,
        },
    });
    return NextResponse.json({ error: false, data: data });
}
