
import { redirect } from "next/navigation";

// This page is no longer used. Redirect to the main app dashboard.
export default function LoginPage() {
    redirect('/dashboard');
}
