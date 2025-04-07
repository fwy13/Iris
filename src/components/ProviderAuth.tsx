"use client";
import { User } from "@/services/User";
import { useUser } from "@/stores/useUser";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";

export type Prop = {
    children: React.ReactNode
}
const ProviderAuth: React.FC<Prop> = (Prop: Prop) => {
    const { data, setUser } = useUser();
    const getData = async () => {
        const user = await User();
        if (user.error) redirect("/login");
        setUser({
            id: user.id,
            name: user.name,
            email: user.email,
            isComfirm: user.isComfirm,
            error: user.error
        })
    };
    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const path = usePathname();
    useEffect(() => {
        const id = localStorage.getItem("id");
        if (id && path !== "/" && data.isComfirm) redirect("/");
        if (data.id && !data.isComfirm && path !== "/confirm-email") redirect("/confirm-email");
        if (!data.id && path !== "/register" && path !== "/login" && id === null) redirect("/login");
    }, [data.id, data.isComfirm, path])
    return (
        Prop.children
    );
}
export default ProviderAuth;