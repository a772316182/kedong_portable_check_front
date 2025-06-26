import { defineEventHandler } from 'h3';
import fs from 'fs/promises';
import path from 'path';

export default defineEventHandler(async () => {
    try {
        const filePath = path.join(process.cwd(), 'pages/topology.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error reading topology file:', error);
        // @ts-ignore
        event.res.statusCode = 500;
        return { success: false, error: 'Failed to load topology.' };
    }
}); 