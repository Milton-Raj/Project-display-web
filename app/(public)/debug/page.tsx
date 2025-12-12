"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, XCircle, RefreshCw } from "lucide-react";

export default function DebugPage() {
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchReport = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/test-env");
            if (!res.ok) throw new Error("API Failed");
            const data = await res.json();
            setReport(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="flex flex-col items-center gap-4">
                <RefreshCw className="w-10 h-10 animate-spin text-primary" />
                <p>Running System Diagnostics...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="text-center space-y-4">
                <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
                <h1 className="text-2xl font-bold">Diagnostics Failed</h1>
                <p className="text-muted-foreground">{error}</p>
                <Button onClick={fetchReport}>Retry</Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white p-8 font-mono">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">System Status Report</h1>
                    <Button onClick={fetchReport} variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Run Again
                    </Button>
                </div>

                {/* Verdict */}
                <Card className={`p-6 border-2 ${report.verdict.startsWith("PASS") ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"}`}>
                    <div className="flex items-center gap-4">
                        {report.verdict.startsWith("PASS") ? (
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        ) : (
                            <XCircle className="w-8 h-8 text-red-500" />
                        )}
                        <div>
                            <h2 className="text-xl font-bold">{report.verdict}</h2>
                            <p className="text-sm opacity-80">{report.timestamp}</p>
                        </div>
                    </div>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Environment Variables */}
                    <Card className="p-6 bg-white/5 border-white/10">
                        <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">Environment Variables</h3>
                        <div className="space-y-2">
                            {Object.entries(report.env_vars).map(([key, status]: any) => (
                                <div key={key} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{key}</span>
                                    <span className={status === "Set" ? "text-green-400" : "text-red-500 font-bold"}>
                                        {status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Authentication */}
                    <Card className="p-6 bg-white/5 border-white/10">
                        <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">Authentication</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Status</span>
                                <span className={report.auth.status === "SUCCESS" ? "text-green-400" : "text-red-500"}>
                                    {report.auth.status || "UNKNOWN"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Token Generated</span>
                                <span>{report.auth.token_present ? "YES" : "NO"}</span>
                            </div>
                            {report.auth.error && (
                                <div className="mt-2 p-2 bg-red-500/20 text-red-400 text-xs rounded break-all">
                                    {report.auth.error}
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Google Sheets */}
                    <Card className="p-6 bg-white/5 border-white/10">
                        <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">Google Sheets</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Read Test</span>
                                <span className={report.sheets.read_status === "SUCCESS" ? "text-green-400" : "text-red-500"}>
                                    {report.sheets.read_status}
                                </span>
                            </div>
                            {report.sheets.read_error && <div className="text-red-400 text-xs">{report.sheets.read_error}</div>}

                            <div className="flex justify-between">
                                <span>Write Test</span>
                                <span className={report.sheets.write_status === "SUCCESS" ? "text-green-400" : "text-red-500"}>
                                    {report.sheets.write_status}
                                </span>
                            </div>
                            {report.sheets.write_error && <div className="text-red-400 text-xs">{report.sheets.write_error}</div>}
                        </div>
                    </Card>

                    {/* Google Drive */}
                    <Card className="p-6 bg-white/5 border-white/10">
                        <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">Google Drive</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Upload Test</span>
                                <span className={report.drive.upload_status === "SUCCESS" ? "text-green-400" : "text-red-500"}>
                                    {report.drive.upload_status}
                                </span>
                            </div>
                            {report.drive.error && (
                                <div className="text-red-400 text-xs break-all">{report.drive.error}</div>
                            )}
                            {report.drive.file_id && (
                                <div className="text-xs text-muted-foreground">File ID: {report.drive.file_id}</div>
                            )}
                            <div className="flex justify-between">
                                <span>Cleanup</span>
                                <span className={report.drive.cleanup_status === "SUCCESS" ? "text-green-400" : "text-muted-foreground"}>
                                    {report.drive.cleanup_status || "N/A"}
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>

                {report.global_error && (
                    <Card className="p-6 border-red-500 bg-red-500/10">
                        <h3 className="text-lg font-bold text-red-500 mb-2">Critical Error</h3>
                        <pre className="text-xs whitespace-pre-wrap">{report.global_error}</pre>
                    </Card>
                )}
            </div>
        </div>
    );
}
