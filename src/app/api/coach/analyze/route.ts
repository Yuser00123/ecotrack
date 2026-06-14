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
    // Log the full error for debugging
    console.error("DETAILED API ROUTE ERROR:", error);
    
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
      },
      { status: 500 }
    );
  }
}
