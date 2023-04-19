import { Balancer, Layout } from "~/components";
import { createMetaData, createSitemap } from "~/utils";

export const meta = createMetaData({
  title: "About",
  description:
    "Just some quick info about this project and showcase some of the features.",
});

export const handle = createSitemap("/about", 0.9);

export default function Route() {
  return (
    <Layout className="contain-sm space-y-20">
      <article className="prose-config mt-10">
        <h1>
          <Balancer>Tentang Kawal Masjid</Balancer>
        </h1>
        <p>Website ini masih dalam pengembangan.</p>
      </article>
    </Layout>
  );
}
