import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance.js";
import { PersonaType, PersonaPostSchema, PersonaPostType } from "../../tipos/persona.js";

// Lista inicial de personas
const personas: PersonaType[] = [
  {
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan.perez@example.com",
    cedula: "3.456.789-0",
    rut: "123456789123",
  },
];

// Definición del plugin de ruta
const personaRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {
  // Ruta para obtener todas las personas
  fastify.get("/", {
    handler: async function (request, reply) {
      return personas;
    },
  });

  // Ruta para crear una nueva persona
  fastify.post("/", {
    schema: {
      body: PersonaPostSchema.valueOf(), // Usar .valueOf() para obtener el esquema JSON Schema compatible
    },
    handler: async function (request, reply) {
      const personaPost = request.body as PersonaPostType;
      personas.push(personaPost);
      return personaPost;
    },
  });
};

export default personaRoute;
