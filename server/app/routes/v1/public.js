import { categoryPublicRoutes } from "../../api/category/routes.js";
import { productPublicRoutes } from "../../api/products/routes.js";

export default async function routes(fastify, options) {
  fastify.register(productPublicRoutes, { prefix: "products" });
  fastify.register(categoryPublicRoutes, { prefix: "categories" });
}
