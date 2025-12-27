"use client";

import { useState } from "react";
import { register } from "@/services/auth.services";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
        toast.error("Semua field wajib diisi");
        return;
        }

        if (password !== confirmPassword) {
        toast.error("Password tidak sama");
        return;
        }

        setLoading(true);
        const toastId = toast.loading("Registering...");

        try {
        await register({ name, email, password });
        toast.success("Register berhasil 🎉", { id: toastId });

        setTimeout(() => {
            router.replace("/dashboard")
        }, 800);
        } catch (err) {
        toast.error("Register gagal", { id: toastId });
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
        <div className="card w-full max-w-sm bg-base-100 shadow-xl">
            <div className="card-body space-y-4">
            <h1 className="text-2xl font-bold text-center">Register</h1>

            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                className="input input-bordered w-full"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                />

                <input
                type="email"
                className="input input-bordered w-full"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />

                {/* Password */}
                <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full pr-10"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                </div>

                <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
                >
                {loading ? (
                    <span className="loading loading-spinner loading-sm" />
                ) : (
                    "Register"
                )}
                </button>
            </form>

            <p className="text-sm text-center">
                Sudah punya akun?{" "}
                <a href="/login" className="link link-primary">
                Login
                </a>
            </p>
            </div>
        </div>
        </div>
    );
}
