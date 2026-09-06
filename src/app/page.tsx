'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import FeatureCard from '@/components/FeatureCard';
import { IconActivity, IconMail, IconWorld } from '@tabler/icons-react';
import PricingSection from '@/components/PricingSection';

export default function Home() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) router.push('/dashboard');
  }, [isLoggedIn, router]);

  return (
    <>
      <section className="py-24 flex flex-col items-center text-center gap-16">
        {/* Hero */}
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-5xl font-bold text-foreground">
            Monitor your websites.
            <br />
            <span className="text-accent">Know before your users do.</span>
          </h1>
          <p className="text-text-mid text-lg max-w-xl">
            PingCheck monitors your sites every minute and alerts you instantly when something goes
            wrong.
          </p>
          <div className="flex gap-4">
            <Link
              href="/auth"
              className="bg-accent hover:bg-accent/80 text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
            >
              Get started free
            </Link>
            <Link
              href="/auth"
              className="border border-line hover:border-accent/40 text-text-mid hover:text-foreground px-6 py-2.5 rounded-lg transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl font-bold">
            What you can do with this product<span className="text-accent">.</span>
          </h2>

          <div className="grid grid-cols-3 gap-4 w-full">
            <FeatureCard
              icon={<IconActivity size={20} className="text-accent" />}
              title="Real-time monitoring"
              description="Ping every minute, instant status updates"
            />
            <FeatureCard
              icon={<IconMail size={20} className="text-accent" />}
              title="Email alerts"
              description="Get notified when your site goes down and recovers"
            />
            <FeatureCard
              icon={<IconWorld size={20} className="text-accent" />}
              title="Public status page"
              description="Share your uptime with your users"
            />
          </div>
        </div>
      </section>
      <PricingSection />
    </>
  );
}
