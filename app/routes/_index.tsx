import { Layout } from "~/components";
import { createSitemap } from "~/utils";

export const handle = createSitemap("/", 1);

export default function Route() {
  return (
    <Layout>
      <section className="mx-auto flex max-w-max flex-wrap items-center justify-center gap-4 py-10 lg:justify-between lg:py-20">
        <div className="max-w-lg space-y-4">
          <div className="prose-config">
            <h1 className="text-xl">
              <span>Kawal Masjid</span>
            </h1>
            <p>Website ini masih dalam pengembangan.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
