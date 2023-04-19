import { parse } from "@conform-to/react";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import {
  Button,
  ButtonLink,
  PageHeader,
  RemixForm,
  RemixLink,
} from "~/components";
import { configDev } from "~/configs";
import { requireUserSession } from "~/helpers";
import { Plus, Trash } from "~/icons";
import { prisma } from "~/libs";
import { model } from "~/models";
import { createSitemap, formatPluralItems } from "~/utils";
import { truncateText } from "~/utils";

import type { LoaderArgs } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";

export const handle = createSitemap();

export async function loader({ request }: LoaderArgs) {
  const { userSession, user } = await requireUserSession(request);

  const [places, placesCount] = await prisma.$transaction([
    model.userPlace.query.getAll({ user: userSession }),
    model.userPlace.query.count({ user: userSession }),
  ]);

  return json({ user, places, placesCount });
}

export async function action({ request }: ActionArgs) {
  const { userSession } = await requireUserSession(request);

  const formData = await request.formData();
  const submission = parse(formData, {});

  if (submission.payload.intent === "user-delete-all-places") {
    await model.userPlace.mutation.deleteAll({ user: userSession });
    return json(submission);
  }

  return redirect(`/user/places`);
}

export default function Route() {
  const { places, placesCount } = useLoaderData<typeof loader>();

  return (
    <>
      <PageHeader size="xs" withBackground={false} withContainer={false}>
        <div className="queue-center">
          <RemixLink to=".">
            <h1>Places</h1>
          </RemixLink>
          <ButtonLink to="new" size="sm">
            <Plus className="size-sm" />
            <span>Add Place</span>
          </ButtonLink>
          {configDev.isDevelopment && (
            <RemixForm method="delete">
              <Button
                size="sm"
                variant="danger"
                name="intent"
                value="user-delete-all-places"
                disabled={placesCount <= 0}
              >
                <Trash className="size-sm" />
                <span>
                  Delete All My {formatPluralItems("Place", placesCount)}
                </span>
              </Button>
            </RemixForm>
          )}
        </div>
      </PageHeader>

      <section className="space-y-2">
        <p>{formatPluralItems("place", placesCount)}</p>
        <ul className="space-y-1">
          {places.map((place) => {
            return (
              <li key={place.id}>
                <RemixLink
                  prefetch="intent"
                  to={`/places/${place.slug}`}
                  className="card-sm hover:card-hover"
                >
                  <h4>{place.name}</h4>
                  <p>{truncateText(place.description)}</p>
                </RemixLink>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
