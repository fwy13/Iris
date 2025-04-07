/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";

const FileInput: React.FC<{
    setFile: Dispatch<SetStateAction<File | null>>;
}> = (Props) => {
    const useInputFile = useRef<HTMLInputElement>(null);
    const [isDragOver, setDragOver] = useState<boolean>(false);
    const [isUploaded, setUploaded] = useState<boolean>(false);
    const [isSuccess, setSuccess] = useState<boolean>(false);

    useEffect(() => {
        useInputFile.current!.addEventListener("dragover", (e) => {
            e.preventDefault();
            setDragOver(true);
        });
        useInputFile.current!.addEventListener("dragleave", () => {
            setDragOver(false);
        });
        useInputFile.current!.addEventListener("drop", (e) => {
            e.preventDefault();
            const file = e.dataTransfer!.files[0];
            setDragOver(false);
            if (file) {
                setUploaded(true);
                const fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                Props.setFile(file);
                setSuccess(true);
            }
        });
        useInputFile.current!.addEventListener("change", (e: any) => {
            const file = e.target.files[0];
            if (file) {
                setUploaded(true);
                const fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                Props.setFile(file);
                setSuccess(true);
            }
        });
    }, [Props]);
    return (
        <div
            className={`animate-fade-down animate-once relative p-10 w-[400px] text-center rounded-xl border-3 border-dashed border-white ${
                isDragOver ? "bg-[#3498db99]" : ""
            } ${isSuccess ? "hidden" : ""}`}
        >
            <div
                className={`bg-[#34db9899] h-full absolute top-0 left-0 z-1 ${
                    isUploaded && !isDragOver ? "w-full" : ""
                }`}
            ></div>
            <input
                type="file"
                accept="image/*"
                className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer z-100"
                ref={useInputFile}
            />
            <label
                htmlFor="avatar"
                className="text-white absolute top-0 left-0 w-full h-full flex justify-center items-center z-10"
            >
                <span className="text-xl">{isUploaded ? "🏄‍♀️" : "📁"}</span>
                {isDragOver ? (
                    <span className="text-xl">
                        Đúng rồi, hãy thả ảnh của bạn vào đây!
                    </span>
                ) : isUploaded ? (
                    <span className="text-xl">Thành công!</span>
                ) : (
                    <span className="text-xl">Thả file của bạn vào đây!</span>
                )}
            </label>
        </div>
    );
};
export default FileInput;
