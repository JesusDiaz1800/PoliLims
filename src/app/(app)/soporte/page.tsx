
import { SoporteChat } from '@/components/soporte/soporte-chat';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Soporte de Laboratorio',
};

// This page is no longer the main entry point for the chat.
// The chat is now in a global widget.
// We redirect to the dashboard as a fallback.
export default function SoportePage() {
    redirect('/dashboard');
}
