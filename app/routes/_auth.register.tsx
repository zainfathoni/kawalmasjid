import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { useId } from "react";
import { badRequest, forbidden } from "remix-utils";

import {
  Alert,
  ButtonLoading,
  Debug,
  Input,
  InputPassword,
  Label,
  Layout,
  PageHeader,
  RemixForm,
  RemixLinkText,
} from "~/components";
import { configSite } from "~/configs";
import { model } from "~/models";
import { schemaUserRegister } from "~/schemas";
import { authenticator } from "~/services";
import {
  createMetaData,
  getRandomText,
  getRedirectTo,
  useRedirectTo,
} from "~/utils";

import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import type { z } from "zod";

export const meta: V2_MetaFunction = () => {
  return createMetaData({
    title: `Registrasi di ${configSite.name}`,
    description: "Buat akun untuk memberikan informasi masjid.",
  });
};

export async function loader({ request }: LoaderArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/user/dashboard",
  });

  const headerHeadingText = getRandomText([
    `Bergabung di ${configSite.name}`,
    `Registrasi di ${configSite.name}`,
  ]);

  const headerDescriptionText = getRandomText([
    `Buat akun untuk memberi informasi masjid`,
    `Registrasi untuk memulai`,
  ]);

  return json({
    headerHeadingText,
    headerDescriptionText,
  });
}

/**
 * More details about the decision here can be read
 * in the _auth.login route action function
 */
export async function action({ request }: ActionArgs) {
  const clonedRequest = request.clone();

  const formData = await clonedRequest.formData();
  const submission = parse(formData, { schema: schemaUserRegister });
  if (!submission.value || submission.intent !== "submit") {
    return badRequest(submission);
  }

  const result = await model.user.mutation.register(submission.value);

  if (result.error) {
    return forbidden({ ...submission, error: result.error });
  }

  await authenticator.authenticate("user-pass", request, {
    successRedirect: getRedirectTo(request) || "/user/dashboard",
    failureRedirect: "/register",
  });
  return json(submission);
}

export default function Route() {
  const { headerHeadingText, headerDescriptionText } =
    useLoaderData<typeof loader>();
  const { searchParams, redirectTo } = useRedirectTo();

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const actionData = useActionData<typeof action>();

  const id = useId();
  const [form, fields] = useForm<z.infer<typeof schemaUserRegister>>({
    id,
    shouldValidate: "onSubmit",
    lastSubmission: actionData,
    constraint: getFieldsetConstraint(schemaUserRegister),
    onValidate({ formData }) {
      return parse(formData, { schema: schemaUserRegister });
    },
  });
  const { name, username, email, password } = fields;

  return (
    <Layout
      isSpaced
      layoutHeader={
        <PageHeader size="xs" isTextCentered>
          <h1>{headerHeadingText}</h1>
          <p>{headerDescriptionText}</p>
        </PageHeader>
      }
    >
      <div className="mx-auto w-full max-w-sm">
        <RemixForm {...form.props} method="POST" className="space-y-4">
          <fieldset
            className="space-y-2 disabled:opacity-80"
            disabled={isSubmitting}
          >
            <div className="space-y-1">
              <Label htmlFor={name.id}>Nama Lengkap</Label>
              <Input
                {...conform.input(name)}
                type="text"
                placeholder="Nama Lengkap Anda"
                autoComplete="name"
                autoFocus
                required
              />
              {name.error && (
                <Alert variant="danger" id={name.errorId}>
                  {name.error}
                </Alert>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor={username.id}>Username</Label>
              <Input
                {...conform.input(username)}
                type="text"
                placeholder="namaanda"
                autoComplete="username"
                required
              />
              {username.error && (
                <Alert variant="danger" id={username.errorId}>
                  {username.error}
                </Alert>
              )}
              <p className="text-xs text-surface-500">
                4-20 karakter (huruf, angka, titik, underscore)
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor={email.id}>Email</Label>
              <Input
                {...conform.input(email)}
                type="email"
                placeholder="anda@email.com"
                autoComplete="email"
                required
              />
              {email.error && (
                <Alert variant="danger" id={email.errorId}>
                  {email.error}
                </Alert>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor={password.id}>Password</Label>
              <InputPassword
                {...conform.input(password)}
                placeholder="Password (minimal 8 karakter)"
                autoComplete="current-password"
                required
              />
              {password.error && (
                <Alert variant="danger" id={password.errorId}>
                  {password.error}
                </Alert>
              )}
              <p className="text-xs text-surface-500">8 karakter atau lebih</p>
            </div>

            <input type="hidden" name="redirectTo" value={redirectTo} />

            <ButtonLoading
              size="lg"
              type="submit"
              name="intent"
              value="submit"
              isSubmitting={isSubmitting}
              loadingText="Membuat akun..."
              className="w-full"
            >
              Buat akun {configSite.name}
            </ButtonLoading>
          </fieldset>

          {/* <div>
            <p>By clicking "Create {configSite.name}" you agree to our Code of Conduct, Terms of Service and Privacy Policy.</p>
          </div> */}

          <div>
            <p className="text-center">
              <RemixLinkText
                to={{ pathname: "/login", search: searchParams.toString() }}
              >
                Punya akun? Login
              </RemixLinkText>
            </p>
          </div>
        </RemixForm>
      </div>

      <Debug name="form">{{ actionData, fields }}</Debug>
    </Layout>
  );
}
