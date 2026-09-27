"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type TeamMember = {
  name: string;
  role: string;
  bio?: string;
  email: string;
  linkedin: string;
  github: string;
};

const iconLinks = (member: TeamMember) => [
  { href: `mailto:${member.email}`, icon: Mail, label: `Email ${member.name}` },
  { href: member.github, icon: GithubIcon, label: `${member.name} on GitHub` },
  { href: member.linkedin, icon: LinkedinIcon, label: `${member.name} on LinkedIn` },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function TeamCard({ member }: { member: TeamMember }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="h-full border border-border/70 bg-card/60 shadow-none transition-shadow hover:shadow-[0_0_24px_-6px_var(--status-cyan)]">
        <CardHeader>
          <CardTitle className="text-lg">{member.name}</CardTitle>
          <p className="font-mono text-xs uppercase tracking-wide text-status-cyan">
            {member.role}
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 pt-2">
          {member.bio && (
            <p className="text-xs leading-relaxed text-muted-foreground">{member.bio}</p>
          )}
          <div className="flex items-center gap-3">
            {iconLinks(member).map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-border/70 text-muted-foreground transition-colors hover:border-status-cyan hover:text-status-cyan"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
