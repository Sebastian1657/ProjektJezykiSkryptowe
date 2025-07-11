import { Issuer as OpenIDClientIssuer } from 'openid-client';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_CALLBACK_URL } from '$env/static/private'; // Use private for server-only secrets

/** @type {import('openid-client').Issuer | null} */
let auth0IssuerInstance = null;
export async function getAuth0Issuer() {
    if (!auth0IssuerInstance) {
        if (!AUTH0_DOMAIN) throw new Error('AUTH0_DOMAIN not set');
        try {
            if (!OpenIDClientIssuer) throw new Error("Issuer class could not be resolved.");
            console.log('Attempting Issuer.discover...');
            auth0IssuerInstance = await OpenIDClientIssuer.discover(`https://${AUTH0_DOMAIN}/`);
            console.log('Issuer discovered successfully.');
        } catch (error) {
            console.error("Error discovering Auth0 Issuer:", error);
            throw new Error(`Could not discover Auth0 issuer at ${AUTH0_DOMAIN}`);
        }
    }
    return auth0IssuerInstance;
}

export async function getAuth0Client() {
    const issuer = await getAuth0Issuer();
    if (!issuer) {
        throw new Error("Failed to get Auth0 Issuer instance.");
    }
    return new issuer.Client({
        client_id: AUTH0_CLIENT_ID,
        client_secret: AUTH0_CLIENT_SECRET,
        redirect_uris: [AUTH0_CALLBACK_URL],
        response_types: ['code']
    });
}