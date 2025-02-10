export default function ListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="animate-pulse space-y-3">
            <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
} 