import jwt, { FastifyJWTOptions } from "@fastify/jwt";
import fp from "fastify-plugin";
import { FastifyReply, FastifyRequest } from "fastify";
import { authenticateFunction } from '../tipos/fastify.js';

const jwtOptions: FastifyJWTOptions = {
    secret: 'supersecret'
};

export default fp(async (fastify) => {
    fastify.register(jwt, jwtOptions);

    const authenticate: authenticateFunction = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.code(401).send({ error: 'Unauthorized' });
        }
    };

    fastify.decorate("authenticate", authenticate);

    // Verificamos que el usuario logueado es el mismo que el usuario que se quiere modificar
    const verifyUserId: authenticateFunction = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify();
            const { id } = request.params as { id: string };
            const { id: userId } = request.user as { id: string };
            if (String(id) !== String(userId)) {
                reply.code(401).send({ error: 'You can not modify other users' });
            }
        } catch (err) {
            reply.code(401).send({ error: 'Unauthorized' });
        }
    }

    fastify.decorate("verifyUserId", verifyUserId);
});
