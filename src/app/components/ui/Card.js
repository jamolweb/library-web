export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children }) {
  return (
    <div className="flex items-center justify-between mb-4">{children}</div>
  );
}

export function CardTitle({ children }) {
  return <h2 className="text-xl font-semibold text-gray-800">{children}</h2>;
}

export function CardContent({ children }) {
  return <div className="space-y-4">{children}</div>;
}
