import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Subscription } from '@/lib/types';

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    api
      .get('/users/subscription')
      .then((r) => setSubscription(r.data))
      .catch(() => setSubscription({ plan: 'free', status: 'inactive' }));
  }, []);

  return { subscription, isPremium: subscription?.plan === 'premium' };
}
