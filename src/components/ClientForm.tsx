import { Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
//import { signIn } from "next-auth/react";
import { clientRegisterSchema, clientRegisterSchemaOAuth } from "@/lib/zod";
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
import { handleFormSubmit } from "@/lib/handleFormSubmit";

type ClientFormValues = z.infer<typeof clientRegisterSchema>;
type ClientOAuthFormValues = z.infer<typeof clientRegisterSchemaOAuth>;

type ClientFormProps = {
  email?: string; // email precompilata (per il flusso OAuth)
  requiredFields?: {
    name?: boolean;
    surname?: boolean;
    email?: boolean;
    password?: boolean;
    cellphone?: boolean;
  };
  layout?: "row" | "col";
  buttons?: "register" | "confirm";
  //submitUrl?: string; // endpoint a cui inviare i dati
};

export default function ClientForm({
  email,
  requiredFields,
  layout = "row",
  buttons = "register",
}: //submitUrl,
ClientFormProps) {
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
  } = useForm<ClientFormValues>({
    resolver: zodResolver(
      useOAuth ? clientRegisterSchemaOAuth : clientRegisterSchema
    ) as unknown as Resolver<
      typeof useOAuth extends true ? ClientOAuthFormValues : ClientFormValues
    >,
  });

  const router = useRouter();

  const [provider, setProvider] = useState<"google" | "github" | undefined>(
    undefined
  );

  useEffect(() => {
    const savedProvider = localStorage.getItem("oauth_provider");
    if (savedProvider === "google" || savedProvider === "github") {
      setProvider(savedProvider);
    }
  }, []);

  const onSubmit = (data: ClientFormValues) =>
    handleFormSubmit({
      data,
      role: "CLIENT",
      useOAuth,
      provider: provider,
      setError,
      router,
      emailFromProps: userEmail,
    });

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
              placeholder="Enter your name"
            />
          </div>
        )}
        {requiredFields?.surname && (
          <div className="w-full flex flex-col">
            <label className="flex justify-between font-medium pl-1 pb-1 text-stone-900">
              Surname
            </label>
            <input
              {...register("surname")}
              type="text"
              id="surname"
              name="surname"
              required
              pattern="[A-Za-z\s]+"
              className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
              placeholder="Enter your surname"
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
              // defaultValue={email}
              type="email"
              id="email"
              name="email"
              required
              className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
              placeholder="Enter your email"
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
                // defaultValue={email}
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                className="w-full p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
                placeholder="Enter your password"
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
      {requiredFields?.cellphone && (
        <div className="w-full flex flex-col">
          <label className="flex justify-between font-medium pl-1 pb-1 text-stone-900">
            Cellphone
            {errors.cellphone && (
              <p className="text-red-500">{errors.cellphone.message}</p>
            )}
          </label>
          <input
            {...register("cellphone")}
            type="tel"
            id="cellphone"
            name="cellphone"
            required
            pattern="[0-9\s]+"
            className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
            placeholder="Enter your cellphone number"
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
