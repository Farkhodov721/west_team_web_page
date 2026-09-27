import { VideoOff } from "lucide-react";

export default function VideoPlaceholder({ clip }: { clip: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden border border-border bg-[#0a0d14]">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
        <VideoOff className="h-6 w-6 text-status-gray" />
        <p className="font-mono text-xs text-status-gray">
          annotated output not yet generated
        </p>
        <p className="font-mono text-[10px] text-muted-foreground">{clip}</p>
      </div>

      <div className="viewfinder-corner viewfinder-corner--tl" />
      <div className="viewfinder-corner viewfinder-corner--tr" />
      <div className="viewfinder-corner viewfinder-corner--bl" />
      <div className="viewfinder-corner viewfinder-corner--br" />
    </div>
  );
}
