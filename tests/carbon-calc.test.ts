import { calculateCarbonFootprint, CalculationInputs } from "@/lib/utils/carbon-calc";

describe("Carbon Calculation Logic", () => {
  const mockInputs: CalculationInputs = {
    transportation: {
      carKmPerWeek: 100,
      fuelType: "petrol",
      publicTransportKmPerWeek: 50,
      flightsPerYear: 1,
    },
    energy: {
      monthlyBill: 100,
      renewablePercentage: 50,
      applianceEfficiency: "medium",
    },
    diet: {
      type: "average",
      localProducePercentage: 50,
    },
    lifestyle: {
      shoppingFrequency: "monthly",
      electronicPurchasesPerYear: 1,
    },
  };

  it("calculates total CO2 correctly", () => {
    const results = calculateCarbonFootprint(mockInputs);
    expect(results.total).toBeGreaterThan(0);
    expect(results.breakdown.transportation).toBeGreaterThan(0);
  });

  it("reduces emissions with electric car", () => {
    const petrolResults = calculateCarbonFootprint(mockInputs);
    const electricResults = calculateCarbonFootprint({
      ...mockInputs,
      transportation: { ...mockInputs.transportation, fuelType: "electric" }
    });
    expect(electricResults.breakdown.transportation).toBeLessThan(petrolResults.breakdown.transportation);
  });

  it("reduces emissions with vegan diet", () => {
    const avgResults = calculateCarbonFootprint(mockInputs);
    const veganResults = calculateCarbonFootprint({
      ...mockInputs,
      diet: { ...mockInputs.diet, type: "vegan" }
    });
    expect(veganResults.breakdown.diet).toBeLessThan(avgResults.breakdown.diet);
  });
});
