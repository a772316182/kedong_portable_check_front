import {defineEventHandler, readBody} from 'h3';
import fs from 'fs/promises';
import path from 'path';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const filePath = path.join(process.cwd(), 'pages/topology.json');
        await fs.writeFile(filePath, JSON.stringify(body, null, 2), 'utf-8');
        return {success: true};
    } catch (error) {
        console.error('Error writing topology file:', error);
        // @ts-ignore
        event.res.statusCode = 500;
        return {success: false, error: 'Failed to save topology.'};
    }
}); 