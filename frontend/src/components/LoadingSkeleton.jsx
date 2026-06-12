export default function LoadingSkeleton({ count = 3 }) {
  return (
    <div className="grid cards">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-card" key={index}>
          <div />
          <span />
          <span />
        </div>
      ))}
    </div>
  );
}
