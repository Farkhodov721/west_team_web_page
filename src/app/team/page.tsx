"use client";

import { motion } from "framer-motion";
import TeamCard, { type TeamMember } from "@/components/TeamCard";

const TEAM: TeamMember[] = [
  {
    name: "Abdulaziz Farxodov",
    role: "Captain",
    bio: "ML/pipeline & website — detector + tracker pipeline, event rules, scene geometry, team website.",
    email: "abdulaziz.farxodov@polito.uz",
    linkedin: "https://www.linkedin.com/in/abdulaziz-farkhodov-643896399/",
    github: "https://github.com/Farkhodov721",
  },
  {
    name: "Asadullo Ismoilov",
    role: "Presentation",
    bio: "Pitch and demo presentation, website support.",
    email: "asadullo.ismoilov@polito.uz",
    linkedin: "https://www.linkedin.com/in/asadullo-ismoilov-8479a6310/",
    github: "https://github.com/AsadDeving",
  },
  {
    name: "Muhammadsayyid Tursunov",
    role: "ML / pipeline",
    bio: "Dev-set labelling (Label Studio), fast video decoding, evaluation, submission.",
    email: "muhammadsayyid.tursunov@polito.uz",
    linkedin: "https://www.linkedin.com/in/sayyeeddeveloper/",
    github: "https://github.com/SayyeedDeveloper",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export default function TeamPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-16 sm:px-6 lg:py-24">
      <div className="flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-wide text-status-orange">
          WIUT Hackathon 2026 · Computer Vision Track
        </span>
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          The team behind BlockVision.
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Three engineers building a rule-based traffic-violation detection
          system on top of pretrained computer vision models.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {TEAM.map((member) => (
          <TeamCard key={member.name} member={member} />
        ))}
      </motion.div>
    </div>
  );
}
