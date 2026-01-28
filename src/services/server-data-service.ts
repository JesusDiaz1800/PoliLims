
import * as fs from 'fs/promises';
import * as path from 'path';

export interface KnowledgeBaseFile {
  name: string;
  size: number;
  lastModified: string;
  status: 'Aprobado' | 'En Revisión';
  version: number;
  approvedBy?: string;
  approvedAt?: string;
}


export async function getKnowledgeBaseFiles(): Promise<KnowledgeBaseFile[]> {
    const dataDirectory = path.join(process.cwd(), 'public', 'data');
    try {
        const files = await fs.readdir(dataDirectory);
        const fileDetails = await Promise.all(
            files.map(async (file) => {
                if (file.endsWith('.txt')) {
                    const filePath = path.join(dataDirectory, file);
                    const stats = await fs.stat(filePath);
                    return {
                        name: file,
                        size: stats.size,
                        lastModified: stats.mtime.toLocaleDateString('es-CL'),
                        status: file.toLowerCase().includes('manual') ? 'Aprobado' : 'En Revisión',
                        version: 1,
                        approvedBy: file.toLowerCase().includes('manual') ? 'Victor Lutz' : undefined,
                        approvedAt: file.toLowerCase().includes('manual') ? new Date(stats.mtime.getTime() - 1000 * 60 * 60 * 24 * 5).toLocaleDateString('es-CL') : undefined,
                    };
                }
                return null;
            })
        );
        return fileDetails.filter((file) => file !== null) as KnowledgeBaseFile[];
    } catch (error) {
        console.error('Failed to read knowledge base directory:', error);
        // Return an empty array if the directory doesn't exist, which is not an error in some cases
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}
