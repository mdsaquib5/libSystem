"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "../../store/authStore";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoading } = useAuthStore();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login({ email, password }, router);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div>
                    <h2 className="auth-title">
                        Admin Login
                    </h2>
                    {/* <p className="auth-subtitle">
                        <p>Try adjusting your search or filters to find what you&apos;re looking for.</p>
                    </p> */}
                </div>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            required
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            required
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary"
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>
                    </div>
                    
                    <div className="auth-footer">
                        <span>Don&apos;t have an account? </span>
                        <Link href="/signup" className="auth-link">
                            Sign up here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
