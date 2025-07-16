const SkeletonGrid = () => {
    return (
      <div className="grid grid-cols-4 grid-rows-4 gap-6 p-6">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="w-full h-40 rounded-lg animate-pulse bg-transparent"
          >
            <div className="h-24 mb-3 rounded bg-[rgb(43,22,97)]"></div>
            <div className="h-4 mb-2 rounded bg-[rgb(43,22,97)]"></div>
            <div className="h-4 w-3/4 rounded bg-[rgb(43,22,97)]"></div>
          </div>
        ))}
      </div>
    );
  };
  
  export default SkeletonGrid;
  