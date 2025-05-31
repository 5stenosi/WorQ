import { signIn } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { UseFormSetError } from "react-hook-form";

// T rappresenta il tipo dei dati del form (ClientFormValues, AgencyFormValues, ecc.).
// Record<string, any> significa che T deve essere un oggetto i cui campi sono stringhe
// (le chiavi) e i valori possono essere qualsiasi tipo (any).
export async function handleFormSubmit<
  T extends Record<string, unknown>
>(params: {
  data: T; // i dati del form dipendono dal tipo (ClientFormValues o AgencyFormValues)
  role: "CLIENT" | "AGENCY";
  useOAuth: boolean;
  provider?: "google" | "github"; // provider OAuth, se presente
  setError: UseFormSetError<T>;
  router: AppRouterInstance; // router di next.js, utilizzato per fare redirect
  emailFromProps?: string; // email ricevuta da props (es nel flusso OAuth), se già nota
}) {
  // Destruttura i params ricevuti per renderli più comodi da usare (params.data -> data)
  const { data, role, useOAuth, provider, router, emailFromProps } = params;

  // operatore nullish coalescing (??) per gestire il caso in cui emailFromProps sia undefined
  console.log("Dati del form:", data);
  const email = useOAuth ? emailFromProps : data.email;
  console.log("Email estratta:", email);
  console.log("typeof data.email:", typeof data.email);

  if (!email) {
    console.error("Email not found.");
    alert("Email is required to complete registration.");
    return;
  }

  const payload = { ...data, email, role };

  try {
  
    if (useOAuth) {
      const res = await fetch("/api/complete-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await signIn(provider, {
          //email,
          redirect: true,
          callbackUrl: "/",
          prompt: "none",
        });
        return;
      } else {
        const error = await res.json();
        throw new Error(error?.message ?? `(${res.status}) Registration failed`);
      }
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      router.replace("/");
    } else {
      const error = await res.json();
      throw new Error(error.message || "Registration failed");
    }
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof Error) {
      if (error.message.includes("Email already registered.")) {
        alert("Email already registered. Please try another one.");
      } else if (error.message.includes("Missing")) {
        alert("Please fill in all required fields.");
      } else {
        alert("An error occurred during registration. Please try again.");
      }
    } else {
      alert("An unknown error occurred. Please try again.");
    }
  }
}
