"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserRound, Sparkles, Send, Bot, 
  CheckCircle2, AlertCircle, Loader2,
  TrendingDown, Zap, Leaf
} from "lucide-react";
import { useCarbonStore } from "@/store/useCarbonStore";
import { useUserStore } from "@/store/useUserStore";
import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";
import Link from "next/link";

export default function CoachPage() {
  const { totalScore, breakdown } = useCarbonStore();
  const { profile } = useUserStore();
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    if (totalScore === 0) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/coach/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalScore,
          breakdown,
          userName: profile.name || "Eco Warrior"
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch insights");
      }
      
      setInsights(data);
    } catch (err: any) {
      console.error("Coach Page Error:", err);
      setError(err.message || "I'm having trouble connecting to my sustainability database. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (totalScore > 0 && !insights && !loading && !error) {
      fetchInsights();
    }
  }, [totalScore, insights, loading, error]);

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-20">
      {/* Header */}
      <section className="text-center space-y-4 pt-8">
        <div className="inline-flex items-center gap-2 bg-forest/10 text-forest px-4 py-1 rounded-full text-sm font-bold">
          <Sparkles className="w-4 h-4" /> AI POWERED COACHING
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-poppins">Meet Your Sustainability Coach</h1>
        <p className="text-forest/60 dark:text-sage/60 max-w-2xl mx-auto">
          Gemini analyzes your footprint to provide personalized strategies for a lower-carbon lifestyle.
        </p>
      </section>

      {totalScore === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-12 flex flex-col items-center justify-center text-center gap-6"
        >
          <div className="bg-forest/10 p-4 rounded-full">
            <Leaf className="w-12 h-12 text-forest" />
          </div>
          <h2 className="text-2xl font-bold font-poppins">No Carbon Data Found</h2>
          <p className="text-forest/60 max-w-md">
            I need to know your current carbon footprint before I can give you personalized advice.
          </p>
          <Link href="/calculator" className="bg-forest text-white px-8 py-3 rounded-2xl font-bold hover:bg-teal transition-all shadow-xl">
            Go to Calculator
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Chat / Insights Area */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-panel p-12 flex flex-col items-center justify-center gap-6 min-h-[400px]"
                >
                  <div className="relative">
                    <Loader2 className="w-12 h-12 text-forest animate-spin" />
                    <Bot className="w-6 h-6 text-forest absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-lg font-medium text-forest/70 animate-pulse text-center">
                    Analyzing your footprint and crafting <br/> personal recommendations...
                  </p>
                </motion.div>
              ) : error ? (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-panel p-12 flex flex-col items-center justify-center gap-4 text-center"
                >
                  <div className="text-red-500">
                    <AlertCircle className="w-12 h-12 mx-auto" />
                    <p className="font-bold text-lg mt-4">{error}</p>
                  </div>
                  <p className="text-sm opacity-60 max-w-xs">
                    This usually happens if the API key is invalid or the service is temporarily down.
                  </p>
                  <button 
                    onClick={fetchInsights}
                    className="mt-4 bg-forest text-white px-6 py-2 rounded-xl font-bold hover:bg-teal transition-all"
                  >
                    Retry Analysis
                  </button>
                </motion.div>
              ) : insights ? (
              <motion.div 
                key="insights"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Summary Box */}
                <div className="glass-panel p-8 bg-forest text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-[-10%] right-[-10%] opacity-10">
                    <Bot className="w-64 h-64" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <Bot className="w-6 h-6" />
                      <span className="text-sm font-bold uppercase tracking-widest opacity-80">Coach Summary</span>
                    </div>
                    <p 
                      className="text-xl leading-relaxed italic"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(insights.summary) }}
                    />
                  </div>
                </div>

                {/* Recommendations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insights.recommendations?.map((rec: string, i: number) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass p-6 flex gap-4 items-start"
                    >
                      <div className="bg-forest/10 p-2 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-forest" />
                      </div>
                      <p className="text-sm font-medium leading-snug">{rec}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Motivation */}
                <div className="glass-panel p-8 bg-teal/10 border-teal/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-6 h-6 text-teal" />
                    <h3 className="text-xl font-bold font-poppins text-teal">Daily Motivation</h3>
                  </div>
                  <p className="text-forest/80 dark:text-sage/80 font-medium">{insights.motivation}</p>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Sidebar - Weekly Challenge & Stats */}
        <div className="space-y-6">
          <AnimatePresence>
            {insights?.weeklyChallenge && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-6 bg-gradient-to-br from-glow/20 to-teal/20 border-glow/30"
              >
                <div className="text-xs font-bold uppercase tracking-widest text-glow mb-4">Weekly Challenge</div>
                <h3 className="text-2xl font-black mb-2 font-poppins">{insights.weeklyChallenge.title}</h3>
                <p className="text-sm opacity-70 mb-6">{insights.weeklyChallenge.description}</p>
                <div className="flex items-center justify-between p-3 bg-white/20 rounded-xl mb-6">
                  <div className="text-xs font-bold">Est. Savings</div>
                  <div className="text-lg font-black text-forest">{insights.weeklyChallenge.estimatedSavings}</div>
                </div>
                <button className="w-full bg-forest text-white py-3 rounded-xl font-bold shadow-lg hover:bg-teal transition-all">
                  Accept Challenge
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="glass-panel p-6 space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-forest" /> Current Impact Stats
            </h3>
            <div className="space-y-3">
              <StatRow label="Transportation" value={breakdown.transportation} unit="T" />
              <StatRow label="Energy" value={breakdown.energy} unit="T" />
              <StatRow label="Diet" value={breakdown.diet} unit="T" />
              <StatRow label="Shopping" value={breakdown.shopping} unit="T" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value, unit }: any) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="opacity-60">{label}</span>
      <span className="font-bold font-mono">{value}{unit}</span>
    </div>
  );
}
