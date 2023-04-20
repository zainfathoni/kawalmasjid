import { createPlaceSlug, updatePlaceSlug } from "~/helpers";
import { prisma } from "~/libs";
import { model } from "~/models";

import type { Place, PlaceImage, User } from "@prisma/client";

export const query = {
  count({ user }: { user: Pick<User, "id"> }) {
    return prisma.place.count({
      where: { userId: user.id },
    });
  },
  getAll({ user }: { user: Pick<User, "id"> }) {
    return prisma.place.findMany({
      where: { userId: user.id },
      include: { user: { select: model.user.fields.private } },
      orderBy: { updatedAt: "desc" },
    });
  },
  getById({ id, userId }: Pick<Place, "id" | "userId">) {
    return prisma.place.findFirst({
      where: { id, userId },
      include: { user: { select: model.user.fields.public } },
    });
  },
};

export const mutation = {
  async create({
    user,
    place,
    placeImage,
  }: {
    user: Pick<User, "id">;
    place: Pick<Place, "name" | "description">;
    placeImage: Pick<PlaceImage, "url">;
  }) {
    // TODO: refactor into a single transaction
    const newPlace = await prisma.place.create({
      data: {
        user: { connect: { id: user.id } },
        slug: createPlaceSlug(place),
        name: place.name.trim(),
        description: place.description.trim(),
      },
    });
    if (!newPlace) {
      console.error("");
    }

    const newPlaceImage = await prisma.placeImage.create({
      data: {
        url: placeImage.url,
        placeId: newPlace.id,
        userId: user.id,
      },
    });
    if (!newPlaceImage) {
      console.error("");
    }

    return newPlace;
  },
  update({
    place,
    user,
  }: {
    place: Pick<Place, "id" | "slug" | "name" | "description">;
    user: Pick<User, "id">;
  }) {
    return prisma.place.updateMany({
      where: {
        id: place.id,
        userId: user.id,
      },
      data: {
        slug: updatePlaceSlug(place),
        name: place.name.trim(),
        description: place.description.trim(),
      },
    });
  },
  deleteAll({ user }: { user: Pick<User, "id"> }) {
    return prisma.place.deleteMany({
      where: { userId: user.id },
    });
  },
  deleteById({ id, userId }: Pick<Place, "id" | "userId">) {
    return prisma.place.deleteMany({
      where: {
        id,
        userId,
      },
    });
  },
};
