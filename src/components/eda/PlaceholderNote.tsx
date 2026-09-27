export default function PlaceholderNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 font-mono text-[11px] leading-relaxed text-status-orange/80">
      &gt; placeholder data — {children}
    </p>
  );
}
