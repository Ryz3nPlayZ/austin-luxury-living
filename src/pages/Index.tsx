import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ListingsSection from "@/components/ListingsSection";
import ValuationSection from "@/components/ValuationSection";
import TeamSection from "@/components/TeamSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ListingsSection />
        <ValuationSection />
        <TeamSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
