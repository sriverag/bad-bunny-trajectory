export default function GameLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-8">
      {/* Title skeleton */}
      <div className="text-center space-y-3">
        <div className="h-10 w-64 bg-muted animate-pulse rounded-lg mx-auto" />
        <div className="h-5 w-48 bg-muted animate-pulse rounded-md mx-auto" />
      </div>

      {/* Mode cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card/50 p-6 space-y-3 animate-pulse"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div className="h-10 w-10 bg-muted rounded-lg" />
            <div className="h-6 w-32 bg-muted rounded-md" />
            <div className="h-4 w-full bg-muted rounded-sm" />
            <div className="flex gap-1">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-2 w-2 bg-muted rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
