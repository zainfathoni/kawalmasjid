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
  TooltipAuto,
} from "~/components";
import { configDev } from "~/configs";
import { requireUserSession } from "~/helpers";
import { model } from "~/models";
import { schemaPlaceNew } from "~/schemas";
import { createSitemap } from "~/utils";

import type { ActionArgs } from "@remix-run/node";
import type { z } from "zod";
import { InfoEmpty, SubmitDocument } from "~/icons";

export const handle = createSitemap();

export async function action({ request }: ActionArgs) {
  const { userSession } = await requireUserSession(request);

  const formData = await request.formData();
  const submission = parse(formData, { schema: schemaPlaceNew });
  if (!submission.value || submission.intent !== "submit") {
    return badRequest(submission);
  }

  try {
    const newPlace = await model.userPlace.mutation.create({
      user: userSession,
      place: submission.value,
    });
    if (!newPlace) {
      return badRequest(submission);
    }
    return redirect(`/places/${newPlace.slug}`);
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
    <section className="space-y-2">
      <header className="py-4">
        <h1 className="queue-center text-3xl">
          <SubmitDocument />
          <span>Create a new place</span>
          <TooltipAuto
            content={
              <p>
                A place can be a blog post, news article, <br /> tutorial, or
                just a regular place
              </p>
            }
          >
            <InfoEmpty className="size-md" />
          </TooltipAuto>
        </h1>
      </header>

      <RemixForm {...form.props} method="POST">
        <fieldset
          disabled={isSubmitting}
          className="space-y-4 disabled:opacity-80"
        >
          <div className="space-y-1">
            <Label htmlFor={name.id}>Name</Label>
            <Input
              {...conform.input(name)}
              autoFocus
              type="text"
              placeholder="Add a name"
              defaultValue={configDev.isDevelopment ? "A new example" : ""}
              className="border-none px-1 text-lg sm:text-xl md:text-2xl lg:text-3xl"
            />
            <Alert id={name.errorId}>{name.error}</Alert>
          </div>

          <div className="space-y-1">
            <Label htmlFor={description.id}>Description</Label>
            <TextArea
              {...conform.input(description)}
              placeholder="Masukkan dekripsi masjid, termasuk kontak, alamat, dll. Maksimum 5000 karakter"
              rows={20}
              defaultValue={configDev.isDevelopment ? "Deskripsi masjid." : ""}
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
              loadingText="Creating..."
              className="grow"
            >
              Create
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
    </section>
  );
}
