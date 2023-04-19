import { parse } from "@conform-to/react";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import {
  Button,
  ButtonLink,
  PageAdminHeader,
  RemixForm,
  RemixLink,
} from "~/components";
import { configDev } from "~/configs";
import { requireUserSession } from "~/helpers";
import { Plus, Trash } from "~/icons";
import { model } from "~/models";
import { createSitemap, formatPluralItems } from "~/utils";

import type { ActionArgs } from "@remix-run/node";

export const handle = createSitemap();

export async function loader() {
  const placesCount = await model.adminPlace.query.count();
  return json({ placesCount });
}

export async function action({ request }: ActionArgs) {
  await requireUserSession(request);

  const formData = await request.formData();
  const submission = parse(formData, {});

  if (submission.payload.intent === "admin-delete-all-places") {
    await model.adminPlace.mutation.deleteAll();
    return json(submission);
  }

  return redirect(`.`);
}

export default function Route() {
  const { placesCount } = useLoaderData<typeof loader>();

  return (
    <div>
      <PageAdminHeader size="xs">
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
              value="admin-delete-all-places"
              disabled={placesCount <= 0}
            >
              <Trash className="size-sm" />
              <span>Delete All {formatPluralItems("Place", placesCount)}</span>
            </Button>
          </RemixForm>
        )}
      </PageAdminHeader>

      <div className="px-layout">
        <Outlet />
      </div>
    </div>
  );
}
