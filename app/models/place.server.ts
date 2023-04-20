import { prisma } from "~/libs";
import { model } from "~/models";

import type { Place, User } from "@prisma/client";

export const query = {
  count() {
    return prisma.place.count();
  },
  getAll({ limit = 10, cursor = null } = {}) {
    return prisma.place.findMany({
      // FIXME: where: { isPublished: true },
      include: {
        user: { select: model.user.fields.public },
        images: true,
      },
      orderBy: { updatedAt: "desc" },

      // Read https://www.prisma.io/docs/concepts/components/prisma-client/pagination
      skip: cursor ? 1 : 0,
      take: limit,
      ...(cursor ? { cursor: { id: cursor } } : {}),
    });
  },
  getBySlug({ slug }: Pick<Place, "slug">) {
    return prisma.place.findFirst({
      where: { slug },
      include: {
        user: {
          select: model.user.fields.public,
        },
        images: true,
      },
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
      include: {
        user: { select: model.user.fields.public },
        images: true,
      },
    });
  },
  search({ q }: { q: string | undefined }) {
    return prisma.place.findMany({
      where: {
        // FIXME: isPublished: true,
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
