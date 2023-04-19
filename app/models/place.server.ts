import { prisma } from "~/libs";
import { model } from "~/models";

import type { Place, User } from "@prisma/client";

export const query = {
  count() {
    return prisma.place.count();
  },
  getAll() {
    return prisma.place.findMany({
      // FIXME: where: { isPublished: true },
      include: { user: { select: model.user.fields.public } },
      orderBy: { updatedAt: "desc" },
    });
  },
  getBySlug({ slug }: Pick<Place, "slug">) {
    return prisma.place.findFirst({
      where: { slug },
      include: { user: { select: model.user.fields.public } },
    });
  },
  // TODO: might evaluate again later for the performance
  getBySlugAndUsername({
    slug,
    username,
  }: Pick<Place, "slug"> & Pick<User, "username">) {
    return prisma.place.findFirst({
      where: {
        AND: [
          { slug: { equals: slug } },
          { user: { username: { equals: username } } },
        ],
      },
      include: { user: { select: model.user.fields.public } },
    });
  },
  search({ q }: { q: string | undefined }) {
    return prisma.place.findMany({
      where: {
        isPublished: true,
        OR: [
          { name: { contains: q } },
          { slug: { contains: q } },
          { description: { contains: q } },
          {
            user: { name: { contains: q } },
          },
          {
            user: { username: { contains: q } },
          },
          {
            verifiedBy: { name: { contains: q } },
          },
          {
            verifiedBy: { username: { contains: q } },
          },
        ],
      },
      include: {
        images: true,
        user: { select: model.user.fields.public },
      },
      orderBy: [{ name: "asc" }],
    });
  },
};
