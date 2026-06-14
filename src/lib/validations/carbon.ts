import { z } from "zod";

export const CarbonDataSchema = z.object({
  totalScore: z.number(),
  breakdown: z.object({
    transportation: z.number(),
    energy: z.number(),
    diet: z.number(),
    shopping: z.number(),
  }),
  userName: z.string().optional(),
});

export type CarbonData = z.infer<typeof CarbonDataSchema>;
