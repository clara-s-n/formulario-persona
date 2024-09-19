import fp from "fastify-plugin";
import multipart from "@fastify/multipart";

export default fp(async (fastify) => {
  fastify.register(multipart, {
    limits: {
      fieldNameSize: 100, // Max field name size in bytes
      fieldSize: 100, // Max field value size in bytes
      fields: 10, // Max number of non-file fields
      fileSize: 5000000, // For multipart forms, the max file size in bytes
      files: 1, // Max number of file fields
      headerPairs: 100, // Max number of header key=>value pairs
      parts: 100, // For multipart forms, the max number of parts (fields + files)
    },
    attachFieldsToBody: true,
    sharedSchemaId: "#multiPartSchema",
  });
});
