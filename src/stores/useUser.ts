import { User } from "@/services/User"
import { create } from "zustand"



export type DataUser = {
    id: string | null,
    name: string | null,
    email: string | null,
    isComfirm: boolean,
    error: boolean,
}

export type User = {
    data: DataUser,
    setUser: (Data: DataUser) => void
}


export const useUser = create<User>(
    (set) => ({
        data: {
            id: null,
            name: null,
            email: null,
            isComfirm: false,
            error: false
        },
        setUser: (Data) => set(() => ({ data: Data }))
    })
)