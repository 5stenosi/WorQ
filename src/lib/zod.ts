import { object, string } from "zod";

// These schemas are used to validate user input during registration and login processes.
const email = string().email("Invalid email");
const password = string()
  .min(8, "Password must be more than 8 characters")
  .max(32, "Password must be less than 32 characters");
const name = string().min(2, "Name is too short").max(50, "Name is too long");
const surname = string()
  .min(2, "Surname is too short")
  .max(50, "Surname is too long");
const cellphone = string()
  .min(10, "Cellphone must be at least 10 digits")
  .max(15, "Cellphone must be at most 15 digits");
const telephone = string()
  .min(10, "Telephone must be at least 10 digits")
  .max(15, "Telephone must be at most 15 digits");
const vatNumber = string().regex(
  /^[A-Z]{2}\d{11}$/,
  "VAT must be in the format AA12345678910"
);

// Sign in schema for both clients and agencies
export const signInSchema = object({
  email,
  password,
});

export const clientFields = {
  name,
  surname,
  cellphone,
};

export const agencyFields = {
  name,
  vatNumber,
  telephone,
};

export const clientRegisterSchema = signInSchema.extend(clientFields);

export const agencyRegisterSchema = signInSchema.extend(agencyFields);

// Sign in schema for OAuth providers (email and password are optional)
const optionalSignInSchema = object({
  email: email.optional(),
  password: password.optional(),
});

export const clientRegisterSchemaOAuth =
  optionalSignInSchema.extend(clientFields);

export const agencyRegisterSchemaOAuth =
  optionalSignInSchema.extend(agencyFields);
