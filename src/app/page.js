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

      <LandingNavbar />
      
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-32 md:space-y-44 relative z-10">
        
        {/* --- HERO SECTION CONTAINER --- */}
        <div className="relative rounded-[32px] border border-white/5 bg-[rgba(16,19,27,0.4)] backdrop-blur-md overflow-hidden shadow-2xl p-8 md:p-12">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image 
              src="https://i.pinimg.com/736x/e7/c1/ce/e7c1ce896b06f7a917a1a441feaef538.jpg"
              alt="Hero Cyberpunk Network Grid"
              fill
              className="object-cover object-center opacity-[0.18] mix-blend-screen"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent to-[rgba(11,14,20,0.4)]" />
          </div>
          <div className="relative z-10">
            <HeroSection />
          </div>
        </div>

        {/* --- FEATURES SECTION CONTAINER --- */}
        <div className="relative rounded-[32px] border border-white/5 bg-[rgba(16,19,27,0.4)] backdrop-blur-md overflow-hidden shadow-2xl p-8 md:p-12">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image 
              src="https://i.pinimg.com/736x/72/78/23/727823989825224592.jpg"
              alt="Features Section Digital Grid Layer"
              fill
              className="object-cover object-center opacity-[0.15] mix-blend-screen"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0E14] via-transparent to-[#0B0E14]" />
          </div>
          <div className="relative z-10">
            <FeaturesSection />
          </div>
        </div>

        {/* --- WHY SECTION CONTAINER --- */}
        <div className="relative rounded-[32px] border border-white/5 bg-[rgba(16,19,27,0.4)] backdrop-blur-md overflow-hidden shadow-2xl p-8 md:p-12">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image 
              src="https://i.pinimg.com/1200x/5b/65/a9/5b65a951f8ec91380406f253159ff065.jpg"
              alt="Data Infrastructure Abstract Graphic"
              fill
              className="object-cover object-center opacity-[0.14] mix-blend-lighten"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-transparent to-[#0B0E14]" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0E14] via-transparent to-[#0B0E14]" />
          </div>
          <div className="relative z-10">
            <WhySection />
          </div>
        </div>

        {/* --- ABOUT SECTION CONTAINER --- */}
        <div className="relative rounded-[32px] border border-white/5 bg-[rgba(16,19,27,0.4)] backdrop-blur-md overflow-hidden shadow-2xl p-8 md:p-12">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image 
              src="https://i.pinimg.com/736x/57/7b/79/577b7983596d024a5c30ca380119193e.jpg"
              alt="About Section Abstract Backdrop Texture"
              fill
              className="object-cover object-center opacity-[0.16] mix-blend-screen"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-transparent to-[#0B0E14]" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0E14] via-transparent to-[#0B0E14]" />
          </div>
          <div className="relative z-10">
            <AboutSection />
          </div>
        </div>

        {/* --- CTA SECTION CONTAINER --- */}
        <div className="relative rounded-[32px] border border-white/5 bg-[rgba(16,19,27,0.4)] backdrop-blur-md overflow-hidden shadow-2xl p-8 md:p-16 text-center max-w-5xl mx-auto">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image 
              src="https://i.pinimg.com/736x/7f/4d/ab/7f4dabbbbb64f002a399c65832083aa1.jpg"
              alt="Immersive Coding Terminal End Layout Asset"
              fill
              className="object-cover object-center opacity-[0.22] mix-blend-screen"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0B0E14]" />
            <div className="absolute inset-0 bg-[rgba(11,14,20,0.6)]" />
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