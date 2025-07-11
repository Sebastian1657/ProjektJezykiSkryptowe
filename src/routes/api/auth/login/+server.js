import { redirect } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import { getAuth0Client } from '$lib/server/auth.js';

export async function GET({ cookies }) {
    const client = await getAuth0Client();
    const state = nanoid();

    const authUrl = client.authorizationUrl({
        scope: 'openid profile email',
        response_mode: 'query',
        state: state,
        prompt: 'login'
    });

    cookies.set('auth_state', state, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600,
        sameSite: 'lax'
    });
    throw redirect(302, authUrl);
}