import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { redirect } from "@remix-run/node";
import { useActionData, useNavigation } from "@remix-run/react";
import { useId } from "react";
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
import { configDev } from "~/configs";
import { requireUserSession } from "~/helpers";
import { model } from "~/models";
import { schemaPlaceNew } from "~/schemas";
import { createSitemap } from "~/utils";

import type { ActionArgs } from "@remix-run/node";
import type { z } from "zod";

export const handle = createSitemap();

export async function action({ request }: ActionArgs) {
  const { userSession } = await requireUserSession(request);

  const formData = await request.formData();
  const submission = parse(formData, { schema: schemaPlaceNew });
  if (!submission.value || submission.intent !== "submit") {
    return badRequest(submission);
  }

  try {
    const newPlace = await model.adminPlace.mutation.create({
      user: userSession,
      place: submission.value,
    });
    if (!newPlace) {
      return badRequest(submission);
    }
    return redirect(`../${newPlace.id}`);
  } catch (error) {
    console.error(error);
    return serverError(submission);
  }
}

export default function Route() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const id = useId();
  const [form, { name, description }] = useForm<z.infer<typeof schemaPlaceNew>>(
    {
      id,
      shouldValidate: "onSubmit",
      lastSubmission: actionData,
      onValidate({ formData }) {
        return parse(formData, { schema: schemaPlaceNew });
      },
      constraint: getFieldsetConstraint(schemaPlaceNew),
    }
  );

  return (
    <div className="stack">
      <header>
        <span>Add New Place</span>
      </header>

      <RemixForm
        {...form.props}
        method="POST"
        className="card max-w-lg space-y-4"
      >
        <fieldset
          disabled={isSubmitting}
          className="space-y-2 disabled:opacity-80"
        >
          <header>
            <div className="space-y-1">
              <Label htmlFor={name.id}>Name</Label>
              <Input
                {...conform.input(name)}
                type="text"
                placeholder="Add a name"
                defaultValue={configDev.isDevelopment ? "A new example" : ""}
                autoFocus
              />
              <Alert id={name.errorId}>{name.error}</Alert>
            </div>
          </header>

          <div className="space-y-1">
            <Label htmlFor={description.id}>Description</Label>
            <TextArea
              {...conform.input(description)}
              placeholder="Type your longer description here..."
              rows={10}
              defaultValue={
                configDev.isDevelopment
                  ? "Here is the long description about the place."
                  : ""
              }
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
              loadingText="Saving..."
              className="grow"
            >
              Save
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
