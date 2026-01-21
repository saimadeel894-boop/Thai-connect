interface StatItemProps {
  value: string;
  label: string;
}

export default function StatItem({ value, label }: StatItemProps) {
  return (
    <div className="text-center">
      <div className="mb-1 text-3xl font-bold text-red-500 md:text-4xl">
        {value}
      </div>
      <div className="text-sm text-gray-400 md:text-base">{label}</div>
    </div>
  );
}
