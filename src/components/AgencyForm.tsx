import { Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { agencyRegisterSchema, agencyRegisterSchemaOAuth } from "@/lib/zod";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faCheck,
  faEye,
  faSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

type AgencyFormValues = z.infer<typeof agencyRegisterSchema>;

type AgencyFormProps = {
  email?: string; // email precompilata se l'utente è già loggato
  requiredFields?: {
    name?: boolean;
    vatNumber?: boolean;
    email?: boolean;
    password?: boolean;
    telephone?: boolean;
  };
  layout?: "row" | "col";
  buttons?: "register" | "confirm";
  //submitUrl?: string; // endpoint a cui inviare i dati
};

export default function AgencyForm({
  email,
  requiredFields,
  layout = "row",
  buttons = "register",
}: //submitUrl,
AgencyFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams(); // Ottieni i parametri di ricerca dall'URL
  const useOAuth = !requiredFields?.email && !requiredFields?.password;
  const [userEmail, setUserEmail] = useState<string | undefined>(email);

  // verifica effettiva utilità
  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    if (!email && emailFromUrl) {
      setUserEmail(decodeURIComponent(emailFromUrl));
    }
  }, [searchParams, email]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AgencyFormValues>({
    resolver: zodResolver(
      useOAuth ? agencyRegisterSchemaOAuth : agencyRegisterSchema
    ) as unknown as Resolver<AgencyFormValues>,
  });

  const router = useRouter();

  const onSubmit = async (data: AgencyFormValues) => {
    const email = userEmail ?? data.email;
    // Verifica che l'email sia disponibile
    if (!email) {
      console.error("Email not found.");
      alert("Email is required to complete registration.");
      return;
    }

    try {
      // Flusso OAuth (completamento profilo)
      if (useOAuth) {
        const res = await fetch("/api/complete-registration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            email: email,
            role: "AGENCY",
          }),
        });

        if (res.ok) {
          // Forza un nuovo login OAuth per aggiornare il JWT
          await signIn("google", {
            redirect: true,
            callbackUrl: "/",
          });
          return;
        } else {
          const error = await res.json();
          throw new Error(error.message || "Registration failed");
        }
      }

      // Flusso Credenziali (registrazione tradizionale)
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role: "AGENCY" }),
      });

      if (res.status === 409) {
        setError("email", {
          type: "manual",
          message: "Email already registered.",
        });
        return;
      }

      if (res.ok) {
        // Login automatico dopo registrazione
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false, // !
        });
        router.replace("/");
        // return;
      } else {
        const error = await res.json();
        throw new Error(error.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col gap-5`}>
      <div className="flex gap-5">
        {requiredFields?.name && (
          <div className="w-full flex flex-col">
            <label className="flex justify-between font-medium pl-1 pb-1 text-stone-900">
              Name
            </label>
            <input
              {...register("name")}
              type="text"
              id="name"
              name="name"
              required
              pattern="[A-Za-z\s]+"
              className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
              placeholder="Enter agency name"
            />
          </div>
        )}
        {requiredFields?.vatNumber && (
          <div className="w-full flex flex-col">
            <label className="flex justify-between font-medium pl-1 pb-1 text-stone-900">
              VAT
            </label>
            <input
              {...register("vatNumber")}
              type="text"
              id="vatNumber"
              name="vatNumber"
              required
              pattern="^[A-Z]{2}\d{11}$"
              className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
              placeholder="Enter VAT (AA12345678910)"
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.toUpperCase();
              }}
            />
          </div>
        )}
      </div>
      <div className={`flex gap-5 ${layout === "col" ? "hidden" : ""}`}>
        {requiredFields?.email && (
          <div className="w-full flex flex-col">
            <label className="flex justify-between font-medium pl-1 pb-1 text-stone-900">
              Email
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              name="email"
              required
              className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
              placeholder="Enter agency email"
            />
          </div>
        )}
        {requiredFields?.password && (
          <div className="w-full flex flex-col">
            <label className="flex justify-between font-medium pl-1 pb-1 text-stone-900">
              Password
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </label>
            <div className="w-full relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                className="w-full p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
                placeholder="Enter agency password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 aspect-square h-full flex items-center text-stone-600 hover:text-stone-700 focus:outline-none"
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
        )}
      </div>
      {requiredFields?.telephone && (
        <div className="w-full flex flex-col">
          <label className="flex justify-between font-medium pl-1 pb-1 text-stone-900">
            Telephone
            {errors.telephone && (
              <p className="text-red-500">{errors.telephone.message}</p>
            )}
          </label>
          <input
            {...register("telephone")}
            type="tel"
            id="telephone"
            name="telephone"
            required
            pattern="[0-9\s]+"
            className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
            placeholder="Enter agency telephone number"
          />
        </div>
      )}
      <div className="flex gap-5 mt-5">
        {buttons === "register" && (
          <>
            <Link
              href={"/login"}
              className="w-full font-medium h-12 flex justify-center items-center rounded-xl border-2 border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-stone-100
                                                    transition-all duration-150 ease-out active:scale-90 hover:scale-105 group"
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="text-lg group-hover:-translate-x-1/2 opacity-0 group-hover:opacity-100 transition duration-150 group-hover:duration-500"
              />
              Login
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="text-lg opacity-0"
              />
            </Link>
            <button
              type="submit"
              className="w-full font-medium h-12 flex justify-center items-center rounded-xl border-2 border-west-side-500 text-west-side-500 hover:bg-west-side-500 hover:text-stone-100
                                                 transition-all duration-150 ease-out active:scale-90 hover:scale-105 group"
            >
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-lg opacity-0"
              />
              Signup
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-lg group-hover:translate-x-1/2 opacity-0 group-hover:opacity-100 transition duration-150 group-hover:duration-500"
              />
            </button>
          </>
        )}
        {buttons === "confirm" && (
          <button
            type="submit"
            className="w-full font-medium h-12 flex justify-center items-center rounded-lg border-2 border-stone-900 text-stone-900
                                                                    hover:border-west-side-500 hover:bg-west-side-500 hover:text-stone-100
                                                                    transition-all duration-150 ease-out active:scale-90 hover:scale-105 overflow-hidden group"
          >
            <FontAwesomeIcon
              icon={faCheck}
              className="text-lg mr-2 opacity-0"
            />
            Confirm
            <FontAwesomeIcon
              icon={faCheck}
              className="text-stone-100 text-lg ml-2 translate-y-[200%] group-hover:translate-y-0 transition duration-150 group-hover:duration-500"
            />
          </button>
        )}
      </div>
    </form>
  );
}
