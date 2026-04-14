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

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isAdmin: false,
    signInWithGoogle: async () => { },
    logout: async () => { },
});

// List of allowed admin emails
const ADMIN_EMAILS = [
    "svtc05@gmail.com",
    "bulutani@yahoo.com",
    "ligarius22@gmail.com",
    // Add your email here temporarily for testing if needed, or rely on the user adding it.
    // The user said "only I and svtc05... and bulutani..." so implies the user has an email too.
    // I will add a placeholder or rely on them testing with one of these.
    // actually, the user said "me", I don't know their email. I'll add a console log to show the email.
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser && currentUser.email) {
                // Simple check: is the email in the allowed list?
                // Note: In a real production app with sensitive data, 
                // claims or database roles are safer, but for this scale, this is fine.
                const isUserAdmin = ADMIN_EMAILS.includes(currentUser.email) ||
                    // Allow ANY email for now if the user wants to test quickly? 
                    // No, strict per instructions. 
                    // *However*, I'll add a way for the user to see *their* email to add it.
                    false;

                setIsAdmin(isUserAdmin);
                if (!isUserAdmin) {
                    console.log("User logged in but not admin:", currentUser.email);
                    // Optional: Sign them out if you want strictly ONLY admins?
                    // The instructions say "that login is for 1) young men or woman... 2) dashboard... only I and..."
                    // So normal users CAN log in. Only Admins see dashboard.
                }
            } else {
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in with Google", error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin, signInWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
