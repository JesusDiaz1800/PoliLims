
import { redirect } from 'next/navigation';

// This page is deprecated. The upload form is now integrated into the documentos page.
export default function UploadPage() {
  redirect('/biblioteca/documentos');
}
