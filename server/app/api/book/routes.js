"use strict";
import { multipartPreHandler } from "../middlewares/multipart-prehandler.js";
import controller from "./controller.js";

export default async function routes(fastify, options) {
  fastify.post(
    "/",
    {
      preHandler: async (req, res) =>
        multipartPreHandler(req, res, ["related_books"]),
    },
    controller.create
  );
  fastify.put(
    "/:id",
    {
      preHandler: async (req, res) =>
        multipartPreHandler(req, res, ["related_books", "picture_urls"]),
    },
    controller.updateById
  );
  fastify.delete("/:id", {}, controller.deleteById);
  fastify.get("/:id", {}, controller.getById);
}

export async function bookPublicRoutes(fastify, opt) {
  fastify.get("/", {}, controller.get);
}
