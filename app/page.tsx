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
    <main className="min-h-screen bg-[#101010] text-white selection:bg-[#8f8f8f]/30">
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
