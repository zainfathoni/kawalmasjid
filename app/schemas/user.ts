import { z } from "zod";

const id = z.string().min(1, "id diperlukan");

const name = z
  .string()
  .min(1, "Nama lengkap diperlukan")
  .max(50, "Nama lengkap terbatas max 50 karakter");

const username = z
  .string()
  .regex(/^[a-zA-Z0-9._]+$/, "Hanya boleh alfabet, angka, titik, underscore")
  .min(4, "Username perlu minimal 4 karakter")
  .max(20, "Username terbatas max 20 karakter");

const email = z.string().min(1, "Email diperlukan").email("Email tidak valid");

const password = z
  .string()
  .min(8, "Password perlu minimal 8 karakter")
  .max(100, "Password terbatas max 100 karakter");

const remember = z.boolean().optional();

const redirectTo = z.string().optional();

const roleSymbol = z.string().min(1, "Peran diperlukan");

const headline = z.string().max(50, "Headline terbatas 50 karakter").optional();

const bio = z.string().max(280, "Biodata terbatas 280 karakter").optional();

export const schemaUserRegister = z.object({
  name,
  username,
  email,
  password,
  remember,
});

export const schemaUserLogin = z.object({
  email,
  password,
  remember,
  redirectTo,
});

export const schemaUserUpdateData = z.object({
  id,
  name,
  username,
  email,
});

export const schemaUserUpdateProfile = z.object({
  id,
  headline,
  bio,
});

export const schemaUserUpdatePassword = z
  .object({
    id,
    password,
    confirmPassword: password,
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: "custom",
        message: "Konfirmasi password tidak cocok",
      });
    }
  });

export const schemaAdminUserUpdate = z.object({
  id,
  name,
  username,
  email,
  roleSymbol,
});
