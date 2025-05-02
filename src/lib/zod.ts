import { object, string } from "zod";

// Registrazione
export const signInSchema = object({
  email: string()
    .email("Invalid email"),
  password: string()
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

// Registrazione cliente
export const clientRegisterSchema = signInSchema.extend({
  cellphone: string()
    .min(10, "Cellphone must be at least 10 digits")
    .max(15, "Cellphone must be at most 15 digits"),
});

// Registrazione agenzia
export const agencyRegisterSchema = signInSchema.extend({
  telephone: string()
    .min(10, "Telephone must be at least 10 digits")
    .max(15, "Telephone must be at most 15 digits"),
});