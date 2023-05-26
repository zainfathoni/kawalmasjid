import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { useId } from "react";
import { badRequest, forbidden } from "remix-utils";

import {
  Alert,
  ButtonLoading,
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
import { schemaUserLogin } from "~/schemas";
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
    title: "Login",
    description: `Lanjut dengan akun ${configSite.name}`,
  });
};

export async function loader({ request }: LoaderArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/places",
  });

  const headerHeadingText = getRandomText(["Halo!", "Selamat datang kembali"]);

  const headerDescriptionText = getRandomText([
    `Lanjut ke ${configSite.name}`,
    `Lanjut dengan akun ${configSite.name}`,
    `Gunakan akun ${configSite.name}`,
  ]);

  return json({
    headerHeadingText,
    headerDescriptionText,
  });
}

/**
 * This also applicable in the _auth.register route action function
 */
export async function action({ request }: ActionArgs) {
  // Clone Request/ReadableStream to prevent the stream being locked
  // Because we're using the request later too for Remix-Auth Authenticator
  const clonedRequest = request.clone();

  const formData = await clonedRequest.formData();
  const submission = parse(formData, { schema: schemaUserLogin });
  if (!submission.value || submission.intent !== "submit") {
    return badRequest(submission);
  }

  // Check user email and password
  const result = await model.user.mutation.login(submission.value);

  // Use custom error for Conform submission
  if (result.error) {
    return forbidden({ ...submission, error: result.error });
  }

  /**
   * Remix-Auth Authenticator
   *
   * Call the method with the name of the strategy we want to use and the
   * request object, optionally we pass an object with the URLs we want the user
   * to be redirected to after a success or a failure
   *
   * Login via services/auth-service.server + models/user.server
   * But this won't check the email and password again
   */
  await authenticator.authenticate("user-pass", request, {
    successRedirect: getRedirectTo(request) || "/places",
    failureRedirect: "/login",
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
  const [form, fields] = useForm<z.infer<typeof schemaUserLogin>>({
    id,
    shouldValidate: "onSubmit",
    lastSubmission: actionData,
    constraint: getFieldsetConstraint(schemaUserLogin),
    onValidate({ formData }) {
      return parse(formData, { schema: schemaUserLogin });
    },
  });
  const { email, password } = fields;

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
              <Label htmlFor={email.id}>Email</Label>
              <Input
                {...conform.input(email)}
                type="email"
                placeholder="anda@email.com"
                autoComplete="email"
                autoFocus
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
                placeholder="Masukkan password"
                autoComplete="current-password"
                required
              />
              {password.error && (
                <Alert variant="danger" id={password.errorId}>
                  {password.error}
                </Alert>
              )}
              <p className="text-xs text-surface-500 dark:text-surface-300">
                Minimal 8 karakter
              </p>
            </div>

            {/* TODO: Implement remember checkbox */}
            {/* <div className="flex gap-1">
              <Checkbox {...conform.input(remember)} name="remember" />
              <Label htmlFor="remember" className="cursor-pointer">
                Remember me
              </Label>
            </div> */}

            <Input type="hidden" name="redirectTo" value={redirectTo} />

            <ButtonLoading
              size="lg"
              type="submit"
              className="w-full"
              name="intent"
              value="submit"
              isSubmitting={isSubmitting}
              loadingText="Sedang login..."
            >
              Login
            </ButtonLoading>
          </fieldset>

          <p className="text-center">
            <RemixLinkText
              to={{ pathname: "/register", search: searchParams.toString() }}
            >
              Baru di {configSite.name}? Registrasi
            </RemixLinkText>
          </p>
        </RemixForm>
      </div>
    </Layout>
  );
}
