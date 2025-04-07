import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    isAuthenticated: boolean;
    admin: any | null;
    token: string | null;
}

const initialState: AuthState = {
    isAuthenticated: !!localStorage.getItem("token"),
    admin: (() => {
        try {
            const adminData = localStorage.getItem("admin");
            return adminData ? JSON.parse(adminData) : null;
        } catch (error) {
            console.error("❌ JSON Parse Error for Admin:", error);
            return null;
        }
    })(),
    token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
    name: "adminAuth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ admin: any; token: string }>) => {
            console.group("🔐 Login Reducer");
            console.log("🔑 Received Token:", action.payload.token);
            console.log("👤 Received admin:", action.payload.admin);

            state.isAuthenticated = true;
            state.admin = action.payload.admin;
            state.token = action.payload.token;

            try {
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("admin", JSON.stringify(action.payload.admin));

                console.log("✅ Token stored in localStorage");
                console.log("🔍 Verification - Token:", localStorage.getItem("token"));
                console.log("🔍 Verification - admin:", localStorage.getItem("admin"));
            } catch (error) {
                console.error("❌ localStorage Error:", error);
                console.warn("Storage might be full or disabled");
            }

            console.groupEnd();
        },
        logout: (state) => {
            console.group("🚪 Logout Action");
            state.isAuthenticated = false;
            state.admin = null;
            state.token = null;

            localStorage.removeItem("token");
            localStorage.removeItem("admin");

            console.log("✅ Logout completed");
            console.groupEnd();
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
