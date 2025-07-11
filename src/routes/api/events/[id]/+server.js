import { error, json } from '@sveltejs/kit';
import Event from '$lib/server/models/Event.js';

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ params, locals }) {
  if (!locals.user) throw error(401, 'Unauthorized');

  const event = await Event.findById(params.id);

  if (!event) throw error(404, 'Event not found');

  if (event.createdBy.toString() !== locals.user._id.toString()) {
    throw error(403, 'Forbidden – not your event');
  }

  await Event.deleteOne({ _id: params.id });

  return json({ success: true });
}
/** @type {import('./$types').RequestHandler} */
export async function PUT({ params, request, locals }) {
  if (!locals.user) throw error(401, 'Unauthorized');

  const event = await Event.findById(params.id);
  if (!event) throw error(404, 'Event not found');

  if (event.createdBy.toString() !== locals.user._id.toString()) {
    throw error(403, 'Forbidden – not your event');
  }

  const data = await request.json();

  event.title = data.title;
  event.description = data.description;
  event.startDate = data.startDate;
  event.endDate = data.endDate;
  event.sharedWith = data.sharedWith;
  event.emoji = data.emoji;

  await event.save();

  return json({ success: true });
}
