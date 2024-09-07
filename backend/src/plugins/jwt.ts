import jwt, {FastifyJWTOptions} from "@fastify/jwt";
import fp from "fastify-plugin";
import {FastifyReply, FastifyRequest} from "fastify";

const jwtOptions: FastifyJWTOptions = {
    secret:'supersecret'
};

export default fp<FastifyJWTOptions>(async (fastify) => {
    fastify.register(jwt, jwtOptions);
    fastify.decorate("authenticate", async function (request: FastifyRequest, reply: FastifyReply) {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });
});