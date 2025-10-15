"use strict";
import { z } from "zod";
import { multipartPreHandler } from "../../middlewares/multipart-prehandler.js";
import controller from "./controller.js";
import { categorySchema } from "../../validation-schema/category.schema.js";
import zodToJsonSchema from "zod-to-json-schema";

export default async function routes(fastify, options) {
  fastify.post(
    "/",
    {
      schema: {
        description: "Create categories",
        tags: ["Categories"],
        body: zodToJsonSchema(categorySchema),
      },
      preHandler: async (req, res) =>
        multipartPreHandler(req, res, ["packages"]),
    },
    controller.create
  );
  fastify.put(
    "/:id",
    {
      schema: {
        description: "Update category",
        tags: ["Categories"],
      },
      preHandler: async (req, res) =>
        multipartPreHandler(req, res, ["packages", "picture_urls"]),
    },
    controller.updateById
  );
  fastify.delete(
    "/:id",
    {
      schema: {
        description: "Delete category",
        tags: ["Categories"],
      },
    },
    controller.deleteById
  );
  fastify.get(
    "/:id",
    {
      schema: {
        description: "Get category",
        tags: ["Categories"],
        response: {
          200: categorySchema.transform(zodToJsonSchema),
        },
      },
    },
    controller.getById
  );
}

export async function categoryPublicRoutes(fastify, opt) {
  fastify.get(
    "/",
    {
      schema: {
        description: "List all categories",
        tags: ["Categories"],
        response: {
          200: z.array(categorySchema).transform(zodToJsonSchema),
        },
      },
    },
    controller.get
  );
}
