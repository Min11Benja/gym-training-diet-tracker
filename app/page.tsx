import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import Solution from "@/components/landing/Solution";
import Features from "@/components/landing/Features";
import WhoIsThisFor from "@/components/landing/WhoIsThisFor";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import SmartForm from "@/components/landing/SmartForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#101010] text-zinc-900 dark:text-white selection:bg-emerald-500/30 dark:selection:bg-[#B2FF59]/30">
      <Navbar />
      <Hero />
      <Problem />
      <Solution />
      <Features />
      <WhoIsThisFor />
      <Pricing />
      <FAQ />
      <SmartForm />
      <Footer />
    </main>
  );
}
