export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section Skeleton */}
        <div className="text-center mb-12 space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4 mx-auto" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-1/2 mx-auto" />
          </div>
        </div>

        {/* Features Grid Skeleton */}

        {/* CTA Section Skeleton */}
        <div className="mt-16 text-center">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-1/3 mx-auto" />
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-full w-48 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
