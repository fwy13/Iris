/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";

const Profile = () => {
    const [isUser, setUser] = useState<{
        name: string;
        avatar: string;
        id: string;
    } | null>(null);
    const useFile = useRef<HTMLInputElement>(null);
    const [isImage, setImage] = useState<string | null>(null);
    const [isName, setName] = useState<string>("");
    const checkUser = () => {
        const { name, avatar, id } = JSON.parse(
            localStorage.getItem("user") || "{}"
        );
        if (!name) {
            setUser(null);
        } else {
            setUser({ name, avatar, id });
        }
    };
    const handleLogin = async () => {
        const formData = new FormData();
        formData.append(
            "image",
            new Blob([useFile.current!.files![0]], {
                type: "image/png",
            })
        );
        const urlAvatar = await fetch("/api/image", {
            method: "POST",
            body: formData,
        }).then((res) => res.json());
        const urlImage = urlAvatar.data.data.url;
        const Response = await fetch("/api/user", {
            method: "POST",
            body: JSON.stringify({
                name: isName,
                avatar: urlImage,
            }),
        }).then((res) => res.json());
        if (Response.error) {
            console.error(Response);
        } else {
            localStorage.setItem(
                "user",
                JSON.stringify({
                    name: isName,
                    avatar: urlImage,
                    id: Response.data.id,
                })
            );
            checkUser();
        }
    };
    const handleUploadAvatar = () => {
        const file = useFile.current!.files![0];
        const previewUrl = URL.createObjectURL(file);
        setImage(previewUrl);
    };
    useEffect(() => {
        checkUser();
    }, []);
    return (
        <div>
            {isUser ? (
                <div className="flex justify-end w-[350px] py-2 items-center gap-2">
                    <h1 className="font-semibold text-[15px]">{isUser.name}</h1>
                    <div className="avatar">
                        <div className="w-8 rounded-full">
                            <img
                                src={isUser.avatar}
                                alt=""
                                width={100}
                                height={100}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex justify-end w-[350px] py-2 items-center gap-2">
                    <div className="dropdown dropdown-center">
                        <div
                            tabIndex={100}
                            role="button"
                            className="btn bg-blue-400 rounded-md"
                        >
                            Đăng nhập
                        </div>
                        <div
                            tabIndex={100}
                            className="flex flex-col gap-2 bg-base-300 items-center justify-center dropdown-content menu rounded-box z-1 w-[250px] p-2 shadow-sm"
                        >
                            <input
                                type="text"
                                placeholder="Tên của bạn"
                                onChange={(e) => setName(e.target.value)}
                                className="w-full outline-none px-3 py-1 border-gray-100 rounded-md border-dashed border-3"
                            />
                            <h1 className="font-semibold text-[15px] text-gray-500">
                                Ấn vào ảnh dưới để tải ảnh lên
                            </h1>
                            <div className="relative flex items-center justify-center w-full text-center rounded-full h-24">
                                <img
                                    className="absolute top-0 left-[30%] border-3 border-dashed rounded-full w-24 h-full"
                                    src={
                                        isImage ||
                                        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                    }
                                    alt=""
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer z-100"
                                    ref={useFile}
                                    onChange={handleUploadAvatar}
                                />
                            </div>
                            <button
                                className="p-2 bg-blue-400 rounded-md w-full flex justify-center items-center mt-3"
                                onClick={handleLogin}
                            >
                                Đăng ký
                            </button>
                        </div>
                    </div>
                    <h1 className="font-semibold text-[15px]">Ẩn danh</h1>
                    <div className="avatar avatar-placeholder">
                        <div className="bg-neutral text-neutral-content w-8 rounded-full">
                            <span className="text-xs">AD</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
