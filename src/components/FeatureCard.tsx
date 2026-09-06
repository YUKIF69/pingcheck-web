import { type ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-surface border border-line rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden hover:border-accent transition">
      {/* Концентричні кола */}
      <div className="relative flex items-center justify-center w-full h-36">
        <div className="absolute w-36 h-36 rounded-full border border-line opacity-20" />
        <div className="absolute w-24 h-24 rounded-full border border-line opacity-40" />
        <div className="absolute w-14 h-14 rounded-full border border-line opacity-60" />
        {/* Іконка */}
        <div className="relative z-10 w-10 h-10 flex items-center justify-center rounded-xl">
          {icon}
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="">
          <h3 className="text-foreground font-semibold mb-1">{title}</h3>
          <p className="text-text-dim text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}
