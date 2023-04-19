import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { badRequest, forbidden, serverError } from "remix-utils";

import {
  Alert,
  Button,
  ButtonLink,
  ButtonLoading,
  Input,
  Label,
  RemixForm,
  TextArea,
} from "~/components";
import { requireUserSession, updatePlaceSlug } from "~/helpers";
import { model } from "~/models";
import { schemaPlaceUpdate } from "~/schemas";
import { createSitemap, invariant } from "~/utils";

import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import type { z } from "zod";
import { Mosque } from "~/icons";

export const handle = createSitemap();

export async function loader({ request, params }: LoaderArgs) {
  const { userSession } = await requireUserSession(request);
  invariant(params.placeId, "placeId not found");

  const place = await model.userPlace.query.getById({
    id: params.placeId,
    userId: userSession.id,
  });
  invariant(place, "Place not found");

  const isOwner = userSession.id === place.userId;
  if (!isOwner) {
    return forbidden({ place: null, isOwner: null });
  }

  return json({ place, isOwner });
}

export async function action({ request, params }: ActionArgs) {
  const { userSession } = await requireUserSession(request);

  const formData = await request.formData();
  const submission = parse(formData, { schema: schemaPlaceUpdate });
  if (!submission.value || submission.intent !== "submit") {
    return badRequest(submission);
  }

  try {
    const newSlug = updatePlaceSlug(submission.value);
    const result = await model.userPlace.mutation.update({
      place: submission.value,
      user: userSession,
    });
    if (!result) {
      return badRequest(submission);
    }
    return redirect(`/places/${newSlug}`);
  } catch (error) {
    console.error(error);
    return serverError(submission);
  }
}

export default function Route() {
  const { place } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  const [form, { id, slug, name, description }] = useForm<
    z.infer<typeof schemaPlaceUpdate>
  >({
    shouldValidate: "onSubmit",
    lastSubmission: actionData,
    onValidate({ formData }) {
      return parse(formData, { schema: schemaPlaceUpdate });
    },
    constraint: getFieldsetConstraint(schemaPlaceUpdate),
  });

  if (!place) {
    return <span>Place not found.</span>;
  }

  return (
    <div className="stack">
      <header className="py-4">
        <h1 className="queue-center text-3xl">
          <Mosque className="size-lg" />
          <span>Ubah informasi masjid</span>
        </h1>
      </header>

      <RemixForm {...form.props} method="PUT">
        <fieldset
          disabled={isSubmitting}
          className="space-y-4 disabled:opacity-80"
        >
          <div className="dim stack text-xs">
            <span>
              ID: <code>{place.id}</code>
            </span>
            <span>
              Slug: <code>{place.slug}</code>
            </span>
          </div>

          <input hidden {...conform.input(id)} defaultValue={place.id} />
          <input hidden {...conform.input(slug)} defaultValue={place.slug} />

          <div className="space-y-1">
            <Label htmlFor={name.id}>Nama masjid</Label>
            <Input
              {...conform.input(name)}
              type="text"
              placeholder="Nama masjid"
              defaultValue={place.name}
              className="border-none px-0 sm:text-xl"
            />
            <Alert id={name.errorId}>{name.error}</Alert>
          </div>

          <div className="space-y-1">
            <Label htmlFor={description.id}>Deskripsi atau keterangan</Label>
            <TextArea
              {...conform.input(description)}
              placeholder="Masukkan dekripsi dan keterangan masjid, termasuk kontak, alamat, dll. Maksimum 5000 karakter."
              rows={10}
              defaultValue={place.description}
              className="border-none px-1 sm:text-lg"
            />
            <Alert id={description.errorId}>{description.error}</Alert>
          </div>

          <div className="queue-center">
            <ButtonLoading
              type="submit"
              name="intent"
              value="submit"
              isSubmitting={isSubmitting}
              loadingText="Mengubah informasi..."
              className="grow"
            >
              Ubah Informasi
            </ButtonLoading>
            <Button type="reset" variant="subtle">
              Reset
            </Button>
            <ButtonLink
              to={`/places/${place.slug}`}
              variant="ghost"
              accent="red"
            >
              Batal
            </ButtonLink>
          </div>
        </fieldset>
      </RemixForm>
    </div>
  );
}
