"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    User,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { formatErrorMessage } from "@/lib/error-utils";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    authError: string | null;
    clearAuthError: () => void;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isAdmin: false,
    authError: null,
    clearAuthError: () => { },
    signInWithGoogle: async () => { },
    logout: async () => { },
});

// List of allowed admin emails (normalized to lowercase)
const ADMIN_EMAILS = [
    "svtc05@gmail.com",
    "bulutani@yahoo.com",
    "ligarius22@gmail.com",
    "sheilamlunter@gmail.com",
    "navareafarm@gmail.com",
    "macashaw1@gmail.com",
    "karanavatulesiash@gmail.com",
    "bogiana2003@gmail.com",
    "mocelutujosiliva@gmail.com",
].map((email) => email.toLowerCase());

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    const clearAuthError = () => setAuthError(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            (currentUser) => {
                setUser(currentUser);
                if (currentUser && currentUser.email) {
                    const normalizedEmail = currentUser.email.toLowerCase().trim();
                    const isUserAdmin = ADMIN_EMAILS.includes(normalizedEmail);
                    setIsAdmin(isUserAdmin);
                } else {
                    setIsAdmin(false);
                }
                setLoading(false);
            },
            (error) => {
                console.error("Auth state observer error:", error);
                setAuthError(formatErrorMessage(error, "Authentication service error."));
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        setAuthError(null);
        try {
            const provider = new GoogleAuthProvider();
            // Force account selection if needed
            provider.setCustomParameters({ prompt: "select_account" });
            await signInWithPopup(auth, provider);
        } catch (error: any) {
            console.error("Error signing in with Google:", error);
            // User closing popup is intentional cancel, don't flag as failure
            if (error?.code !== "auth/popup-closed-by-user") {
                setAuthError(formatErrorMessage(error, "Failed to sign in with Google."));
            }
        }
    };

    const logout = async () => {
        setAuthError(null);
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
            setAuthError(formatErrorMessage(error, "Failed to sign out."));
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAdmin,
                authError,
                clearAuthError,
                signInWithGoogle,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
