"use strict";
import { z } from "zod";
import { multipartPreHandler } from "../../middlewares/multipart-prehandler.js";
import controller from "./controller.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import { productSchema } from "../../validation-schema/product-schema.js";

export default async function routes(fastify, options) {
  // Create product
  fastify.post(
    "/",
    {
      schema: {
        description: "Create a new product",
        tags: ["Products"],
        body: zodToJsonSchema(productSchema),
        response: {
          201: zodToJsonSchema(productSchema),
        },
      },
      preHandler: async (req, res) =>
        multipartPreHandler(req, res, [
          "features",
          "youtube_urls",
          "specifications",
        ]),
    },
    controller.create
  );

  // Update product by ID
  fastify.put(
    "/:id",
    {
      schema: {
        description: "Update product by ID",
        tags: ["Products"],
        body: zodToJsonSchema(productSchema.partial()), // allow partial update
        response: {
          200: zodToJsonSchema(productSchema),
        },
      },
      preHandler: async (req, res) =>
        multipartPreHandler(req, res, [
          "picture_urls",
          "features",
          "youtube_urls",
          "specifications",
        ]),
    },
    controller.updateById
  );

  // Delete product by ID
  fastify.delete(
    "/:id",
    {
      schema: {
        description: "Delete product by ID",
        tags: ["Products"],
      },
    },
    controller.deleteById
  );

  // Get product by ID
  fastify.get(
    "/:id",
    {
      schema: {
        description: "Get product by ID",
        tags: ["Products"],
        response: {
          200: zodToJsonSchema(productSchema),
        },
      },
    },
    controller.getById
  );
}

// Public product routes (no auth)
export async function productPublicRoutes(fastify, options) {
  fastify.get(
    "/",
    {
      schema: {
        description: "List all products",
        tags: ["Products"],
        response: {
          200: z.array(productSchema).transform(zodToJsonSchema),
        },
      },
    },
    controller.get
  );
}
