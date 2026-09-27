export default function PlaceholderSection({
  title,
  phase,
}: {
  title: string;
  phase: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-32 text-center">
      <h1 className="font-heading text-3xl font-semibold sm:text-4xl">
        {title}
      </h1>
      <p className="font-mono text-sm text-status-orange">
        &gt; coming in {phase}
      </p>
    </div>
  );
}
