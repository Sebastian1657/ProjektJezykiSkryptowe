import { error, redirect, isRedirect } from '@sveltejs/kit';
import { getAuth0Client } from '$lib/server/auth.js';
import { AUTH0_CALLBACK_URL, SESSION_SECRET, APP_BASE_URL } from '$env/static/private'; // Potrzebujemy sekretu sesji
import { sign } from 'cookie-signature';
import User from '$lib/server/models/User.js';

export async function GET({ url, cookies }) {
    const client = await getAuth0Client();
    const storedState = cookies.get('auth_state');
    cookies.delete('auth_state', { path: '/' });

    const params = client.callbackParams(url.toString());

    if (!storedState || storedState !== params.state) {
        console.error('State mismatch error:', { storedState, receivedState: params.state });
        throw error(400, 'State mismatch error. Possible CSRF attack.');
    }

    try {
        const tokenSet = await client.callback(
            AUTH0_CALLBACK_URL,
            params,
            { state: storedState }
        );

        const claims = tokenSet.claims();
        console.log('Auth0 Claims:', claims);
        const namespace = 'http://sebastianmiler/';
        const isNewUser = claims[`${namespace}is_new_user`] === true;
        let userInDb;
        console.log(User.collection.findOne({ sub: claims.sub }));
        if (isNewUser){
            console.log(`New user detected (sub: ${claims.sub}): creating account in DB.`);
            try{
                userInDb = new User({
                    sub: claims.sub,
                    email: claims.email,
                    name: claims.nickname,
                    surname: null,
                    dateOfBirth: null,
                    favoriteColor: '#FF0000',
                    picture: claims.picture,
                    role: 'user',
                    accountCreated: new Date(),
                    lastLogin: new Date(),
                    isActive: true
                });
                // @ts-ignore
                await userInDb.save();
                console.log('New user created in DB.');
            } catch (dbError) {
                console.error('Failed to create new user in DB:', dbError);
                redirect(302, '/api/auth/login')
            }
        }else{
            if(isNewUser && userInDb){
                console.log(`Existing user detected, but not logged in (sub: ${claims.sub})`);
                redirect(302, '/api/auth/login');
            }
            userInDb = await User.findOne({ sub: claims.sub }).lean();
        }

        if(!userInDb || (!userInDb.isActive && !isNewUser)){
            if(userInDb && !userInDb.isActive){
                console.warn(`ACCESS DENIED for user ${claims.sub}. User exists in local DB but is inactive.${userInDb.isActive}`);
            }else{
                console.warn(`ACCESS DENIED for user ${claims.sub}. User exists in Auth0 but not in local DB.`);
            }
            throw redirect(302, '/access-denied');
        }

        console.log('User verified in DB. Creating session cookie.');
        const userSessionData = {
            _id: userInDb._id.toString(),
            sub: userInDb.sub,
            name: userInDb.name,
            surname: userInDb.surname,
            picture: userInDb.picture,
            email: userInDb.email,
            favoriteColor: userInDb.favoriteColor,
            dateOfBirth: userInDb.dateOfBirth ? userInDb.dateOfBirth.toISOString() : null,
            role: userInDb.role,
            createdAt: userInDb.createdAt.toISOString(),
            lastLogin: userInDb.lastLogin ? userInDb.lastLogin.toISOString() : null,
            isActive: userInDb.isActive,
            exp: tokenSet.expires_at
        };
        const signedSession = sign(JSON.stringify(userSessionData), SESSION_SECRET);

        if (!signedSession) {
            console.error("Failed to sign session cookie");
            throw new Error("Failed to sign session cookie");
        }

        cookies.set('user_session', signedSession, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: tokenSet.expires_in ? tokenSet.expires_in : 60 * 60,
            sameSite: 'lax'
        });
        throw redirect(302, '/');
    } catch (err) {
        if (isRedirect(err)) {
            throw err;
        }

        console.error("Auth0 Callback Error:", err);
        let errorMessage = 'Authentication failed. Please try again.';
        if (err instanceof Error) {
            errorMessage = err.message;
        }else if (typeof err === 'string') {
            errorMessage = err;
        }

        console.error(errorMessage);
        throw error(500, `Authentication failed: ${errorMessage}`);
    }
}