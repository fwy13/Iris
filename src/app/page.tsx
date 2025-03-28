"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    const [isExam, setExam] = useState<Data | null>(null);
    const getData = async () => {
        const response: Data = await fetch("/api/exam").then((res) =>
            res.json()
        );
        setExam(response);
    };
    useEffect(() => {
        getData();
    }, []);
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1>Hiện đang có các bài tập 🐸</h1>
            <div className="flex flex-col p-2 gap-2">
                {isExam?.data.map((e) => (
                    <Link key={e.id} href={`/bai-thi/${e.id}`} className="hover:text-success">
                        <h1 className="text-center">{e.name}</h1>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;
