"use client";

import { motion } from "framer-motion";
import { 
  CheckCircle2, Clock, Zap, 
  Search, Filter, Leaf, 
  Trash2, Car, Home, Utensils, ShoppingBag, Award
} from "lucide-react";
import { useState } from "react";
import { useGamificationStore } from "@/store/useGamificationStore";
import { cn } from "@/lib/utils";

const ACTIONS = [
  {
    id: "led-bulbs",
    title: "Switch to LED Bulbs",
    description: "Replace standard incandescent bulbs with high-efficiency LEDs.",
    category: "energy",
    savings: "0.2T",
    difficulty: "Easy",
    time: "30 min",
    xp: 150
  },
  {
    id: "carpool",
    title: "Carpool to Work",
    description: "Share a ride with colleagues or neighbors twice a week.",
    category: "transport",
    savings: "0.5T",
    difficulty: "Medium",
    time: "2 days",
    xp: 300
  },
  {
    id: "meatless-monday",
    title: "Meatless Monday",
    description: "Skip meat for just one day a week to reduce agricultural impact.",
    category: "diet",
    savings: "0.3T",
    difficulty: "Easy",
    time: "1 day",
    xp: 200
  },
  {
    id: "cold-wash",
    title: "Cold Water Laundry",
    description: "Wash your clothes in cold water instead of hot.",
    category: "energy",
    savings: "0.1T",
    difficulty: "Easy",
    time: "1 hour",
    xp: 100
  },
  {
    id: "reusable-bottle",
    title: "Use Reusable Bottle",
    description: "Stop buying single-use plastic bottles for an entire week.",
    category: "lifestyle",
    savings: "0.05T",
    difficulty: "Easy",
    time: "7 days",
    xp: 150
  },
  {
    id: "bike-to-shop",
    title: "Bike to the Shop",
    description: "Use a bicycle for short errands within 3 miles.",
    category: "transport",
    savings: "0.15T",
    difficulty: "Medium",
    time: "30 min",
    xp: 250
  }
];

export default function ActionsPage() {
  const [filter, setFilter] = useState("all");
  const [completed, setCompleted] = useState<string[]>([]);
  const { addXP, updateStreak } = useGamificationStore();

  const handleComplete = (id: string, xp: number) => {
    if (completed.includes(id)) return;
    setCompleted([...completed, id]);
    addXP(xp);
    updateStreak();
  };

  const filteredActions = ACTIONS.filter(action => filter === "all" || action.category === filter);

  return (
    <div className="flex flex-col gap-12 pb-24">
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold font-poppins mb-4">Action Center</h1>
          <p className="text-forest/60 dark:text-sage/60">
            Small actions lead to big impacts. Choose a task below to start reducing your carbon footprint and earn XP.
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
          {["all", "transport", "energy", "diet", "lifestyle"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all whitespace-nowrap",
                filter === cat ? "bg-forest text-white shadow-lg" : "glass hover:bg-forest/5"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Action Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActions.map((action, i) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "glass-panel p-8 flex flex-col justify-between group relative overflow-hidden",
              completed.includes(action.id) && "opacity-60 grayscale-[50%]"
            )}
          >
            {completed.includes(action.id) && (
              <div className="absolute top-4 right-4 bg-glow text-white p-1 rounded-full z-20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="bg-forest/10 p-3 rounded-2xl">
                  {action.category === "transport" && <Car className="w-6 h-6 text-forest" />}
                  {action.category === "energy" && <Home className="w-6 h-6 text-forest" />}
                  {action.category === "diet" && <Utensils className="w-6 h-6 text-forest" />}
                  {action.category === "lifestyle" && <ShoppingBag className="w-6 h-6 text-forest" />}
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-xs font-bold text-teal">-{action.savings}</div>
                  <div className="text-[10px] uppercase opacity-40 font-bold">Annual Savings</div>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2 font-poppins">{action.title}</h3>
              <p className="text-sm text-forest/70 dark:text-sage/70 mb-8 leading-relaxed">
                {action.description}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-bold text-forest/60">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {action.time}
                </div>
                <div className={cn(
                  "px-2 py-0.5 rounded-md",
                  action.difficulty === "Easy" ? "bg-glow/10 text-glow" : "bg-teal/10 text-teal"
                )}>
                  {action.difficulty}
                </div>
                <div className="flex items-center gap-1 text-teal">
                  <Zap className="w-3 h-3 fill-teal" /> {action.xp} XP
                </div>
              </div>

              <button
                onClick={() => handleComplete(action.id, action.xp)}
                disabled={completed.includes(action.id)}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold transition-all shadow-xl flex items-center justify-center gap-2",
                  completed.includes(action.id) 
                    ? "bg-forest/10 text-forest/40 cursor-default" 
                    : "bg-forest text-white hover:bg-teal hover:shadow-forest/20 active:scale-95"
                )}
              >
                {completed.includes(action.id) ? "Action Completed" : "Mark as Completed"}
              </button>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Gamification Teaser */}
      <section className="glass-panel p-10 bg-forest text-white flex flex-col items-center text-center gap-6">
        <div className="bg-white/10 p-4 rounded-3xl">
          <Award className="w-12 h-12 text-sage" />
        </div>
        <h2 className="text-3xl font-bold font-poppins">Level Up Your Sustainability</h2>
        <p className="max-w-lg opacity-80">
          Earn XP for every action you complete. Reach Level 5 to unlock the "Sustainability Champion" badge and receive special AI insights.
        </p>
        <div className="w-full max-w-md h-3 bg-white/20 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-sage w-[65%]" />
        </div>
        <div className="text-sm font-bold text-sage">650 / 1000 XP to Level 2</div>
      </section>
    </div>
  );
}
