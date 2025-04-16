"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CompleteProfile() {
  const { data: session, status } = useSession();
  const [role, setRole] = useState<"CLIENT" | "AGENCY">();
  const [formData, setFormData] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin?callbackUrl=/complete-profile");
    }
  }, [status, router]);

  const handleSubmit = async () => {
    const res = await fetch("/api/complete-registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, ...formData, email: session?.user?.email }),
    });

    if (res.ok) {
      router.push("/");
    } else {
      alert("Error while saving data. Retry again");
    }
  };

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10">
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
            placeholder="Telefono"
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
