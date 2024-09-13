
import oauthPlugin, { FastifyOAuth2Options } from "@fastify/oauth2";
import fp from "fastify-plugin";

export default fp(async (fastify) => {
    const googleOAuth2Options: FastifyOAuth2Options = {
        name: "googleOAuth2",
        scope: ["profile", "email"],
        credentials: {
            client: {
                id: process.env.GOOGLE_ID || "",
                secret: process.env.GOOGLE_SECRET || "",
            },
            auth: oauthPlugin.fastifyOauth2.GOOGLE_CONFIGURATION,
        },
        startRedirectPath: "/auth/login/google",
        callbackUri: `https://${process.env.FRONT_URL}/backend/auth/login/google/callback`,
        callbackUriParams: {
            // custom query param that will be passed to callbackUri
            access_type: "offline", // will tell Google to send a refreshToken too
        },
        pkce: "S256",
    };

    fastify.register(oauthPlugin.fastifyOauth2, googleOAuth2Options);
});