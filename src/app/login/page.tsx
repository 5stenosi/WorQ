"use client";

import { useAuthErrorMessage } from "@/lib/useAuthErrorMessage";
import { signIn, useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowLeft,
  faArrowRight,
  faEye,
  faSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const errorMessage = useAuthErrorMessage();
  const { status } = useSession();
  const router = useRouter();

  const credentialsAction = (formData: FormData) => {
    signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      callbackUrl: "/",
    });
  };

  // Se l'utente è già loggato, viene reindirizzato alla home
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  useEffect(() => {
    const number = Math.floor(Math.random() * 4) + 1;
    setRandomNumber(number);
    console.log("Random number:", number); // Log the random number to the console

    const timer = setTimeout(() => {
      const googleButton = document.getElementById("google");
      const githubButton = document.getElementById("github");

      if (googleButton) {
        googleButton.classList.remove(
          "motion-preset-expand",
          "motion-delay-150"
        );
      }
      if (githubButton) {
        githubButton.classList.remove(
          "motion-preset-expand",
          "motion-delay-150"
        );
      }
    }, 750);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  return (
    <div id="login" className="px-10">
      <section className="w-full h-screen flex justify-center items-center pt-24 pb-3">
        <div className="bg-stone-100 rounded-xl shadow-sm max-w-2xl w-full p-10 flex flex-col gap-10">
          {/* Titolo */}
          <h2 className="text-center text-2xl font-bold">
            Log into your account
          </h2>
          {/* Auth */}
          <div className="flex gap-5">
            {/* Google */}
            <button
              id="google"
              className={`w-full flex justify-center items-center py-4 border-2 hover:text-stone-100 font-medium rounded-lg
                                motion-preset-expand motion-delay-150
                                transition-all duration-150 ease-out active:scale-90 hover:scale-105
                 ${
                   randomNumber === 1
                     ? "border-google-blue hover:bg-google-blue text-google-blue"
                     : ""
                 }
                 ${
                   randomNumber === 2
                     ? "border-red-500 hover:bg-red-500 text-red-500"
                     : ""
                 }
                 ${
                   randomNumber === 3
                     ? "border-green-500 hover:bg-green-500 text-green-500"
                     : ""
                 }
                 ${
                   randomNumber === 4
                     ? "border-yellow-500 hover:bg-yellow-500 text-yellow-500"
                     : ""
                 }`}
              onClick={() => {
                localStorage.setItem("oauth_provider", "google");
                signIn("google", { callbackUrl: "/" });
              }}
            >
              <FontAwesomeIcon icon={faGoogle} className="mr-2 text-2xl" />
              Login with Google
            </button>
            {/* Github */}
            <button
              id="github"
              className="w-full flex justify-center items-center py-4 border-2 border-github hover:bg-github text-github hover:text-stone-100 font-medium rounded-lg
                                motion-preset-expand motion-delay-150
                                transition-all duration-150 ease-out active:scale-90 hover:scale-105"
              onClick={() => {
                localStorage.setItem("oauth_provider", "github");
                signIn("github", { callbackUrl: "/" });
              }}
            >
              <FontAwesomeIcon icon={faGithub} className="mr-2 text-2xl" />
              Login with GitHub
            </button>
          </div>
          {/* Form */}
          <form action={credentialsAction} className="flex flex-col gap-5">
            <div className="flex flex-col gap-5">
              <div className="w-full flex flex-col">
                <label className="flex justify-between font-medium pl-1 pb-1 text-stone-900">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
                  placeholder="Enter your email"
                />
              </div>
              <div className="w-full flex flex-col ">
                <label className="flex justify-between font-medium pl-1 pb-1 text-stone-900">
                  Password
                </label>
                <div className="w-full relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    className="w-full p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50 pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 aspect-square h-full flex items-center text-stone-600 hover:text-stone-700 focus:outline-none"
                  >
                    <FontAwesomeIcon
                      icon={faEye}
                      className="fa-stack-1x text-stone-600"
                    />
                    {showPassword ? (
                      <FontAwesomeIcon
                        icon={faSlash}
                        className="fa-stack-1x text-red-500"
                      />
                    ) : (
                      ""
                    )}
                  </button>
                </div>
              </div>
            </div>

            {errorMessage && (
              <p className="text-red-500 text-center font-medium">
                {errorMessage}
              </p>
            )}

            {/* Buttons */}
            <div className="flex gap-5 mt-5">
              {/* Signup Button */}
              <Link
                href={"/register"}
                className="w-full font-medium h-12 flex justify-center items-center rounded-xl border-2 border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-stone-100
                                                  transition-all duration-150 ease-out active:scale-90 hover:scale-105 group"
              >
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  className="text-lg group-hover:-translate-x-1/2 opacity-0 group-hover:opacity-100 transition duration-150 group-hover:duration-500"
                />
                Signup
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  className="text-lg opacity-0"
                />
              </Link>
              {/* Login Button */}
              <button
                type="submit"
                className="w-full font-medium h-12 flex justify-center items-center rounded-xl border-2 border-west-side-500 text-west-side-500 hover:bg-west-side-500 hover:text-stone-100
                                                transition-all duration-150 ease-out active:scale-90 hover:scale-105 group"
              >
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-lg opacity-0"
                />
                Login with credentials
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-lg group-hover:translate-x-1/2 opacity-0 group-hover:opacity-100 transition duration-150 group-hover:duration-500"
                />
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
