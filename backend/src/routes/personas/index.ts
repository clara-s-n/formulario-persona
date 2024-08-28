import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance.js";
import { PersonaType } from "../../tipos/persona.js";

const personas: PersonaType[] = [
  {
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan.perez@example.com",
    cedula: "3.456.789-0",
    rut: "123456789123",
  },
];

const personaRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {
  fastify.get("/", {
    handler: async function (request, reply) {
      return personas;
    },
  });

  fastify.post("/", {
    handler: async function (request, reply) {
      const personaPost = request.body as PersonaType;
      personas.push(personaPost);
      return personaPost;
    },
  });
};

export default personaRoute;
