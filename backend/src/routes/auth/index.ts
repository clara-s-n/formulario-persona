import { FastifyPluginAsync } from "fastify";
import { query } from '../../services/database.js';
import bcrypt from 'bcryptjs';

const authRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/login', {
    schema: {
      tags: ['auth'],
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string' },
          password: { type: 'string' }
        }
      }
    },
    handler: async (request, reply) => {
      const { email, password } = request.body as { email: string, password: string };
      const res = await query(`select id, email, password, name, lastname from personas where email = '${email}'`);
      if (res.rows.length === 0) {
        reply.code(404).send({ message: 'Usuario no encontrado' });
        return;
      }
      const user = res.rows[0];
      if (!await bcrypt.compare(password, user.password)) {
        reply.code(401).send({ message: 'Contraseña incorrecta' });
        return;
      }

      const token = fastify.jwt.sign({ id: user.id }, { expiresIn: '1h' });

      reply.send({ success: true, token, id: user.id, user: `${user.name} ${user.lastname}` });
    }
  });
};

export default authRoute;