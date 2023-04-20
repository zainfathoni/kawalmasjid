import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { useId, useState } from "react";
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
import { Mosque } from "~/icons";
import { FileInfo, Widget } from "@uploadcare/react-widget";

export const handle = createSitemap();

export function loader() {
  const UPLOADCARE_PUBLIC_KEY = process.env.UPLOADCARE_PUBLIC_KEY;
  return json({ UPLOADCARE_PUBLIC_KEY });
}

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
      place: {
        name: submission.value.name,
        description: submission.value.description,
      },
      placeImage: {
        url: submission.value.imageUrl
      }
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

  const { UPLOADCARE_PUBLIC_KEY } = useLoaderData<typeof loader>();
  const [imageUrl, setImageUrl] = useState("");

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

  const handlePlaceImageChange = (file: FileInfo) => {
    setImageUrl(file.cdnUrl ?? "");
  };


  return (
    <section className="space-y-2">
      <header className="py-4">
        <h1 className="queue-center text-3xl">
          <Mosque className="size-lg" />
          <span>Tambah informasi masjid</span>
        </h1>
      </header>

      <RemixForm {...form.props} method="POST">
        <fieldset
          disabled={isSubmitting}
          className="space-y-4 disabled:opacity-80"
        >
          <div className="space-y-1">
            <Label htmlFor={name.id}>Nama masjid</Label>
            <Input
              {...conform.input(name)}
              autoFocus
              type="text"
              placeholder="Nama masjid"
              defaultValue={
                configDev.isDevelopment ? "Masjid Istiqlal Jakarta Pusat" : ""
              }
              className="border-none px-1 text-lg sm:text-xl md:text-2xl lg:text-3xl"
            />
            <Alert id={name.errorId}>{name.error}</Alert>
          </div>

          <div className="space-y-1">
            <Label htmlFor={description.id}>Deskripsi atau keterangan</Label>
            <TextArea
              {...conform.input(description)}
              placeholder="Masukkan dekripsi dan keterangan masjid, termasuk kontak, alamat, dll. Maksimum 5000 karakter."
              rows={5}
              defaultValue={configDev.isDevelopment ? "Deskripsi masjid." : ""}
              className="border-none px-1 sm:text-lg"
            />
            <Alert id={description.errorId}>{description.error}</Alert>
          </div>

          {!UPLOADCARE_PUBLIC_KEY && <p>Terdapat masalah untuk mengunggah foto masjid</p>}
          {UPLOADCARE_PUBLIC_KEY && <div>
            <label hidden htmlFor="imageUrl">
              Foto masjid:
            </label>
            <input
              type="hidden"
              id="imageUrl"
              name="imageUrl"
              value={imageUrl}
              readOnly
            />
            <label htmlFor="file">Unggah foto masjid:</label>{" "}
            <Widget
              publicKey={UPLOADCARE_PUBLIC_KEY}
              id="file"
              onChange={handlePlaceImageChange}
            />
          </div>}

          <div className="queue-center">
            <ButtonLoading
              type="submit"
              name="intent"
              value="submit"
              isSubmitting={isSubmitting}
              loadingText="Menambahkan masjid..."
              className="grow"
            >
              Tambah Masjid
            </ButtonLoading>
            <Button type="reset" variant="subtle">
              Reset
            </Button>
            <ButtonLink to=".." variant="ghost" accent="red">
              Batal
            </ButtonLink>
          </div>
        </fieldset>
      </RemixForm>
    </section>
  );
}
