import { object, string } from "zod";

// Registrazione
export const signInSchema = object({
  email: string().email("Invalid email"),
  password: string()
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

// Registrazione cliente
export const clientRegisterSchema = signInSchema.extend({
  name: string().min(2, "Name is too short").max(50, "Name is too long"),
  surname: string()
    .min(2, "Surname is too short")
    .max(50, "Surname is too long"),
  cellphone: string()
    .min(10, "Cellphone must be at least 10 digits")
    .max(15, "Cellphone must be at most 15 digits"),
});

// Registrazione agenzia
export const agencyRegisterSchema = signInSchema.extend({
  name: string().min(2, "Name is too short").max(50, "Name is too long"),
  vatNumber: string().regex(
    /^[A-Z]{2}\d{11}$/,
    "VAT must be in the format AA12345678910"
  ),
  telephone: string()
    .min(10, "Telephone must be at least 10 digits")
    .max(15, "Telephone must be at most 15 digits"),
});

export const clientRegisterSchemaOAuth = object({
  email: string().email("Invalid email").optional(),
  password: string()
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters")
    .optional(),
  name: string().min(2, "Name is too short").max(50, "Name is too long"),
  surname: string()
    .min(2, "Surname is too short")
    .max(50, "Surname is too long"),
  cellphone: string()
    .min(10, "Cellphone must be at least 10 digits")
    .max(15, "Cellphone must be at most 15 digits"),
});

export const agencyRegisterSchemaOAuth = object({
  email: string().email("Invalid email").optional(),
  password: string()
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters")
    .optional(),
  name: string().min(2, "Name is too short").max(50, "Name is too long"),
  vatNumber: string().regex(
    /^[A-Z]{2}\d{11}$/,
    "VAT must be in the format AA12345678910"
  ),
  telephone: string()
    .min(10, "Telephone must be at least 10 digits")
    .max(15, "Telephone must be at most 15 digits"),
});
