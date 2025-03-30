/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Profile from "./components/Profile";

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
        <div className="flex flex-col items-center justify-center h-screen mt-10">
            <Profile />
            <div className="flex flex-col gap-2 bg-base-200 p-5 items-center rounded-lg">
                <h1 className="text-2xl font-extrabold pb-3">
                    Bạn đang có các bài tập 🐸
                </h1>
                <div className="divider m-0"></div>
                <input
                    type="text"
                    placeholder="Tìm kiếm"
                    className="mb-2 border border-gray-500 outline-none rounded-md px-3 py-1 w-full"
                />
                <div className="flex flex-col gap-2 h-[350px] overflow-y-auto overflow-x-hidden">
                    {isExam?.data.map((exam) => (
                        <Link key={exam.id} href={`/bai-thi/${exam.id}`}>
                            <div className="flex gap-2 items-center py-2 w-[300px] bg-base-300 rounded-md hover:scale-105">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-20 text-orange-400"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                                    />
                                </svg>
                                <div className="flex flex-col">
                                    <div className="flex gap-2 items-center">
                                        <h1 className="font-bold text-[17px]">
                                            {exam.name}
                                        </h1>
                                        <div
                                            className="tooltip"
                                            data-tip={"Fwy13"}
                                        >
                                            <div className="avatar">
                                                <div className="w-6 rounded-full">
                                                    <img
                                                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                                        alt=""
                                                        width={100}
                                                        height={100}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col text-[13px] text-gray-400">
                                        <h1>{exam.count} lượt làm đề</h1>
                                        <h1>Thời gian bài làm {exam.time}</h1>
                                        <h1>
                                            Số lượng câu hỏi {exam.data.length}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
