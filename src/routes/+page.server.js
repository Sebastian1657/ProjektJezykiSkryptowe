import { error } from '@sveltejs/kit';
import { getUserEvents } from '$lib/server/getUserEvents.js';
import { get } from 'mongoose';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }
    const events = await getUserEvents(locals.user._id);

    return {
        user: locals.user,
        events
    };
}