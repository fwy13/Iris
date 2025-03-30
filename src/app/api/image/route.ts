import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const form = await req.formData();
    const image = form.get("image");
    const blob = new Blob([image!], { type: "image/png" });
    const formData = new FormData();
    formData.append("Filedata", blob);
    const Res = await fetch(`${process.env.URL_TIKTOK}`, {
        method: "POST",
        body: formData,
        headers: {
            "x-csrftoken": "MnCo6U4ea1F2Jv4dQf5CVcjaIYxOF2o0",
            cookie: `${process.env.COOKIE_TIKTOK}`,
        },
    }).then((res) => res.json());
    console.log(Res.data.url);
    return NextResponse.json({
        error: false,
        message: "Thành công!",
        data: Res,
    });
}
