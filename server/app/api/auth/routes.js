"use strict";
import controller from "./controller.js";
import userController from "../users/controller.js";

export default async function routes(fastify, options) {
  fastify.addHook("preHandler", async (request, reply) => {
    if (request.body) console.log("body", request.body);
  });

  fastify.post(
    "/login",
    {
      schema: {
        description: "Login with email and password",
        tags: ["Auth"],
      },
    },
    controller.verifyUserCredentials
  );

  fastify.post(
    "/register",
    {
      schema: {
        description: "Register new user",
        tags: ["Auth"],
      },
    },
    controller.register
  );

  fastify.post(
    "/login-request",
    {
      schema: {
        description: "Request login OTP / token",
        tags: ["Auth"],
      },
    },
    controller.loginRequest
  );

  fastify.post(
    "/login-verify",
    {
      schema: {
        description: "Verify login OTP / token",
        tags: ["Auth"],
      },
    },
    controller.loginVerify
  );

  fastify.post(
    "/register-request",
    {
      schema: {
        description: "Request register OTP / token",
        tags: ["Auth"],
      },
    },
    controller.registerRequest
  );

  fastify.post(
    "/register-verify",
    {
      schema: {
        description: "Verify register OTP / token",
        tags: ["Auth"],
      },
    },
    controller.registerVerify
  );

  fastify.post(
    "/refresh",
    {
      schema: {
        description: "Verify refresh token and get new access token",
        tags: ["Auth"],
      },
    },
    controller.verifyRefreshToken
  );

  fastify.post(
    "/username",
    {
      schema: {
        description: "Check if username is available",
        tags: ["Auth"],
      },
    },
    userController.checkUsername
  );

  fastify.post(
    "/:token",
    {
      schema: {
        description: "Reset user password",
        tags: ["Auth"],
        params: {
          type: "object",
          properties: {
            token: { type: "string" },
          },
          required: ["token"],
        },
      },
    },
    userController.resetPassword
  );
}
