"use client";

import { FormEvent, useState } from "react";

export default function UploadTestPage() {
    const [message, setMessage] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        setMessage("Uploading...");

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            setMessage(result.message);
            return;
        }

        setMessage(result.file.url);
    };

    return (
        <main>
            <h1>Upload Test</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    name="file"
                    accept="image/*"
                />

                <button type="submit">
                    Upload
                </button>
            </form>

            {message && (
                <p>
                    {message}
                </p>
            )}
        </main>
    );
}