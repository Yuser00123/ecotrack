"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, LayoutDashboard, Calculator, UserRound, Moon, Sun, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { useGamificationStore } from "@/store/useGamificationStore";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Calculator", href: "/calculator", icon: Calculator },
  { name: "AI Coach", href: "/coach", icon: UserRound },
  { name: "Actions", href: "/actions", icon: Award },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { level, xp } = useGamificationStore();

  return (
    <nav className="sticky top-0 z-50 w-full px-4 py-4">
      <div className="mx-auto max-w-7xl glass px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-forest p-2 rounded-lg group-hover:bg-teal transition-colors">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold font-poppins text-forest dark:text-sage">EcoTrack</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-sm font-medium",
                pathname === item.href
                  ? "bg-forest text-white shadow-md"
                  : "text-forest/70 dark:text-sage/70 hover:bg-forest/10 dark:hover:bg-sage/10"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end mr-2">
            <div className="text-xs font-bold text-teal">LVL {level}</div>
            <div className="w-20 h-1 bg-forest/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-forest"
                initial={{ width: 0 }}
                animate={{ width: `${(xp % 1000) / 10}%` }}
              />
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl glass hover:bg-forest/10 dark:hover:bg-sage/10 transition-colors"
          >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
