"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, ScanEye } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home", color: "var(--status-cyan)" },
  { href: "/team", label: "Team", color: "var(--status-green)" },
  { href: "/approach", label: "Approach", color: "var(--status-orange)" },
  { href: "/eda", label: "EDA", color: "var(--status-gray)" },
  { href: "/results", label: "Results", color: "var(--status-green)" },
  { href: "/demo", label: "Demo", color: "var(--status-red)" },
  { href: "/report", label: "Report", color: "var(--status-cyan)" },
];

function NavLink({
  href,
  label,
  color,
  active,
  onClick,
}: {
  href: string;
  label: string;
  color: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 text-sm transition-colors",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <span
        className="h-1.5 w-1.5 rounded-full transition-opacity"
        style={{ backgroundColor: color, opacity: active ? 1 : 0.25 }}
      />
      {label}
    </Link>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <ScanEye className="h-5 w-5 text-status-cyan" />
          <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
            Block<span className="text-status-cyan">Vision</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              color={link.color}
              active={pathname === link.href}
            />
          ))}
        </nav>

        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open navigation menu"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border/60 text-foreground"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="border-l border-border/60">
              <SheetHeader>
                <SheetTitle className="font-heading text-lg">
                  Block<span className="text-status-cyan">Vision</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-6 px-4 pb-6">
                {LINKS.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    color={link.color}
                    active={pathname === link.href}
                    onClick={() => setOpen(false)}
                  />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
