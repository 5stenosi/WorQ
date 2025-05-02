import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { agencyRegisterSchema } from "@/lib/zod";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faEye, faSlash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

type AgencyFormValues = z.infer<typeof agencyRegisterSchema>;

export default function AgencyForm() {
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<AgencyFormValues>({
        resolver: zodResolver(agencyRegisterSchema),
    });

    const router = useRouter();

    const onSubmit = async (data: AgencyFormValues) => {
        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, role: "AGENCY" }),
        });

        if (res.status === 409) {
            setError("email", { type: "manual", message: "Email già registrata." });
            return;
        }

        if (res.ok) {
            const loginRes = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });
            if (loginRes?.ok) {
                router.push("/");
            } else {
                console.error("Login failed", loginRes);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex gap-5">
                {/* Name */}
                <div className="w-full flex flex-col">
                    <label className="flex justify-between font-medium pl-1 pb-1 text-stone-900">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        pattern="[A-Za-z\s]+"
                        className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
                        placeholder="Enter agency name"
                    />
                </div>
                {/* VAT */}
                <div className="w-full flex flex-col">
                    <label className="flex justify-between font-medium pl-1 pb-1 text-stone-900">
                        VAT
                    </label>
                    <input
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
            </div>
            <div className="flex gap-5">
                {/* Email */}
                <div className="w-full flex flex-col">
                    <label className="flex justify-between font-medium pl-1 pb-1 text-stone-900">
                        Email
                        {errors.email && (<p className="text-red-500">{errors.email.message}</p>)}
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
                {/* Password */}
                <div className="w-full flex flex-col">
                    <label className="flex justify-between font-medium pl-1 pb-1 text-stone-900">
                        Password
                        {errors.password && (<p className="text-red-500">{errors.password.message}</p>)}
                    </label>
                    <div className="w-full relative">
                        <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            required
                            className="w-full p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
                            placeholder="Enter agency password" />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 aspect-square h-full flex items-center text-stone-500 hover:text-stone-700 focus:outline-none">
                            <FontAwesomeIcon icon={faEye} className="fa-stack-1x text-stone-500" />
                            {showPassword
                                ? <FontAwesomeIcon icon={faSlash} className="fa-stack-1x text-red-500" />
                                : ""}
                        </button>
                    </div>
                </div>
            </div>
            {/* Telephone */}
            <div className="w-full flex flex-col">
                <label className="flex justify-between font-medium pl-1 pb-1 text-stone-900">
                    Telephone
                    {errors.telephone && (<p className="text-red-500">{errors.telephone.message}</p>)}
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
            {/* Buttons */}
            <div className="flex gap-5 mt-5">
                {/* Login Button */}
                <Link href={"/login"} className="w-full font-medium h-12 flex justify-center items-center rounded-xl border-2 border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-stone-100
                                                transition-all duration-150 ease-out active:scale-90 hover:scale-105 group">
                    <FontAwesomeIcon icon={faArrowLeft} className="text-lg group-hover:-translate-x-1/2 opacity-0 group-hover:opacity-100 transition duration-150 group-hover:duration-500" />
                    Login
                    <FontAwesomeIcon icon={faArrowLeft} className="text-lg opacity-0" />
                </Link>
                {/* Signup Button */}
                <button type="submit" className="w-full font-medium h-12 flex justify-center items-center rounded-xl border-2 border-west-side-500 text-west-side-500 hover:bg-west-side-500 hover:text-stone-100
                                             transition-all duration-150 ease-out active:scale-90 hover:scale-105 group">
                    <FontAwesomeIcon icon={faArrowRight} className="text-lg opacity-0" />
                    Signup
                    <FontAwesomeIcon icon={faArrowRight} className="text-lg group-hover:translate-x-1/2 opacity-0 group-hover:opacity-100 transition duration-150 group-hover:duration-500" />
                </button>
            </div>
        </form>
    );
}