import { redirect } from '@sveltejs/kit';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID, APP_BASE_URL } from '$env/static/private';

export async function GET({ cookies }) {
    cookies.delete('user_session', {path: '/'});

    const logOutUrl = new URL(`https://${AUTH0_DOMAIN}/v2/logout`);
    logOutUrl.searchParams.set('client_id', AUTH0_CLIENT_ID);
    logOutUrl.searchParams.set('returnTo', `${APP_BASE_URL}/wylogowano`);

    return redirect(302, logOutUrl.toString());
}