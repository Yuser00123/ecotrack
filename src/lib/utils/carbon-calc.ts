export interface CalculationInputs {
  transportation: {
    carKmPerWeek: number;
    fuelType: "petrol" | "diesel" | "electric" | "hybrid";
    publicTransportKmPerWeek: number;
    flightsPerYear: number;
  };
  energy: {
    monthlyBill: number;
    renewablePercentage: number;
    applianceEfficiency: "low" | "medium" | "high";
  };
  diet: {
    type: "meat-heavy" | "average" | "vegetarian" | "vegan";
    localProducePercentage: number;
  };
  lifestyle: {
    shoppingFrequency: "weekly" | "monthly" | "rarely";
    electronicPurchasesPerYear: number;
  }
}

export const calculateCarbonFootprint = (inputs: CalculationInputs) => {
  // 1. Transportation (Annual Tons CO2)
  const carFactors = { petrol: 0.192, diesel: 0.171, electric: 0.05, hybrid: 0.11 };
  const carEmissions = (inputs.transportation.carKmPerWeek * 52 * carFactors[inputs.transportation.fuelType]) / 1000;
  const publicTransportEmissions = (inputs.transportation.publicTransportKmPerWeek * 52 * 0.04) / 1000;
  const flightEmissions = (inputs.transportation.flightsPerYear * 500 * 0.15) / 1000; // Assume 500km avg per flight
  const transportationTotal = carEmissions + publicTransportEmissions + flightEmissions;

  // 2. Energy
  const energyFactor = 0.4 * (1 - inputs.energy.renewablePercentage / 100);
  const efficiencyMultiplier = { low: 1.2, medium: 1.0, high: 0.8 };
  const energyEmissions = (inputs.energy.monthlyBill * 12 * energyFactor * efficiencyMultiplier[inputs.energy.applianceEfficiency]) / 1000;
  const energyTotal = energyEmissions;

  // 3. Diet
  const dietBaselines = { "meat-heavy": 2.5, average: 2.0, vegetarian: 1.5, vegan: 1.1 };
  const localProduceDiscount = (inputs.diet.localProducePercentage / 100) * 0.15; // Up to 15% discount for local produce
  const dietTotal = dietBaselines[inputs.diet.type] * (1 - localProduceDiscount);

  // 4. Shopping & Lifestyle
  const shoppingBaselines = { weekly: 1.0, monthly: 0.5, rarely: 0.2 };
  const electronicEmissions = inputs.lifestyle.electronicPurchasesPerYear * 0.1; // 100kg per device
  const shoppingTotal = shoppingBaselines[inputs.lifestyle.shoppingFrequency] + electronicEmissions;

  const total = transportationTotal + energyTotal + dietTotal + shoppingTotal;

  return {
    total: parseFloat(total.toFixed(2)),
    breakdown: {
      transportation: parseFloat(transportationTotal.toFixed(2)),
      energy: parseFloat(energyTotal.toFixed(2)),
      diet: parseFloat(dietTotal.toFixed(2)),
      shopping: parseFloat(shoppingTotal.toFixed(2)),
    }
  };
};
