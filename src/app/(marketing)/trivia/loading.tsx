import { Skeleton } from "@/components/ui/skeleton";

export default function GameLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-8">
      <div className="text-center space-y-3">
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="h-5 w-48 mx-auto" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card/50 p-6 space-y-3"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-1">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-2 w-2 rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
