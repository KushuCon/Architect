import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DeltaComparison from "@/components/DeltaComparison";
import RoadmapPreview from "@/components/RoadmapPreview";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <DeltaComparison />
      <RoadmapPreview />
      <Footer />
    </div>
  );
};

export default Index;
