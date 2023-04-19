# 🕌 Kawal Masjid

![Kawal Masjid](https://raw.githubusercontent.com/zainfathoni/kawalmasjid/main/public/assets/screenshots/kawalmasjid-screenshot-light.png)

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Remix](https://img.shields.io/badge/Remix-000000?style=flat-square&logo=remix&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-111111?style=flat-square&logo=framer&logoColor=white)
![Prisma ORM](https://img.shields.io/badge/Prisma_ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PlanetScale](https://img.shields.io/badge/PlanetScale-000000?style=flat-square&logo=planetscale&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
[![Better Uptime](https://betteruptime.com/status-badges/v1/monitor/enmd.svg)](https://status.kawalmasj.id/?utm_source=status_badge)

## Introduction

🕌 Kawal Masjid is a platform to inform Infaq Online Masjid seluruh Indonesia.

Made with [⏪ Rewinds](https://rewinds.mhaidarhanif.com), a web app starter kit with Remix, Tailwind CSS, and the TypeScript ecosystem. It is an opinionated collection of interactive UI components, hooks, and utilities.

### Live

> 🚧 This project is still in very early development

Visit [kawalmasj.id](https://kawalmasj.id)

Follow the progress on:

- Twitter: [@kawalmasjid](https://twitter.com/kawalmasjid)
- GitHub: [kawalmasjid](https://github.com/zainfathoni/kawalmasjid)

## Tech Stack

Listed here are only the most important parts in the stack.️ Some setup mostly finished, but some might haven't done yet or still in progress. More details and references can also be checked from [`mhaidarhanif/rewinds`](https://rewinds.mhaidarhanif.com) and [`catamyst/stack`](https://a.catamyst.com/stack).

## Development

### Install Dependencies

Before running your Remix app locally, make sure your project's local dependencies are installed using your preferred package manager agent:

```sh
# this repo is using pnpm lock file
pnpm i
```

Or if using [`ni`](https://github.com/antfu/ni) which can autodetect the agent:

```sh
pnpm add -g @antfu/ni  # install once
ni                     # can auto choose npm/yarn/pnpm
```

### Setup Environment Variables/Secrets

Use plain `.env` file for local development:

```sh
cp -i .env.example .env
# -i or --interactive will ask before overwrite
```

Then edit `.env` as you need.

Alternatively, it's recommended to use [Doppler](https://doppler.com), or [Dotenv](https://dotenv.org), or something similar to manage the credentials.

For example if using Doppler:

```sh
doppler login
doppler setup
doppler secrets download --no-file --format env > .env
```

> ⚠️ Make sure to setup the environment variables/secrets here, on Vercel, or on your preferred deployment target. Otherwise the app will break on production. That's why Doppler or Dotenv are recommended to manage them easily. There are also some preset strings in the `.env.example` which you can copy directly.

### Prisma ORM and Database Connection

It's up to you which database/DBMS you want to use with the app that supported by Prisma ORM. This repo is suited to use either your own MySQL instance or MySQL on PlanetScale. But we don't use SQLite because it doesn't have `@db.Text` annotation and `model.createMany()` function.

Once you have the database URL connection string from PlanetScale MySQL instance, for example:

```sh
DATABASE_URL='mysql://username:pscale_pw_password@region.connect.psdb.cloud/name?sslaccept=strict'
```

If you need to use local database, run [Docker compose](./docker-compose.yml):

```sh
docker compose up
```

While in development, you can:

- Generate Prisma types for `@prisma/client` with `nr prisma:generate` (it runs `prisma generate`)
- Check generated Prisma documentation with `nr docs:prisma` (it runs `prisma-docs-generator serve`) then open <http://localhost:5858>
- Visualize the schema with [Prisma Editor](https://github.com/mohammed-bahumaish/prisma-editor) or [Prismaliser](https://prismaliser.app)
- Push Prisma schema changes for PlanetScale with `nr prisma:push` (it runs `prisma db push`)
  - You might notice that with [PlanetScale](https://planetscale.com/docs/tutorials/prisma-quickstart) approach with [Prisma](https://prisma.io/docs/guides/database/using-prisma-with-planetscale), we don't need migration files in our repo, rather managed in their platform.

### Run Development Server

Make sure you've generated the latest Prisma schema with `nr prisma:generate`.

Afterward, start the Remix development server like so based on your preference:

- Run without HMR: `nr dev`
- Run with HMR: `nr dev-hmr`

Without HMR, it will just run `remix dev`, the Remix server on development. Then wait until you see this:

```sh
Loading environment variables from .env
Remix App Server started at http://localhost:3000
```

Open up <http://localhost:3000> and you should be ready to go!

Alternatively, you can enable/disable HMR by changing this in the `remix.config.js`. By default we're not using it.

```js
const isUsingHMR = false;
```

With HMR, it will run both `dev:remix` and `dev:express`, the Remix server and Express server with HMR enabled. Then wait until you see this:

```sh
📀 Remix on Express server port :3000
Loading environment variables from .env
💿 Built in 0s
```

Open up <http://localhost:3000> and you should be ready to go!

### TypeScript and ESLint Server

When you update some significant changes in the TypeScript config, ESLint config, or just generated a new Prisma schema, you can restart the language server as needed:

```sh
> TypeScript: Restart TS Server
> ESLint: Restart ESLint Server
> Prisma: Restart Language Server
```

## Deployment

## Vercel

As this repo was made after having run the `create-remix` command and selected "Vercel" as a deployment target, you only need to [import your Git repository](https://vercel.com/new) into Vercel, and it will be deployed. Alternatively you can just use the "Deploy to Vercel" button above.

Just keep in mind to set up the environment variables/secret that preferably differentiated for each server environments such as local/development, staging/preview, and production.

Required for the app to run:

```sh
# Primary database that connects to Prisma ORM
DATABASE_URL=

# Session secret for cookie after authenticated or logged in
REMIX_SESSION_SECRET=

# Application name
REMIX_APP_NAME=

# Application name for transactional email
REMIX_APP_EMAIL=
```

Optionals but required for seed:

```sh
# Default admin email
REMIX_ADMIN_EMAIL=

# Default admin password
REMIX_ADMIN_PASSWORD=
```

The session secret for `REMIX_SESSION_SECRET` can be generated more securely using either Node.js crypto module (JS) or OpenSSL (shell):

```sh
$ node scripts/generate-secret.js
1234567890abcdefghijklmnopqrstuvwxyz1234567890

$ sh scripts/generate-secret.sh
yjudrrKv/W4jxzmQqXze9T7DEANxStDtg4YCdfgs/4E=
```

When managing environment variables/secrets using Doppler, there's the auto sync integration to Vercel:

- <https://doppler.com/integrations/vercel>
- <https://vercel.com/integrations/doppler>

If you'd like to avoid using a Git repository, you can also deploy the directory by running [Vercel CLI](https://vercel.com/cli):

```sh
ni -g vercel
vercel
```

It is generally recommended to use a Git repository, because future commits will then automatically be deployed by Vercel, through its [Git Integration](https://vercel.com/docs/concepts/git).

## Important Notes

### Icons

This repo provide at least 2 icon set with SVG assets:

- [Lucide](https://lucide.dev)
- [Iconoir](https://iconoir.com)

Recommended to use [Icones](https://icones.js.org) to search the icon names easily.

### Tailwind CSS Config

Use [uicolors.app](https://uicolors.app/create) or [tints.dev](https://tints.dev) to generate the color tokens easily. Then replace what's inside `tailwind.config.js`.

### Remix Entry Files

This repo already has the entry files. Since Remix `v1.14`, you might notice that the entry files might be able to be implicitly defined. At the moment, I still suggest revealing or explicitly defining them to make it work smoothly.

```sh
npx remix reveal
```

### Remix SEO Configuration

As there's not yet an official way to handle SEO related output for metadata and sitemap, here are the options ordered by preference:

1. [`balavishnuvj/remix-seo`](https://github.com/balavishnuvj/remix-seo): Collection of SEO utilities like sitemap, robots.txt, etc. for a Remix Application
2. [`chaance/remix-seo`](https://github.com/chaance/remix-seo): A package for easily managing SEO meta and link tags in Remix
3. [`fedeya/remix-sitemap`](https://github.com/fedeya/remix-sitemap): Sitemap generator for Remix applications

## References

### General

- [web.dev](https://web.dev)
- [Rewinds Stack](https://rewinds.mhaidarhanif.com)
- [Catamyst Stack](https://a.catamyst.com/stack)
  - [Catamyst Stack All](https://a.catamyst.com/stack-all)
- [The Web’s Next Transition - Epic Web Dev by Kent C. Dodds](https://epicweb.dev/the-webs-next-transition)
- [Infra I'm Building On In 2023 - T3](https://t3.gg/blog/post/2023-infra)
  - [The Infra That Saved Me From AWS - My 2023 Stack](https://youtube.com/watch?v=v-9AZKp-Ljo)

### Remix

- [Remix Docs](http://remix.run)
- [Remix Blog Tutorial](http://remix.run/docs/en/main/tutorials/blog)
- [Up and Running with Remix - Kent C. Dodds - egghead.io](https://egghead.io/courses/up-and-running-with-remix-b82b6bb6)
- [Build a Fullstack App with Remix and Prisma - Prisma YouTub Playlist](https://youtube.com/watch?v=4tXGRe5CDDg&list=PLn2e1F9Rfr6kPDIAbfkOxgDLf4N3bFiMn)
- [Build a Fullstack App with Remix and Prisma - Prisma Blog](https://prisma.io/blog/fullstack-remix-prisma-mongodb-1-7D0BfTXBmB6r)

### React

- [React](https://react.dev)
- [Rethinking React best practices - Frontend Mastery](https://frontendmastery.com/posts/rethinking-react-best-practices)
- [Bulletproof React - A simple, scalable, and powerful architecture for building production-ready React applications](https://github.com/alan2207/bulletproof-react)

### Tailwind CSS

- [Tailwind CSS](https://tailwindcss.com)
- [Why we use Tailwind CSS as our primary framework | Clean Commit](https://cleancommit.io/blog/why-we-use-tailwind-css-as-our-primary-framework)
- [An Honest Look at Tailwind as an API for CSS | thoughtbot, inc.](https://thoughtbot.com/blog/an-honest-look-at-tailwind-as-an-api-for-css)
- [Styling Best Practices I Use With Tailwind CSS | theodorusclarence.com](https://theodorusclarence.com/blog/tailwindcss-best-practice)

### Inspirations

- [Design System Checklist](https://designsystemchecklist.com)
- [shadcn UI](https://github.com/shadcn/ui)
  - [Taxonomy](https://tx.shadcn.com)
- [Precedent](https://precedent.dev)
- [Reshaped](https://reshaped.so)
- [Remix Stacks](https://remix.run/stacks)
  - [Remix Directory](https://remix.directory)
  - [Spacewave Stack by Kent C. Dodds](https://github.com/epicweb-dev/spacewave-stack)
  - [Synthwave Stack by I4O Open Source](https://github.com/i4o-oss/synthwave-stack)
  - [Stripe Stack by Daniel Kanem](https://github.com/dev-xo/stripe-stack)
- [T3 Stack by T3 Community via Theo Browne](https://create.t3.gg)
- [neorepo - Remix/Next.js production-ready starter kit](https://neorepo.com)
- [SaasRock - The One-Man SaaS Framework](https://saasrock.com)
- [MakerKit - SaaS Starter Kits based on React](https://makerkit.dev)
- [Saas UI - The React component library for Startups](https://saas-ui.dev)
- [saasui.design](https://saasui.design)
- [saasinterface.com](https://saasinterface.com)
