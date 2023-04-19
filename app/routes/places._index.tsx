import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import {
  AvatarAuto,
  ButtonLink,
  Layout,
  PageHeader,
  RemixLink,
} from "~/components";
import { model } from "~/models";
import {
  createCacheHeaders,
  createMetaData,
  createSitemap,
  formatPluralItems,
  formatRelativeTime,
} from "~/utils";

import type { LoaderArgs } from "@remix-run/node";
import { Plus } from "~/icons";

export const handle = createSitemap("/places", 0.8);

export const meta = createMetaData({
  title: "Places",
  description: "Public places created by the community.",
});

export async function loader({ request }: LoaderArgs) {
  const places = await model.place.query.getAll();
  const placesCount = places.length;
  return json(
    { places, placesCount },
    { headers: createCacheHeaders(request) }
  );
}

export default function Route() {
  const { places, placesCount } = useLoaderData<typeof loader>();

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
          <h1>All {formatPluralItems("place", placesCount)}</h1>
          <p>
            Published places from the users. Frequently changed or reset for
            this example demo.
          </p>
          <ButtonLink to="/new" size="sm">
            <Plus className="size-sm" />
            <span>Add Place</span>
          </ButtonLink>
        </PageHeader>
      }
    >
      <section>
        <ul className="space-y-2">
          {places.map((place) => {
            return (
              <li key={place.slug}>
                <RemixLink
                  prefetch="intent"
                  to={`/${place.user.username}/${place.slug}`}
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
