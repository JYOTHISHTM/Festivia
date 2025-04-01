import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    isAuthenticated: boolean;
    creator: any | null;
    token: string | null;
}

const initialState: AuthState = {
    isAuthenticated: !!localStorage.getItem("token"),
    creator: localStorage.getItem("creator") 
        ? JSON.parse(localStorage.getItem("creator")!) 
        : null,
    token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
    name: "creatorAuth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ creator: any; token: string }>) => {
            console.group("🔐 Login Reducer");
            console.log("🔑 Received Token:", action.payload.token);
            console.log("👤 Received Creator:", action.payload.creator);

            state.isAuthenticated = true;
            state.creator = action.payload.creator;
            state.token = action.payload.token;

            try {
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("creator", JSON.stringify(action.payload.creator));
                
                console.log("✅ Token stored in localStorage");
                console.log("🔍 Verification - Token:", localStorage.getItem("token"));
                console.log("🔍 Verification - Creator:", localStorage.getItem("creator"));
            } catch (error) {
                console.error("❌ localStorage Error:", error);
                console.warn("Storage might be full or disabled");
            }

            console.groupEnd();
        },
        logout: (state) => {
            console.group("🚪 Logout Action");
            state.isAuthenticated = false;
            state.creator = null;
            state.token = null;

            localStorage.removeItem("token");
            localStorage.removeItem("creator");

            console.log("✅ Logout completed");
            console.groupEnd();
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;