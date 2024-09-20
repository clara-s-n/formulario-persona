import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance.js";
import {
  PersonaIdSchema,
  PersonaPutSchema,
  PersonaPutType,
  PersonaPostType,
  PersonaPostSchema
} from "../../tipos/persona.js";
import { validateCedula } from "../../validations/idAlgorithm.js";
import { validateRut } from "../../validations/rutAlgorithm.js";
import { query } from "../../services/database.js";
import * as path from "path";
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';

// Definición del plugin de ruta
const personaRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {

  fastify.post("/", {
    schema: {
      tags: ["persona"],
      consumes: ["multipart/form-data"],
      body: PersonaPostSchema,
    },
    preHandler: [validateCedula, validateRut],
    handler: async function (request, reply) {
      const personaPost = request.body as PersonaPostType;
      const imageFile = await request.file();

      let imageUrl = '';
      if (imageFile) {
        const uploadPath = path.join(process.cwd(), "public", imageFile.filename);
        await pipeline(
            imageFile.file,
            createWriteStream(uploadPath)
        );
        imageUrl = `/public/${imageFile.filename}`;
      }

      // Extract actual values from form fields
      const name = personaPost.name.value;
      const lastname = personaPost.lastname.value;
      const email = personaPost.email.value;
      const countryId = personaPost.countryId.value;
      const rut = personaPost.rut.value;
      const password = personaPost.password.value;

      // Use parameterized query
      const res = await query(
          `INSERT INTO personas
       (name, lastname, email, countryId, rut, password, image_path)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id;`,
          [name, lastname, email, countryId, rut, password, imageUrl]
      );

      if (res.rowCount === 0) {
        reply.code(404).send({ message: "Failed to insert persona" });
        return;
      }

      const id = res.rows[0].id;
      reply.code(201).send({
        id,
        name,
        lastname,
        email,
        countryId,
        rut,
        imageUrl
      });
    }
  });

  // Ruta para obtener todas las personas
  fastify.get("/", {
    schema: {
      tags: ["persona"]
    },
    onRequest: fastify.authenticate,
    handler: async function (request, reply) {
      const res = await query(`select
        id,
        name,
        lastname,
        email,
        countryId,
        rut,
        image_path
        from personas`);
      if (res.rows.length === 0) {
        reply.code(404).send({ message: "No hay personas registradas" });
        return;
      }
      return res.rows;
    }
  });

  // Ruta para eliminar una persona
  fastify.delete("/:id", {
    schema: {
      tags: ["persona"],
      params: PersonaIdSchema,
    },
    // Verificamos que se autentique y que sea el mismo id
    onRequest: fastify.verifyUserId,
    handler: async function (request, reply) {
      const { id } = request.params as { id: string };
      // Eliminamos la persona de la base de datos
        const res = await query(`delete from personas where id = ${id};`);
        if (res.rowCount === 0) {
          reply.code(404).send({message: "Persona no encontrada"});
          return;
        }
        reply.code(200).send({ message: "Persona eliminada", id });
    }
  });

  fastify.put("/:id", {
    schema: {
      tags: ["persona"],
      params: PersonaIdSchema,
      body: PersonaPutSchema,
    },
    onRequest: fastify.verifyUserId,
    preHandler: [validateCedula, validateRut],
    handler: async function (request, reply) {
      const { id } = request.params as { id: string };
      const personaPut = request.body as PersonaPutType;
      const imageFile = await request.file();

      let imageUrl = null;
      if (imageFile) {
        const uploadPath = path.join(process.cwd(), "public", imageFile.filename);
        await pipeline(
            imageFile.file,
            createWriteStream(uploadPath)
        );
        imageUrl = `/public/${imageFile.filename}`;
      }

      // Construir objeto de actualización y lista de parámetros
      const updates = [];
      const params = [];
      let paramIndex = 1;

      const getFieldValue = (field: { value?: string } | string): string => {
        return typeof field === 'object' && field.value ? field.value : field as string;
      };

      if (personaPut.name) {
        updates.push(`name = $${paramIndex}`);
        params.push(getFieldValue(personaPut.name));
        paramIndex++;
      }
      if (personaPut.lastname) {
        updates.push(`lastname = $${paramIndex}`);
        params.push(getFieldValue(personaPut.lastname));
        paramIndex++;
      }
      if (personaPut.email) {
        updates.push(`email = $${paramIndex}`);
        params.push(getFieldValue(personaPut.email));
        paramIndex++;
      }
      if (personaPut.countryId) {
        updates.push(`countryId = $${paramIndex}`);
        params.push(getFieldValue(personaPut.countryId));
        paramIndex++;
      }
      if (personaPut.rut) {
        updates.push(`rut = $${paramIndex}`);
        params.push(getFieldValue(personaPut.rut));
        paramIndex++;
      }
      if (imageUrl !== null) {
        updates.push(`image_path = $${paramIndex}`);
        params.push(imageUrl);
        paramIndex++;
      }

      // Si no hay actualizaciones, devolver un error
      if (updates.length === 0) {
        reply.code(400).send({ message: "No se proporcionaron campos para actualizar" });
        return;
      }

      // Construir y ejecutar la consulta
      const updateQuery = `
      UPDATE personas
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *;
    `;
      params.push(id);

      try {
        const res = await query(updateQuery, params);

        if (res.rowCount === 0) {
          reply.code(404).send({ message: "Persona no encontrada" });
          return;
        }

        reply.code(200).send(res.rows[0]);
      } catch (error) {
        console.error('Error al actualizar persona:', error);
        reply.code(500).send({ message: "Error interno del servidor al actualizar la persona" });
      }
    }
  });

  // Ruta para ver los datos de una persona específica
  fastify.get("/:id", {
    schema: {
      tags: ["persona"],
      params: PersonaIdSchema,
    },
    onRequest: fastify.authenticate,
    handler: async function (request, reply) {
      const { id } = request.params as { id: string };
      const res = await query(`select 
        id,
        name,
        lastname,
        email,
        countryId,
        rut,
        image_path
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