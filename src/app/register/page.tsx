"use client";

// This page allows users to register as either a Client or an Agency.
// Import necessary hooks, icons, and form components.
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUser,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import ClientForm from "../../components/ClientForm";
import AgencyForm from "../../components/AgencyForm";

export default function RegisterPage() {
  // State variable to track the selected role (CLIENT or AGENCY).
  const [role, setRole] = useState<"CLIENT" | "AGENCY" | "">("");

  // Main layout with a centered registration card.
  return (
    <div id="register" className="px-10">
      <section className="w-full min-h-screen flex justify-center items-center pt-28 pb-3">
        <div className="bg-stone-100 rounded-xl shadow-sm max-w-4xl w-full p-5 sm:p-10 flex flex-col gap-5">
          {/* Title */}
          <h2 className="text-center text-xl sm:text-2xl text-balance font-bold sm:mb-5">
            Sign up for <br className="sm:hidden" /> an account
          </h2>

          {/* If no role is selected, show buttons to choose between Client and Agency. */}
          {!role ? (
            <div className="flex flex-col sm:flex-row gap-5">
              <button
                onClick={() => setRole("CLIENT")}
                className="w-full font-medium h-10 sm:h-12 flex justify-center items-center rounded-lg border-2 border-stone-900 text-stone-900
                            hover:border-west-side-500 hover:bg-west-side-500 hover:text-stone-100
                            active:border-west-side-500 active:bg-west-side-500 active:text-stone-100
                            transition-all duration-150 ease-out active:scale-90 hover:scale-105 overflow-hidden group"
              >
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-stone-100 text-lg mr-2 translate-y-[200%] group-hover:translate-y-0 transition duration-150 group-hover:duration-500"
                />
                Client
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-lg ml-2 opacity-0"
                />
              </button>
              <button
                onClick={() => setRole("AGENCY")}
                className="w-full font-medium h-10 sm:h-12 flex justify-center items-center rounded-lg border-2 border-stone-900 text-stone-900
                            hover:border-west-side-500 hover:bg-west-side-500 hover:text-stone-100
                            active:border-west-side-500 active:bg-west-side-500 active:text-stone-100
                            transition-all duration-150 ease-out active:scale-90 hover:scale-105 overflow-hidden group"
              >
                <FontAwesomeIcon
                  icon={faUserTie}
                  className="text-stone-100 text-lg mr-2 translate-y-[200%] group-hover:translate-y-0 transition duration-150 group-hover:duration-500"
                />
                Agency
                <FontAwesomeIcon
                  icon={faUserTie}
                  className="text-lg ml-2 opacity-0"
                />
              </button>
            </div>
          ) : (
            <>
              {/* If a role is selected, show a back button and the corresponding registration form. */}
              <button
                onClick={() => setRole("")}
                className="flex justify-center items-center absolute size-8 sm:size-10 bg-stone-100 hover:bg-stone-900 border-1 border-stone-900/10 rounded-md shadow-sm text-lg sm:text-xl transition
                          text-stone-900 hover:text-stone-100
                          active:bg-stone-900 active:text-stone-100"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              {role === "CLIENT" ? (
                <ClientForm
                  requiredFields={{
                    name: true,
                    surname: true,
                    email: true,
                    password: true,
                    cellphone: true,
                  }}
                />
              ) : (
                <AgencyForm
                  requiredFields={{
                    name: true,
                    vatNumber: true,
                    email: true,
                    password: true,
                    telephone: true,
                  }}
                />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}