"use client";
import { useUser } from "@/stores/useUser";

export type Data = {
    data: {
        id: string;
        name: string;
        data: string;
        time: number;
        count: number;
    }[];
};
const Home = () => {
    const { data } = useUser();
    return (
        <span>Xin chao {data.name}</span>
    );
};

export default Home;
