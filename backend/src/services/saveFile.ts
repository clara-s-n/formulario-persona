import * as fs from 'fs';
import * as path from 'path';
import { MultipartFile } from '@fastify/multipart';

// Define la carpeta donde se guardarán los archivos
const UPLOAD_DIR = path.join(__dirname, '../uploads');

// Asegúrate de que la carpeta exista
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Almacenamiento en memoria para imágenes (en una aplicación real, usarías una base de datos)
const images: { id: string; filename: string; userId: string }[] = [];

/**
 * Guarda un archivo en el sistema de archivos y lo asocia a un usuario.
 * @param file - El archivo a guardar.
 * @param userId - El ID del usuario al que se asociará la imagen.
 * @returns El objeto con la información de la imagen guardada.
 */
export const saveFile = async (file: MultipartFile, userId: string): Promise<{ id: string; filename: string; userId: string }> => {
    const filePath = path.join(UPLOAD_DIR, file.filename);

    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(filePath);

        file.file.pipe(writeStream);

        writeStream.on('finish', () => {
            const imageId = generateId(); // Genera un ID único para la imagen
            const imageInfo = { id: imageId, filename: file.filename, userId };
            images.push(imageInfo); // Guarda la imagen en el almacenamiento en memoria
            resolve(imageInfo);
        });

        writeStream.on('error', (error) => {
            reject(new Error('Error al guardar el archivo: ' + error.message));
        });
    });
};

// Función para generar IDs únicos
const generateId = (): string => Math.random().toString(36).substr(2, 9);
