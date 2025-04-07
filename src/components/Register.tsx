"use client";
import { useUser } from "@/stores/useUser";
import { redirect } from "next/navigation";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha"


const Register = () => {
    const [isEmail, setEmail] = useState<string>("");
    const [isPassword, setPassword] = useState<string>("");
    const [isToken, setToken] = useState<string>("");
    const [isFullName, setFullName] = useState<string>("");

    const { setUser } = useUser();
    const login = async () => {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({ email: isEmail, password: isPassword, tokenCaptcha: isToken, fullName: isFullName }),
        });
        const data = await res.json();
        if (data.error) return;
        setUser({
            email: data.data.email,
            id: data.data.id,
            name: data.data.name,
            isComfirm: false,
            error: data.error
        });
        redirect("/confirm-email");
    };
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-5 rounded-md flex flex-col justify-center items-center gap-3 w-[350px]">
                <h1 className="text-gray-900 font-bold">Đăng ký</h1>
                <input type="text" placeholder="Tên đầy đủ" onChange={(e) => setFullName(e.target.value)} className="outline-none border-2 border-blue-400 py-1 px-2 rounded-sm w-full text-gray-900" />
                <input type="text" placeholder="Nhập email" onChange={(e) => setEmail(e.target.value)} className="outline-none border-2 border-blue-400 py-1 px-2 rounded-sm w-full text-gray-900" />
                <input type="password" placeholder="Nhập mật khẩu" onChange={(e) => setPassword(e.target.value)} className="outline-none border-2 border-blue-400 py-1 px-2 rounded-sm w-full text-gray-900" />
                <ReCAPTCHA onChange={(token) => {
                    setToken(token!);
                }} sitekey="6LdfwAsrAAAAAIbJMoP3RkhcpmvmhppuboAYPkHY" />
                <button className="bg-blue-400 text-white p-2 rounded-sm w-full" onClick={login}>Đăng ký</button>
            </div>
        </div>
    );
}
export default Register;