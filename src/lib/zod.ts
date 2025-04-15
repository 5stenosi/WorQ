import { object, string } from "zod";

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const clientRegisterSchema = signInSchema.extend({
  name: string().min(1, "Name is required"),
  surname: string().min(1, "Surname is required"),
  cellphone: string()
    .min(10, "Cellphone must be at least 10 digits")
    .max(15, "Cellphone must be at most 15 digits"),
});

export const agencyRegisterSchema = signInSchema.extend({
  name: string().min(1, "Agency name is required"),
  vatNumber: string()
    .min(11, "VAT number must be 11 characters")
    .max(11, "VAT number must be 11 characters"),
  telephone: string()
    .min(10, "Telephone must be at least 10 digits")
    .max(15, "Telephone must be at most 15 digits"),
});
