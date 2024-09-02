import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance.js";
import { PersonaType, PersonaPostSchema, PersonaPostType } from "../../tipos/persona.js";
import { validateCedula } from "../../validations/idAlgorithm.js";
import { validateRut } from "../../validations/rutAlgorithm.js";

// Lista inicial de personas
const personas: PersonaType[] = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan.perez@example.com",
    cedula: "3.456.789-0",
    rut: "123456789123",
  },
  {
    id: 2,
    nombre: "María",
    apellido: "González",
    email: "maria.perez@example.com",
    cedula: "4.567.890-1",
    rut: "234567890234",
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
      if (personas.length === 0) {
        reply.code(404).send({ message: "No hay personas registradas" });
        return;
      }
      return personas;
    },

  });

  // Ruta para crear una nueva persona
  fastify.post("/", {
    schema: {
      body: PersonaPostSchema,
    },
    preHandler: [validateCedula, validateRut],
    handler: async function (request, reply) {
      const personaPost = request.body as PersonaPostType;
      const id = personas.length + 1;
      personaPost.id = id;
      personas.push(personaPost);
      if (!personaPost.id) {
        reply.code(500).send({ message: "No se pudo crear la persona" });
        return;
      }
      return personaPost;
    },
  });

  // Ruta para eliminar una persona
  fastify.delete("/:id", {
    handler: async function (request, reply) {
      const { id } = request.params as { id: string };
      const index = personas.findIndex((p) => p.id === parseInt(id));
      if (index === -1) {
        reply.code(404).send({ message: "Persona no encontrada" });
        return;
      }
      const deletedPerson = personas.splice(index, 1)[0];
      return { message: "Persona eliminada", deletedPerson };
    },
  });

  // Ruta para editar una persona
  fastify.put("/:id", {
    schema: {
      body: PersonaPostSchema,
    },
    preHandler: [validateCedula, validateRut],
    handler: async function (request, reply) {
      const { id } = request.params as { id: string };
      const updatedPersona = request.body as PersonaPostType;
      const index = personas.findIndex((p) => p.id === parseInt(id));
      if (index === -1) {
        reply.code(404).send({ message: "Persona no encontrada" });
        return;
      }
      personas[index] = { ...personas[index], ...updatedPersona, id: parseInt(id) };
      return personas[index];
    },
  });

  // Ruta para ver los datos de una persona específica
  fastify.get("/:id", {
    handler: async function (request, reply) {
      const { id } = request.params as { id: string };
      const persona = personas.find((p) => p.id === parseInt(id));
      if (!persona) {
        reply.code(404).send({ message: "Persona no encontrada" });
        return;
      }
      return persona;
    },
  });
};

export default personaRoute;