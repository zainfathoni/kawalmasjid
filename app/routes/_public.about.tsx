import { Balancer, Layout, Image } from "~/components";
import { createMetaData, createSitemap } from "~/utils";

export const meta = createMetaData({
  title: "Tentang Kawal Masjid",
  description: "Website ini masih dalam pengembangan.",
});

export const handle = createSitemap("/about", 0.9);

export default function Route() {
  return (
    <Layout className="contain-sm space-y-20">
      <article className="prose-config mt-10">
        <h1>
          <Balancer>Tentang Kawal Masjid</Balancer>
        </h1>
        <Image src="/assets/opengraph/kawalmasjid-og.png" alt="Kawal Masjid" />
        <p>Website ini masih dalam pengembangan.</p>
      </article>
    </Layout>
  );
}
