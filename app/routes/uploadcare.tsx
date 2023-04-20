import { parse } from "@conform-to/dom";
import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import type { FileInfo } from "@uploadcare/react-widget";
import { Widget } from "@uploadcare/react-widget";
import { useState } from "react";
import { badRequest, serverError } from "remix-utils";
import { ButtonLoading, Debug, RemixForm } from "~/components";
import { requireUserSession } from "~/helpers";
import { prisma } from "~/libs";

export function loader() {
  const UPLOADCARE_PUBLIC_KEY = process.env.UPLOADCARE_PUBLIC_KEY;
  return json({ UPLOADCARE_PUBLIC_KEY });
}

export async function action({ request }: ActionArgs) {
  const { userSession, user } = await requireUserSession(request);

  const formData = await request.formData();
  const submission = parse(formData);
  if (!submission.payload || submission.intent !== "submit") {
    return badRequest(submission);
  }
  if (!submission?.payload?.imageUrl) {
    return badRequest(submission);
  }

  try {
    const firstPlace = await prisma.place.findFirst();
    if (!firstPlace) {
      return badRequest(submission);
    }

    const newImage = await prisma.placeImage.create({
      data: {
        url: submission?.payload?.imageUrl,
        placeId: firstPlace.id,
        userId: userSession.id,
      },
    });
    if (!newImage) {
      return badRequest(submission);
    }
    return redirect(".");
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

  if (!UPLOADCARE_PUBLIC_KEY) {
    return null;
  }

  const handleChange = (file: FileInfo) => {
    setImageUrl(file.cdnUrl ?? "");
  };

  return (
    <div>
      <label htmlFor="file">Your file:</label>{" "}
      <Widget
        publicKey={UPLOADCARE_PUBLIC_KEY}
        id="file"
        onChange={handleChange}
      />
      <RemixForm method="post">
        <label hidden htmlFor="imageUrl">
          Your image:
        </label>
        <input
          type="hidden"
          id="imageUrl"
          name="imageUrl"
          value={imageUrl}
          readOnly
        />
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
      </RemixForm>
      <Debug name="actionData">{actionData}</Debug>
    </div>
  );
}
