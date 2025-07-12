import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface AuthStore {
    isAdmin: boolean;
    isLoading: boolean;
    error: string | null;

    checkAdminStatus: () => Promise<void>;
    reset: () => void; //function that updates the state & puts it to the initial state
}

export const useAuthStore = create<AuthStore>((set) => ({
    isAdmin: false,
    isLoading: false,
    error: null,

    //whenever we open the page we want to check if the user is admin & that is in the useEffect in AuthProvider.tsx(if(token)...)
    checkAdminStatus: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await axiosInstance.get("/admin/check")
            set({isAdmin: response.data.admin})
        } catch (error: any) {
            set({isAdmin: false, error: error.response.data.message})
        } finally {
            set({isLoading: false})
        }
    },

    reset: () => {
        set({isAdmin: false, isLoading: false, error: null})
    }
}))