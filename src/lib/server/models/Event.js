import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    sharedWith: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    }],

    title: {
        type: String,
        required: [true, 'Tytuł wydarzenia jest wymagany.'],
        trim: true,
        maxlength: [63, 'Tytuł nie może być dłuższy niż 63 znaki.']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Opis nie może być dłuższy niż 500 znaków.']
    },
    startDate: {
        type: Date,
        required: [true, 'Data rozpoczęcia jest wymagana.']
    },
    endDate: {
        type: Date
    },
    emoji: {
        type: String,
        default: '🎉'
    }
}, {
    timestamps: true
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event;