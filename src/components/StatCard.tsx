interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  valueColor?: string;
  bars?: { isUp: boolean }[];
}

export default function StatCard({ label, value, subValue, valueColor, bars }: StatCardProps) {
  return (
    <div className="bg-surface border border-line rounded-xl p-6">
      <div className="flex justify-between items-center mb-1">
        <p className="text-[10px] uppercase tracking-widest text-text-dim">{label}</p>
        {bars && (
          <p className={`text-sm font-mono font-medium ${valueColor ?? 'text-foreground'}`}>
            {value}
          </p>
        )}
      </div>
      {!bars && (
        <p className={`text-2xl font-medium font-mono ${valueColor ?? 'text-foreground'}`}>
          {value}
        </p>
      )}

      {bars && (
        <div className="flex items-center gap-0.5 my-2">
          {bars.map((b, i) => (
            <div key={i} className={`flex-1 h-5 rounded-sm ${b.isUp ? 'bg-green' : 'bg-low'}`} />
          ))}
        </div>
      )}

      {subValue && <p className="text-xs text-text-dim mt-1">{subValue}</p>}
    </div>
  );
}
