import { signIn } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { UseFormSetError } from "react-hook-form";

// T represents the type of the form data (ClientFormValues, AgencyFormValues)
export async function handleFormSubmit<
  T extends Record<string, unknown>
>(params: {
  data: T;
  role: "CLIENT" | "AGENCY";
  useOAuth: boolean;
  provider?: "google" | "github"; 
  setError: UseFormSetError<T>;
  router: AppRouterInstance; // router instance of Next.js, used for navigation and redirection
  emailFromProps?: string;
}) {
  // Destructure the parameters for easier access (params.data -> data)
  const { data, role, useOAuth, provider, router, emailFromProps } = params;

  const email = useOAuth ? emailFromProps : data.email;

  if (!email) {
    console.error("Email not found.");
    alert("Email is required to complete registration.");
    return;
  }

  const payload = { ...data, email, role };

  try {
    const endpoint = useOAuth ? "/api/complete-registration" : "/api/register";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const { message } = await res.json();
      throw new Error(message || `(${res.status}) Registration failed`);
    }

    // Sign in after successful complete-registration
    if (useOAuth && provider) {
      await signIn(provider, {
        redirect: true,
        callbackUrl: "/",
        prompt: "none",
      });
    } else {
      // For non-OAuth registration, sign in with credentials
      await signIn("credentials", {
        email: data.email as string,
        password: data.password as string,
        redirect: false,
      });
      router.replace("/");
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
