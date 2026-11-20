/** Matches the split-view preview panel: gallery → title → about → map → access. */
const GymPreviewSkeleton = () => (
  <div
    className="flex flex-col overflow-hidden rounded-[22px] border border-[rgba(220,230,235,0.9)] bg-surface"
    aria-busy="true"
    aria-live="polite"
  >
    <div className="h-[260px] w-full animate-pulse bg-page lg:h-[330px]" />
    <div className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="h-7 w-1/2 max-w-[220px] animate-pulse rounded-md bg-page" />
        <div className="h-[26px] w-[76px] shrink-0 animate-pulse rounded-full bg-page" />
      </div>
      <div className="h-5 w-1/3 max-w-[160px] animate-pulse rounded-md bg-page" />
      <div className="mt-2 h-10 w-2/5 max-w-[200px] animate-pulse rounded-md bg-page" />
      <div className="flex flex-col gap-2">
        <div className="h-4 w-full animate-pulse rounded-md bg-page" />
        <div className="h-4 w-[92%] animate-pulse rounded-md bg-page" />
        <div className="h-4 w-[78%] animate-pulse rounded-md bg-page" />
      </div>
      <div className="mt-2 flex justify-between gap-4 border-t border-border-muted pt-5">
        <div className="h-4 w-2/5 animate-pulse rounded-md bg-page" />
        <div className="h-8 w-1/3 animate-pulse rounded-md bg-page" />
      </div>
      <div className="h-[220px] w-full animate-pulse rounded-2xl bg-page md:h-[291px]" />
      <div className="flex flex-col gap-3 rounded-2xl bg-page/80 p-3">
        <div className="h-5 w-1/3 animate-pulse rounded-md bg-surface" />
        <div className="flex gap-4">
          <div className="h-[26px] w-[76px] animate-pulse rounded-full bg-surface" />
          <div className="h-[26px] w-[76px] animate-pulse rounded-full bg-surface" />
        </div>
        <div className="h-4 w-4/5 animate-pulse rounded-md bg-surface" />
      </div>
    </div>
  </div>
);

export default GymPreviewSkeleton;
