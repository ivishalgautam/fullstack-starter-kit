import { bookPublicRoutes } from "../../api/book/routes.js";
import { productPublicRoutes } from "../../api/products/routes.js";

export default async function routes(fastify, options) {
  fastify.register(productPublicRoutes, { prefix: "products" });
  fastify.register(bookPublicRoutes, { prefix: "books" });
}
