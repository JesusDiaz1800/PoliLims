
'use server';

import * as fs from 'fs/promises';
import * as path from 'path';

export interface KnowledgeBaseFile {
  name: string;
  size: number;
  version: number;
  status: 'Aprobado' | 'En Revisión';
  approvedBy?: string;
  approvedAt?: string;
}


// --- Files ---

export async function getKnowledgeBaseFiles(): Promise<KnowledgeBaseFile[]> {
    const dataDirectory = path.join(process.cwd(), 'public', 'data');
    try {
        const files = await fs.readdir(dataDirectory);
        const fileDetails = await Promise.all(
            files
                // Omitimos archivos que no son de texto para la IA, pero se podrían incluir todos si se quisiera
                .filter(file => file.endsWith('.txt') || file.endsWith('.md'))
                .map(async (file, index) => {
                    const filePath = path.join(dataDirectory, file);
                    const stats = await fs.stat(filePath);
                    // Mock data para el ejemplo
                    const isApproved = index % 2 === 0;
                    return { 
                        name: file, 
                        size: stats.size,
                        version: isApproved ? 2 : 1,
                        status: isApproved ? 'Aprobado' : 'En Revisión',
                        approvedBy: isApproved ? 'Victor Lutz' : undefined,
                        approvedAt: isApproved ? '15-07-2024' : undefined,
                    };
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
