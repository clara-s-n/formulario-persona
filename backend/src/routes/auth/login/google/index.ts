import { FastifyPluginAsync } from 'fastify';
import { query } from '../../../../services/database.js'
const googleAuth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    // Endpoint de callback después del login exitoso
    fastify.get('/callback', {
        handler: async function (request, reply) {
            try {

                const googletoken = await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

                const userinfo = await fastify.googleOAuth2.userinfo(googletoken.token.access_token);

                // Para facilitar el llamado de las propiedades del objeto lo procesamos de json a string y viceversa.
                const userinfoString = JSON.stringify(userinfo);

                // Parsear la cadena JSON de nuevo a un objeto
                const parsedUserinfo = JSON.parse(userinfoString);

                // Acceder a las propiedades del usuario
                const email = parsedUserinfo.email;
                //const given_name = parsedUserinfo.given_name;
                //const family_name = parsedUserinfo.family_name

                // Consulta a la base de datos
                const res = await query(`select id, email, password from personas where email = '${email}'`);

                if (res.rows.length === 0) {
                    reply.redirect('https://localhost/');
                    return;
                  }
                //const user = res.rows[0];
                //const token = fastify.jwt.sign({ id: user.id, email: user.email });
                reply.redirect('https://localhost/peopleList')


            } catch (error) {
                console.error('Error al obtener el token de acceso:', error);
                reply.status(500).send({ error: 'Error al procesar la autenticación' });
            }
        }
    });
}

export default googleAuth;