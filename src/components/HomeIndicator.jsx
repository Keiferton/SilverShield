export default function HomeIndicator() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center">
      <div className="h-1.5 w-28 rounded-full bg-black/45 mix-blend-overlay" />
    </div>
  );
}
