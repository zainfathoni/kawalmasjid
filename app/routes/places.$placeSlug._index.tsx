import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { notFound, serverError } from "remix-utils";

import {
  Balancer,
  Button,
  ButtonLink,
  Layout,
  RemixForm,
  Image,
} from "~/components";
import { model } from "~/models";
import {
  createCacheHeaders,
  createMetaData,
  createSitemap,
  invariant,
} from "~/utils";

import type { LoaderArgs, ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { requireUserSession } from "~/helpers";
import { parse } from "@conform-to/dom";
import { useRootLoaderData } from "~/hooks";
import { EditPencil, Trash } from "~/icons";

export const handle = createSitemap();

export const meta: V2_MetaFunction<typeof loader> = ({ params, data }) => {
  const note = data?.place;

  if (!note) {
    return createMetaData({
      title: "Data masjid tidak ditemukan",
      description: `Tidak dapat menemukan masjid ${params.placeSlug}`,
    });
  }

  return createMetaData({
    title: `${note.name}`,
    description: `${note.description}`,
  });
};

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.placeSlug, `placeSlug not found`);

  const place = await model.place.query.getBySlug({ slug: params.placeSlug });
  if (!place) {
    throw notFound("Place not found");
  }

  return json({ place }, { headers: createCacheHeaders(request, 60) });
}

export async function action({ request }: ActionArgs) {
  const { userSession, user } = await requireUserSession(request);

  const formData = await request.formData();
  const submission = parse(formData);

  if (submission.payload.intent === "delete-place") {
    try {
      await model.userNote.mutation.deleteById({
        id: submission.payload.placeId,
        userId: userSession.id,
      });
      return redirect(`/${user.username}`);
    } catch (error) {
      console.error(error);
      return serverError(submission);
    }
  }
}

/**
 * Similar with /$username/$placeSlug but simpler
 * And might not for public use
 */
export default function Route() {
  const { user: userSession } = useRootLoaderData();
  const { place } = useLoaderData<typeof loader>();

  const isOwner = userSession?.id === place.userId;

  return (
    <Layout
      isSpaced
      variant="sm"
      layoutHeader={
        <header className="mb-4 space-y-4 bg-brand-100 py-3 dark:bg-brand-800/20 sm:py-5">
          {isOwner && (
            <aside className="contain-sm queue-center">
              <ButtonLink
                to={`/user/places/${place.id}/edit`}
                size="xs"
                variant="warning"
              >
                <EditPencil className="size-xs" />
                <span>Ubah</span>
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
                  <span>Hapus</span>
                </Button>
              </RemixForm>
            </aside>
          )}

          <div className="contain-sm">
            <h1>
              <Balancer>{place.name}</Balancer>
            </h1>
            {place.images.map((img) => (
              <Image src={img.url} key={img.id} alt={place.name} />
            ))}
          </div>
        </header>
      }
    >
      <article className="prose-config mt-10 whitespace-pre-wrap">
        {place.description}
      </article>
    </Layout>
  );
}
