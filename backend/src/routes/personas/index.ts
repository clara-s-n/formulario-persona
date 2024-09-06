import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance.js";
import { PersonaPutSchema, PersonaPutType, PersonaPostType, PersonaPostSchema  } from "../../tipos/persona.js";
import { validateCedula } from "../../validations/idAlgorithm.js";
import { validateRut } from "../../validations/rutAlgorithm.js";
import { query } from "../../services/database.js";

// Definición del plugin de ruta
const personaRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {
  // Ruta para obtener todas las personas
  fastify.get("/", {
    handler: async function (request, reply) {
      const res = await query(`select
        id,
        name,
        lastname,
        email,
        countryId,
        rut
        from personas`);
      if (res.rows.length === 0) {
        reply.code(404).send({ message: "No hay personas registradas" });
        return;
      }
      return res.rows;
  }});

  // Ruta para crear una nueva persona
  fastify.post("/", {
    schema: {
      body: PersonaPostSchema,
    },
    preHandler: [validateCedula, validateRut],
    handler: async function (request, reply) {
      const personaPost = request.body as PersonaPostType;
      // Ahora lo conectamos a la base de datos
        const res = await query(`insert into personas
            (name, lastname, email, countryId, rut, password)
            values
            ('${personaPost.name}', '${personaPost.lastname}', '${personaPost.email}', '${personaPost.countryId}', '${personaPost.rut}', '${personaPost.password}')
            returning id;`);
        const id = res.rows[0].id;
        if (res.rows.length === 0) {
            reply.code(404).send({ message: "Persona no encontrada" });
            return;
        }
        reply.code(201).send({ ...personaPost, id });
    }
  });

  // Ruta para eliminar una persona
  fastify.delete("/:id", {
    handler: async function (request, reply) {
      const { id } = request.params as { id: string };
      // Eliminamos la persona de la base de datos
        const res = await query(`delete from personas where id = ${id};`);
        if (res.rowCount === 0) {
          reply.code(404).send({message: "Persona no encontrada"});
          return;
        }
        reply.code(200).send({ message: "Persona eliminada", id });
  }});

  // Ruta para editar una persona
  fastify.put("/:id", {
    schema: {
      body: PersonaPutSchema,
    },
    preHandler: [validateCedula, validateRut],
    handler: async function (request, reply) {
      const {id} = request.params as { id: string };
      const personaPut = request.body as PersonaPutType;
      // Actualizamos la persona en la base de datos
      const res = await query(`update personas
        set name = '${personaPut.name}',
        lastname = '${personaPut.lastname}',
        email = '${personaPut.email}',
        countryId = '${personaPut.countryId}',
        rut = '${personaPut.rut}'
        where id = ${id}
        returning id;`);
        if (res.rows.length === 0) {
            reply.code(404).send({ message: "Persona no encontrada" });
            return;
        }
        reply.code(200).send({ ...personaPut, id });
    }

  });

  // Ruta para ver los datos de una persona específica
  fastify.get("/:id", {
    handler: async function (request, reply) {
      const { id } = request.params as { id: string };
      const res = await query(`select 
        id,
        name,
        lastname,
        email,
        countryId,
        rut
        from personas where id = ${id};`);

      if (res.rows.length === 0) {
        reply.code(404).send({ message: "Persona no encontrada" });
        return;
      }
      const persona = res.rows[0];
      return persona;
    },
  });
};

export default personaRoute;