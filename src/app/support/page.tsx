/**
 * Support Portal Home Page
 * Redirects to Disputes page
 */

'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SupportHomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to disputes page
    router.replace('/support/disputes');
  }, [router]);

  return null;
}
