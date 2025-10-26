'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LivesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/lives/watch');
  }, [router]);

  return null;
}
