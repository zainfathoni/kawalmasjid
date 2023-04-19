import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Badge, PageAdminHeader, RemixLink } from "~/components";
import { prisma } from "~/libs";
import { model } from "~/models";
import {
  createCacheHeaders,
  createMetaData,
  createSitemap,
  formatPluralItems,
  getAllSearchQuery,
  truncateText,
} from "~/utils";

import type { LoaderArgs } from "@remix-run/node";

export const meta = createMetaData({
  title: "Admin search results",
  description: "Could found anything.",
});

export const handle = createSitemap();

export async function loader({ request }: LoaderArgs) {
  const { q } = getAllSearchQuery({ request });

  const [places, users] = await prisma.$transaction([
    model.place.query.search({ q }),
    model.user.query.search({ q }),
  ]);

  const itemsCount = places.length + users.length;

  return json(
    { q, places, users, itemsCount },
    { headers: createCacheHeaders(request) }
  );
}

export default function Route() {
  const { q, places, users, itemsCount } = useLoaderData<typeof loader>();

  return (
    <div>
      <PageAdminHeader size="xs" direction="col">
        <h1>Admin search results</h1>
        <h3>
          <span>{formatPluralItems("result", itemsCount)}</span>
          {q && <span> with keyword: {q}</span>}
          {!q && <span> with no specific keyword</span>}
        </h3>
      </PageAdminHeader>

      <section className="px-layout space-y-4">
        {itemsCount <= 0 && <h3>Sorry, nothing found.</h3>}

        {users.length > 0 && (
          <div className="space-y-2">
            <h4>Pengguna</h4>
            <ul className="space-y-1">
              {users.map((user) => {
                return (
                  <li key={user.id}>
                    <RemixLink
                      to={`/admin/users/${user.id}`}
                      prefetch="intent"
                      className="card-sm hover:card-hover"
                    >
                      {user.name} @{user.username}{" "}
                      <Badge>{user.role.name}</Badge>
                    </RemixLink>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {places.length > 0 && (
          <div className="space-y-2">
            <h4>Places</h4>
            <ul className="space-y-1">
              {places.map((place) => {
                return (
                  <li key={place.id}>
                    <RemixLink
                      prefetch="intent"
                      to={`/admin/places/${place.id}`}
                      className="card-sm hover:card-hover"
                    >
                      <b>{place.name}</b>
                      <span> · </span>
                      <span>{truncateText(place.description, 50)}</span>
                    </RemixLink>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
