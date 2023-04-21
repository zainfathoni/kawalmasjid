import { z } from "zod";

export const schemaPlaceNew = z.object({
  name: z.string().min(1, "Nama diperlukan").max(50, "Nama max 50 karakter"),
  description: z
    .string()
    .min(1, "Deskripsi diperlukan")
    .max(5000, "Deskripsi max 5000 karakter"),
  // TODO: handle multiple images
  imageUrl: z.string().optional(),
  qrCodeUrl: z.string().optional(),
});

export const schemaPlaceUpdate = z
  .object({
    id: z.string().min(1, "id diperlukan"),
    slug: z.string().min(1, "slug diperlukan"),
  })
  .merge(schemaPlaceNew);
