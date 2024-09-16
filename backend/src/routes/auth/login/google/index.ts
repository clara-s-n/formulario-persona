import { FastifyPluginAsync } from 'fastify';

const googleAuth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    // Endpoint de callback después del login exitoso
    fastify.get('/callback', {
        handler: async function (request, reply) {
            try {

                const token = await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
    
                //console.log(`access_token: ${token.token.access_token}`);

                const userinfo = await fastify.googleOAuth2.userinfo(token.token.access_token)

                reply.send({ 
                    access_token: token.token.access_token,
                    user_info: userinfo
                 });
                
            } catch (error) {
                console.error('Error al obtener el token de acceso:', error);
                reply.status(500).send({ error: 'Error al procesar la autenticación' });
            }
        }
    });
}

export default googleAuth;