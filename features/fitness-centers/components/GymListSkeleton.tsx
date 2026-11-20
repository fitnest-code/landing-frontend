const Row = () => (
  <div className="flex w-full items-center gap-6 rounded-2xl border border-border-muted bg-surface p-3">
    <div className="h-[127px] w-[154px] shrink-0 animate-pulse rounded-lg bg-page" />
    <div className="flex min-h-[127px] min-w-0 flex-1 flex-col justify-between py-1">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="h-7 w-2/5 max-w-[180px] animate-pulse rounded-md bg-page" />
          <div className="h-[26px] w-[76px] shrink-0 animate-pulse rounded-full bg-page" />
        </div>
        <div className="h-5 w-1/3 max-w-[140px] animate-pulse rounded-md bg-page" />
      </div>
      <div className="flex items-center gap-2">
        <div className="size-5 shrink-0 animate-pulse rounded-full bg-page" />
        <div className="h-5 w-3/5 max-w-[220px] animate-pulse rounded-md bg-page" />
      </div>
    </div>
  </div>
);

type GymListSkeletonProps = {
  rows?: number;
};

/** Matches list-card geometry so layout does not jump while the first page loads. */
const GymListSkeleton = ({ rows = 5 }: GymListSkeletonProps) => (
  <div className="flex flex-col gap-2" aria-hidden>
    {Array.from({ length: rows }, (_, index) => (
      <Row key={index} />
    ))}
  </div>
);

export default GymListSkeleton;
