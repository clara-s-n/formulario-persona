import { Static, Type } from "@sinclair/typebox";

// Expresión regular para la contraseña
// const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_-])[A-Za-z\d!@#$%^&*_-]{8,20}$/;

// Expresión regular para el formato de cédula
const cedulaRegex = /^[1-9]{1}\.[0-9]{3}\.[0-9]{3}-[0-9]{1}$/;

// Expresión regular para el formato del RUT
const rutRegex = /^\d{12}$/;

const FileSchema = Type.Object(
    {
        type: Type.Literal("file"),
        fieldname: Type.String(),
        filename: Type.String(),
        encoding: Type.String(),
        mimetype: Type.String(),
        file: Type.Object({}), // Para manejar el FileStream
        _buf: Type.Object({}), // Buffer del archivo
    },
    { additionalProperties: false }
);

export const nameSchema = Type.Object(
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
);

const emailSchema = Type.Object(
    {
        type: Type.Literal("field"),
        fieldname: Type.String(),
        mimetype: Type.String(),
        encoding: Type.String(),
        value: Type.String(),
        fieldnameTruncated: Type.Boolean(),
        valueTruncated: Type.Boolean(),
    },
    { additionalProperties: false },
);

export const PersonaSchema = Type.Object({
    id: Type.Number(),
    name: Type.String({ minLength: 2, maxLength: 50 }),
    lastname: Type.String({ minLength: 2, maxLength: 50 }),
    email: Type.String({ type: 'string', format: 'email' }),
    countryId: Type.String({ pattern: cedulaRegex.source }),
    rut: Type.String({ pattern: rutRegex.source }),
    imageUrl: Type.Optional(Type.String()),
});

export const PersonaPostSchema = Type.Object({
/*    password: Type.Optional(Type.String({
        minLength: 8,
        maxLength: 20,
        pattern: passwordRegex.source,
    })),

  // Se valida la cedula en base a la expresión de antes
    countryId: Type.String({
        pattern: cedulaRegex.source,
    }),

      // Acá la validación para el nombre y apellido
    name: Type.String({ minLength: 2, maxLength: 50 }),
    lastname: Type.String({ minLength: 2, maxLength: 50 }),

      // Acá la validación para el email
    email: Type.String({ type: 'string', format: 'email' }),

      // Acá la validación para el rut
    rut: Type.String({ pattern: rutRegex.source }),*/

    name: nameSchema,
    email: emailSchema,
    foto: FileSchema,
    countryId: nameSchema,
    rut: nameSchema,
    password: nameSchema,
    lastname: nameSchema,
});



export const PersonaPutSchema = Type.Object({
    name: Type.Optional(nameSchema),
    lastname: Type.Optional(nameSchema),
    email: Type.Optional(nameSchema),
    countryId: Type.Optional(nameSchema),
    rut: Type.Optional(nameSchema),
    password: Type.Optional(nameSchema),
    foto: Type.Optional(FileSchema),
});

export const PersonaIdSchema = Type.Object({
    id: Type.Number(),
});

export type PersonaIdType = Static<typeof PersonaIdSchema>;
export type PersonaType = Static<typeof PersonaSchema>;
export type PersonaPostType = Static<typeof PersonaPostSchema>;
export type PersonaPutType = Static<typeof PersonaPutSchema>;
export type NameSchemaType = Static<typeof nameSchema>;