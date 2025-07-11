// @ts-ignore
import { error } from '@sveltejs/kit';
import User from '$lib/server/models/User';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
    if (!locals.user) {
        redirect(302, '/api/auth/logout');
    }
    const profilebd = await User.findOne({ _id: locals.user._id }).lean();

    if (!profilebd) {
        throw redirect(302, '/api/auth/logout');
    }

    return {
        profile: {
            // @ts-ignore
            email: profilebd.email,
            // @ts-ignore
            name: profilebd.name,
            // @ts-ignore
            surname: profilebd.surname,
            // @ts-ignore
            picture: profilebd.picture,
            // @ts-ignore
            dateOfBirth: profilebd.dateOfBirth ? profilebd.dateOfBirth.toISOString().split('T')[0] : null,
            // @ts-ignore
            favoriteColor: profilebd.favoriteColor
        }
    };
}; 