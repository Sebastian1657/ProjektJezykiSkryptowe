import { json, error } from '@sveltejs/kit';
import Event from '$lib/server/models/Event.js';
import User from '$lib/server/models/User.js';
import mongoose from 'mongoose';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }
    const eventData = await request.json();
    const creatorId = locals.user._id;

    if (!eventData.sharedWith.includes(creatorId)) {
        eventData.sharedWith.push(creatorId);
    }
    try {
        const newEvent = new Event({
            ...eventData,
            createdBy: creatorId,
        });
        
        await newEvent.save();
        
        return json(newEvent, { status: 201 });
    } catch (e) {
        let errorMessage = "Nie udało się utworzyć wydarzenia.";
        if (e instanceof Error) {
            errorMessage = e.message;
        }
        throw error(500, errorMessage);
    }
}