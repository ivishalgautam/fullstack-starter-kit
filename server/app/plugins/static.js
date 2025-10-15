import fp from "fastify-plugin";
import fastifyStatic from "@fastify/static";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default fp(async (fastify) => {
  await fastify.register(fastifyStatic, {
    root: join(process.cwd(), "public"),
  });
});
