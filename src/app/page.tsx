import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import HowToUse from "@/components/HowToUse";
import Ingredients from "@/components/Ingredients";
import SocialProof from "@/components/SocialProof";
import Guarantee from "@/components/Guarantee";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Benefits />
        <HowToUse />
        <Ingredients />
        <SocialProof />
        <Guarantee />
        <FAQ />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
