import { FastifyPluginAsync } from "fastify";

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post("/", async function (request, reply) {
    const body = request.body;
    console.log({ body });
    return body;
  });
};

export default example;
