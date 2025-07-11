import { json, error } from '@sveltejs/kit';
import User from '$lib/server/models/User.js';

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, locals }) {
    console.log("locals.user:", locals.user);
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }
    const formData = await request.json();

    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: locals.user._id },
            {
                name: formData.name,
                surname: formData.surname,
                dateOfBirth: formData.dateOfBirth,
                favoriteColor: formData.favoriteColor,
            },
            { new: true }
        );

        if (!updatedUser) {
            throw error(404, 'User not found');
        }
        return json({ success: true, message: 'Profile updated successfully.' });

    } catch (e) {
        console.error("Profile update error:", e);
        throw error(500, 'Internal Server Error');
    }
}
/** @type {import('./$types').RequestHandler} */
export async function GET({ locals }) {
    console.log("locals.user:", locals.user);
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }
    
    try {
        const users = await User.find({}, 
            ['_id', 'name', 'surname', 'email', 'picture', 'favoriteColor', 'role', 'dateOfBirth']
        ).lean();
        return json(users);
        
    } catch (e) {
        throw error(500, 'Failed to fetch users');
    }
}