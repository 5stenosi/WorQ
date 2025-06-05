"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) setSent(true);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-stone-100 px-5">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 sm:p-10">
        <h1 className="text-2xl font-bold text-center text-stone-900 mb-6">
          Reset your password
        </h1>
        {sent ? (
          <p className="text-green-600 text-center font-medium">
            Check your email for a reset link.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="font-medium text-stone-900 pl-1 pb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              Send reset link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
