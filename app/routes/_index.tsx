import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { AvatarAuto, Layout, RemixLink, Image } from "~/components";
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
      <section className="mx-auto flex max-w-max flex-wrap items-center justify-center gap-4 py-5 lg:justify-between">
        <div className="max-w-lg space-y-4">
          <div className="stack-center">
            <Image
              src="/assets/opengraph/kawalmasjid-avatar.png"
              alt="Kawal Masjid"
              width={250}
              height={250}
              className="h-60 w-60 rounded-lg"
            />
            <h1 className="text-5xl">Kawal Masjid</h1>
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
                  className="card hover:card-hover flex h-full gap-4 p-4"
                >
                  <Image
                    src={
                      place.qrCode?.url ??
                      place.images[0]?.url ??
                      "assets/images/qr-code-placeholder.jpeg"
                    }
                    alt={
                      place.qrCode?.url
                        ? `QR code ${place.name}`
                        : `Belum ada QR code ${place.name}`
                    }
                    className="aspect-square h-36 w-36 rounded-md object-cover"
                    width={36}
                    height={36}
                  />
                  <div className="flex flex-col space-y-0">
                    <h3>{place.name}</h3>
                    <p>{place.description}</p>
                    {/* <p className="dim">{truncateText(place.content, 70)}</p> */}
                    <div className="queue-center dim">
                      <AvatarAuto user={place.user} className="size-md" />
                      <b>{place.user.name}</b>
                      <span>•</span>
                      <span>{formatRelativeTime(place.updatedAt)}</span>
                    </div>
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
