import { Static, Type } from "@sinclair/typebox";

// Expresión regular para la contraseña
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_-])[A-Za-z\d!@#$%^&*_-]{8,20}$/;

// Expresión regular para el formato de cédula
const cedulaRegex = /^[1-9]{1}\.[0-9]{3}\.[0-9]{3}-[0-9]{1}$/;

// Expresión regular para el formato del RUT
const rutRegex = /^\d{12}$/;

export const PersonaSchema = Type.Object({
  id: Type.Number(),
  name: Type.String({ minLength: 2, maxLength: 50 }),
  lastname: Type.String({ minLength: 2, maxLength: 50 }),
  email: Type.String({ type: 'string', format: 'email' }),
  countryId: Type.String({ pattern: cedulaRegex.source }),
  rut: Type.String({ pattern: rutRegex.source }),
});

export const PersonaPostSchema = Type.Object({
  password: Type.String({
    minLength: 8,
    maxLength: 20,
    pattern: passwordRegex.source,
  }),

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
  rut: Type.String({ pattern: rutRegex.source }),

});

export const PersonaPutSchema = Type.Object({
    name: Type.Optional(Type.String({ minLength: 2, maxLength: 50 })),
    lastname: Type.Optional(Type.String({ minLength: 2, maxLength: 50 })),
    email: Type.Optional(Type.String({ type: 'string', format: 'email' })),
    countryId: Type.Optional(Type.String({ pattern: cedulaRegex.source })),
    rut: Type.Optional(Type.String({ pattern: rutRegex.source })),
    password: Type.Optional(Type.String()),
});

export type PersonaType = Static<typeof PersonaSchema>;
export type PersonaPostType = Static<typeof PersonaPostSchema>;
export type PersonaPutType = Static<typeof PersonaPutSchema>;