import { error, json } from '@sveltejs/kit';
import fs from 'fs'; // Moduł Node.js do operacji na systemie plików
import path from 'path'; // Moduł Node.js do pracy ze ścieżkami

// Ścieżka bazowa do naszego folderu ze zdjęciami
const baseDir = path.resolve('static/Photos');

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
    // Odczytaj ścieżkę podfolderu z parametrów URL. Jeśli nie ma, użyj pustego stringa.
    const subfolderPath = params.path || '';

    // Zbuduj pełną, bezpieczną ścieżkę do folderu, który chcemy wylistować
    const targetDir = path.join(baseDir, subfolderPath);

    // --- Zabezpieczenia ---
    // Upewnij się, że nikt nie próbuje wyjść poza folder `baseDir` (np. przez '../')
    if (!targetDir.startsWith(baseDir)) {
        throw error(403, 'Access Denied'); // Błąd "Forbidden"
    }

    try {
        // Odczytaj zawartość katalogu
        const files = await fs.promises.readdir(targetDir, { withFileTypes: true });

        // Przetwórz listę plików i folderów na bardziej użyteczny format
        const items = files.map(file => {
            const isDirectory = file.isDirectory();
            const itemPath = path.join(subfolderPath, file.name).replace(/\\/g, '/'); // Normalizuj ścieżkę do formatu URL

            return {
                name: file.name,
                type: isDirectory ? 'folder' : 'image', // Proste założenie, że wszystko co nie jest folderem to obraz
                path: itemPath, // Ścieżka względna do /Photos/
                url: `/Photos/${itemPath}` // Pełny URL do zasobu
            };
        });

        // Zwróć dane jako JSON
        return json(items);

    } catch (e) {
        // Jeśli folder nie istnieje lub wystąpił inny błąd odczytu
        console.error(`Error reading directory ${targetDir}:`, e);
        throw error(404, 'Not Found');
    }
}