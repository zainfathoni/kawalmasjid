import { createPlaceSlug, updatePlaceSlug } from "~/helpers";
import { prisma } from "~/libs";
import { model } from "~/models";

import type { Place, User } from "@prisma/client";

export const query = {
  count() {
    return prisma.place.count();
  },
  getAll() {
    return prisma.place.findMany({
      include: {
        user: { select: model.user.fields.public },
      },
      orderBy: { updatedAt: "desc" },
    });
  },
  getById({ id }: Pick<Place, "id">) {
    return prisma.place.findFirst({
      where: { id },
      include: {
        user: { select: model.user.fields.public },
        verifiedBy: { select: model.user.fields.public },
      },
    });
  },
};

export const mutation = {
  create({
    user,
    place,
  }: {
    user: Pick<User, "id">;
    place: Pick<Place, "name" | "description">;
  }) {
    return prisma.place.create({
      data: {
        user: { connect: { id: user.id } },
        slug: createPlaceSlug(place),
        name: place.name.trim(),
        description: place.description.trim(),
      },
    });
  },
  update({
    place,
  }: {
    place: Pick<Place, "id" | "slug" | "name" | "description">;
  }) {
    return prisma.place.update({
      where: {
        id: place.id,
      },
      data: {
        slug: updatePlaceSlug(place),
        name: place.name.trim(),
        description: place.description.trim(),
      },
    });
  },
  verify({ id, user }: { id: Pick<Place, "id">; user: User }) {
    return prisma.place.update({
      where: {
        id,
      },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
        verifiedById: user.id,
      },
    });
  },
  publish({ id }: { id: Pick<Place, "id"> }) {
    return prisma.place.update({
      where: {
        id,
      },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
    });
  },
  deleteAll() {
    return prisma.place.deleteMany();
  },
  deleteById({ id }: Pick<Place, "id">) {
    return prisma.place.delete({
      where: { id },
    });
  },
};
