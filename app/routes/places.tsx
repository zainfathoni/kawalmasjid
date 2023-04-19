import { Outlet } from "@remix-run/react";

import { model } from "~/models";
import { formatDateLastMod } from "~/utils";

import type { SEOHandle } from "~/utils";

export const handle: SEOHandle = {
  getSitemapEntries: async () => {
    const places = await model.place.query.getAll();
    return places.map((place) => {
      return {
        route: `/${place.user.username}/${place.slug}`,
        priority: 0.7,
        lastmod: formatDateLastMod(place.updatedAt),
      };
    });
  },
};

export default function Route() {
  return <Outlet />;
}
