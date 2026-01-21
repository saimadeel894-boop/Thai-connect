interface BadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "default" | "outline";
}

export default function Badge({
  children,
  icon,
  variant = "default",
}: BadgeProps) {
  const variantStyles = {
    default: "bg-red-500/10 text-red-500 border-red-500/20",
    outline: "bg-transparent text-red-500 border-red-500",
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${variantStyles[variant]}`}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </div>
  );
}
