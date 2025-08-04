
import { redirect } from 'next/navigation';

// Redirect to the first available page in this section
export default function SoportePage() {
  redirect('/troubleshooting');
}
