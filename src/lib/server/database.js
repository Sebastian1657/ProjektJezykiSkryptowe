import mongoose from 'mongoose';
import { DATABASE_URL } from '$env/static/private';

/** @type {Promise<typeof mongoose> | null} */
let cachedConnection = null;

export async function connectToDatabase() {
    if (cachedConnection) {
        console.log('Using cached database connection.');
        return cachedConnection;
    }
    try {
        console.log('Creating new database connection...');
        cachedConnection = mongoose.connect(DATABASE_URL);
        return cachedConnection;
    } catch (e) {
        console.error('Database connection failed:', e);
        throw e;
    }
}