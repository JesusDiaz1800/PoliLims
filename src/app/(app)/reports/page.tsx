
import { redirect } from 'next/navigation';

export default function ReportsPage() {
  // Redirect to the more specific product report page
  redirect('/reports/producto-terminado');
}
