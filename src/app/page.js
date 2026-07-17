import Image from "next/image";
import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import WhySection from "@/components/landing/WhySection";
import AboutSection from "@/components/landing/AboutSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#0B0E14] text-[#F5F6FA] overflow-x-hidden font-sans antialiased selection:bg-[#E94FD1]/30 selection:text-[#FF6FB5]">
      {/* Cinematic Ambient Background Glow Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#E94FD1] to-[#8B5CF6] opacity-[0.12] blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[30%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#3FE0C5] to-[#2FD1FF] opacity-[0.08] blur-[200px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[5%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#FFB84D] to-[#E94FD1] opacity-[0.06] blur-[180px] pointer-events-none z-0" />

      {/* Structured Layout Blocks */}
      <LandingNavbar />
      
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-24 md:space-y-36 relative z-10">
        
        {/* Hero Section with Secure Background Image Mapping */}
        <div className="relative rounded-[32px] overflow-hidden">
          <div className="absolute inset-0 opacity-[0.08] mix-blend-screen pointer-events-none">
            <Image 
              src="https://i.pinimg.com/736x/e7/c1/ce/e7c1ce896b06f7a917a1a441feaef538.jpg"
              alt="Hero Atmospheric Ambient Glow Texture"
              fill
              className="object-cover object-center"
              priority
              unoptimized
            />
          </div>
          <div className="relative z-10">
            <HeroSection />
          </div>
        </div>

        <FeaturesSection />

        {/* Why Section with Secure Background Image Mapping */}
        <div className="relative rounded-[32px] overflow-hidden">
          <div className="absolute inset-0 opacity-[0.06] mix-blend-lighten pointer-events-none">
            <Image 
              src="https://i.pinimg.com/1200x/5b/65/a9/5b65a951f8ec91380406f253159ff065.jpg"
              alt="Why Context Framework Asset Texture"
              fill
              className="object-cover object-center"
              unoptimized
            />
          </div>
          <div className="relative z-10">
            <WhySection />
          </div>
        </div>

        <AboutSection />

        {/* CTA Section with Secure Background Image Mapping */}
        <div className="relative rounded-[32px] overflow-hidden">
          <div className="absolute inset-0 opacity-[0.09] mix-blend-screen pointer-events-none">
            <Image 
              src="https://i.pinimg.com/1200x/ba/ca/76/baca76e6a0350298df4c86153da25117.jpg"
              alt="CTA Immersive Dashboard End Texture"
              fill
              className="object-cover object-center"
              unoptimized
            />
          </div>
          <div className="relative z-10">
            <CTASection />
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}