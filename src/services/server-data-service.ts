
'use server';

import * as fs from 'fs/promises';
import * as path from 'path';

export interface KnowledgeBaseFile {
  name: string;
  size: number;
}


// --- Files ---

export async function getKnowledgeBaseFiles(): Promise<KnowledgeBaseFile[]> {
    const dataDirectory = path.join(process.cwd(), 'public', 'data');
    try {
        const files = await fs.readdir(dataDirectory);
        const fileDetails = await Promise.all(
            files
                .filter(file => file.endsWith('.txt'))
                .map(async file => {
                    const filePath = path.join(dataDirectory, file);
                    const stats = await fs.stat(filePath);
                    return { name: file, size: stats.size };
                })
        );
        return fileDetails;
    } catch (error) {
        // If the directory doesn't exist, create it and return an empty array.
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
            await fs.mkdir(dataDirectory, { recursive: true });
            return [];
        }
        console.error('Failed to read knowledge base directory:', error);
        return [];
    }
}

    