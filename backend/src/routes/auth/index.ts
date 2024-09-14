import {FastifyPluginAsync} from "fastify";

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.post("/login", {
        schema: {
            tags: ["auth"],
            body: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: {type: "string", format: "email"},
                    password: {type: "string"},
                },
            },
        },
        handler: async function (request, reply) {
            const {email, password} = request.body as {
                email: string,
                password: string
            };
            if (email !== "ana.correo@gmail.com" || password !== "Aws-4321") {
                return reply.unauthorized("Invalid email or password");
            }
            const token = fastify.jwt.sign({
                email,
                id: 1,
                roles: ["admin", "user"],
            });
            reply.send({token});
        }
    });
}

export default auth;