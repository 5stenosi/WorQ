"use client";

import { signIn } from "next-auth/react";

export default function SignIn() {
  const resendAction = (formData: FormData) => {
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });
    signIn("resend", data);
  };

  
  const credentialsAction = (formData: FormData) => {
    signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-sm mx-auto mt-10">
      {/* Google Sign-In */}
      <button
        onClick={() => signIn("google")}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Sign in with Google
      </button>

      {/* GitHub Sign-In */}
      <button
        onClick={() => signIn("github")}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
      >
        Sign in with GitHub
      </button>

      {/* Resend Email Sign-In */}
      <form action={resendAction} className="flex flex-col gap-2">
        <label htmlFor="email-resend" className="font-medium">
          Email (Resend)
        </label>
        <input
          type="email"
          id="email-resend"
          name="email"
          required
          className="px-3 py-2 border rounded-lg"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Sign in with Resend
        </button>
      </form>
      
    {/* Credentials Sign-In */}
    <form action={credentialsAction} className="flex flex-col gap-2">
        <label htmlFor="credentials-email" className="font-medium">
          Email (Credentials)
        </label>
        <input
          type="email"
          id="credentials-email"
          name="email"
          required
          className="px-3 py-2 border rounded-lg"
        />

        <label htmlFor="credentials-password" className="font-medium">
          Password
        </label>
        <input
          type="password"
          id="credentials-password"
          name="password"
          required
          className="px-3 py-2 border rounded-lg"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Sign in with Credentials
        </button>
      </form>
    </div>
  );
}
