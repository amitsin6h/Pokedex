export default function PokemonCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-2 h-3 w-10 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mx-auto my-2 h-28 w-28 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="mx-auto mb-2 h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="flex justify-center gap-1.5">
        <div className="h-5 w-14 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="h-5 w-14 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}
