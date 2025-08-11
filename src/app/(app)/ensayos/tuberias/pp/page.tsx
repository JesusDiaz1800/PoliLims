
"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';

export default function TuberiasPpPage() {
    const router = useRouter();
    React.useEffect(() => {
        router.replace('/ensayos/seguimiento');
    }, [router]);

    return null; // or a loading spinner
}
