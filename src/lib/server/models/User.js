import mongoose from 'mongoose';

// schemat dokumentu użytkownika
const userSchema = new mongoose.Schema({
    sub: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String },
    surname: { type: String },
    dateOfBirth: { type: Date },
    favoriteColor: { type: String },
    emailVerified: { type: Boolean, default: false },
    picture: { type: String },
    role: { type: String, default: 'user'},
    lastLogin: { type: Date },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;