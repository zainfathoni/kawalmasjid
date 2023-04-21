import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { useId, useState } from "react";
import { badRequest, serverError } from "remix-utils";

import type { FileInfo } from "@uploadcare/react-widget";
import { Widget as UploadcareWidget } from "@uploadcare/react-widget";
import uploadcareTabEffects from "uploadcare-widget-tab-effects/react-en";

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
import { Mosque } from "~/icons";

import type { ActionArgs } from "@remix-run/node";
import type { z } from "zod";

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
        // FIXME: Either always require image or allow creating places without image
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        url: submission.value.imageUrl,
      },
      placeQRCode: {
        // FIXME: Either always require image or allow creating places without image
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        url: submission.value.qrCodeUrl,
      },
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
  const [qrCodeUrl, setQRCodeUrl] = useState("");

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

  const handleChangePlaceImage = (file: FileInfo) => {
    setImageUrl(file.cdnUrl ?? "");
  };

  const handleChangeQrCodeUrl = (file: FileInfo) => {
    setQRCodeUrl(file.cdnUrl ?? "");
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

          {!UPLOADCARE_PUBLIC_KEY && (
            <p>Terdapat masalah untuk fitur mengunggah gambar</p>
          )}

          {UPLOADCARE_PUBLIC_KEY && (
            <>
              <div className="space-y-1">
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
                <UploadcareWidget
                  publicKey={UPLOADCARE_PUBLIC_KEY}
                  tabs="file camera url"
                  previewStep
                  effects="crop, sharp, enhance"
                  customTabs={{ preview: uploadcareTabEffects }}
                  onChange={handleChangePlaceImage}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  id="file"
                />
              </div>
              <div className="space-y-1">
                <label hidden htmlFor="qrCodeUrl">
                  Foto QR Code infaq:
                </label>
                <input
                  type="hidden"
                  id="qrCodeUrl"
                  name="qrCodeUrl"
                  value={qrCodeUrl}
                  readOnly
                />
                <label htmlFor="qrCodeFile">Unggah foto QR Code infaq:</label>{" "}
                <UploadcareWidget
                  publicKey={UPLOADCARE_PUBLIC_KEY}
                  tabs="file camera url"
                  previewStep
                  effects="crop, sharp, enhance"
                  customTabs={{ preview: uploadcareTabEffects }}
                  onChange={handleChangeQrCodeUrl}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  id="qrCodeFile"
                />
              </div>
            </>
          )}

          <div className="queue-center">
            <ButtonLoading
              type="submit"
              name="intent"
              value="submit"
              isSubmitting={isSubmitting}
              loadingText="Menambahkan informasi..."
              className="grow"
            >
              Tambah Informasi
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
