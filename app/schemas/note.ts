import { z } from "zod";

export const schemaNoteNew = z.object({
  title: z.string().min(1, "Judul diperlukan").max(50, "Judul max 50 karakter"),
  description: z
    .string()
    .min(1, "Deskripsi diperlukan")
    .max(100, "Deskripsi max 100 karakter"),
  content: z
    .string()
    .min(1, "Konten diperlukan")
    .max(10_000, "Konten max 10,000 karakter"),
});

export const schemaNoteUpdate = z
  .object({
    id: z.string().min(1, "id diperlukan"),
    slug: z.string().min(1, "slug diperlukan"),
  })
  .merge(schemaNoteNew);
