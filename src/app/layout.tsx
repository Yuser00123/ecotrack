import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ 
  weight: ["400", "600", "700"], 
  subsets: ["latin"], 
  variable: "--font-poppins" 
});

export const metadata: Metadata = {
  title: "EcoTrack | Calculate, Track & Reduce Your Carbon Footprint",
  description: "Personalized insights and AI-powered recommendations to help you live more sustainably.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-forest/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal/10 rounded-full blur-[120px] pointer-events-none" />
            
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
