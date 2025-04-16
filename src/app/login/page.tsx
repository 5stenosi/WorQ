"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  const credentialsAction = (formData: FormData) => {
    signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      callbackUrl: "/", // redirect to the homepage after login
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-sm mx-auto mt-10 border p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold text-center">
        Login into your account
      </h2>

      {/* Google Sign-In */}
      <button
        onClick={() => signIn("google")}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Login with Google
      </button>

      {/* GitHub Sign-In */}
      <button
        onClick={() => signIn("github")}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
      >
        Login with GitHub
      </button>

      {/* Divider */}
      <div className="text-center text-sm text-gray-500">or</div>

      {/* Credentials Sign-In */}
      <form action={credentialsAction} className="flex flex-col gap-3">
        <label htmlFor="email" className="font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="px-3 py-2 border rounded-lg"
        />

        <label htmlFor="password" className="font-medium">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          className="px-3 py-2 border rounded-lg"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mt-2"
        >
          Login with Credentials
        </button>
      </form>

      {/* Link di registrazione */}
      <p className="text-center text-sm mt-4">
        Don&apos;t have an account?{" "}
        <a href="/register" className="text-blue-600 underline">
          Sign up here
        </a>
      </p>
    </div>
  );
}
