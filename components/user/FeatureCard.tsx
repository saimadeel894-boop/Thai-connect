interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="group rounded-2xl border border-gray-800 bg-gray-900/50 p-8 transition-all hover:border-red-500/50 hover:bg-gray-900">
      <div className="mb-4 text-4xl text-red-500">{icon}</div>
      <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
