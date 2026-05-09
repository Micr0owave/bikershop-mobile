import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { useAuth } from '@/components/AuthProvider';

export default function Index() {
  const { user } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure layout is mounted
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isReady) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, router, isReady]);

  return null;
}
