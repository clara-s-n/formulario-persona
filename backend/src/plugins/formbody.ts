import fp from "fastify-plugin";
import fb from "@fastify/formbody";

export default fp(async (fastify) => {
  fastify.register(fb);
});
