import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { notFound } from "remix-utils";

import { Balancer, Layout } from "~/components";
import { model } from "~/models";
import { createCacheHeaders, createSitemap, invariant } from "~/utils";

import type { LoaderArgs } from "@remix-run/node";

export const handle = createSitemap();

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.placeSlug, `placeSlug not found`);

  const place = await model.place.query.getBySlug({ slug: params.placeSlug });
  if (!place) {
    throw notFound("Place not found");
  }

  return json({ place }, { headers: createCacheHeaders(request, 60) });
}

/**
 * Similar with /$username/$placeSlug but simpler
 * And might not for public use
 */
export default function Route() {
  const { place } = useLoaderData<typeof loader>();

  return (
    <Layout isSpaced>
      <div className="contain-sm">
        <article className="prose-config mt-10 whitespace-pre-wrap">
          <header className="pb-10">
            <h1>
              <Balancer>{place.name}</Balancer>
            </h1>
          </header>
          {place.description}
        </article>
      </div>
    </Layout>
  );
}
