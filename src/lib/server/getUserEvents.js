import Event from '$lib/server/models/Event.js';

/**
 * @param {string} userId - ID użytkownika (np. z locals.user._id)
 * @returns {Promise<import('$lib/types').Event[]>}
 */
export async function getUserEvents(userId) {
  const events = await Event.find({
    $or: [
      { createdBy: userId },
      { sharedWith: { $in: [userId] } }
    ]
  })
    .populate('createdBy', 'name surname')
    .populate('sharedWith', 'name surname')
    .select('-__v')
    .lean();

  return events.map(event => ({
    // @ts-ignore
    _id: event._id.toString(),
    createdBy: {
      _id: event.createdBy._id.toString(),
      name: event.createdBy.name,
      surname: event.createdBy.surname
    },
    // @ts-ignore
    sharedWith: event.sharedWith.map(user => ({
      _id: user._id.toString(),
      name: user.name || 'Bezimienny',
      surname: user.surname || ''
    })),
    startDate: event.startDate?.toISOString() || null,
    endDate: event.endDate?.toISOString() || null,
    title: event.title || '',
    description: event.description || '',
    emoji: event.emoji || '🎉'
  }));
}
