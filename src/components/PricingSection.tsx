import { IconCheck } from '@tabler/icons-react';
import Link from 'next/link';

export default function PricingSection() {
  return (
    <section className="flex flex-col items-center gap-8 pb-24">
      <h2 className="text-2xl font-bold text-foreground">Simple pricing.</h2>
      <div className="flex justify-center gap-6 w-full">
        {/* Free */}
        <div className="flex flex-col gap-5 p-6 bg-surface border border-line rounded-2xl min-w-80">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Free</h3>
            <p className="text-text-dim text-sm mt-1">For personal projects</p>
          </div>
          <div>
            <span className="text-4xl font-bold text-foreground">$0</span>
            <span className="text-text-dim text-sm"> / month</span>
          </div>
          <Link
            href="/register"
            className="w-full text-center py-2.5 rounded-xl border border-line text-foreground text-sm hover:border-accent/40 transition-colors cursor-pointer"
          >
            Get started free
          </Link>
          <ul className="flex flex-col gap-3">
            {['3 monitors', '5 min interval', 'Email alerts', 'Public status page'].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-text-mid">
                <IconCheck size={15} className="text-green shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Premium */}
        <div className="flex flex-col gap-5 p-6 bg-surface border border-accent/50 rounded-2xl relative min-w-80">
          <span className="absolute top-4 right-4 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
            Most popular
          </span>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Premium</h3>
            <p className="text-text-dim text-sm mt-1">For serious projects</p>
          </div>
          <div>
            <span className="text-4xl font-bold text-foreground">$9</span>
            <span className="text-text-dim text-sm"> / month</span>
          </div>
          <button className="w-full py-2.5 rounded-xl bg-accent hover:bg-accent/80 text-white text-sm transition-colors cursor-pointer">
            Upgrade to Premium
          </button>
          <ul className="flex flex-col gap-3">
            {[
              'Unlimited monitors',
              '1 min interval',
              'Email alerts',
              'Public status page',
              'Priority support',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-text-mid">
                <IconCheck size={15} className="text-green shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
