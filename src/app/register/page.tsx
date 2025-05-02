"use client";

import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faUserTie } from '@fortawesome/free-solid-svg-icons';
import ClientForm from "../../components/ClientForm";
import AgencyForm from "../../components/AgencyForm";

export default function RegisterPage() {
  const [role, setRole] = useState<"CLIENT" | "AGENCY" | "">("");

  return (
    <div id="register" className="px-10">
      <section className="w-full h-screen flex justify-center items-center pt-24 pb-3">
        <div className="bg-stone-100 rounded-xl shadow-sm max-w-2xl w-full p-10 flex flex-col gap-5">
          {/* Titolo */}
          <h2 className="text-center text-2xl font-bold mb-5">Sign up for an account</h2>

          {!role ? (
            <div className="flex gap-5">
              <button onClick={() => setRole("CLIENT")}
                className="w-full font-medium h-12 flex justify-center items-center rounded-lg border-2 border-stone-900 text-stone-900
                            hover:border-west-side-500 hover:bg-west-side-500 hover:text-stone-100
                            transition-all duration-150 ease-out active:scale-90 hover:scale-105 overflow-hidden group">
                <FontAwesomeIcon icon={faUser} className="text-stone-100 text-lg mr-2 translate-y-[200%] group-hover:translate-y-0 transition duration-150 group-hover:duration-500" />
                Client
                <FontAwesomeIcon icon={faUser} className="text-lg ml-2 opacity-0" />
              </button>
              <button onClick={() => setRole("AGENCY")}
                className="w-full font-medium h-12 flex justify-center items-center rounded-lg border-2 border-stone-900 text-stone-900
                            hover:border-west-side-500 hover:bg-west-side-500 hover:text-stone-100
                            transition-all duration-150 ease-out active:scale-90 hover:scale-105 overflow-hidden group">
                <FontAwesomeIcon icon={faUserTie} className="text-stone-100 text-lg mr-2 translate-y-[200%] group-hover:translate-y-0 transition duration-150 group-hover:duration-500" />
                Agency
                <FontAwesomeIcon icon={faUserTie} className="text-lg ml-2 opacity-0" />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setRole("")}
                className="flex justify-center items-center absolute size-10 bg-stone-100 hover:bg-stone-900 border-1 border-stone-900/10 rounded-md shadow-sm text-stone-900 hover:text-stone-100 text-xl transition">
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              {role === "CLIENT" ? <ClientForm /> : <AgencyForm />}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
