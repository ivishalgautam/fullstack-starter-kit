import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export default fp(async (fastify) => {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "CarKhana API",
        description: "API documentation for CarKhana backend",
        version: "1.0.0",
      },
      servers: [{ url: "http://localhost:3001", description: "Local server" }],
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: "/docs",
    exposeRoute: true,
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
  });
});
