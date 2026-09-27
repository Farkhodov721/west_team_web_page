"use client";

import { useEffect, useState } from "react";
import VideoPlaceholder from "@/components/results/VideoPlaceholder";

// Looks for a real annotated clip at /public/results/<videoSrc>. If it's not
// there, falls back to a clearly-labeled placeholder instead of a broken
// player. Drop a real file at that path and it appears automatically — no
// code change needed.
export default function ClipMedia({
  videoSrc,
  clip,
}: {
  videoSrc: string;
  clip: string;
}) {
  const [found, setFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(videoSrc, { method: "HEAD" })
      .then((res) => {
        if (!cancelled) setFound(res.ok);
      })
      .catch(() => {
        if (!cancelled) setFound(false);
      });
    return () => {
      cancelled = true;
    };
  }, [videoSrc]);

  if (!found) return <VideoPlaceholder clip={clip} />;

  return (
    <video className="aspect-video w-full border border-border bg-black" controls preload="metadata">
      <source src={videoSrc} />
    </video>
  );
}
