import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { AvatarAuto, Layout, RemixLink } from "~/components";
import { model } from "~/models";
import { createCacheHeaders, createSitemap, formatRelativeTime } from "~/utils";

export const handle = createSitemap("/", 1);

export async function loader({ request }: LoaderArgs) {
  // Only show latest 5 places
  const places = await model.place.query.getAll({ limit: 5 });
  return json({ places }, { headers: createCacheHeaders(request) });
}

export default function Route() {
  const { places } = useLoaderData<typeof loader>();
  return (
    <Layout>
      <section className="mx-auto flex max-w-max flex-wrap items-center justify-center gap-4 py-10 lg:justify-between lg:py-20">
        <div className="max-w-lg space-y-4">
          <div className="prose-config">
            <h1 className="text-xl">
              <span>Kawal Masjid</span>
            </h1>
            <p>Website ini masih dalam pengembangan.</p>
          </div>
        </div>
      </section>
      <section>
        <ul className="space-y-2">
          {places.map((place) => {
            return (
              <li key={place.slug}>
                <RemixLink
                  prefetch="intent"
                  to={`/places/${place.slug}`}
                  className="card hover:card-hover flex h-full flex-col space-y-0"
                >
                  <h3>{place.name}</h3>
                  <p>{place.description}</p>
                  {/* <p className="dim">{truncateText(place.content, 70)}</p> */}
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
      </section>
    </Layout>
  );
}
