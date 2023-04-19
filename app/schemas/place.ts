import { z } from "zod";

export const schemaPlaceNew = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name max of 50 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(5000, "Description max of 5000 characters"),
});

export const schemaPlaceUpdate = z
  .object({
    id: z.string().min(1, "Existing id is required"),
    slug: z.string().min(1, "Existing slug is required"),
  })
  .merge(schemaPlaceNew);
