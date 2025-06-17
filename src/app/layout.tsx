"use client";

import "./globals.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookSquare, faXTwitter, faInstagram, faTiktok, faLinkedin, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { SessionProvider, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { ToastContainer } from 'react-toastify';
import Link from "next/link";
import React, { useState } from "react";
import RegisterSW from "@/components/RegisterSW";
config.autoAddCss = false;

// RootLayout wraps the app with session provider and layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <InnerLayout>{children}</InnerLayout>
    </SessionProvider>
  );
}

// InnerLayout contains the navigation, footer, and main content
function InnerLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  // Scroll to top if already on homepage
  const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Scroll to map section or navigate to homepage with anchor
  const handleScrollToMap = () => {
    if (typeof window !== "undefined") {
      const targetId = "map-section";
      if (window.location.pathname === "/") {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      } else {
        window.location.href = "/?scrollTo=map-section";
      }
    }
  };

  return (
    <html lang="en">
      <head>
        <meta name="description" content="WorQ - Your ultimate workspace solution. Explore spaces, connect, and collaborate effortlessly." />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512.svg" />
        <title>WorQ</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="theme-color" content="#f3f4f6" />
      </head>
      <body className="bg-stone-200 text-stone-900 select-none">
        {/* <RegisterSW /> */}
        {/* Navigation bar */}
        <nav className="z-1000 w-full p-5 fixed flex justify-center items-center gap-5">
          <div className="bg-stone-100/75 border-1 border-stone-100 px-2.5 backdrop-blur-xs shadow-sm rounded-3xl flex flex-col md:grid items-center transition duration-250 grid-cols-1 md:grid-cols-[1fr_auto_1fr] w-full lg:w-3/4 xl:w-2/3">
            <div className="justify-evenly items-center text-stone-900 font-medium text-lg gap-3 text-center hidden md:flex">
              <button onClick={handleScrollToMap} className="rounded-2xl transition duration-250 w-full py-3
                                                            hover:bg-stone-900 hover:text-stone-100
                                                            active:bg-stone-900 active:text-stone-100">
                Map
              </button>
              <Link href="/spaces" className="rounded-2xl transition duration-250 w-full py-3
                                            hover:bg-stone-900 hover:text-stone-100
                                            active:bg-stone-900 active:text-stone-100">
                Spaces
              </Link>
            </div>

            <div className="w-full md:w-auto flex flex-col justify-start md:justify-center items-center text-center">
              <Link
                href="/"
                onClick={handleScrollToTop}
                className="w-full md:w-auto text-3xl md:text-5xl font-bold px-6 pt-2 md:pb-4 text-stone-900">
                Wor<span className="text-west-side-500">Q</span>
              </Link>

              {/* Mobile Menu */}
              <div className={`w-full flex md:hidden flex-col gap-2 overflow-hidden transition-all ${menuOpen ? "max-h-64 mt-2" : "max-h-0"}`}>
                <div className="flex justify-evenly items-center text-stone-900 font-medium text-lg gap-2 text-center">
                  {/* First block: navigation */}
                  <button
                    onClick={e => { handleScrollToMap(); setMenuOpen(false); }}
                    className="rounded-2xl transition duration-250 w-full py-3 hover:bg-stone-900 hover:text-stone-100 active:bg-stone-900 active:text-stone-100">
                    Map
                  </button>
                  <Link
                    href="/spaces"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-2xl transition duration-250 w-full py-3 hover:bg-stone-900 hover:text-stone-100 active:bg-stone-900 active:text-stone-100">
                    Spaces
                  </Link>
                </div>
                {/* Second block: auth/profile */}
                <div className="flex justify-evenly items-center text-stone-900 font-medium text-lg gap-2 text-center">
                  {session ? (
                    <>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="rounded-2xl transition duration-250 w-full py-3 hover:bg-stone-900 hover:text-stone-100 active:bg-stone-900 active:text-stone-100">
                        Logout
                      </button>
                      <Link
                        href="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="rounded-2xl transition duration-250 w-full py-3 hover:bg-west-side-500 hover:text-stone-100 active:bg-west-side-500 active:text-stone-100">
                        Profile
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/register"
                        onClick={() => setMenuOpen(false)}
                        className="rounded-2xl transition duration-250 w-full py-3 hover:bg-stone-900 hover:text-stone-100 active:bg-stone-900 active:text-stone-100">
                        Signup
                      </Link>
                      <Link
                        href="/login"
                        onClick={() => setMenuOpen(false)}
                        className="rounded-2xl transition duration-250 w-full py-3 hover:bg-west-side-500 hover:text-stone-100 active:bg-west-side-500 active:text-stone-100">
                        Login
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <div className="md:hidden w-full">
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`w-full pt-1 pb-2 transition-transform duration-200 cursor-pointer ${menuOpen ? "-scale-y-100" : ""}`}
                  onClick={() => setMenuOpen((open) => !open)}
                />
              </div>
            </div>

            <div className="justify-evenly items-center text-stone-900 font-medium text-lg gap-3 text-center hidden md:flex">
              {session ? (
                <>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="rounded-2xl transition duration-250 w-full py-3 
                                                          hover:bg-stone-900 hover:text-stone-100
                                                          active:bg-stone-900 active:text-stone-100">
                    Logout
                  </button>
                  <Link href="/profile" className="rounded-2xl transition duration-250 w-full py-3 
                                                  hover:bg-west-side-500 hover:text-stone-100
                                                  active:bg-west-side-500 active:text-stone-100">
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/register" className="rounded-2xl transition duration-250 w-full py-3 
                                                    hover:bg-stone-900 hover:text-stone-100
                                                    active:bg-stone-900 active:text-stone-100">
                    Signup
                  </Link>
                  <Link href="/login" className="rounded-2xl transition duration-250 w-full py-3 
                                                 hover:bg-west-side-500 hover:text-stone-100
                                                 active:bg-west-side-500 active:text-stone-100">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {children}

        {/* Footer section */}
        <footer className="z-1000 w-full bg-stone-900 text-stone-100 p-5 lg:p-20 mt-10">
          <div
            className="flex gap-10 lg:gap-5 justify-between
                          flex-col lg:flex-row items-start lg:items-center">
            {/* Main Info */}
            <div className="flex flex-col gap-5">
              <h1 className="text-4xl font-bold">
                Wor<span className="text-turquoise-blue-400">Q</span>
              </h1>
              {/* Contact phone number */}
              <p className="text-base lg:text-xl">
                Call us{" "}
                <a
                  href="tel:800515516"
                  className="underline decoration-2 cursor-pointer transition
                            hover:decoration-turquoise-blue-400
                            active:decoration-turquoise-blue-400"
                >
                  800 515 516
                </a>
              </p>
              <p className="text-base lg:text-xl">
                Send us an email at{" "}
                <a
                  href="mailto:info@worq.com"
                  className="underline decoration-2 cursor-pointer transition
                            hover:decoration-turquoise-blue-400
                            active:decoration-turquoise-blue-400"
                >
                  info@worq.com
                </a>
              </p>
              {/* Social media icons */}
              <div className="flex gap-2">
                <FontAwesomeIcon
                  icon={faXTwitter}
                  className="aspect-square p-2 text-2xl cursor-pointer rounded-lg
                            transition-all duration-150 ease-out active:scale-90 hover:scale-110
                            hover:bg-turquoise-blue-400 hover:text-stone-900
                            active:bg-turquoise-blue-400 active:text-stone-900"
                />
                <FontAwesomeIcon
                  icon={faFacebookSquare}
                  className="aspect-square p-2 text-2xl cursor-pointer rounded-lg
                            transition-all duration-150 ease-out active:scale-90 hover:scale-110
                            hover:bg-turquoise-blue-400 hover:text-stone-900
                            active:bg-turquoise-blue-400 active:text-stone-900"
                />
                <FontAwesomeIcon
                  icon={faLinkedin}
                  className="aspect-square p-2 text-2xl cursor-pointer rounded-lg
                            transition-all duration-150 ease-out active:scale-90 hover:scale-110
                            hover:bg-turquoise-blue-400 hover:text-stone-900
                            active:bg-turquoise-blue-400 active:text-stone-900"
                />
                <FontAwesomeIcon
                  icon={faYoutube}
                  className="aspect-square p-2 text-2xl cursor-pointer rounded-lg
                            transition-all duration-150 ease-out active:scale-90 hover:scale-110
                            hover:bg-turquoise-blue-400 hover:text-stone-900
                            active:bg-turquoise-blue-400 active:text-stone-900"
                />
                <FontAwesomeIcon
                  icon={faInstagram}
                  className="aspect-square p-2 text-2xl cursor-pointer rounded-lg
                            transition-all duration-150 ease-out active:scale-90 hover:scale-110
                            hover:bg-turquoise-blue-400 hover:text-stone-900
                            active:bg-turquoise-blue-400 active:text-stone-900"
                />
                <FontAwesomeIcon
                  icon={faTiktok}
                  className="aspect-square p-2 text-2xl cursor-pointer rounded-lg
                            transition-all duration-150 ease-out active:scale-90 hover:scale-110
                            hover:bg-turquoise-blue-400 hover:text-stone-900
                            active:bg-turquoise-blue-400 active:text-stone-900"
                />
              </div>
            </div>

            {/* Newsletter subscription */}
            <div className="flex flex-col justify-center w-full lg:w-auto gap-5 lg:gap-10">
              <h2 className="font-bold text-lg lg:text-3xl">Subscribe and stay up to date.</h2>
              <input
                type="text"
                placeholder="Enter your email..."
                id="newsletter"
                className="w-full outline-0 border-2 border-stone-100 rounded-2xl p-4"
              />
              {/* email input management */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    const input = document.getElementById(
                      "newsletter"
                    ) as HTMLInputElement;
                    const email = input.value;
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    const messageElement = document.getElementById("message");
                    if (emailRegex.test(email)) {
                      if (messageElement) {
                        messageElement.textContent =
                          "Subscribed successfully!";
                        messageElement.classList.add(
                          "decoration-turquoise-blue-400"
                        );
                      }
                    } else {
                      if (messageElement) {
                        messageElement.textContent = "Invalid email.";
                        messageElement.classList.add("decoration-red-500");
                      }
                    }
                  }}
                  className="px-4 py-2 border-2 border-stone-100 rounded-2xl
                            transition-all duration-150 ease-out active:scale-90 hover:scale-110
                            hover:bg-stone-100 hover:text-stone-900
                            active:bg-stone-100 active:text-stone-900
                            ">
                  Subscribe
                </button>
                <p
                  id="message"
                  className="font-medium underline decoration-2
                               text-sm lg:text-xl"
                ></p>
              </div>
            </div>
          </div>
        </footer>
        <ToastContainer position="bottom-right" />
      </body>
    </html >
  );
}
