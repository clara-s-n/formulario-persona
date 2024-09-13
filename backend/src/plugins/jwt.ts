import jwt, { FastifyJWTOptions } from "@fastify/jwt";
import fp from "fastify-plugin";
import { FastifyReply, FastifyRequest } from "fastify";
import { authenticateFunction } from '../tipos/fastify.js';

const jwtOptions: FastifyJWTOptions = {
    secret: 'supersecret'
};

export default fp<FastifyJWTOptions>(async (fastify) => {
    fastify.register(jwt, jwtOptions);

    const authenticate: authenticateFunction = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.code(401).send({ error: 'Unauthorized' });
        }
    };

    fastify.decorate("authenticate", authenticate);
});
