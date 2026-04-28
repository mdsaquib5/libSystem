"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "../../store/authStore";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signup, isLoading } = useAuthStore();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup({ name, email, password }, router);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div>
                    <h2 className="auth-title">
                        Admin Signup
                    </h2>
                    <p className="auth-subtitle">
                        Create an account to access the dashboard
                    </p>
                </div>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            required
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
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
                            minLength={6}
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
                            {isLoading ? "Signing up..." : "Sign up"}
                        </button>
                    </div>

                    <div className="auth-footer">
                        <span>Already have an account? </span>
                        <Link href="/login" className="auth-link">
                            Sign in here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
