/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { parseQuizText, QuizQuestion } from "@/utils/parserQuiz";
import { extractTextFromDocx, ImageData } from "@/utils/parserDocx";
import { debounce } from "lodash";
import FileInput from "../../components/FileInput";
import { redirect } from "next/navigation";

const PageUpload = () => {
    const [isTextExam, setTextExam] = useState<string>();
    const [isImages, setImages] = useState<ImageData[]>([]);
    const [isFile, setFile] = useState<File | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [isQuiz, setQuiz] = useState<QuizQuestion[]>([]);
    const [isName, setName] = useState<string>("");
    const [isTime, setTime] = useState<number>(60);
    const useAnswer = useRef<string[]>(["A", "B", "C", "D"]);
    const handleFileUpload = async () => {
        try {
            const arrayBuffer = await isFile!.arrayBuffer();
            const extractedTextFromDocx = await extractTextFromDocx(
                arrayBuffer,
                setImages
            );
            setTextExam(extractedTextFromDocx);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        if (isFile) {
            handleFileUpload();
        }
    }, [isFile]);

    useEffect(() => {
        if (isTextExam && isImages) {
            const parser = parseQuizText(isTextExam, isImages);
            setQuiz(parser);
        }
    }, [isTextExam, isImages]);

    const debounceDropDown = useCallback(
        debounce((nextValue) => setTextExam(`${nextValue}`), 800),
        []
    );
    const handleUpload = async () => {
        await fetch("/api/upload", {
            method: "POST",
            body: JSON.stringify({
                name: isName,
                type: isFile?.type,
                data: isQuiz,
                time: isTime,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (!res.error) {
                    redirect(`bai-thi/${res.data.id}`);
                } else {
                    console.log("Co loi!");
                }
            });
    };
    const changeTextEditor = (value?: string) => {
        debounceDropDown(value);
    };
    return (
        <div className="flex justify-center items-center h-screen">
            <FileInput setFile={setFile} />
            {isFile && (
                <div className="w-full h-screen gap-2 flex flex-col">
                    <div className="flex gap-2 justify-center items-center border border-emerald-400 rounded-md my-2 p-2">
                        <input
                            type="text"
                            className="border rounded-sm outline-none px-2 py-1 w-[300px]"
                            defaultValue={isFile.name}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                        />
                        <label htmlFor="">Thời gian (phút): </label>
                        <input
                            type="number"
                            className="border rounded-sm outline-none px-2 py-1 w-[50px]"
                            min={0}
                            onChange={(e) => {
                                setTime(parseInt(e.target.value));
                            }}
                            defaultValue={60}
                        />
                        <button
                            className="p-2 bg-blue-400 rounded-md active:scale-105"
                            onClick={handleUpload}
                        >
                            Tải lên
                        </button>
                    </div>
                    <div className="flex gap-2 justify-between w-full h-full overflow-hidden">
                        <div className="flex flex-col gap-2 h-full overflow-y-auto border p-3 border-emerald-200 rounded-md min-w-1/2">
                            {isQuiz.map((item, index) => (
                                <div
                                    key={index}
                                    className="border border-emerald-500 rounded-md px-4 py-2"
                                >
                                    <h1 className="text-[17px] font-bold">
                                        Câu {item.number}: (
                                        {!item.rw
                                            ? "Dạng trắc nghiệm"
                                            : "Dạng trắc nghiệm đúng sai"}
                                        )
                                    </h1>
                                    <p
                                        className="text-[15px] mb-1 whitespace-pre-line"
                                        dangerouslySetInnerHTML={{
                                            __html: item.question,
                                        }}
                                    />
                                    {item.answer.map((answer, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center mb-2 border p-1 gap-2 rounded-md px-2 ${
                                                item.right.some(
                                                    (right) => right === index
                                                ) && "bg-emerald-500 text-white"
                                            }`}
                                        >
                                            <p>
                                                {useAnswer.current[index]}.{" "}
                                                {answer}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        {!isLoading && (
                            <Editor
                                height={window.innerHeight}
                                className="h-full"
                                value={isTextExam}
                                onChange={changeTextEditor}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PageUpload;
