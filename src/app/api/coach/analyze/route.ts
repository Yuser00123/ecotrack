import { NextRequest, NextResponse } from "next/server";
import { analyzeCarbonData } from "@/services/gemini.service";
import { CarbonDataSchema } from "@/lib/validations/carbon";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validation = CarbonDataSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid data format", details: validation.error.format() }, { status: 400 });
    }

    const insights = await analyzeCarbonData(validation.data);
    
    return NextResponse.json(insights);
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
