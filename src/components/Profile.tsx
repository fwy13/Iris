/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

const Profile = () => {
    const [isUser, setUser] = useState<{
        name: string;
        avatar: string;
        id: string;
    } | null>(null);
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
                <div>
                    <span>Hello world</span>
                </div>
            )}
        </div>
    );
};

export default Profile;
