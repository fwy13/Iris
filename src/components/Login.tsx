"use client";
import { useUser } from "@/stores/useUser";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import Turnstile from "react-turnstile";


const Login = () => {
    const [isEmail, setEmail] = useState("");
    const [isPassword, setPassword] = useState("");
    const [isToken, setToken] = useState("");
    const { setUser } = useUser();
    const login = async () => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email: isEmail, password: isPassword, token: isToken }),
        });
        const data = await res.json();
        if (data.error) return;
        setUser({
            email: data.data.email,
            id: data.data.id,
            name: data.data.name,
            error: data.error,
            isComfirm: data.data.isComfirm,
        });
        localStorage.setItem("id", data.data.id);
        if (!data.data.isComfirm) redirect("/confirm-email");
        redirect("/");
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-5 rounded-md flex flex-col justify-center items-center gap-3 w-[350px]">
                <h1 className="text-gray-900 font-bold">Đăng nhập</h1>
                <input type="text" placeholder="Nhập email" onChange={(e) => setEmail(e.target.value)} className="outline-none border-2 border-blue-400 py-1 px-2 rounded-sm w-full text-gray-900" />
                <input type="password" placeholder="Nhập mật khẩu" onChange={(e) => setPassword(e.target.value)} className="outline-none border-2 border-blue-400 py-1 px-2 rounded-sm w-full text-gray-900" />
                <Turnstile sitekey="0x4AAAAAABFZDgN_trIdJgLu" onVerify={(token) => {
                    setToken(token);
                }} />
                <Link href={"/forgot-password"} className="text-blue-400 self-start">Quên mật khẩu?</Link>
                <button className="bg-blue-400 text-white p-2 rounded-sm w-full" onClick={login}>Đăng nhập</button>
                <div className="divider divider-primary m-0 text-black">Hoặc</div>
                <Link href={"/register"} className="text-gray-600 hover:text-blue-400">Đăng ký tài khoản mới tại đây.</Link>
            </div>
        </div>
    );
}
export default Login;