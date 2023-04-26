import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { AvatarAuto, Image, Layout, PageHeader, RemixLink } from "~/components";
import { prisma } from "~/libs";
import { model } from "~/models";
import {
  createCacheHeaders,
  createMetaData,
  createSitemap,
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
          size="sm"
          containSize="sm"
          withContainer={false}
          withBackground={false}
          withMarginBottom={false}
        >
          <h1>Hasil pencarian</h1>
          <h2>
            <span>{itemsCount} hasil</span>
            {q && <span> dengan kata kunci: {q}</span>}
            {!q && <span> tanpa kata kunci spesifik</span>}
          </h2>
        </PageHeader>
      }
    >
      <section className="space-y-4">
        {itemsCount <= 0 && <h3>Maaf, tidak ditemukan data apapun.</h3>}

        {places.length > 0 && (
          <div className="space-y-2">
            <span>Masjid</span>
            <ul className="space-y-1">
              {places.map((place) => {
                const qrCodeUrl = place.qrCode?.url;
                const firstImageUrl = place.images[0]?.url;
                let src = "assets/images/qr-code-placeholder.jpeg";
                if (qrCodeUrl?.length) {
                  src = qrCodeUrl;
                } else if (firstImageUrl?.length) {
                  src = firstImageUrl;
                }
                return (
                  <li key={place.id}>
                    <RemixLink
                      prefetch="intent"
                      to={`/places/${place.slug}`}
                      className="card-sm hover:card-hover flex gap-4 p-4"
                    >
                      <Image
                        src={src}
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
                        <h4>{place.name}</h4>
                        <p>{truncateText(place.description)}</p>
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
