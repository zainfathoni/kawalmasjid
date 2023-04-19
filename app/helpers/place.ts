import { createNanoID, createSlug } from "~/utils";

import type { Place } from "@prisma/client";

export function createPlaceSlug({ name }: Pick<Place, "name">) {
  const slug: string = createSlug(name);
  const nanoID: string = createNanoID();

  return `${slug}-${nanoID}`;
}

/**
 * Update slug still retain the existing nano ID
 * Although this could be refactored to use slugId from the Prisma model/table field
 * But this way is more efficient to think only 1 data point instead of 2
 */
export function updatePlaceSlug({ slug, name }: Pick<Place, "slug" | "name">) {
  // Get the last string part after the last "-"
  const splittedSlug: string[] = slug.split("-");
  const existingNanoID: string = splittedSlug[splittedSlug.length - 1];

  // Assume the name has changed
  const newSlug: string = createSlug(name);

  // If the previous slug was broken, fix it
  if (existingNanoID == undefined) {
    const nanoID: string = createNanoID();
    return `${newSlug}-${nanoID}`;
  } else {
    return `${newSlug}-${existingNanoID}`;
  }
}
