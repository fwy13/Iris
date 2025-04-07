
import { prisma } from "@/db/prisma";
import jwt from "jsonwebtoken";

export const ReCreateToken = async (id: string, email: string, name: string) => {
    const jwtToken = jwt.sign({ id: id, email: email, name: name }, process.env.JWT_SECRET!, { expiresIn: "30d" });
    await prisma.user.update(
        {
            where: { email: email },
            data: { token: jwtToken }
        }
    );
    return jwtToken;
}