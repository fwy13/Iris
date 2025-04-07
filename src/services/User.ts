import { DataUser } from "@/stores/useUser";
import axios from "axios";

export const User = async () => {
    const data: { data: DataUser } = await axios.get('/api/user', {
        withCredentials: true,
        responseType: "json",
    })
    return data.data;
}