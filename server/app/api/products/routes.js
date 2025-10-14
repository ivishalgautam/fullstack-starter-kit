"use strict";
import { multipartPreHandler } from "../../middlewares/multipart-prehandler.js";
import controller from "./controller.js";

export default async function routes(fastify, options) {
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
  fastify.delete("/:id", {}, controller.deleteById);
  fastify.get("/:id", {}, controller.getById);
}

export async function productPublicRoutes(fastify, opt) {
  fastify.get("/", {}, controller.get);
}
