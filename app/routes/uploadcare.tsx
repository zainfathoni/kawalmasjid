import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";
import { Widget } from "@uploadcare/react-widget";

export function loader() {
  const UPLOADCARE_PUBLIC_KEY = process.env.UPLOADCARE_PUBLIC_KEY;
  return json({ UPLOADCARE_PUBLIC_KEY })
}

export default function Route() {
  const { UPLOADCARE_PUBLIC_KEY } = useLoaderData<typeof loader>()
  if (!UPLOADCARE_PUBLIC_KEY) {
    return null
  }

  return (
    <p>
      <label htmlFor='file'>Your file:</label>{' '}
      <Widget publicKey={UPLOADCARE_PUBLIC_KEY} id='file' />
    </p>
  )
}
