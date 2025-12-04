"use strict";
import { multipartPreHandler } from "../../middlewares/multipart-prehandler.js";
import controller from "./controller.js";

export default async function routes(fastify, options) {
  // Create product
  fastify.post(
    "/",
    {
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
  fastify.delete("/:id", controller.deleteById);

  // Get product by ID
  fastify.get("/:id", {}, controller.getById);
}

// Public product routes (no auth)
export async function productPublicRoutes(fastify, options) {
  fastify.get("/", {}, controller.get);
}
