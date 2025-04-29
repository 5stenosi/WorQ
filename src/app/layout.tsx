"use client";

import "./globals.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookSquare,
  faXTwitter,
  faInstagram,
  faTiktok,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { SessionProvider } from "next-auth/react";
config.autoAddCss = false;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const handleScrollToBottom = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleScrollToMap = () => {
    if (typeof window !== "undefined") {
      const targetId = "map-section"; // ID del componente di destinazione
      if (window.location.pathname === "/") {
        // Se siamo già nella schermata principale, scrolla direttamente
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      } else {
        // Cambia pagina con una query string per indicare lo scroll
        window.location.href = "/?scrollTo=map-section";
      }
    }
  };

  return (
    <html lang="en">
      <title>WorQ</title>
      <body className="bg-stone-200 text-stone-900 select-none">
        <SessionProvider>
          <nav className="z-1000 w-full p-5 md:px-10 h-24 fixed flex justify-center items-center gap-5">
            <div className="bg-stone-100/75 border-1 border-stone-100 px-4 backdrop-blur-xs rounded-3xl grid items-center transition duration-250 grid-cols-1 lg:grid-cols-[1fr_auto_1fr] w-full lg:w-3/4">
              <div className="justify-evenly items-center text-stone-900 font-medium text-lg gap-3 text-center hidden sm:flex">
                {/* <button onClick={handleScrollToBottom} className="rounded-xl transition duration-250 w-full py-3 hover:bg-stone-900 hover:text-stone-100">
                Contact us
              </button> */}
              <a href="/spaces" className="rounded-xl transition duration-250 w-full py-3 hover:bg-stone-900 hover:text-stone-100">
                Spaces
              </a>
              <a href="/profile" className="rounded-xl transition duration-250 w-full py-3 hover:bg-stone-900 hover:text-stone-100">
                Profile
              </a>
              <button onClick={handleScrollToMap} className="rounded-xl transition duration-250 w-full py-3 hover:bg-stone-900 hover:text-stone-100">
                Map
              </button>

            </div>

              <div className="flex justify-center items-center text-center">
                <a
                  href="/"
                  onClick={handleScrollToTop}
                  className="text-5xl font-bold px-6 pt-2 pb-4 rounded-2xl text-stone-900"
                >
                  Wor<span className="text-west-side-500">Q</span>
                </a>
              </div>

              <div className="justify-evenly items-center text-stone-900 font-medium text-lg gap-3 text-center hidden sm:flex">
                <button className="rounded-xl transition duration-250 w-full py-3 hover:bg-stone-900 hover:text-stone-100">
                  Log out
                </button>
                <button className="rounded-xl transition duration-250 w-full py-3 hover:bg-stone-900 hover:text-stone-100">
                  Sign up
                </button>
                <button className="rounded-xl transition duration-250 w-full py-3 hover:bg-west-side-500 hover:text-stone-100">
                  Log in
                </button>
              </div>
            </div>
          </nav>

          {children}

          {/* Footer */}
          <footer className="w-full bg-stone-900 text-stone-100 p-5 lg:p-20 mt-10">
            <div
              className="flex gap-10 lg:gap-5 justify-between
                          flex-col lg:flex-row items-start lg:items-center"
            >
              {/* Main Info */}
              <div className="flex flex-col gap-5">
                <h1 className="text-4xl font-bold">
                  Wor<span className="text-turquoise-blue-400">Q</span>
                </h1>
                {/* Ho messo il numero di "Che amore di caffè" */}
                <p className="text-base lg:text-xl">
                  Call us{" "}
                  <a
                    href="tel:800515516"
                    className="underline decoration-2 hover:decoration-turquoise-blue-400 cursor-pointer transition"
                  >
                    800 515 516
                  </a>
                </p>
                <p className="text-base lg:text-xl">
                  Send us an email at{" "}
                  <a
                    href="mailto:info@worq.com"
                    className="underline decoration-2 hover:decoration-turquoise-blue-400 cursor-pointer transition"
                  >
                    info@worq.com
                  </a>
                </p>
                {/* Contact Icons */}
                <div className="flex gap-2">
                  <FontAwesomeIcon
                    icon={faXTwitter}
                    className="aspect-square p-2 text-2xl cursor-pointer rounded-lg hover:bg-turquoise-blue-400 hover:text-stone-900 transition"
                  />
                  <FontAwesomeIcon
                    icon={faFacebookSquare}
                    className="aspect-square p-2 text-2xl cursor-pointer rounded-lg hover:bg-turquoise-blue-400 hover:text-stone-900 transition"
                  />
                  <FontAwesomeIcon
                    icon={faLinkedin}
                    className="aspect-square p-2 text-2xl cursor-pointer rounded-lg hover:bg-turquoise-blue-400 hover:text-stone-900 transition"
                  />
                  <FontAwesomeIcon
                    icon={faYoutube}
                    className="aspect-square p-2 text-2xl cursor-pointer rounded-lg hover:bg-turquoise-blue-400 hover:text-stone-900 transition"
                  />
                  <FontAwesomeIcon
                    icon={faInstagram}
                    className="aspect-square p-2 text-2xl cursor-pointer rounded-lg hover:bg-turquoise-blue-400 hover:text-stone-900 transition"
                  />
                  <FontAwesomeIcon
                    icon={faTiktok}
                    className="aspect-square p-2 text-2xl cursor-pointer rounded-lg hover:bg-turquoise-blue-400 hover:text-stone-900 transition"
                  />
                </div>
              </div>

              {/* Newsletter */}
              <div className="flex flex-col justify-center w-full lg:w-auto gap-5 lg:gap-10">
                <h1
                  className="font-bold
                             text-lg lg:text-3xl"
                >
                  Subscribe and stay up to date.
                </h1>
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
                          messageElement.textContent = "Invalid email address.";
                          messageElement.classList.add("decoration-red-500");
                        }
                      }
                    }}
                    className="px-4 py-2 border-2 border-stone-100 rounded-2xl hover:bg-stone-100 hover:text-stone-900 transition"
                  >
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
        </SessionProvider>
      </body>
    </html>
  );
}
