import fastifyOauth2 from "@fastify/oauth2";
import {FastifyReply, FastifyRequest} from "fastify";


export interface authenticateFunction{
    (request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

declare module "fastify" {
    interface FastifyInstance {
        authenticate: authenticateFunction;
        verifyUserId: authenticateFunction;
        googleOAuth2: fastifyOauth2.OAuth2Namespace
    }
}

export default authenticateFunction;