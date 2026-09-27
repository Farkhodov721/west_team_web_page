"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export type Step = {
  number: string;
  title: string;
  color: string;
  description: string;
  detail?: string;
};

export default function PipelineStep({
  step,
  index,
  isLast,
}: {
  step: Step;
  index: number;
  isLast: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay: index % 2 === 0 ? 0 : 0.05 }}
      className="relative flex gap-5 sm:gap-8"
    >
      <div className="flex flex-col items-center">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-mono text-sm font-semibold"
          style={{ borderColor: step.color, color: step.color }}
        >
          {step.number}
        </div>
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{ originY: 0 }}
            className="mt-1 w-px flex-1 bg-border"
          />
        )}
      </div>

      <Card className="mb-10 flex-1 border border-border/70 bg-card/60 shadow-none">
        <CardContent className="flex flex-col gap-2 pt-4">
          <h3 className="font-heading text-lg font-semibold" style={{ color: step.color }}>
            {step.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {step.description}
          </p>
          {step.detail && (
            <p className="mt-1 rounded-md bg-black/20 px-3 py-2 font-mono text-xs leading-relaxed text-status-gray">
              {step.detail}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
