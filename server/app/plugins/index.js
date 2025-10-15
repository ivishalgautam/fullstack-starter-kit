import security from "./security.js";
import cors from "./cors.js";
import cookie from "./cookie.js";
import formbody from "./formbody.js";
import multipart from "./multipart.js";
import staticFiles from "./static.js";
import swagger from "./swagger.js";
import db from "./db.js";
import rateLimit from "./rate-limit.js";
import routes from "../routes/v1/index.js";
import publicRoutes from "../routes/v1/public.js";
import authRoutes from "../api/auth/routes.js";

import { ErrorHandler } from "../utils/error-handler.js";

export default async function registerPlugins(app) {
  app.setErrorHandler(ErrorHandler);
  await app.register(rateLimit);
  await app.register(security);
  await app.register(cors);
  await app.register(cookie);
  await app.register(formbody);
  await app.register(multipart);
  await app.register(staticFiles);
  await app.register(swagger);
  await app.register(db);
  await app.register(publicRoutes, { prefix: "v1" });
  await app.register(authRoutes, { prefix: "v1" });
  await app.register(routes, { prefix: "v1" });
}
