import { redirect } from '@sveltejs/kit';
import { SESSION_SECRET } from '$env/static/private';
import { unsign } from 'cookie-signature';
import { connectToDatabase } from '$lib/server/database';

connectToDatabase();

const publicPaths = ['/api/auth/login', '/api/auth/callback', '/api/auth/logout', '/access-denied', '/static/favicon.png', '/wylogowano'];

export async function handle({ event, resolve }) {
    console.log(`\n--- Hooks running for: ${event.url.pathname} ---`);
    event.locals.user = null;

    const sessionCookie = event.cookies.get('user_session');

    if (sessionCookie) {
        const unsignedData = unsign(sessionCookie, SESSION_SECRET);
        if (unsignedData) {
            try {
                const userFromCookie = JSON.parse(unsignedData);
                if (userFromCookie?.exp && userFromCookie.exp * 1000 > Date.now()) {
                    event.locals.user = userFromCookie;
                } else {
                    console.log('Session expired, deleting cookie.');
                    event.cookies.delete('user_session', { path: '/' });
                }
            } catch (e) {
                console.error('Error parsing session cookie:', e);
                event.cookies.delete('user_session', { path: '/' });
            }
        } else {
            console.warn('Invalid session cookie signature.');
            event.cookies.delete('user_session', { path: '/' });
        }
    }

    const isPublicPath = publicPaths.some((path) => event.url.pathname.startsWith(path));

    if (event.locals.user) {
        if (isPublicPath && event.url.pathname !== '/api/auth/callback' && event.url.pathname !== '/api/auth/logout') {
            throw redirect(303, '/');
        }
        return resolve(event);
    }

    if (isPublicPath) {
        console.log(`Allowing access for guest to public path: ${event.url.pathname}`);
        return resolve(event);
    }

    console.log(`Redirecting unauthorized access to ${event.url.pathname} to login.`);
    throw redirect(303, `/api/auth/login`);
}