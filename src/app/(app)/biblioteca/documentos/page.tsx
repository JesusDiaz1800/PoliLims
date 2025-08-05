
import { DocumentosTable } from '@/components/biblioteca/documentos-table';
import type { Metadata } from 'next';
import { getKnowledgeBaseFiles } from '@/services/data-service';

export const metadata: Metadata = {
  title: 'Biblioteca de Documentos',
};

// Revalidate every 60 seconds to pick up new files
export const revalidate = 60;

export default async function DocumentosPage() {
  const files = await getKnowledgeBaseFiles();
  return <DocumentosTable files={files} />;
}
