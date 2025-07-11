//  A loading placeholder that shows while real playlist data is being fetched.
// Displays 7 skeleton items that visually mimic the structure of playlist items.

const PlaylistSkeleton = () => {
  // Create an array of 7 items to represent skeleton placeholders
  return Array.from({ length: 7 }).map((_, i) => (
    <div key={i} className="p-2 rounded-md flex items-center gap-3">
      {/* Album cover placeholder (square) */}
      <div className="w-12 h-12 bg-zinc-800 rounded-md flex-shrink-0 animate-pulse" />
      {/* Text placeholders (hidden on mobile) */}
      <div className="flex-1 min-w-0 hidden md:block space-y-2">
        {/* Primary text placeholder (e.g., song title) */}
        <div className="h-4 bg-zinc-800 rounded animate-pulse w-3/4" />
        {/* Secondary text placeholder (e.g., artist name) */}
        <div className="h-3 bg-zinc-800 rounded animate-pulse w-1/2" />
      </div>
    </div>
  ));
};
export default PlaylistSkeleton;


//animate pulse comes from tailwind