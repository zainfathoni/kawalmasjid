import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { badRequest, serverError } from "remix-utils";

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
import { model } from "~/models";
import { schemaPlaceUpdate } from "~/schemas";
import { createSitemap, invariant } from "~/utils";

import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import type { z } from "zod";

export const handle = createSitemap();

export async function loader({ params }: LoaderArgs) {
  invariant(params.placeId, "placeId not found");
  const place = await model.adminPlace.query.getById({ id: params.placeId });
  return json({ place });
}

export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData();
  const submission = parse(formData, { schema: schemaPlaceUpdate });
  if (!submission.value || submission.intent !== "submit") {
    return badRequest(submission);
  }

  try {
    const updatedPlace = await model.adminPlace.mutation.update({
      place: submission.value,
    });
    if (!updatedPlace) {
      return badRequest(submission);
    }
    return redirect(`..`);
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
      <header>
        <span>Edit Place</span>
      </header>

      <RemixForm {...form.props} method="PUT" className="card max-w-lg">
        <fieldset
          disabled={isSubmitting}
          className="space-y-2 disabled:opacity-80"
        >
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

            <input hidden {...conform.input(id)} defaultValue={place.id} />
            <input hidden {...conform.input(slug)} defaultValue={place.slug} />

            <div className="space-y-1">
              <Label htmlFor={name.id}>Name</Label>
              <Input
                {...conform.input(name)}
                type="text"
                placeholder="Add a name"
                autoFocus
                defaultValue={place.name}
              />
              <Alert id={name.errorId}>{name.error}</Alert>
            </div>
          </header>

          <div className="space-y-1">
            <Label htmlFor={description.id}>Description</Label>
            <TextArea
              {...conform.input(description)}
              placeholder="Type your longer description here..."
              rows={5}
              defaultValue={place.description}
            />
            <Alert id={description.errorId}>{description.error}</Alert>
            <p className="text-sm text-surface-500">
              The place has a maximum description length of 5,000 characters.
            </p>
          </div>

          <div className="queue-center">
            <ButtonLoading
              type="submit"
              name="intent"
              value="submit"
              isSubmitting={isSubmitting}
              loadingText="Updating..."
              className="grow"
            >
              Update
            </ButtonLoading>
            <Button type="reset" variant="subtle">
              Reset
            </Button>
            <ButtonLink to=".." variant="ghost" accent="red">
              Cancel
            </ButtonLink>
          </div>
        </fieldset>
      </RemixForm>
    </div>
  );
}
