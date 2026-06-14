"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Zap, Leaf, TrendingDown, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [savedCount, setSavedCount] = useState(124500);

  useEffect(() => {
    const interval = setInterval(() => {
      setSavedCount(prev => prev + Math.floor(Math.random() * 5));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-24 pt-12 pb-24">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-forest/10 text-forest dark:text-sage dark:bg-sage/10 px-4 py-1 rounded-full text-sm font-semibold tracking-wide"
        >
          JOIN THE GREEN REVOLUTION
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl md:text-7xl font-bold font-poppins leading-tight"
        >
          Your Journey to <span className="text-forest underline decoration-teal">Net Zero</span> Starts Here.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-forest/70 dark:text-sage/70 max-w-2xl"
        >
          Understand your impact, track your progress, and reduce your carbon footprint with AI-powered personalized coaching.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 pt-4"
        >
          <Link href="/calculator" className="bg-forest text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-teal transition-all shadow-xl hover:shadow-forest/20">
            Calculate Your Impact <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/dashboard" className="glass px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-forest/5 transition-all">
            View Dashboard
          </Link>
        </motion.div>

        {/* Live Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-col items-center gap-2"
        >
          <div className="flex items-center gap-2 text-teal font-bold">
            <Users className="w-5 h-5" />
            <span>Total Carbon Saved by EcoTrack Users</span>
          </div>
          <div className="text-4xl font-black font-mono tracking-tighter text-forest dark:text-sage">
            {savedCount.toLocaleString()} <span className="text-lg">Tons CO₂e</span>
          </div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Understand",
            description: "Deep dive into your lifestyle choices and see where your emissions come from.",
            icon: Leaf,
            color: "bg-forest",
            link: "/calculator"
          },
          {
            title: "Track",
            description: "Monitor your progress over time with premium analytics and historical trends.",
            icon: TrendingDown,
            color: "bg-teal",
            link: "/dashboard"
          },
          {
            title: "Reduce",
            description: "Get AI-powered recommendations and weekly challenges to lower your impact.",
            icon: Zap,
            color: "bg-glow",
            link: "/actions"
          }
        ].map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="glass-panel p-8 group hover:scale-[1.02] transition-transform"
          >
            <div className={`${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
              <feature.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 font-poppins">{feature.title}</h3>
            <p className="text-forest/70 dark:text-sage/70 mb-6">{feature.description}</p>
            <Link href={feature.link} className="text-teal font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Sustainability Visualization (Mock) */}
      <section className="glass-panel p-12 overflow-hidden relative min-h-[400px] flex items-center justify-center">
        <div className="relative z-10 text-center max-w-2xl">
          <h2 className="text-4xl font-bold mb-6 font-poppins">Our Planet, Our Responsibility.</h2>
          <p className="text-lg text-forest/70 dark:text-sage/70 mb-8">
            The average person generates 4 tons of CO2 per year. Small changes in your diet, travel, and home can reduce this by over 50%.
          </p>
          <div className="flex justify-center gap-12">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-forest underline">4.0 T</div>
              <div className="text-xs uppercase tracking-widest mt-2">Avg Footprint</div>
            </div>
            <div className="flex flex-col items-center text-teal">
              <div className="text-3xl font-bold">1.5 T</div>
              <div className="text-xs uppercase tracking-widest mt-2">Eco Target</div>
            </div>
          </div>
        </div>
        
        {/* Animated Globe Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            <Globe className="w-[600px] h-[600px]" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
