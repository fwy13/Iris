"use client";
import { useUser } from "@/stores/useUser";
import axios from "axios";
import { redirect } from "next/navigation";
import { useState } from "react";

const ComfirmEmail = () => {
    const [isCode, setCode] = useState<string>("");
    const [isSent, setSent] = useState<boolean>(false);
    const { data } = useUser();
    const sendCode = async () => {
        setSent(true);
        const response = await axios.post("/api/auth/verifyemail", {
            withCredentials: true,
            email: data.email,
            code: isCode
        });
        if (!response.data.error) redirect("/");
    }
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-5 rounded-md flex flex-col justify-center items-center gap-1 w-[350px]">
                <h1 className="text-gray-900 font-bold text-xl">Xác minh email của bạn.</h1>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-32 text-success">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <p className="text-gray-900 text-center text-[15px]">Chúng tôi đã gửi một mã xác minh đến email của bạn. Vui lòng điền vào dưới đây 👇</p>
                <input type="text" className="outline-none border-2 border-blue-400 py-1 px-2 rounded-sm w-full text-gray-900" onChange={(e) => setCode(e.target.value)} />
                <button className="bg-blue-400 py-1 px-2 rounded-sm w-full text-white" onClick={sendCode} disabled={isSent}>Gửi đi 💌</button>
            </div>
        </div>
    )
}

export default ComfirmEmail;