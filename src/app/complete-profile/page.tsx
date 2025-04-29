"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isUserProfileComplete } from "@/lib/checkUserCompletation";

export default function CompleteProfile() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<"CLIENT" | "AGENCY">();
  const [formData, setFormData] = useState({});
  const router = useRouter();
  /*
  useEffect(() => {
    
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/complete-profile");
    }
      

    if (status === "authenticated" && session?.user) {
      // a questo punto l'utente è autenticato
      const checkProfileCompletion = async () => {
        if (session.user) {
          const isComplete = await isUserProfileComplete(session.user.email!);
          if (isComplete) {
            // Se il profilo è completo, reindirizza alla homepage
            router.push("/");
          }
        }
      };
      checkProfileCompletion();
    }
  }, [status, session, router]);
  */

  useEffect(() => {
    // Ottieni l'email dalla sessione o dai query params
    const sessionEmail = session?.user?.email;
    const urlEmail = searchParams.get("email");

    if (sessionEmail) {
      setEmail(sessionEmail);
    } else if (urlEmail) {
      setEmail(urlEmail);
    } else if (status === "authenticated") {
      // Se autenticato ma senza email, reindirizza
      router.push("/login");
    }
  }, [status, session, searchParams, router]);

  useEffect(() => {
    if (email) {
      const checkProfile = async () => {
        const isComplete = await isUserProfileComplete(email);
        if (isComplete) {
          router.replace("/"); // replace invece di push, così non torna più indietro
        }
      };
      checkProfile();
    }
  }, [email, router]);

  const handleSubmit = async () => {
    if (!email || !role) {
      alert("Missing data. Please select your role and fill the form.");
      return;
    }
    if (Object.keys(formData).length === 0) {
      alert("Please complete all required fields.");
      return;
    }

    const res = await fetch("/api/complete-registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, ...formData, email }),
    });

    console.log("Email inviata al server:", session?.user?.email); // Debug

    if (res.ok) {
      router.push("/");
    } else {
      alert("Error while saving data. Retry again");
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  if (!email) return <p>Verifying your session...</p>;

  /*
  if (!session?.user?.email) {
    alert("Missing email. Please log in again.");
    return;
  }
    */

  return (
    <div className="max-w-md mx-auto pt-35">
      <h1 className="text-xl font-bold mb-4">Complete your profile</h1>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Which is your role?</label>
        <div className="flex gap-4">
          <label>
            <input
              type="radio"
              checked={role === "CLIENT"}
              onChange={() => setRole("CLIENT")}
            />{" "}
            Client
          </label>
          <label>
            <input
              type="radio"
              checked={role === "AGENCY"}
              onChange={() => setRole("AGENCY")}
            />{" "}
            Agency
          </label>
        </div>
      </div>

      {role === "CLIENT" && (
        <>
          <input
            className="border p-2 mb-2 w-full"
            placeholder="Name"
            onChange={(e) =>
              setFormData((f) => ({ ...f, name: e.target.value }))
            }
          />
          <input
            className="border p-2 mb-2 w-full"
            placeholder="Surname"
            onChange={(e) =>
              setFormData((f) => ({ ...f, surname: e.target.value }))
            }
          />
          <input
            className="border p-2 mb-2 w-full"
            placeholder="Cellphone"
            onChange={(e) =>
              setFormData((f) => ({ ...f, cellphone: e.target.value }))
            }
          />
        </>
      )}

      {role === "AGENCY" && (
        <>
          <input
            className="border p-2 mb-2 w-full"
            placeholder="Agency Name"
            onChange={(e) =>
              setFormData((f) => ({ ...f, name: e.target.value }))
            }
          />
          <input
            className="border p-2 mb-2 w-full"
            placeholder="VAT Number"
            onChange={(e) =>
              setFormData((f) => ({ ...f, vatNumber: e.target.value }))
            }
          />
          <input
            className="border p-2 mb-2 w-full"
            placeholder="Telephone"
            onChange={(e) =>
              setFormData((f) => ({ ...f, telephone: e.target.value }))
            }
          />
        </>
      )}

      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleSubmit}
      >
        Complete
      </button>
    </div>
  );
}
