"use client";

import { useCarbonStore } from "@/store/useCarbonStore";
import { useUserStore } from "@/store/useUserStore";
import { useGamificationStore } from "@/store/useGamificationStore";
import { motion } from "framer-motion";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  LineChart, Line, Legend
} from "recharts";
import { 
  Leaf, Zap, TrendingDown, Award, 
  Info, ExternalLink, RefreshCcw
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const COLORS = ["#1A4D2E", "#4F8A8B", "#22C55E", "#E8F3D6"];

export default function DashboardPage() {
  const router = useRouter();
  const { totalScore, breakdown, history, lastUpdated } = useCarbonStore();
  const { profile } = useUserStore();
  const { level, xp, streak, badges } = useGamificationStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!profile.onboarded) {
      router.push("/calculator");
    }
  }, [profile.onboarded, router]);

  if (!mounted || !profile.onboarded) return null;

  const donutData = [
    { name: "Transport", value: breakdown.transportation },
    { name: "Energy", value: breakdown.energy },
    { name: "Diet", value: breakdown.diet },
    { name: "Shopping", value: breakdown.shopping },
  ];

  const comparisonData = [
    { name: "You", value: totalScore },
    { name: "National Avg", value: 4.5 },
  ];

  const trendData = history.map(h => ({
    date: h.date,
    score: h.score,
    target: 1.5
  }));

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Header Summary */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-bold font-poppins mb-2">Welcome Back, Eco Warrior!</h1>
          <p className="text-forest/60 dark:text-sage/60">Your current annual footprint is {totalScore} Tons CO₂e.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => router.push("/calculator")}
            className="flex items-center gap-2 glass px-4 py-2 rounded-xl text-sm font-bold hover:bg-forest/5 transition-all"
          >
            <RefreshCcw className="w-4 h-4" /> Recalculate
          </button>
        </div>
      </section>

      {/* Impact Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ImpactCard 
          title="Current Score" 
          value={`${totalScore} T`} 
          subtitle="Tons CO₂e / Year" 
          icon={Leaf} 
          color="text-forest" 
        />
        <ImpactCard 
          title="Current Streak" 
          value={`${streak.current} Days`} 
          subtitle="Keep it up!" 
          icon={Zap} 
          color="text-glow" 
        />
        <ImpactCard 
          title="Eco Rank" 
          value={`Level ${level}`} 
          subtitle={`${xp % 1000}/1000 XP`} 
          icon={Award} 
          color="text-teal" 
        />
        <ImpactCard 
          title="Badges" 
          value={badges.length.toString()} 
          subtitle="Unlocked so far" 
          icon={Award} 
          color="text-forest" 
        />
      </section>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Carbon Breakdown Donut */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 flex flex-col items-center"
        >
          <h3 className="text-xl font-bold mb-6 font-poppins self-start">Carbon Breakdown</h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 w-full">
            {donutData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-sm font-medium">{d.name}: {d.value}T</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* You vs National Average */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-8"
        >
          <h3 className="text-xl font-bold mb-6 font-poppins">You vs National Average</h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#1A4D2E" : "#4F8A8B"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-forest/5 rounded-2xl text-sm">
            {totalScore < 4.5 ? (
              <p className="font-bold text-forest">Great work! You are {Math.round((1 - totalScore / 4.5) * 100)}% below the average footprint.</p>
            ) : (
              <p className="font-bold text-teal">You are currently {Math.round((totalScore / 4.5 - 1) * 100)}% above the national average. Let's work on reducing that!</p>
            )}
          </div>
        </motion.div>

        {/* Historical Trends */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-8"
        >
          <h3 className="text-xl font-bold mb-6 font-poppins">Reduction Path</h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="date" hide />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#1A4D2E" strokeWidth={3} dot={{ r: 6 }} name="Your Footprint" />
                <Line type="monotone" dataKey="target" stroke="#4F8A8B" strokeDasharray="5 5" name="Eco Goal" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-center opacity-50 mt-4 italic">Goal: Reach 1.5 Tons per year by 2030</p>
        </motion.div>
      </div>

      {/* Call to AI Coach */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="glass-panel p-10 bg-gradient-to-br from-forest/5 to-teal/5 flex flex-col md:flex-row items-center justify-between gap-8"
      >
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold font-poppins mb-4">Need personalized advice?</h2>
          <p className="text-lg text-forest/70 dark:text-sage/70">
            Our AI Sustainability Coach analyzed your footprint and has 5 new recommendations for you.
          </p>
        </div>
        <button 
          onClick={() => router.push("/coach")}
          className="bg-forest text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-teal transition-all shadow-xl"
        >
          Chat with AI Coach <ExternalLink className="w-5 h-5" />
        </button>
      </motion.section>
    </div>
  );
}

function ImpactCard({ title, value, subtitle, icon: Icon, color }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-6"
    >
      <div className="flex items-center gap-4">
        <div className={cn("p-3 rounded-2xl bg-white/10 shadow-inner", color)}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">{title}</div>
          <div className="text-2xl font-black font-poppins">{value}</div>
          <div className="text-xs font-medium opacity-60 mt-1">{subtitle}</div>
        </div>
      </div>
    </motion.div>
  );
}
