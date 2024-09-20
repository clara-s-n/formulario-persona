import fp from "fastify-plugin";
import estatico from "@fastify/static";
import { join } from "node:path";

export default fp(async (fastify) => {
  fastify.register(estatico, {
    root: join(process.cwd(), "public"),
    prefix: "/public/",
  });
});
