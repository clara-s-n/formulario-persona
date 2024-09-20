import { Static, Type } from "@sinclair/typebox";
import { FastifyPluginAsync } from "fastify";
import { FastifyInstance } from "fastify/types/instance.js";
import { join } from "path";
import { writeFileSync } from "fs";

const FormSchema = Type.Object(
  {
    nombre: Type.Object(
      {
        type: Type.Literal("field"),
        fieldname: Type.String(),
        mimetype: Type.String(),
        encoding: Type.String(),
        value: Type.String(),
        fieldnameTruncated: Type.Boolean(),
        valueTruncated: Type.Boolean(),
      },
      { additionalProperties: false }
    ),
    email: Type.Object(
      {
        type: Type.Literal("field"),
        fieldname: Type.String(),
        mimetype: Type.String(),
        encoding: Type.String(),
        value: Type.String(),
        fieldnameTruncated: Type.Boolean(),
        valueTruncated: Type.Boolean(),
      },
      { additionalProperties: false }
    ),
    foto: Type.Object(
      {
        type: Type.Literal("file"),
        fieldname: Type.String(),
        filename: Type.String(),
        encoding: Type.String(),
        mimetype: Type.String(),
        file: Type.Object({}), // Para manejar el FileStream
        _buf: Type.Object({}),
      },
      { additionalProperties: false }
    ),
  },
  { additionalProperties: false }
);

type Formulario = Static<typeof FormSchema>;

const example: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts
): Promise<void> => {
  fastify.post("/", {
    schema: {
      consumes: ["multipart/form-data"],
      body: FormSchema,
    },
    handler: async function (request, reply) {
      const body = request.body as Formulario;
      console.log({ body });
      const fileBuffer = body.foto._buf as Buffer;
      const filename = join(process.cwd(), "public", body.foto.filename);
      writeFileSync(filename, fileBuffer);
      return body;
    },
  });
};

export default example;
