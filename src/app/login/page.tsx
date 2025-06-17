"use client";

import { useAuthErrorMessage } from "@/lib/useAuthErrorMessage";
import { signIn } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons/faGoogle";
import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { faSlash } from "@fortawesome/free-solid-svg-icons/faSlash";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  // State to store a random number for button color variation
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  // Get authentication error message from custom hook
  const errorMessage = useAuthErrorMessage();

  // Handles login with credentials (email and password)
  const credentialsAction = (formData: FormData) => {
    signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      callbackUrl: "/",
    });
  };

  // On mount, set a random number for button color and handle animation classes
  useEffect(() => {
    const number = Math.floor(Math.random() * 4) + 1; // Generate a random number between 1 and 4
    setRandomNumber(number);
    console.log("Random number:", number); // Log the random number to the console

    // Remove animation classes after a delay
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
      <section className="w-full min-h-screen flex justify-center items-center pt-28 pb-3">
        <div className="bg-stone-100 rounded-xl shadow-sm max-w-2xl w-full p-5 sm:p-10 flex flex-col gap-5 sm:gap-10">
          {/* Title */}
          <h2 className="text-center text-xl sm:text-2xl text-balance font-bold">
            Log into your account
          </h2>
          {/* OAuth Authentication Buttons */}
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Google Login Button */}
            <button
              id="google"
              className={`w-full flex justify-center items-center py-2 sm:py-4 border-2 hover:text-stone-100 active:text-stone-100 font-medium rounded-lg
                          motion-preset-expand motion-delay-150
                          transition-all duration-150 ease-out active:scale-90 hover:scale-105
               ${randomNumber === 1
                  ? "border-google-blue hover:bg-google-blue active:bg-google-blue text-google-blue"
                  : ""
                }
               ${randomNumber === 2
                  ? "border-google-red hover:bg-google-red active:bg-google-red text-google-red"
                  : ""
                }
               ${randomNumber === 3
                  ? "border-google-green hover:bg-google-green active:bg-google-green text-google-green"
                  : ""
                }
               ${randomNumber === 4
                  ? "border-google-yellow hover:bg-google-yellow active:bg-google-yellow text-google-yellow"
                  : ""
                }`}
              onClick={() => {
                localStorage.setItem("oauth_provider", "google"); // Store provider in localStorage
                signIn("google"); // Trigger Google OAuth login
              }}
            >
              <FontAwesomeIcon icon={faGoogle} className="mr-2 text-2xl" />
              <span className="sm:hidden">Login</span>
              <span className="hidden sm:inline">Login with Google</span>
            </button>
            {/* Github Login Button */}
            <button
              id="github"
              className="w-full flex justify-center items-center py-2 sm:py-4 border-2 border-github hover:bg-github active:bg-github text-github hover:text-stone-100 active:text-stone-100 font-medium rounded-lg
                                motion-preset-expand motion-delay-150
                                transition-all duration-150 ease-out active:scale-90 hover:scale-105"
              onClick={() => {
                localStorage.setItem("oauth_provider", "github"); // Store provider in localStorage
                signIn("github"); // Trigger GitHub OAuth login
              }}
            >
              <FontAwesomeIcon icon={faGithub} className="mr-2 text-2xl" />
              <span className="sm:hidden">Login</span>
              <span className="hidden sm:inline">Login with GitHub</span>
            </button>
          </div>
          {/* Credentials Login Form */}
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
                  {/* Toggle password visibility button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 aspect-square h-full flex items-center text-stone-600 hover:text-stone-700 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
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
              {/* Link to Forgot Password page */}
              <Link
                href="/forgot-password"
                className="w-fit rounded-sm text-sm p-2 hover:bg-west-side-500 active:bg-west-side-500 text-west-side-500 hover:text-stone-100 active:text-stone-100 font-medium transition"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Display error message if present */}
            {errorMessage && (
              <p className="text-red-500 text-center font-medium">
                {errorMessage}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-5 mt-5">
              {/* Signup Button */}
              <Link
                href={"/register"}
                className="w-full font-medium h-10 sm:h-12 flex justify-center items-center rounded-xl border-2 border-stone-900 text-stone-900
                          hover:bg-stone-900 hover:text-stone-100
                          active:bg-stone-900 active:text-stone-100
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
                className="w-full font-medium h-10 sm:h-12 flex justify-center items-center rounded-xl border-2 border-west-side-500 text-west-side-500
                          hover:bg-west-side-500 hover:text-stone-100
                          active:bg-west-side-500 active:text-stone-100
                            transition-all duration-150 ease-out active:scale-90 hover:scale-105 group"
              >
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-lg opacity-0"
                />
                <span className="sm:hidden">Login</span>
                <span className="hidden sm:inline">Login with Credentials</span>
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
