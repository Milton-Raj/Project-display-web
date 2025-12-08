"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, LogIn, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Login failed");
                setIsLoading(false);
                return;
            }

            // Redirect to admin dashboard
            router.push("/admin/dashboard");
            router.refresh();
        } catch (err) {
            setError("An error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md px-4"
            >
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-2 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center glow-primary">
                            <Lock className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">
                        Admin <span className="gradient-text">Portal</span>
                    </h1>
                    <p className="text-muted-foreground">Sign in to manage your portfolio</p>
                </div>

                {/* Login Card */}
                <Card className="shadow-premium-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl">Welcome Back</CardTitle>
                        <CardDescription>
                            Enter your credentials to access the admin panel
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium flex items-center space-x-2">
                                    <Mail className="w-4 h-4" />
                                    <span>Email</span>
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium flex items-center space-x-2">
                                    <Lock className="w-4 h-4" />
                                    <span>Password</span>
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-4 rounded-xl bg-destructive/20 border border-destructive/30 text-destructive">
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="gradient"
                                size="lg"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    "Signing in..."
                                ) : (
                                    <>
                                        Sign In
                                        <LogIn className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Footer Note */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground flex items-center justify-center space-x-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Secured with JWT authentication</span>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
