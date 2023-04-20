import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { AvatarAuto, Badge, ButtonLink, Debug, RemixLink } from "~/components";
import { Check, Eye, SendDiagonal, X } from "~/icons";
import { model } from "~/models";
import { createSitemap, formatPluralItems } from "~/utils";

import type { LoaderArgs } from "@remix-run/node";

export const handle = createSitemap();

export async function loader({ request }: LoaderArgs) {
  const places = await model.adminPlace.query.getAll();
  const placesCount = places.length;
  return json({ places, placesCount });
}

export default function Route() {
  const { places, placesCount } = useLoaderData<typeof loader>();

  if (places.length <= 0) {
    return <span>No places. Please add new.</span>;
  }

  return (
    <div className="stack">
      <header>
        <div className="queue-center">
          <span>{formatPluralItems("place", placesCount)}</span>
          <ButtonLink to="/places" size="xs" variant="info">
            <Eye className="size-xs" />
            <span>View All</span>
          </ButtonLink>
        </div>
      </header>

      <ul className="space-y-2">
        {places.map((place) => {
          return (
            <li key={place.id}>
              <RemixLink
                to={place.id}
                className="card hover:card-hover block space-y-2"
              >
                <h3>{place.name}</h3>
                <code className="text-xs">{place.slug}</code>

                <div className="queue-center text-xs">
                  {place.isVerified ? (
                    <Badge variant="brand" size="sm">
                      <Check className="size-xs" />
                      <span>Verified</span>
                    </Badge>
                  ) : (
                    <Badge variant="danger" size="sm">
                      <X className="size-xs" />
                      <span>Unverified</span>
                    </Badge>
                  )}
                  {place.isPublished ? (
                    <Badge variant="brand" size="sm">
                      <SendDiagonal className="size-xs" />
                      <span>Published</span>
                    </Badge>
                  ) : (
                    <Badge variant="default" size="sm">
                      <SendDiagonal className="size-xs" />
                      <span>Draft</span>
                    </Badge>
                  )}
                </div>

                <div className="queue-center">
                  <AvatarAuto user={place.user} className="size-md" />
                  <span className="text-sm">
                    {place.user.name} (@{place.user.username})
                  </span>
                </div>
              </RemixLink>
            </li>
          );
        })}
      </ul>

      <Debug name="places">{places}</Debug>
    </div>
  );
}
