"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) setSent(true);
  };

  return (
    <div id="forgot-password" className="px-10">
      <section className="w-full min-h-screen flex justify-center items-center pt-28 pb-3">
        <div className="bg-stone-100 rounded-xl shadow-sm max-w-md w-full p-5 sm:p-10 flex flex-col gap-5">
          {/* Titolo */}
          <h1 className="text-center text-xl sm:text-2xl text-balance font-bold sm:mb-5">
            Reset your password
          </h1>
          {sent ? (
            <p className="text-west-side-500 text-center font-medium">
              If your email is correct, a reset link has been sent to your inbox. Please check your email and follow the instructions to reset your password.
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
      </section>
    </div>
  );
}
