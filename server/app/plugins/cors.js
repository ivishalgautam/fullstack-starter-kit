import fp from "fastify-plugin";
import cors from "@fastify/cors";
import constants from "../lib/constants/index.js";

export default fp(async (fastify) => {
  await fastify.register(cors, {
    origin: constants.allowedOrigins,
    credentials: true,
  });
});
