
import { prisma } from "@/db/prisma";
import jwt from "jsonwebtoken";


export const verifyToken = async (token: string) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
        const user = await prisma.user.findFirst({ where: { id: payload.id } });
        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
}