# 🕌 Kawal Masjid

![Kawal Masjid](https://raw.githubusercontent.com/zainfathoni/kawalmasjid/main/public/assets/screenshots/kawalmasjid-screenshot-dark.png)

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

- [🕌 Kawal Masjid](#-kawal-masjid)
  - [Introduction](#introduction)
    - [Live](#live)
  - [Tech Stack](#tech-stack)
  - [Development](#development)
    - [Install Dependencies](#install-dependencies)
    - [Setup Environment Variables/Secrets](#setup-environment-variablessecrets)
      - [Prisma ORM and Database Connection](#prisma-orm-and-database-connection)
      - [Uploadcare](#uploadcare)
    - [Run Development Server](#run-development-server)
  - [References](#references)

### Live

> 🚧 This project is still in very early development

Visit [kawalmasj.id](https://kawalmasj.id)

Follow the progress on:

- Twitter: [@kawalmasjid](https://twitter.com/kawalmasjid)
- GitHub: [kawalmasjid](https://github.com/zainfathoni/kawalmasjid)

## Tech Stack

Listed here are only the most important parts in the stack.️ Some setups are mostly finished, but some might haven't been done yet or are still in progress. More details and references can also be checked from [`mhaidarhanif/rewinds`](https://rewinds.mhaidarhanif.com) and [`catamyst/stack`](https://a.catamyst.com/stack).

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

These are the environment variables you need to set up on your own for developing locally:

- `DATABASE_URL`
- `UPLOADCARE_PUBLIC_KEY`

#### Prisma ORM and Database Connection

This repo is suited to use either your own MySQL instance or MySQL on PlanetScale.

Next, you need to set up your PlanetScale database. If you don't already have a [PlanetScale account](https://planetscale.com/docs/concepts/billing#planetscale-plans), you can [sign up for a free one here](https://auth.planetscale.com/sign-up). Then [create a free database](https://planetscale.com/docs/tutorials/nextjs-planetscale-netlify-template#create-your-database) and grab the `DATABASE_URL` from there. Once you have the database URL connection string, you can paste it to the `DATABASE_URL` env var, for example:

```sh
DATABASE_URL='mysql://username:pscale_pw_password@region.connect.psdb.cloud/name?sslaccept=strict'
```

If you prefer using a local database, run [Docker Compose](./docker-compose.yml):

```sh
docker compose up
```

While in development, you can:

- Generate Prisma types for `@prisma/client` with `nr prisma:generate` (it runs `prisma generate`)
- Check generated Prisma documentation with `nr docs:prisma` (it runs `prisma-docs-generator serve`) then open <http://localhost:5858>
- Visualize the schema with [Prisma Editor](https://github.com/mohammed-bahumaish/prisma-editor) or [Prismaliser](https://prismaliser.app)
- Push Prisma schema changes for PlanetScale with `nr prisma:push` (it runs `prisma db push`)
  - You might notice that with [PlanetScale's](https://planetscale.com/docs/tutorials/prisma-quickstart) approach with [Prisma](https://prisma.io/docs/guides/database/using-prisma-with-planetscale), we don't need migration files in our repo, but rather managed in their platform.

#### Uploadcare

We use [Uploadcare](https://uploadcare.com) to host uploaded images. If you want this feature to work when running the app locally on your machine, you need to create a new free account on Uploadcare and paste your [Public API key](https://uploadcare.com/docs/start/settings/#keys-public) to `UPLOADCARE_PUBLIC_KEY` env var.

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

With HMR, it will run both `dev:remix` and `dev:express`, the Remix server and the Express server with HMR enabled. Then wait until you see this:

```sh
📀 Remix on Express server port :3000
Loading environment variables from .env
💿 Built in 0s
```

Open up <http://localhost:3000> and you should be ready to go!

## References

- [Tabung SG](https://tabung.sg)
