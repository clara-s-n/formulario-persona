import { FastifyPluginAsync } from "fastify";

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    const queryString = request.query;
    console.log({ queryString });
    reply.redirect("http://localhost");
  });
};

export default example;