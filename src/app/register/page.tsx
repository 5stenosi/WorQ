"use client";

import { signIn } from "next-auth/react";
import { agencyRegisterSchema, clientRegisterSchema } from "@/lib/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function RegisterPage() {
  const [role, setRole] = useState<"CLIENT" | "AGENCY" | "">("");

  return (
    <div className="p-4 max-w-xl mx-auto mt-10 border rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Sign Up</h2>

      {!role ? (
        <>
          <p className="mb-4">Are you a Client or an Agency?</p>
          <div className="flex gap-4">
            <button
              onClick={() => setRole("CLIENT")}
              className="bg-blue-600 text-white p-2 rounded"
            >
              Client
            </button>
            <button
              onClick={() => setRole("AGENCY")}
              className="bg-green-600 text-white p-2 rounded"
            >
              Agency
            </button>
          </div>
        </>
      ) : (
        <>{role === "CLIENT" ? <ClientForm /> : <AgencyForm />}</>
      )}
    </div>
  );
}

type ClientFormValues = z.infer<typeof clientRegisterSchema>;

function ClientForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientRegisterSchema),
  });
  //const [success, setSuccess] = useState(false);

  const onSubmit = async (data: ClientFormValues) => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, role: "CLIENT" }),
    });
    if (res.ok) {
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: "/",
      });
      //setSuccess(true);
    }
  };

  /*
  return success ? (
    <p className="text-green-600">
      Signed up successfully! You can now log in.
    </p>
  ) : (
  */
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input
        {...register("email")}
        placeholder="Email"
        className="border p-2 w-full"
      />
      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email.message}</p>
      )}

      <input
        {...register("password")}
        type="password"
        placeholder="Password"
        className="border p-2 w-full"
      />
      {errors.password && (
        <p className="text-red-500 text-sm">{errors.password.message}</p>
      )}

      <input
        {...register("name")}
        placeholder="Nome"
        className="border p-2 w-full"
      />
      {errors.name && (
        <p className="text-red-500 text-sm">{errors.name.message}</p>
      )}

      <input
        {...register("surname")}
        placeholder="Cognome"
        className="border p-2 w-full"
      />
      {errors.surname && (
        <p className="text-red-500 text-sm">{errors.surname.message}</p>
      )}

      <input
        {...register("cellphone")}
        placeholder="Cellulare"
        className="border p-2 w-full"
      />
      {errors.cellphone && (
        <p className="text-red-500 text-sm">{errors.cellphone.message}</p>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded w-full"
      >
        Sign Up
      </button>
    </form>
  );
}

type AgencyFormValues = z.infer<typeof agencyRegisterSchema>;

function AgencyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AgencyFormValues>({
    resolver: zodResolver(agencyRegisterSchema),
  });
  //const [success, setSuccess] = useState(false);

  const onSubmit = async (data: AgencyFormValues) => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, role: "AGENCY" }),
    });
    if (res.ok) {
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: "/",
      });
      //setSuccess(true);
    }
  };

  /*
  return success ? (
    <p className="text-green-600">
      Signed up successfully! You can now log in.
    </p>
  ) : (
  */
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input
        {...register("email", { required: true })}
        placeholder="Email"
        className="border p-2 w-full"
      />
      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email.message}</p>
      )}

      <input
        {...register("password", { required: true })}
        type="password"
        placeholder="Password"
        className="border p-2 w-full"
      />
      {errors.password && (
        <p className="text-red-500 text-sm">{errors.password.message}</p>
      )}

      <input
        {...register("name")}
        placeholder="Agency Name"
        className="border p-2 w-full"
      />
      {errors.name && (
        <p className="text-red-500 text-sm">{errors.name.message}</p>
      )}

      <input
        {...register("vatNumber")}
        placeholder="VAT Number"
        className="border p-2 w-full"
      />
      {errors.vatNumber && (
        <p className="text-red-500 text-sm">{errors.vatNumber.message}</p>
      )}

      <input
        {...register("telephone")}
        placeholder="Telephone"
        className="border p-2 w-full"
      />
      {errors.telephone && (
        <p className="text-red-500 text-sm">{errors.telephone.message}</p>
      )}

      <button
        type="submit"
        className="bg-green-600 text-white p-2 rounded w-full"
      >
        Sign Up
      </button>
    </form>
  );
}
