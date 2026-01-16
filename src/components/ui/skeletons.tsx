import { Skeleton } from './skeleton';

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-start justify-between">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
      <Skeleton className="mb-2 h-3 w-24" />
      <Skeleton className="h-8 w-32" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-32" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-6 w-16 rounded-full" />
      </td>
      <td className="px-6 py-4 text-right">
        <Skeleton className="ml-auto h-8 w-8 rounded" />
      </td>
    </tr>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex h-full flex-col gap-8 p-6 pb-12 md:p-8 lg:flex-row">
      <div className="w-full shrink-0 lg:w-80">
        <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-6">
          <Skeleton className="mb-6 h-40 w-40 rounded-full" />
          <Skeleton className="mb-2 h-6 w-48" />
          <Skeleton className="mb-6 h-4 w-32" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
      <div className="flex-1 space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <Skeleton className="mb-6 h-6 w-48" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg md:col-span-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
