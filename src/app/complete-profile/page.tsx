"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ClientForm from "@/components/ClientForm";
import AgencyForm from "@/components/AgencyForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faSpinner,
  faUser,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";

export default function CompleteProfile() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<"CLIENT" | "AGENCY" | "">("");
  const router = useRouter();

  useEffect(() => {
    const urlEmail = searchParams.get("email");

    if (urlEmail) {
      setEmail(urlEmail);
    } else if (status === "authenticated") {
      router.push("/login");
    }
  }, [status, session, searchParams, router]);

  if (status === "loading") return (
    <div className="h-screen text-6xl flex justify-center items-center text-stone-600">
      <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
    </div>
  );;

  return (
    <div id="complete-profile" className="px-10">
      <section className="w-full min-h-screen flex justify-center items-center pt-28">
        <div className="bg-stone-100 rounded-xl shadow-sm max-w-2xl w-full p-5 sm:p-10 flex flex-col gap-5">
          {/* Titolo */}
          <h2 className={`text-center text-xl sm:text-2xl text-balance font-bold sm:mb-5`}>Complete <br className="sm:hidden" /> your profile</h2>

          {!role ? (
            <div className="flex flex-col sm:flex-row gap-5">
              <button onClick={() => setRole("CLIENT")}
                className="w-full font-medium h-10 sm:h-12 flex justify-center items-center rounded-lg border-2 border-stone-900 text-stone-900
                                hover:border-west-side-500 hover:bg-west-side-500 hover:text-stone-100
                                active:border-west-side-500 active:bg-west-side-500 active:text-stone-100
                                transition-all duration-150 ease-out active:scale-90 hover:scale-105 overflow-hidden group">
                <FontAwesomeIcon icon={faUser} className="text-stone-100 text-lg mr-2 translate-y-[200%] group-hover:translate-y-0 transition duration-150 group-hover:duration-500" />
                Client
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-lg ml-2 opacity-0"
                />
              </button>
              <button onClick={() => setRole("AGENCY")}
                className="w-full font-medium h-10 sm:h-12 flex justify-center items-center rounded-lg border-2 border-stone-900 text-stone-900
                            hover:border-west-side-500 hover:bg-west-side-500 hover:text-stone-100
                            active:border-west-side-500 active:bg-west-side-500 active:text-stone-100
                            transition-all duration-150 ease-out active:scale-90 hover:scale-105 overflow-hidden group">
                <FontAwesomeIcon icon={faUserTie} className="text-stone-100 text-lg mr-2 translate-y-[200%] group-hover:translate-y-0 transition duration-150 group-hover:duration-500" />
                Agency
                <FontAwesomeIcon
                  icon={faUserTie}
                  className="text-lg ml-2 opacity-0"
                />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setRole("")}
                className="flex justify-center items-center absolute size-8 sm:size-10 bg-stone-100 hover:bg-stone-900 border-1 border-stone-900/10 rounded-md shadow-sm text-lg sm:text-xl transition
                          text-stone-900 hover:text-stone-100
                          active:bg-stone-900 active:text-stone-100">
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              {role === "CLIENT" ? (
                <ClientForm
                  email={session?.user.email} // da sessione OAuth
                  requiredFields={{
                    name: true,
                    surname: true,
                    cellphone: true,
                  }}
                  layout="col"
                  buttons="confirm"
                  //submitUrl="/api/complete-registration"
                />
              ) : (
                <AgencyForm
                  email={session?.user.email} // da sessione OAuth
                  requiredFields={{
                    name: true,
                    vatNumber: true,
                    telephone: true,
                  }}
                  layout="col"
                  buttons="confirm"
                  //submitUrl="/api/complete-registration"
                />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
