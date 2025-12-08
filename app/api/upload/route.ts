import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { mkdir } from "fs/promises";

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const file: File | null = data.get("file") as unknown as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Ignore error if directory exists
        }

        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = file.name.replace(/[^a-zA-Z0-9.]/g, '-');
        const finalFilename = `${uniqueSuffix}-${filename}`;
        const filepath = path.join(uploadDir, finalFilename);

        await writeFile(filepath, buffer);

        // Return the public URL
        const url = `/uploads/${finalFilename}`;

        return NextResponse.json({ url });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
