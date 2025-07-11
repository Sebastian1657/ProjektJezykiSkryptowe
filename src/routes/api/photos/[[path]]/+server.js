import { error, json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

const baseDir = path.resolve('static/Photos');

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
    const subfolderPath = params.path || '';

    const targetDir = path.join(baseDir, subfolderPath);

    // --- Zabezpieczenia ---
    if (!targetDir.startsWith(baseDir)) {
        throw error(403, 'Access Denied');
    }

    try {
        const files = await fs.promises.readdir(targetDir, { withFileTypes: true });
        const items = files.map(file => {
            const isDirectory = file.isDirectory();
            const itemPath = path.join(subfolderPath, file.name).replace(/\\/g, '/'); // Normalizuj ścieżkę do formatu URL

            return {
                name: file.name,
                type: isDirectory ? 'folder' : 'image',
                path: itemPath,
                url: `/Photos/${itemPath}`
            };
        });
        return json(items);
    } catch (e) {
        console.error(`Error reading directory ${targetDir}:`, e);
        throw error(404, 'Not Found');
    }
}