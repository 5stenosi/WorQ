"use client";
// This page allows users to reset their password using a token from the URL.

import { useState } from "react";
import { useSearchParams } from "next/navigation";

// Import necessary hooks for state management and URL parameter access.

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Get the reset token from the URL query parameters.

  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  // State variables for the new password and success status.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    // Handles form submission: sends the new password and token to the API.

    if (res.ok) setSuccess(true);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-stone-100 px-5">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 sm:p-10">
        {success ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-green-600 mb-4">
              Password reset successfully!
            </h1>
            <p className="text-stone-900">
              You can now{" "}
              <a href="/login" className="text-west-side-500 hover:underline">
                log in
              </a>
              .
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center text-stone-900 mb-6">
              Reset your password
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="font-medium text-stone-900 pl-1 pb-1"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
                />
              </div>
              <button
                type="submit"
                className="w-full font-medium h-10 sm:h-12 flex justify-center items-center rounded-xl border-2 border-west-side-500 text-west-side-500
                  hover:bg-west-side-500 hover:text-white
                  active:bg-west-side-500 active:text-white
                  transition-all duration-150 ease-out active:scale-90 hover:scale-105"
              >
                Reset Password
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}