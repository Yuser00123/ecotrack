"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Car, Plane, Train, Zap, Home, Utensils, ShoppingBag, 
  ArrowRight, ArrowLeft, CheckCircle2, Leaf
} from "lucide-react";
import { useRouter } from "next/navigation";
import { calculateCarbonFootprint, CalculationInputs } from "@/lib/utils/carbon-calc";
import { useCarbonStore } from "@/store/useCarbonStore";
import { useUserStore } from "@/store/useUserStore";
import { useGamificationStore } from "@/store/useGamificationStore";
import { cn } from "@/lib/utils";

const steps = [
  { id: "transport", title: "Transportation", icon: Car },
  { id: "energy", title: "Home Energy", icon: Home },
  { id: "diet", title: "Dietary Habits", icon: Utensils },
  { id: "lifestyle", title: "Lifestyle", icon: ShoppingBag },
];

export default function CalculatorPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CalculationInputs>({
    transportation: {
      carKmPerWeek: 50,
      fuelType: "petrol",
      publicTransportKmPerWeek: 20,
      flightsPerYear: 2,
    },
    energy: {
      monthlyBill: 100,
      renewablePercentage: 0,
      applianceEfficiency: "medium",
    },
    diet: {
      type: "average",
      localProducePercentage: 20,
    },
    lifestyle: {
      shoppingFrequency: "monthly",
      electronicPurchasesPerYear: 2,
    },
  });

  const { setCarbonData, addHistoryEntry } = useCarbonStore();
  const { setProfile } = useUserStore();
  const { addXP, unlockBadge } = useGamificationStore();

  const currentResults = calculateCarbonFootprint(formData);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleComplete = () => {
    setCarbonData({
      totalScore: currentResults.total,
      breakdown: currentResults.breakdown,
    });
    addHistoryEntry({
      date: new Date().toISOString().split("T")[0],
      score: currentResults.total,
    });
    setProfile({ onboarded: true });
    addXP(500);
    unlockBadge("green-starter");
    router.push("/dashboard");
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 pt-8 pb-20">
      {/* Sidebar - Progress & Live Meter */}
      <div className="w-full md:w-80 flex flex-col gap-6">
        <div className="glass-panel p-6 sticky top-32">
          <div className="flex items-center gap-2 mb-6">
            <Leaf className="text-teal w-5 h-5" />
            <h2 className="font-bold font-poppins">Calculation Progress</h2>
          </div>

          <div className="flex flex-col gap-4">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                  i <= currentStep ? "bg-forest text-white" : "bg-forest/10 text-forest/40"
                )}>
                  {i < currentStep ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                </div>
                <span className={cn(
                  "text-sm font-medium",
                  i === currentStep ? "text-forest font-bold" : "text-forest/40"
                )}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-forest/10">
            <div className="text-xs uppercase tracking-widest text-forest/50 mb-2">Live Carbon Meter</div>
            <div className="text-4xl font-black text-forest dark:text-sage">
              {currentResults.total} <span className="text-sm font-normal opacity-50">Tons/Year</span>
            </div>
            <div className="w-full h-2 bg-forest/10 rounded-full mt-4 overflow-hidden">
              <motion.div 
                className="h-full bg-forest"
                animate={{ width: `${Math.min((currentResults.total / 10) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Wizard Area */}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-panel p-8 md:p-12 min-h-[500px] flex flex-col"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-forest p-3 rounded-2xl shadow-lg">
                {(() => {
                  const Icon = steps[currentStep].icon;
                  return <Icon className="text-white w-6 h-6" />;
                })()}
              </div>
              <h1 className="text-3xl font-bold font-poppins">{steps[currentStep].title}</h1>
            </div>

            <div className="flex-grow">
              {currentStep === 0 && (
                <div className="flex flex-col gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-bold uppercase tracking-wider text-forest/60">Weekly Car Usage (km)</label>
                    <input 
                      type="range" min="0" max="500" step="10"
                      value={formData.transportation.carKmPerWeek}
                      onChange={(e) => setFormData({...formData, transportation: {...formData.transportation, carKmPerWeek: parseInt(e.target.value)}})}
                      className="w-full h-2 bg-forest/10 rounded-lg appearance-none cursor-pointer accent-forest"
                    />
                    <div className="flex justify-between text-sm font-mono font-bold text-forest">
                      <span>0 km</span>
                      <span className="text-xl bg-forest/5 px-3 py-1 rounded-lg">{formData.transportation.carKmPerWeek} km</span>
                      <span>500+ km</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold uppercase tracking-wider text-forest/60">Fuel Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {["petrol", "diesel", "hybrid", "electric"].map((type) => (
                        <button
                          key={type}
                          onClick={() => setFormData({...formData, transportation: {...formData.transportation, fuelType: type as any}})}
                          className={cn(
                            "py-3 rounded-xl border-2 transition-all font-bold capitalize",
                            formData.transportation.fuelType === type 
                              ? "border-forest bg-forest text-white" 
                              : "border-forest/10 hover:border-forest/30"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold uppercase tracking-wider text-forest/60">Flights per Year</label>
                    <div className="flex items-center gap-6">
                      {[0, 1, 2, 5, 10].map((num) => (
                        <button
                          key={num}
                          onClick={() => setFormData({...formData, transportation: {...formData.transportation, flightsPerYear: num}})}
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all",
                            formData.transportation.flightsPerYear === num 
                              ? "bg-forest text-white scale-110 shadow-lg" 
                              : "bg-forest/5 hover:bg-forest/10"
                          )}
                        >
                          {num === 10 ? "10+" : num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="flex flex-col gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-bold uppercase tracking-wider text-forest/60">Monthly Electricity Bill ($)</label>
                    <input 
                      type="range" min="0" max="500" step="10"
                      value={formData.energy.monthlyBill}
                      onChange={(e) => setFormData({...formData, energy: {...formData.energy, monthlyBill: parseInt(e.target.value)}})}
                      className="w-full h-2 bg-forest/10 rounded-lg appearance-none cursor-pointer accent-teal"
                    />
                    <div className="flex justify-between text-sm font-mono font-bold text-teal">
                      <span>$0</span>
                      <span className="text-xl bg-teal/5 px-3 py-1 rounded-lg">${formData.energy.monthlyBill}</span>
                      <span>$500+</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold uppercase tracking-wider text-forest/60">Renewable Energy Usage</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[0, 50, 100].map((val) => (
                        <button
                          key={val}
                          onClick={() => setFormData({...formData, energy: {...formData.energy, renewablePercentage: val}})}
                          className={cn(
                            "py-4 rounded-xl border-2 transition-all font-bold",
                            formData.energy.renewablePercentage === val 
                              ? "border-teal bg-teal text-white" 
                              : "border-forest/10 hover:border-teal/30"
                          )}
                        >
                          {val}% {val === 100 ? "Clean" : ""}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold uppercase tracking-wider text-forest/60">Appliance Efficiency</label>
                    <div className="flex gap-4">
                      {["low", "medium", "high"].map((eff) => (
                        <button
                          key={eff}
                          onClick={() => setFormData({...formData, energy: {...formData.energy, applianceEfficiency: eff as any}})}
                          className={cn(
                            "flex-1 py-4 rounded-xl border-2 transition-all font-bold capitalize",
                            formData.energy.applianceEfficiency === eff 
                              ? "border-forest bg-forest text-white" 
                              : "border-forest/10 hover:border-forest/30"
                          )}
                        >
                          {eff}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="flex flex-col gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-bold uppercase tracking-wider text-forest/60">Primary Diet Type</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { id: "meat-heavy", label: "Meat-Heavy", desc: "Regular meat consumption" },
                        { id: "average", label: "Balanced", desc: "Mix of everything" },
                        { id: "vegetarian", label: "Vegetarian", desc: "No meat, some dairy" },
                        { id: "vegan", label: "Vegan", desc: "100% Plant-based" }
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setFormData({...formData, diet: {...formData.diet, type: type.id as any}})}
                          className={cn(
                            "p-6 rounded-2xl border-2 transition-all text-left group",
                            formData.diet.type === type.id 
                              ? "border-forest bg-forest/5 ring-4 ring-forest/10" 
                              : "border-forest/10 hover:border-forest/30"
                          )}
                        >
                          <div className="font-bold text-lg mb-1">{type.label}</div>
                          <div className="text-sm opacity-60">{type.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold uppercase tracking-wider text-forest/60">Local & Seasonal Produce (%)</label>
                    <input 
                      type="range" min="0" max="100" step="10"
                      value={formData.diet.localProducePercentage}
                      onChange={(e) => setFormData({...formData, diet: {...formData.diet, localProducePercentage: parseInt(e.target.value)}})}
                      className="w-full h-2 bg-forest/10 rounded-lg appearance-none cursor-pointer accent-forest"
                    />
                    <div className="text-center font-bold text-2xl text-forest">{formData.diet.localProducePercentage}%</div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="flex flex-col gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-bold uppercase tracking-wider text-forest/60">Shopping Frequency</label>
                    <div className="grid grid-cols-3 gap-4">
                      {["weekly", "monthly", "rarely"].map((freq) => (
                        <button
                          key={freq}
                          onClick={() => setFormData({...formData, lifestyle: {...formData.lifestyle, shoppingFrequency: freq as any}})}
                          className={cn(
                            "py-6 rounded-xl border-2 transition-all font-bold capitalize",
                            formData.lifestyle.shoppingFrequency === freq 
                              ? "border-teal bg-teal text-white" 
                              : "border-forest/10 hover:border-teal/30"
                          )}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold uppercase tracking-wider text-forest/60">Major Electronics per Year</label>
                    <div className="flex gap-4">
                      {[0, 1, 2, 3, 5].map((num) => (
                        <button
                          key={num}
                          onClick={() => setFormData({...formData, lifestyle: {...formData.lifestyle, electronicPurchasesPerYear: num}})}
                          className={cn(
                            "flex-1 h-14 rounded-xl flex items-center justify-center font-bold transition-all",
                            formData.lifestyle.electronicPurchasesPerYear === num 
                              ? "bg-forest text-white shadow-lg" 
                              : "bg-forest/5 hover:bg-forest/10"
                          )}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-center opacity-50 mt-2">Includes phones, laptops, and major appliances</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-12">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-0 hover:bg-forest/5"
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-10 py-3 rounded-xl bg-forest text-white font-bold transition-all hover:bg-teal shadow-xl hover:shadow-forest/20"
              >
                {currentStep === steps.length - 1 ? "Calculate Impact" : "Next Step"} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
