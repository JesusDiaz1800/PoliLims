
import { redirect } from 'next/navigation';

// This page is no longer needed as the chat is a global widget.
// We redirect to the dashboard as a safe fallback.
export default function SoportePage() {
    redirect('/dashboard');
}
