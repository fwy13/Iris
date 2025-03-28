import { NextResponse } from "next/server";

/**
 * 
 import { prisma } from "@/db/prisma";
 import { NextResponse } from "next/server";
 
 export async function POST(req: Request) {
     const data = await req.formData();
     if (!data.get("Filedata") || !data.get("name") || !data.get("type"))
         return NextResponse.json({ error: true });
 
     const formData = new FormData();
     const newBlob = new Blob([data.get("Filedata")!], {
         type: `${data.get("type")}`,
     });
     formData.append("Filedata", newBlob);
     const Res = await fetch(`${process.env.URL_TIKTOK}`, {
         method: "POST",
         body: formData,
         headers: {
             "x-csrftoken": "MnCo6U4ea1F2Jv4dQf5CVcjaIYxOF2o0",
             cookie: `${process.env.COOKIE_TIKTOK}`,
         },
     }).then((res) => res.json());
 
     return NextResponse.json({
         error: false,
         message: "Thành công!",
         data: Res,
     });
 }
 */
export async function GET() {
    return NextResponse.json({
        data: "hello",
    });
}
