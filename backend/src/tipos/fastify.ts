import {FastifyReply, FastifyRequest} from "fastify";

export interface authenticateFunction{
    (request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

declare module "fastify" {
    interface FastifyInstance {
        authenticate: authenticateFunction;
    }
}