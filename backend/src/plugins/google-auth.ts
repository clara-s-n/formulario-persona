import oauthPlugin, { FastifyOAuth2Options } from '@fastify/oauth2';
import fp from 'fastify-plugin';

export default fp(async (fastify ) => {
    const googleOAuth20ptions: FastifyOAuth2Options = {
        name: 'googleOAuth2',
        scope: ['profile', 'email'],
        credentials: {
            client: {
                id: process.env.GOOGLE_CLIENT_ID || '',
                secret: process.env.GOOGLE_CLIENT_SECRET || '',
            },
            auth: oauthPlugin.fastifyOauth2.GOOGLE_CONFIGURATION,
        },
        startRedirectPath: '/auth/login/google',
        callbackUri: `https://${process.env.FRONT_URL}/backend/auth/login/google/callback`,
        callbackUriParams: {
            // custom query param that will be passed to callbackUri
            access_type: 'offline', // will tell Google to send a refreshToken too
        },
        pkce: 'S256',
        // check if your provider supports PKCE,
        // in case they do,
        // use of this parameter is highly encouraged
        // in order to prevent authorization code interception attacks
    };
    fastify.register(oauthPlugin.fastifyOauth2, googleOAuth20ptions);
});