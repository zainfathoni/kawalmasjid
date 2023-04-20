import { parse } from "@conform-to/react";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { serverError } from "remix-utils";

import {
  Button,
  ButtonLink,
  Debug,
  RemixForm,
  RemixLinkText,
  TooltipAuto,
} from "~/components";
import { requireUserSession } from "~/helpers";
import { EditPencil, Eye, Trash } from "~/icons";
import { model } from "~/models";
import {
  createSitemap,
  formatDateTime,
  formatRelativeTime,
  invariant,
} from "~/utils";

import type { ActionArgs, LoaderArgs } from "@remix-run/node";

export const handle = createSitemap();

export async function loader({ params }: LoaderArgs) {
  invariant(params.placeId, "placeId not found");
  const place = await model.adminPlace.query.getById({ id: params.placeId });
  return json({ place });
}

export async function action({ request }: ActionArgs) {
  await requireUserSession(request);

  const formData = await request.formData();
  const submission = parse(formData);

  if (submission.payload.intent === "delete-place") {
    try {
      await model.adminPlace.mutation.deleteById({
        id: submission.payload.placeId,
      });
      return redirect(`..`);
    } catch (error) {
      console.error(error);
      return serverError(submission);
    }
  }
}

export default function Route() {
  const { place } = useLoaderData<typeof loader>();

  if (!place) {
    return <span>Place not found.</span>;
  }

  return (
    <div className="stack">
      <header>
        <div className="queue-center">
          <span>View Place</span>
          <ButtonLink to={`/places/${place.slug}`} size="xs" variant="info">
            <Eye className="size-xs" />
            <span>View on Site</span>
          </ButtonLink>
          <ButtonLink to="edit" size="xs" variant="warning">
            <EditPencil className="size-xs" />
            <span>Edit</span>
          </ButtonLink>
          <RemixForm method="delete">
            <input type="hidden" name="placeId" value={place.id} />
            <Button
              size="xs"
              variant="danger"
              name="intent"
              value="delete-place"
            >
              <Trash className="size-xs" />
              <span>Delete</span>
            </Button>
          </RemixForm>
        </div>
      </header>

      <section className="card stack">
        <header>
          <div className="queue-center text-xs">
            <span>
              ID: <code>{place.id}</code>
            </span>
            <span>•</span>
            <span>
              Slug: <code>{place.slug}</code>
            </span>
          </div>

          <div className="queue-center text-xs">
            <span>
              <span>Created by: </span>
              <RemixLinkText
                prefetch="intent"
                to={`/admin/users/${place.user.id}`}
              >
                {place.user.name}
              </RemixLinkText>
            </span>
            <span>•</span>
            <TooltipAuto content={<b>{formatDateTime(place.createdAt)}</b>}>
              <span>Created at: </span>
              <b>{formatRelativeTime(place.createdAt)}</b>
            </TooltipAuto>
            <span>•</span>
            <TooltipAuto content={<b>{formatDateTime(place.updatedAt)}</b>}>
              <span>Updated at: </span>
              <b>{formatRelativeTime(place.updatedAt)}</b>
            </TooltipAuto>
          </div>
        </header>

        <article className="prose-config whitespace-pre-wrap sm:py-4">
          <h1>{place.name}</h1>
          {place.description}
        </article>
      </section>

      <Debug name="place">{place}</Debug>
    </div>
  );
}
