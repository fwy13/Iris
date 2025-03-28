/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { formatTime } from "@/utils/formatTime";
import { QuizQuestion } from "@/utils/parserQuiz";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import * as partyjs from "party-js";
import { isEqual, sortBy } from "lodash";

export type FetchExam = {
    data: {
        data: QuizQuestion[];
        time: number;
        name: string;
        id: string;
    };
    error: boolean;
};

const PageExam = () => {
    const { id } = useParams();
    const [isExam, setExam] = useState<FetchExam | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [isLearning, setLearning] = useState<boolean>(true);
    const [isIdx, setIdx] = useState<number>(0);
    const [isAgain, setAgain] = useState<boolean>(false);
    const [isSuccess, setSuccess] = useState<boolean>(false);
    const [isAnswerTemp, setAnswerTemp] = useState<number>(-1);
    const [isNext, setNext] = useState<boolean>(false);
    const [isCountDown, setCountDown] = useState<number>(100000);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isPoint, setPoint] = useState<number>(0);

    const useRWTemp = useRef<number[]>([]);
    const useRw = useRef([
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
    ]);

    const useAnswer = useRef<string[]>(["A", "B", "C", "D"]);
    const useSuccess = useRef<HTMLHeadingElement>(null);

    const fetchExam = async () => {
        const data: FetchExam = await fetch(`/api/exam/${id}`).then((res) =>
            res.json()
        );
        if (data.error) return;
        setExam(data);
        setCountDown(data.data.time * 60);
        setLoading(false);
    };
    const handleCheckResult = () => {
        setNext(true);
        if (!isExam?.data.data[isIdx].rw) {
            if (
                isExam?.data.data[isIdx].right.some(
                    (result) => result === isAnswerTemp
                )
            ) {
                if (!isNext) {
                    setSuccess(true);
                    partyjs.confetti(useSuccess.current!, {
                        count: partyjs.variation.range(20, 40),
                    });
                    setPoint((prev) => prev + 1);
                } else {
                    toast("Đáp án chính xác, cần cố gắng!");
                    setSuccess(true);
                }
            } else {
                setAgain(true);
            }
        } else {
            if (
                isEqual(
                    sortBy(useRWTemp.current),
                    sortBy(isExam.data.data[isIdx].right)
                )
            ) {
                if (!isNext) {
                    setSuccess(true);
                    partyjs.confetti(useSuccess.current!, {
                        count: partyjs.variation.range(20, 40),
                    });
                    setPoint((prev) => prev + 1);
                } else {
                    toast("Đáp án chính xác, cần cố gắng!");
                    setSuccess(true);
                }
            } else {
                setAgain(true);
            }
        }
    };

    const handleNext = () => {
        if (isIdx + 1 === isExam?.data.data.length) {
            setLearning(true);
            setIdx(0);
            setAnswerTemp(-1);
            setNext(false);
            setSuccess(false);
            useRw.current! = [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0],
            ];
        } else {
            setIdx((prev) => prev + 1);
            setAnswerTemp(-1);
            setNext(false);
            setSuccess(false);
            useRw.current! = [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0],
            ];
        }
    };

    useEffect(() => {
        fetchExam();
    }, []);
    useEffect(() => {
        if (!isLearning) {
            setInterval(() => {
                if (isCountDown > 0) {
                    setCountDown((prev) => prev - 1);
                }
            }, 1000);
        }
    }, [isLearning]);
    useEffect(() => {
        if (isAgain) {
            setAgain(false);
            toast("Đáp án sai, bạn có thể bỏ qua câu này!");
        }
    }, [isAgain, isSuccess]);

    return (
        <div className="flex h-screen justify-center items-center overflow-hidden">
            {isLoading ? (
                <span className="loading loading-ring loading-xl"></span>
            ) : isLearning ? (
                <div className="bg-base-300 p-5 rounded-md items-center justify-center flex flex-col w-[400px]">
                    <h1 className="text-[17px] font-bold">
                        {isExam?.data.name}
                    </h1>
                    <h1 className="text-[13px] mb-4">
                        Mã bài thi: {isExam?.data.id}
                    </h1>
                    <div className="flex flex-col gap-3 w-full">
                        <div className="flex justify-between w-full text-[13px]">
                            <h1 className="flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                </svg>
                                Thời gian làm bài:{" "}
                            </h1>
                            <h1>{isExam?.data.time} phút</h1>
                        </div>
                        <div className="flex justify-between w-full text-[13px]">
                            <h1 className="flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                                    />
                                </svg>
                                Số lượng câu hỏi:{" "}
                            </h1>
                            <h1>{isExam?.data.data.length}</h1>
                        </div>
                        <div className="flex justify-between w-full text-[13px]">
                            <h1 className="flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                                    />
                                </svg>
                                Số lượt làm đề:{" "}
                            </h1>
                            <h1>0</h1>
                        </div>
                        <div className="flex justify-between w-full text-[13px]">
                            <h1 className="flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                                    />
                                </svg>
                                Phát hành bởi:{" "}
                            </h1>
                            <h1>Fwy13</h1>
                        </div>
                        <button
                            className="flex gap-2 justify-center p-1 bg-[#F97316] rounded-lg w-full text-white"
                            onClick={() => setLearning(false)}
                        >
                            Làm bài
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center w-full h-full">
                    <div className="flex items-center justify-between absolute top-0 left-0 w-full bg-base-200 p-2 border-b border-gray-700">
                        <button className="btn btn-circle btn-error text-white flex justify-center items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
                                />
                            </svg>
                        </button>
                        <div>Thời gian còn lại: {formatTime(isCountDown)}</div>
                    </div>
                    <div className="mt-16 overflow-y-auto bg-base-300 p-4 rounded-md">
                        <h1 className="font-bold text-[17px]">
                            Câu {isExam?.data.data[isIdx].number}:
                        </h1>
                        <h1
                            className="text-[15px] flex flex-col gap-2"
                            ref={useSuccess}
                            dangerouslySetInnerHTML={{
                                __html: isExam?.data.data[isIdx]
                                    .question as string,
                            }}
                        ></h1>
                        <ToastContainer
                            position="top-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick={false}
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="dark"
                            transition={Bounce}
                        />
                        <div
                            className="flex flex-col gap-2 mt-2 border-t border-gray-700 pt-2"
                            style={{
                                display: isExam?.data.data[isIdx].rw
                                    ? "none"
                                    : "",
                            }}
                        >
                            {isExam?.data.data[isIdx].answer.map(
                                (item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex gap-2 items-center"
                                    >
                                        <button
                                            disabled={isSuccess}
                                            onClick={() => {
                                                setAnswerTemp(idx);
                                            }}
                                            className={`rounded-full bg-transparent text-white p-3 border  size-10 items-center flex justify-center font-bold
                                                ${
                                                    isAnswerTemp === idx
                                                        ? "border-amber-400"
                                                        : "border-gray-700"
                                                }`}
                                        >
                                            {useAnswer.current[idx]}
                                        </button>
                                        <h1 className="border border-gray-700 p-1 rounded-md">
                                            {item}
                                        </h1>
                                    </div>
                                )
                            )}

                            <div className="flex w-full gap-2">
                                <button
                                    className="w-full p-2 text-white rounded-md bg-blue-400 disabled:bg-blue-900 disabled:text-gray-300"
                                    disabled={isSuccess}
                                    onClick={handleCheckResult}
                                >
                                    Kiểm tra
                                </button>
                                <button
                                    className="w-full p-2 text-white rounded-md bg-orange-500 disabled:bg-orange-900 disabled:text-gray-300"
                                    disabled={!isNext}
                                    onClick={handleNext}
                                >
                                    Câu tiếp theo
                                </button>
                            </div>
                        </div>
                        <div
                            className="flex-col gap-2 mt-2 border-t border-gray-700 pt-2"
                            style={{
                                display: isExam?.data.data[isIdx].rw
                                    ? "flex"
                                    : "none",
                            }}
                        >
                            {isExam?.data.data[isIdx].answer.map(
                                (item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex gap-2 items-center"
                                    >
                                        <button
                                            disabled={isSuccess}
                                            onClick={() => {
                                                useRw.current![idx][0] = 1;
                                                useRw.current![idx][1] = 0;
                                                if (
                                                    useRWTemp.current.findIndex(
                                                        (item) => item === idx
                                                    ) === -1
                                                ) {
                                                    useRWTemp.current.push(idx);
                                                }
                                            }}
                                            className={`rounded-full bg-transparent text-white p-3 border  size-10 items-center flex justify-center font-bold
                                                ${
                                                    useRw.current![idx][0] === 1
                                                        ? "border-amber-400"
                                                        : "border-gray-700"
                                                }`}
                                        >
                                            Đ
                                        </button>
                                        <button
                                            disabled={isSuccess}
                                            onClick={() => {
                                                useRw.current![idx][1] = 1;
                                                useRw.current![idx][0] = 0;
                                                if (
                                                    useRWTemp.current.findIndex(
                                                        (item) => item === idx
                                                    ) !== -1
                                                ) {
                                                    useRWTemp.current.splice(
                                                        useRWTemp.current.findIndex(
                                                            (item) =>
                                                                item === idx
                                                        ),
                                                        1
                                                    );
                                                }
                                            }}
                                            className={`rounded-full bg-transparent text-white p-3 border  size-10 items-center flex justify-center font-bold
                                                ${
                                                    useRw.current![idx][1] === 1
                                                        ? "border-amber-400"
                                                        : "border-gray-700"
                                                }`}
                                        >
                                            S
                                        </button>
                                        <h1 className="border border-gray-700 p-1 rounded-md">
                                            {item}
                                        </h1>
                                    </div>
                                )
                            )}
                            <div className="flex w-full gap-2">
                                <button
                                    className="w-full p-2 text-white rounded-md bg-blue-400 disabled:bg-blue-900 disabled:text-gray-300"
                                    disabled={isSuccess}
                                    onClick={handleCheckResult}
                                >
                                    Kiểm tra
                                </button>
                                <button
                                    className="w-full p-2 text-white rounded-md bg-orange-500 disabled:bg-orange-900 disabled:text-gray-300"
                                    disabled={!isNext}
                                    onClick={handleNext}
                                >
                                    Câu tiếp theo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default PageExam;
