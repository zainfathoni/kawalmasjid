import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { AvatarAuto, Layout, PageHeader, RemixLink } from "~/components";
import { prisma } from "~/libs";
import { model } from "~/models";
import {
  createCacheHeaders,
  createMetaData,
  createSitemap,
  formatPluralItems,
  formatRelativeTime,
  getAllSearchQuery,
  truncateText,
} from "~/utils";

import type { LoaderArgs } from "@remix-run/node";

export const meta = createMetaData({
  name: "Search results",
  description: "Could found some places or users.",
});

export const handle = createSitemap("/page", 0.9);

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
    <Layout
      isSpaced
      containSize="sm"
      layoutHeader={
        <PageHeader
          size="xs"
          containSize="sm"
          withContainer={false}
          withBackground={false}
          withMarginBottom={false}
        >
          <h1>Search results</h1>
          <h2>
            <span>{formatPluralItems("result", itemsCount)}</span>
            {q && <span> with keyword: {q}</span>}
            {!q && <span> with no specific keyword</span>}
          </h2>
        </PageHeader>
      }
    >
      <section className="space-y-4">
        {itemsCount <= 0 && <h3>Sorry, nothing found.</h3>}

        {places.length > 0 && (
          <div className="space-y-2">
            <span>Places</span>
            <ul className="space-y-1">
              {places.map((place) => {
                return (
                  <li key={place.id}>
                    <RemixLink
                      prefetch="intent"
                      to={`/${place.user.username}/${place.slug}`}
                      className="card-sm hover:card-hover"
                    >
                      <h4>{place.name}</h4>
                      <p>{truncateText(place.description)}</p>
                      <div className="queue-center dim">
                        <AvatarAuto user={place.user} className="size-md" />
                        <b>{place.user.name}</b>
                        <span>•</span>
                        <span>{formatRelativeTime(place.updatedAt)}</span>
                      </div>
                    </RemixLink>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {users.length > 0 && (
          <div className="space-y-2">
            <span>Users</span>
            <ul className="space-y-1">
              {users.map((user) => {
                return (
                  <li key={user.id}>
                    <RemixLink
                      prefetch="intent"
                      to={`/${user.username}`}
                      className="card-sm hover:card-hover queue-center"
                    >
                      <AvatarAuto user={user} className="size-xl" />
                      <div className="space-y-0">
                        <h5>{user.name}</h5>
                        <p>@{user.username}</p>
                      </div>
                    </RemixLink>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>
    </Layout>
  );
}
